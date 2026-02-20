'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import './reserve.css';

const COURSES = [
  {
    id: 'none',
    name: 'コースなし（アラカルト）',
    price: null,
    desc: 'お好きなメニューを自由にお楽しみください',
    icon: '🍽️',
  },
  {
    id: 'standard',
    name: '大陸棚スタンダードコース',
    price: 3500,
    desc: '串かつ食べ放題+飲み放題 120分',
    icon: '🍻',
  },
  {
    id: 'premium',
    name: '深海プレミアムコース',
    price: 5000,
    desc: '刺身盛り+串かつ食べ放題+飲み放題 150分',
    icon: '🦐',
  },
  {
    id: 'taikan',
    name: '大陸棚フルコース',
    price: 7000,
    desc: 'もつ鍋+刺身+串かつ+デザート+飲み放題 180分',
    icon: '👑',
  },
];

const TIME_SLOTS = [
  '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
  '20:00', '20:30', '21:00', '21:30', '22:00', '22:30',
];

function getAvailableDates() {
  const dates = [];
  const today = new Date();
  for (let i = 1; i <= 30; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    dates.push(d);
  }
  return dates;
}

function formatDate(date) {
  const days = ['日', '月', '火', '水', '木', '金', '土'];
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const day = days[date.getDay()];
  return `${m}/${d}（${day}）`;
}

function formatDateFull(date) {
  const days = ['日', '月', '火', '水', '木', '金', '土'];
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const day = days[date.getDay()];
  return `${y}年${m}月${d}日（${day}）`;
}

export default function ReservePage() {
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [guests, setGuests] = useState(2);
  const [course, setCourse] = useState('none');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [note, setNote] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const availableDates = useMemo(() => getAvailableDates(), []);

  const selectedCourse = COURSES.find((c) => c.id === course);

  const canProceedStep1 = selectedDate && selectedTime && guests > 0;
  const canProceedStep2 = course !== undefined;
  const canProceedStep3 = name.trim() && phone.trim();

  async function handleSubmit() {
    if (submitting) return;
    setSubmitting(true);

    const reservationData = {
      date: selectedDate ? selectedDate.toISOString().split('T')[0] : null,
      time: selectedTime,
      guests,
      course_id: course,
      name,
      phone,
      email,
      note,
      status: 'pending'
    };

    const { error } = await supabase.from('reservations').insert([reservationData]);

    if (error) {
      alert('予約の送信に失敗しました: ' + error.message);
      setSubmitting(false);
    } else {
      setSubmitted(true);
      setStep(4);
      setSubmitting(false);
    }
  }

  if (submitted && step === 4) {
    return (
      <div className="rv-page">
        <header className="rv-header">
          <div className="rv-header-inner">
            <Link href="/" className="rv-logo">🐟 大陸棚居酒屋</Link>
          </div>
        </header>
        <main className="rv-main">
          <div className="rv-complete">
            <div className="rv-complete-icon">🎉</div>
            <h1 className="rv-complete-title">ご予約ありがとうございます</h1>
            <p className="rv-complete-desc">
              ご予約を受け付けました。<br />
              確認のメールをお送りしましたので、ご確認ください。
            </p>
            <div className="rv-complete-summary">
              <div className="rv-summary-row">
                <span className="rv-summary-label">📅 日時</span>
                <span className="rv-summary-value">{formatDateFull(selectedDate)} {selectedTime}</span>
              </div>
              <div className="rv-summary-row">
                <span className="rv-summary-label">👥 人数</span>
                <span className="rv-summary-value">{guests}名</span>
              </div>
              <div className="rv-summary-row">
                <span className="rv-summary-label">🍽️ コース</span>
                <span className="rv-summary-value">
                  {selectedCourse.name}
                  {selectedCourse.price && <span className="rv-summary-price">（¥{selectedCourse.price.toLocaleString()}）</span>}
                </span>
              </div>
              <div className="rv-summary-row">
                <span className="rv-summary-label">👤 代表者</span>
                <span className="rv-summary-value">{name} 様</span>
              </div>
            </div>
            <p className="rv-complete-note">
              ※こちらは架空の居酒屋サイトのデモです。実際の予約は行われません。
            </p>
            <Link href="/" className="rv-btn rv-btn-primary" style={{ display: 'inline-flex', marginTop: '2rem' }}>
              トップページに戻る
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="rv-page">
      {/* Header */}
      <header className="rv-header">
        <div className="rv-header-inner">
          <Link href="/" className="rv-logo">🐟 大陸棚居酒屋</Link>
          <Link href="/" className="rv-back-link">← トップに戻る</Link>
        </div>
      </header>

      <main className="rv-main">
        {/* Progress Bar */}
        <div className="rv-progress">
          <div className="rv-progress-bar">
            {[1, 2, 3].map((s) => (
              <div key={s} className="rv-progress-step-wrap">
                <div
                  className={`rv-progress-dot ${step >= s ? 'active' : ''} ${step > s ? 'done' : ''}`}
                  onClick={() => { if (s < step) setStep(s); }}
                >
                  {step > s ? '✓' : s}
                </div>
                <span className={`rv-progress-label ${step >= s ? 'active' : ''}`}>
                  {s === 1 && '日時・人数'}
                  {s === 2 && 'コース選択'}
                  {s === 3 && 'お客様情報'}
                </span>
              </div>
            ))}
            <div className="rv-progress-line">
              <div className="rv-progress-line-fill" style={{ width: `${((step - 1) / 2) * 100}%` }} />
            </div>
          </div>
        </div>

        <div className="rv-container">
          {/* Step 1: Date, Time, Guests */}
          {step === 1 && (
            <div className="rv-step animate-in">
              <h2 className="rv-step-title">📅 日時・人数を選択</h2>
              <p className="rv-step-desc">ご来店希望日、時間帯、人数をお選びください</p>

              {/* Date Selection */}
              <div className="rv-field-group">
                <label className="rv-field-label">ご来店日</label>
                <div className="rv-date-grid">
                  {availableDates.map((date) => {
                    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                    const isSunday = date.getDay() === 0;
                    return (
                      <button
                        key={date.toISOString()}
                        className={`rv-date-btn ${selectedDate?.toDateString() === date.toDateString() ? 'selected' : ''} ${isSunday ? 'sunday' : ''} ${isWeekend && !isSunday ? 'saturday' : ''}`}
                        onClick={() => setSelectedDate(date)}
                      >
                        <span className="rv-date-month">{date.getMonth() + 1}月</span>
                        <span className="rv-date-day">{date.getDate()}</span>
                        <span className="rv-date-dow">{['日', '月', '火', '水', '木', '金', '土'][date.getDay()]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time Selection */}
              <div className="rv-field-group">
                <label className="rv-field-label">ご来店時間</label>
                <div className="rv-time-grid">
                  {TIME_SLOTS.map((time) => (
                    <button
                      key={time}
                      className={`rv-time-btn ${selectedTime === time ? 'selected' : ''}`}
                      onClick={() => setSelectedTime(time)}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              {/* Guest Count */}
              <div className="rv-field-group">
                <label className="rv-field-label">ご来店人数</label>
                <div className="rv-guest-selector">
                  <button
                    className="rv-guest-btn"
                    onClick={() => setGuests(Math.max(1, guests - 1))}
                    disabled={guests <= 1}
                  >
                    −
                  </button>
                  <span className="rv-guest-count">
                    <span className="rv-guest-number">{guests}</span>
                    <span className="rv-guest-unit">名</span>
                  </span>
                  <button
                    className="rv-guest-btn"
                    onClick={() => setGuests(Math.min(30, guests + 1))}
                    disabled={guests >= 30}
                  >
                    +
                  </button>
                </div>
                {guests >= 10 && (
                  <p className="rv-guest-note">※10名様以上の場合はお電話でのご予約もおすすめです</p>
                )}
              </div>

              <div className="rv-actions">
                <button
                  className="rv-btn rv-btn-primary rv-btn-lg"
                  disabled={!canProceedStep1}
                  onClick={() => setStep(2)}
                >
                  コース選択へ進む →
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Course Selection */}
          {step === 2 && (
            <div className="rv-step animate-in">
              <h2 className="rv-step-title">🍽️ コースを選択</h2>
              <p className="rv-step-desc">ご希望のコースをお選びください（後から変更も可能です）</p>

              <div className="rv-course-grid">
                {COURSES.map((c) => (
                  <button
                    key={c.id}
                    className={`rv-course-card ${course === c.id ? 'selected' : ''}`}
                    onClick={() => setCourse(c.id)}
                  >
                    <span className="rv-course-icon">{c.icon}</span>
                    <h3 className="rv-course-name">{c.name}</h3>
                    <p className="rv-course-desc">{c.desc}</p>
                    {c.price ? (
                      <span className="rv-course-price">
                        ¥{c.price.toLocaleString()}<small>/人（税込）</small>
                      </span>
                    ) : (
                      <span className="rv-course-price free">席のみ予約</span>
                    )}
                    {course === c.id && <span className="rv-course-check">✓</span>}
                  </button>
                ))}
              </div>

              <div className="rv-actions rv-actions-split">
                <button className="rv-btn rv-btn-ghost" onClick={() => setStep(1)}>
                  ← 戻る
                </button>
                <button
                  className="rv-btn rv-btn-primary rv-btn-lg"
                  onClick={() => setStep(3)}
                >
                  お客様情報入力へ →
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Customer Info */}
          {step === 3 && (
            <div className="rv-step animate-in">
              <h2 className="rv-step-title">👤 お客様情報</h2>
              <p className="rv-step-desc">代表者様の情報をご入力ください</p>

              {/* Summary badge */}
              <div className="rv-info-summary">
                <span>📅 {formatDate(selectedDate)} {selectedTime}</span>
                <span>👥 {guests}名</span>
                <span>🍽️ {selectedCourse?.name}</span>
              </div>

              <div className="rv-form">
                <div className="rv-form-group">
                  <label className="rv-form-label" htmlFor="rv-name">
                    お名前 <span className="rv-required">必須</span>
                  </label>
                  <input
                    id="rv-name"
                    type="text"
                    className="rv-input"
                    placeholder="例：太平洋 太郎"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="rv-form-group">
                  <label className="rv-form-label" htmlFor="rv-phone">
                    電話番号 <span className="rv-required">必須</span>
                  </label>
                  <input
                    id="rv-phone"
                    type="tel"
                    className="rv-input"
                    placeholder="例：090-1234-5678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div className="rv-form-group">
                  <label className="rv-form-label" htmlFor="rv-email">
                    メールアドレス <span className="rv-optional">任意</span>
                  </label>
                  <input
                    id="rv-email"
                    type="email"
                    className="rv-input"
                    placeholder="例：example@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="rv-form-group">
                  <label className="rv-form-label" htmlFor="rv-note">
                    ご要望・備考 <span className="rv-optional">任意</span>
                  </label>
                  <textarea
                    id="rv-note"
                    className="rv-textarea"
                    placeholder="アレルギー・お席のご希望など"
                    rows={3}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />
                </div>
              </div>

              {/* Confirmation Preview */}
              <div className="rv-confirm-preview">
                <h3 className="rv-confirm-title">📋 予約内容の確認</h3>
                <div className="rv-confirm-grid">
                  <div className="rv-confirm-row">
                    <span className="rv-confirm-label">日時</span>
                    <span className="rv-confirm-value">{selectedDate && formatDateFull(selectedDate)} {selectedTime}</span>
                  </div>
                  <div className="rv-confirm-row">
                    <span className="rv-confirm-label">人数</span>
                    <span className="rv-confirm-value">{guests}名</span>
                  </div>
                  <div className="rv-confirm-row">
                    <span className="rv-confirm-label">コース</span>
                    <span className="rv-confirm-value">
                      {selectedCourse?.name}
                      {selectedCourse?.price && ` (¥${selectedCourse.price.toLocaleString()}/人)`}
                    </span>
                  </div>
                  {selectedCourse?.price && (
                    <div className="rv-confirm-row rv-confirm-total">
                      <span className="rv-confirm-label">合計（税込）</span>
                      <span className="rv-confirm-value rv-confirm-total-price">
                        ¥{(selectedCourse.price * guests).toLocaleString()}
                      </span>
                    </div>
                  )}
                  <div className="rv-confirm-row">
                    <span className="rv-confirm-label">代表者</span>
                    <span className="rv-confirm-value">{name || '—'}</span>
                  </div>
                  <div className="rv-confirm-row">
                    <span className="rv-confirm-label">電話番号</span>
                    <span className="rv-confirm-value">{phone || '—'}</span>
                  </div>
                  {email && (
                    <div className="rv-confirm-row">
                      <span className="rv-confirm-label">メール</span>
                      <span className="rv-confirm-value">{email}</span>
                    </div>
                  )}
                  {note && (
                    <div className="rv-confirm-row">
                      <span className="rv-confirm-label">備考</span>
                      <span className="rv-confirm-value">{note}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="rv-actions rv-actions-split">
                <button className="rv-btn rv-btn-ghost" onClick={() => setStep(2)}>
                  ← 戻る
                </button>
                <button
                  className="rv-btn rv-btn-primary rv-btn-lg rv-btn-submit"
                  disabled={!canProceedStep3 || submitting}
                  onClick={handleSubmit}
                >
                  {submitting ? '送信中...' : '🎉 この内容で予約する'}
                </button>
              </div>

              <p className="rv-disclaimer">
                ※こちらは架空の居酒屋サイトのデモです。実際の予約は行われません。
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="rv-footer">
        <p>© 2026 大陸棚居酒屋 太平洋本店（架空のお店です）</p>
      </footer>
    </div>
  );
}
