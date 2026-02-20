import Link from 'next/link';

export default function ReservationSection() {
  return (
    <section className="section section-alt" id="reserve">
      <div className="container">
        <h2 className="section-title">ご予約</h2>
        <p className="section-subtitle">RESERVATION</p>
        <div className="section-divider" />

        <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', marginBottom: 'var(--space-2xl)', maxWidth: 600, margin: '0 auto var(--space-2xl)' }}>
          ご予約はお電話またはネット予約で承ります。<br />
          人気の週末は混み合いますので、お早めのご予約をおすすめします。
        </p>

        <div className="reserve-grid">
          <Link
            href="/reserve"
            className="reserve-card"
          >
            <span className="reserve-card-icon">📱</span>
            <h3 className="reserve-card-title">ネット予約</h3>
            <p className="reserve-card-desc">
              24時間いつでもネットから簡単予約
            </p>
            <span className="btn btn-primary" style={{ marginTop: 'auto' }}>
              予約サイトへ →
            </span>
          </Link>

          <a href="tel:0120-000-000" className="reserve-card">
            <span className="reserve-card-icon">📞</span>
            <h3 className="reserve-card-title">電話で予約</h3>
            <p className="reserve-card-desc">
              スタッフが丁寧にご対応いたします
            </p>
            <span
              style={{
                fontSize: 'var(--font-size-xl)',
                fontWeight: 700,
                color: 'var(--color-gold)',
                marginTop: 'auto',
              }}
            >
              0120-000-000
            </span>
          </a>

          <a
            href="https://maps.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="reserve-card"
          >
            <span className="reserve-card-icon">🗺️</span>
            <h3 className="reserve-card-title">店舗への行き方</h3>
            <p className="reserve-card-desc">
              マリアナ海溝ICより潜水5分
            </p>
            <span className="btn btn-outline" style={{ marginTop: 'auto' }}>
              地図を見る →
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
