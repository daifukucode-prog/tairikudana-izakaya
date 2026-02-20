'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function FloatingReserveButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className="fab"
        onClick={() => setOpen(!open)}
        aria-label="予約する"
      >
        <span className="fab-icon">{open ? '✕' : '🍺'}</span>
        <span className="fab-label">予約</span>
      </button>

      {open && (
        <div className="fab-modal">
          <div className="fab-modal-content">
            <h3 className="fab-modal-title">ご予約方法</h3>
            <Link
              href="/reserve"
              className="fab-modal-btn"
            >
              📱 ネット予約（24時間OK）
            </Link>
            <a href="tel:0120-000-000" className="fab-modal-btn">
              📞 電話で予約
            </a>
            <a
              href="https://maps.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="fab-modal-btn fab-modal-btn-outline"
            >
              🗺️ 地図を見る
            </a>
          </div>
          <div
            className="fab-modal-overlay"
            onClick={() => setOpen(false)}
          />
        </div>
      )}
    </>
  );
}
