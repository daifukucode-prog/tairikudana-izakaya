'use server';

import { cookies } from 'next/headers';
import crypto from 'crypto';

// AUTH_SECRET が未設定の場合は起動時に警告を出し、フォールバック値を使用
// ⚠️ 本番環境では必ず AUTH_SECRET を環境変数に設定してください
const AUTH_SECRET = process.env.AUTH_SECRET;
if (!AUTH_SECRET) {
  console.warn(
    '[security] AUTH_SECRET が未設定です。サーバーレス環境ではリクエストごとに秘密鍵が変わり、ログインが不安定になります。.env.local または Vercel の環境変数に AUTH_SECRET を設定してください。'
  );
}
const SECRET_KEY = AUTH_SECRET || crypto.randomBytes(32).toString('hex');
const TOKEN_MAX_AGE = 60 * 60 * 8; // 8時間

function generateToken(user) {
  const payload = {
    user,
    iat: Date.now(),
    exp: Date.now() + TOKEN_MAX_AGE * 1000,
    nonce: crypto.randomBytes(16).toString('hex'),
  };
  const data = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', SECRET_KEY)
    .update(data)
    .digest('base64url');
  return `${data}.${signature}`;
}

function verifyToken(token) {
  if (!token) return null;
  try {
    const [data, signature] = token.split('.');
    const expectedSig = crypto
      .createHmac('sha256', SECRET_KEY)
      .update(data)
      .digest('base64url');

    // タイミングセーフな署名比較
    const sigBuf = Buffer.from(signature, 'base64url');
    const expectedBuf = Buffer.from(expectedSig, 'base64url');
    if (sigBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(sigBuf, expectedBuf)) {
      return null;
    }

    const payload = JSON.parse(Buffer.from(data, 'base64url').toString());
    if (payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function loginAction(user, password) {
  const adminUser = process.env.ADMIN_USER;
  const adminPass = process.env.ADMIN_PASSWORD;

  if (!adminUser || !adminPass) {
    return { success: false, error: 'サーバー設定エラー' };
  }

  // タイミング攻撃対策: 一定時間の遅延
  await new Promise((r) => setTimeout(r, 200 + Math.random() * 300));

  // タイミングセーフな文字列比較
  const userBuf = Buffer.from(user.normalize('NFC'));
  const passBuf = Buffer.from(password.normalize('NFC'));
  const adminUserBuf = Buffer.from(adminUser.normalize('NFC'));
  const adminPassBuf = Buffer.from(adminPass.normalize('NFC'));

  const userMatch =
    userBuf.length === adminUserBuf.length &&
    crypto.timingSafeEqual(userBuf, adminUserBuf);
  const passMatch =
    passBuf.length === adminPassBuf.length &&
    crypto.timingSafeEqual(passBuf, adminPassBuf);

  if (userMatch && passMatch) {
    const token = generateToken(user);
    const cookieStore = await cookies();
    cookieStore.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: TOKEN_MAX_AGE,
      path: '/',
    });
    return { success: true };
  }
  return { success: false, error: 'ユーザー名またはパスワードが正しくありません' };
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete('auth_token');
  return { success: true };
}

export async function checkAuthAction() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  const payload = verifyToken(token);
  return { authenticated: !!payload };
}
