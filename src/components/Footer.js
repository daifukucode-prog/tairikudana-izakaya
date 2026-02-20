export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <h3 className="footer-logo">🐟 大陸棚居酒屋</h3>
            <p className="footer-brand-text">太平洋本店</p>
            <p className="footer-address">
              太平洋 北緯10° 東経170°<br />
              大陸棚海底プラザ 1F
            </p>
            <p className="footer-phone">
              <a href="tel:0120-000-000">📞 0120-000-000</a>
            </p>
          </div>

          <div className="footer-nav">
            <h4 className="footer-nav-title">メニュー</h4>
            <a href="#menu" className="footer-link">メニュー</a>
            <a href="#course" className="footer-link">コース・宴会</a>
            <a href="#shop" className="footer-link">店舗情報</a>
            <a href="#news" className="footer-link">お知らせ</a>
            <a href="#reserve" className="footer-link">ご予約</a>
          </div>

          <div className="footer-nav">
            <h4 className="footer-nav-title">営業時間</h4>
            <p className="footer-text">月〜土: 17:00 - 02:00</p>
            <p className="footer-text">日・祝: 17:00 - 00:00</p>
            <p className="footer-text" style={{ color: 'var(--color-gold)' }}>年中無休</p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2026 大陸棚居酒屋 太平洋本店. All rights reserved.</p>
          <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-dim)' }}>
            ※これは架空の居酒屋サイトです
          </p>
        </div>
      </div>
    </footer>
  );
}
