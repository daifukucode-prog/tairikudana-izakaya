export default function CourseSection() {
  const courses = [
    {
      title: '食べ飲み放題コース',
      price: '3,500',
      unit: '円〜（税込）',
      time: '120分',
      description: '串かつ・焼き鳥・唐揚げなど食べ放題＋生ビール含む飲み放題付き',
      features: ['串かつ食べ放題', '焼き鳥食べ放題', '生ビール含む50種飲み放題', 'お通し・枝豆付き'],
      badge: '🔥 一番人気',
      image: '/images/kushikatsu.png',
    },
    {
      title: '太平洋海鮮コース',
      price: '4,500',
      unit: '円（税込）',
      time: '120分',
      description: '大陸棚沖直送の刺身盛り合わせをメインに海鮮三昧',
      features: ['刺身五点盛り', '海鮮カルパッチョ', '海老の串かつ', '海鮮茶漬け〆', '飲み放題120分付き'],
      badge: '🐟 海の幸',
      image: '/images/sashimi.png',
    },
    {
      title: '大陸棚もつ鍋コース',
      price: '3,800',
      unit: '円（税込）',
      time: '120分',
      description: '特製味噌仕立てのもつ鍋を囲む宴会に。〆はちゃんぽん麺',
      features: ['串かつ5本', '特製もつ鍋', '〆ちゃんぽん麺', 'デザート付き', '飲み放題120分付き'],
      badge: '🍲 温まる',
      image: '/images/motsu-nabe.png',
    },
  ];

  return (
    <section className="section section-alt" id="course">
      <div className="container">
        <h2 className="section-title">コース・宴会</h2>
        <p className="section-subtitle">COURSE</p>
        <div className="section-divider" />

        <div className="course-grid">
          {courses.map((course, idx) => (
            <div key={idx} className="course-card">
              <div className="course-badge">{course.badge}</div>
              <div style={{ position: 'relative', height: 180, overflow: 'hidden', borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0' }}>
                <img
                  src={course.image}
                  alt={course.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '60%',
                  background: 'linear-gradient(transparent, rgba(20,20,20,0.9))',
                }} />
                <h3 className="course-title" style={{ position: 'absolute', bottom: 'var(--space-md)', left: 'var(--space-lg)' }}>
                  {course.title}
                </h3>
              </div>
              <div style={{ padding: 'var(--space-lg)' }}>
                <div className="course-price">
                  <span className="course-price-value">¥{course.price}</span>
                  <span className="course-price-unit">{course.unit}</span>
                </div>
                <p className="course-time">⏱ {course.time}制</p>
                <p className="course-desc">{course.description}</p>
                <ul className="course-features">
                  {course.features.map((f, i) => (
                    <li key={i}>✔ {f}</li>
                  ))}
                </ul>
                <a href="#reserve" className="btn btn-primary" style={{ width: '100%', marginTop: 'var(--space-lg)' }}>
                  このコースを予約
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
