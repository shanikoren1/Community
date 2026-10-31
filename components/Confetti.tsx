"use client";
import { useEffect, useState } from "react";

type CT = "coral" | "orange" | "amber";

const COLORS: Record<CT, string[]> = {
  coral:  ["#FF6F91", "#FF9BB5", "#FFD0DC", "#fff", "#FF4D7A"],
  orange: ["#FF8A1F", "#FFB347", "#FFD580", "#fff", "#FF6A1A"],
  amber:  ["#FFC24D", "#FFD98C", "#FFE5B4", "#fff", "#FFAD0D"],
};

interface Pt { id: number; x: number; d: number; s: number; c: string; r: number; }

export default function Confetti({ active, type = "amber", big = false }: { active: boolean; type?: CT; big?: boolean }) {
  const [pts, setPts] = useState<Pt[]>([]);

  useEffect(() => {
    if (!active) { setPts([]); return; }
    const cols = COLORS[type];
    const count = big ? 120 : 68;
    const scale = big ? 1.7 : 1;
    setPts(Array.from({ length: count }, (_, i) => ({
      id: i,
      x: (i * 1.49) % 100,
      d: (big ? 2.4 : 1.8) + (i % 5) * 0.38,
      s: (5 + (i % 9)) * scale,
      c: cols[i % cols.length],
      r: (i % 6) * 0.055,
    })));
    const t = setTimeout(() => setPts([]), big ? 5500 : 4000);
    return () => clearTimeout(t);
  }, [active, type, big]);

  if (!pts.length) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[998] overflow-hidden" aria-hidden>
      {pts.map(p => (
        <div
          key={p.id}
          className="confetti-particle absolute top-0"
          style={{
            left: `${p.x}%`,
            width: p.s,
            height: type === "coral" ? p.s * 2.8 : p.s,
            borderRadius: type === "orange" ? "50%" : "2px",
            backgroundColor: p.c,
            animationDelay: `${p.r}s`,
            animationDuration: `${p.d}s`,
            clipPath: type === "amber"
              ? "polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)"
              : undefined,
          }}
        />
      ))}
    </div>
  );
}
