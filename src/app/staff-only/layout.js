'use client';
import { useEffect, useState, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { checkAuthAction, logoutAction } from '@/app/actions';

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname === '/staff-only/login';
  const [authState, setAuthState] = useState(isLoginPage ? 'authed' : 'checking');

  useEffect(() => {
    if (isLoginPage) return;

    let cancelled = false;
    checkAuthAction().then((res) => {
      if (cancelled) return;
      if (res.authenticated) {
        setAuthState('authed');
      } else {
        setAuthState('unauthed');
        router.push('/staff-only/login');
      }
    });
    return () => { cancelled = true; };
  }, [pathname, router, isLoginPage]);

  const handleLogout = useCallback(async () => {
    await logoutAction();
    router.push('/staff-only/login');
  }, [router]);

  if (authState === 'checking') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--color-text-muted)' }}>読み込み中...</p>
      </div>
    );
  }

  // ログインページはサイドバーなし
  if (isLoginPage) {
    return <>{children}</>;
  }

  if (authState !== 'authed') return null;

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <Link href="/" className="admin-sidebar-logo">🐟 大陸棚居酒屋 管理</Link>
        <nav className="admin-nav">
          <Link
            href="/staff-only"
            className={`admin-nav-item ${pathname === '/staff-only' ? 'active' : ''}`}
          >
            📊 ダッシュボード
          </Link>
          <Link
            href="/staff-only/menu"
            className={`admin-nav-item ${pathname === '/staff-only/menu' ? 'active' : ''}`}
          >
            🍽️ メニュー管理
          </Link>
          <Link
            href="/staff-only/news"
            className={`admin-nav-item ${pathname === '/staff-only/news' ? 'active' : ''}`}
          >
            📢 お知らせ管理
          </Link>
        </nav>
        <div style={{ marginTop: 'auto', paddingTop: 'var(--space-2xl)' }}>
          <button onClick={handleLogout} className="admin-nav-item" style={{ width: '100%', textAlign: 'left', color: 'var(--color-red-light)' }}>
            🚪 ログアウト
          </button>
          <Link href="/" target="_blank" className="admin-nav-item" style={{ marginTop: 'var(--space-sm)' }}>
            🔗 公開サイトを見る
          </Link>
        </div>
      </aside>
      <main className="admin-main">
        {children}
      </main>
    </div>
  );
}