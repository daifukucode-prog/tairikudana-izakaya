export default function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero-bg">
        <img
          src="/images/hero-bg.png"
          alt="大陸棚居酒屋の料理"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0.55,
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(180deg, rgba(10,10,10,0.4) 0%, rgba(10,10,10,0.6) 40%, rgba(10,10,10,0.85) 100%)',
          }}
        />
      </div>
      <div className="hero-content">
        <p className="hero-sub" style={{ letterSpacing: '0.3em', marginBottom: 'var(--space-md)' }}>
          — 太平洋の真ん中で、旨い一杯を —
        </p>
        <h1 className="hero-title">
          <span style={{ display: 'block', fontSize: '0.4em', fontWeight: 400, color: 'var(--color-gold)', marginBottom: 'var(--space-sm)', letterSpacing: '0.15em' }}>
            TAIRIKUDANA IZAKAYA
          </span>
          大陸棚居酒屋
        </h1>
        <p className="hero-desc">
          串かつ1本120円〜 ｜ 太平洋直送の鮮魚 ｜ 食べ飲み放題3,500円
        </p>
        <div className="hero-actions">
          <a href="#reserve" className="btn btn-primary btn-lg hero-btn">
            🍺 今すぐ予約
          </a>
          <a href="tel:0120-000-000" className="btn btn-outline btn-lg hero-btn">
            📞 電話で予約
          </a>
        </div>
      </div>
    </section>
  );
}
