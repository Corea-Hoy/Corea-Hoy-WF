"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

interface Slide {
  src: string;
  labelKo: string;
  labelEs: string;
}

const SLIDES: Slide[] = [
  {
    src: "https://images.unsplash.com/photo-1538485399081-7191377e8241?w=1200&q=80",
    labelKo: "경복궁, 서울",
    labelEs: "Palacio Gyeongbokgung, Seúl",
  },
  {
    src: "https://images.unsplash.com/photo-1548115184-bc6544d06a58?w=1200&q=80",
    labelKo: "부산 해운대 야경",
    labelEs: "Noche en Haeundae, Busan",
  },
  {
    src: "https://images.unsplash.com/photo-1601621915196-2621bfb0cd6e?w=1200&q=80",
    labelKo: "전주 한옥마을",
    labelEs: "Aldea Hanok de Jeonju",
  },
  {
    src: "https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=1200&q=80",
    labelKo: "서울 야경",
    labelEs: "Seúl de noche",
  },
  {
    src: "https://images.unsplash.com/photo-1578637387939-43c525550085?w=1200&q=80",
    labelKo: "제주도 한라산",
    labelEs: "Monte Hallasan, Jeju",
  },
  {
    src: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200&q=80",
    labelKo: "서울 남산타워",
    labelEs: "Torre Namsan, Seúl",
  },
];

const INTERVAL = 4000;

export default function KoreaCarousel({ isKo, fullHeight = false }: { isKo: boolean; fullHeight?: boolean }) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const prev = useCallback(() =>
    setCurrent((c) => (c - 1 + SLIDES.length) % SLIDES.length), []);
  const next = useCallback(() =>
    setCurrent((c) => (c + 1) % SLIDES.length), []);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(next, INTERVAL);
    return () => clearInterval(id);
  }, [paused, next]);

  return (
    <div
      className={`relative overflow-hidden ${
        fullHeight ? "absolute inset-0 w-full h-full" : "w-full mb-10"
      }`}
      style={fullHeight ? undefined : { height: "340px" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Slides */}
      {SLIDES.map((slide, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: i === current ? 1 : 0, zIndex: i === current ? 1 : 0 }}
        >
          <Image
            src={slide.src}
            alt={slide.labelKo}
            fill
            className="object-cover"
            sizes="100vw"
            priority={i === 0}
          />
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          {/* Label */}
          <div className="absolute bottom-5 left-6 z-10">
            <span className="text-white text-sm font-semibold drop-shadow-lg">
              {isKo ? slide.labelKo : slide.labelEs}
            </span>
          </div>
        </div>
      ))}

      {/* Prev button */}
      <button
        onClick={prev}
        aria-label="이전"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition-all cursor-pointer backdrop-blur-sm"
      >
        ‹
      </button>

      {/* Next button */}
      <button
        onClick={next}
        aria-label="다음"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition-all cursor-pointer backdrop-blur-sm"
      >
        ›
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-4 right-6 z-10 flex items-center gap-1.5">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`슬라이드 ${i + 1}`}
            className={`rounded-full transition-all cursor-pointer ${
              i === current
                ? "w-5 h-2 bg-white"
                : "w-2 h-2 bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>

      {/* Pause indicator */}
      {paused && (
        <div className="absolute top-3 right-4 z-10 text-[10px] text-white/60 font-semibold tracking-wider">
          ❚❚
        </div>
      )}
    </div>
  );
}
