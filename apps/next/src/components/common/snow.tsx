import type { CSSProperties } from 'react';

const FLAKE_COUNT = 120;

function seeded(seed: number) {
  const x = Math.sin(seed * 999.9) * 10000;
  return x - Math.floor(x);
}

export function Snow() {
  const flakes = Array.from({ length: FLAKE_COUNT }, (_, i) => {
    const idx = i + 1;
    const x = seeded(idx) * 100;
    const drift = (seeded(idx * 3.1) * 2 - 1) * 24;
    const duration = 10 + seeded(idx * 5.7) * 20;
    const delay = -seeded(idx * 2.3) * 30;
    const scale = 0.2 + seeded(idx * 7.9) * 0.9;
    const opacity = 0.1 + seeded(idx * 11.4) * 0.7;

    return {
      idx,
      style: {
        left: `${x}vw`,
        opacity,
        transform: `translate3d(0,-10px,0) scale(${scale})`,
        animationDuration: `${duration}s`,
        animationDelay: `${delay}s`,
        ['--snow-drift' as string]: `${drift}px`,
      } as CSSProperties,
    };
  });

  return (
    <div className="snow-layer" aria-hidden="true">
      {flakes.map((flake) => (
        <div key={flake.idx} className="snow" style={flake.style}>
          ❅
        </div>
      ))}
    </div>
  );
}
