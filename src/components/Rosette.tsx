function hypotrochoid(R: number, r: number, d: number, steps: number) {
  const k = (R - r) / r;
  const turns = r / gcd(R, r);
  const pts: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * Math.PI * 2 * turns;
    const x = 200 + (R - r) * Math.cos(t) + d * Math.cos(k * t);
    const y = 200 + (R - r) * Math.sin(t) - d * Math.sin(k * t);
    pts.push(`${x.toFixed(2)},${y.toFixed(2)}`);
  }
  return `M${pts.join("L")}`;
}

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

const outer = hypotrochoid(150, 45, 80, 1400);
const inner = hypotrochoid(96, 36, 52, 900);
const ellipses = Array.from({ length: 36 }, (_, i) => i);

export function Rosette({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 400" className={className} fill="none" stroke="currentColor" aria-hidden>
      <path d={outer} strokeWidth="0.35" />
      <path d={inner} strokeWidth="0.35" />
      {ellipses.map((i) => (
        <ellipse
          key={i}
          cx="200"
          cy="200"
          rx="190"
          ry="70"
          transform={`rotate(${i * 5} 200 200)`}
          strokeWidth="0.25"
        />
      ))}
      <circle cx="200" cy="200" r="196" strokeWidth="0.5" />
      <circle cx="200" cy="200" r="40" strokeWidth="0.5" />
    </svg>
  );
}
