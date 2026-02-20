export default function ShopInfo() {
  return (
    <section className="section" id="shop">
      <div className="container">
        <h2 className="section-title">店舗情報</h2>
        <p className="section-subtitle">SHOP INFO</p>
        <div className="section-divider" />

        <div className="shop-grid">
          <div className="shop-map">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d20000000!2d170.0!3d10.0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sja!2sjp!4v1700000000000!5m2!1sja!2sjp"
              width="100%"
              height="100%"
              style={{ border: 0, borderRadius: 'var(--radius-lg)', minHeight: 350 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="大陸棚居酒屋 太平洋本店 地図"
            />
          </div>

          <div className="shop-details">
            <h3 className="shop-name">🐟 大陸棚居酒屋 太平洋本店</h3>

            <div className="shop-info-row">
              <span className="shop-info-icon">📍</span>
              <div>
                <p className="shop-info-label">住所</p>
                <p className="shop-info-value">
                  太平洋 北緯10° 東経170°<br />
                  大陸棚海底プラザ 1F
                </p>
              </div>
            </div>

            <div className="shop-info-row">
              <span className="shop-info-icon">🚢</span>
              <div>
                <p className="shop-info-label">アクセス</p>
                <p className="shop-info-value">
                  マリアナ海溝IC（海底ハイウェイ）より潜水5分<br />
                  太平洋中央駅 徒歩3分
                </p>
              </div>
            </div>

            <div className="shop-info-row">
              <span className="shop-info-icon">🕐</span>
              <div>
                <p className="shop-info-label">営業時間</p>
                <p className="shop-info-value">
                  月〜土：17:00 〜 02:00<br />
                  日・祝：17:00 〜 00:00<br />
                  <span style={{ color: 'var(--color-red-light)', fontWeight: 600 }}>
                    定休日：なし（年中無休・海底だから）
                  </span>
                </p>
              </div>
            </div>

            <div className="shop-info-row">
              <span className="shop-info-icon">📞</span>
              <div>
                <p className="shop-info-label">電話番号</p>
                <p className="shop-info-value">
                  <a href="tel:0120-000-000" style={{ color: 'var(--color-gold)', fontWeight: 700, fontSize: 'var(--font-size-lg)' }}>
                    0120-000-000
                  </a>
                </p>
              </div>
            </div>

            <div className="shop-info-row">
              <span className="shop-info-icon">💳</span>
              <div>
                <p className="shop-info-label">お支払い</p>
                <p className="shop-info-value">
                  現金 / クレジットカード / PayPay / 深海コイン
                </p>
              </div>
            </div>

            <div className="shop-info-row">
              <span className="shop-info-icon">🪑</span>
              <div>
                <p className="shop-info-label">座席</p>
                <p className="shop-info-value">
                  全120席（カウンター12席 / テーブル80席 / 個室28席 / 水槽テラス席あり）
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
