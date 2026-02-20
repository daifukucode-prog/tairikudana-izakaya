'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`header ${scrolled ? 'header-scrolled' : ''}`}>
      <div className="header-inner">
        <Link href="/" className="header-logo">
          🐟 大陸棚居酒屋
        </Link>

        <nav className={`header-nav ${isOpen ? 'header-nav-open' : ''}`}>
          <a href="#menu" className="nav-link" onClick={() => setIsOpen(false)}>
            メニュー
          </a>
          <a href="#course" className="nav-link" onClick={() => setIsOpen(false)}>
            コース
          </a>
          <a href="#shop" className="nav-link" onClick={() => setIsOpen(false)}>
            店舗情報
          </a>
          <a href="#news" className="nav-link" onClick={() => setIsOpen(false)}>
            お知らせ
          </a>
          <Link href="/reserve" className="btn btn-primary btn-sm nav-reserve-btn">
            今すぐ予約
          </Link>
        </nav>

        <button
          className="header-menu-btn"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="メニューを開く"
        >
          <span className={`hamburger ${isOpen ? 'hamburger-open' : ''}`}>
            <span />
            <span />
            <span />
          </span>
        </button>
      </div>
    </header>
  );
}
