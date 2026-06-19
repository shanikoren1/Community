"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, Camera, MessageCircle, Check } from "lucide-react";
import { WHATSAPP_URL, PLAYCLUB_URL } from "../lib/config";

const FLAME = "linear-gradient(135deg, #FF6A1A 0%, #FFB347 100%)";
const DURATIONS = [20, 45, 60];

interface Props { goalLabel: string; }
type Phase = "setup" | "running" | "paused" | "done";

export default function FocusTimer({ goalLabel }: Props) {
  const [minutes, setMinutes] = useState(20);
  const [phase, setPhase] = useState<Phase>("setup");
  const [remaining, setRemaining] = useState(20 * 60);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const total = minutes * 60;

  useEffect(() => { if (phase === "setup") setRemaining(minutes * 60); }, [minutes, phase]);

  useEffect(() => {
    if (phase === "running") {
      intervalRef.current = setInterval(() => {
        setRemaining((r) => {
          if (r <= 1) { if (intervalRef.current) clearInterval(intervalRef.current); setPhase("done"); return 0; }
          return r - 1;
        });
      }, 1000);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [phase]);

  function reset() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setPhase("setup"); setRemaining(minutes * 60);
  }

  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");
  const progress = total > 0 ? 1 - remaining / total : 0;
  const R = 120, C = 2 * Math.PI * R;

  if (phase === "done") return <RewardScreen goalLabel={goalLabel} minutes={minutes} onAgain={reset} />;

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: 280, height: 280 }}>
        <svg width="280" height="280" viewBox="0 0 280 280" className="-rotate-90">
          <circle cx="140" cy="140" r={R} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="14" />
          <circle cx="140" cy="140" r={R} fill="none" stroke="url(#flame)" strokeWidth="14" strokeLinecap="round"
            strokeDasharray={C} strokeDashoffset={C * (1 - progress)} style={{ transition: "stroke-dashoffset 1s linear" }} />
          <defs>
            <linearGradient id="flame" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF6A1A" /><stop offset="100%" stopColor="#FFB347" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-black text-white" style={{ fontFamily: "var(--font-outfit)", fontSize: 56, letterSpacing: "-0.03em" }}>{mm}:{ss}</span>
          <span className="mono-label mt-1" style={{ color: "#6B6B78" }}>{phase === "setup" ? "ready" : phase === "paused" ? "paused" : "stay focused"}</span>
        </div>
      </div>

      {phase === "setup" && (
        <div className="flex gap-2.5 mt-8">
          {DURATIONS.map((d) => (
            <button key={d} onClick={() => setMinutes(d)} className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
              style={{ border: minutes === d ? "1.5px solid #FF8A1F" : "1.5px solid rgba(255,255,255,0.1)", background: minutes === d ? "rgba(255,106,26,0.12)" : "transparent", color: minutes === d ? "#FF8A1F" : "#9A9AA8", fontFamily: "var(--font-inter)" }}>
              {d} min
            </button>
          ))}
        </div>
      )}

      <div className="flex items-center gap-3 mt-8">
        {phase === "setup" && (
          <button onClick={() => setPhase("running")} className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-black transition-all hover:-translate-y-0.5"
            style={{ background: FLAME, fontFamily: "var(--font-inter)", boxShadow: "0 10px 40px rgba(255,106,26,0.35)" }}>
            <Play size={18} /> Start focus
          </button>
        )}
        {phase === "running" && (
          <button onClick={() => setPhase("paused")} className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold transition-all" style={{ border: "1.5px solid rgba(255,255,255,0.12)", color: "#C4C4CC", fontFamily: "var(--font-inter)" }}>
            <Pause size={16} /> Pause
          </button>
        )}
        {phase === "paused" && (
          <button onClick={() => setPhase("running")} className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-black transition-all hover:-translate-y-0.5" style={{ background: FLAME, fontFamily: "var(--font-inter)", boxShadow: "0 10px 40px rgba(255,106,26,0.35)" }}>
            <Play size={16} /> Resume
          </button>
        )}
        {phase !== "setup" && (
          <button onClick={reset} className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl font-semibold transition-all" style={{ color: "#6B6B78", fontFamily: "var(--font-inter)" }}>
            <RotateCcw size={16} /> Reset
          </button>
        )}
      </div>

      <p className="mt-8 text-sm text-center max-w-xs" style={{ color: "#9A9AA8", fontFamily: "var(--font-inter)" }}>
        Prepare everything you need in front of you, then start. When the timer ends, the celebration begins.
      </p>
    </div>
  );
}

function RewardScreen({ goalLabel, minutes, onAgain }: { goalLabel: string; minutes: number; onAgain: () => void }) {
  useEffect(() => {
    fetch("/api/checkin", { method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ goal: goalLabel, minutes, completedAt: new Date().toISOString() }) }).catch(() => {});
  }, [goalLabel, minutes]);

  const confetti = Array.from({ length: 24 });
  const colors = ["#FF6A1A", "#FFB347", "#FF8A1F", "#FFD98C"];

  return (
    <div className="relative flex flex-col items-center text-center">
      <div className="pointer-events-none absolute -top-6 left-0 right-0 flex justify-center overflow-visible" aria-hidden="true">
        {confetti.map((_, i) => (
          <span key={i} style={{ position: "absolute", left: `${(i / confetti.length) * 100}%`, width: 8, height: 8, borderRadius: 2, background: colors[i % colors.length], animation: `confetti-fall 1.4s ease-in ${(i % 6) * 0.12}s both` }} />
        ))}
      </div>

      <div className="reward-pop mb-6 w-24 h-24 rounded-full flex items-center justify-center" style={{ background: FLAME, boxShadow: "0 12px 50px rgba(255,106,26,0.5)" }}>
        <Check size={48} color="#0C0C11" strokeWidth={3} />
      </div>
      <h2 className="font-black text-white mb-2" style={{ fontFamily: "var(--font-outfit)", fontSize: 34, letterSpacing: "-0.03em" }}>You showed up.</h2>
      <p className="text-lg mb-1" style={{ color: "#C4C4CC", fontFamily: "var(--font-inter)" }}>
        {minutes} focused minutes on <strong style={{ color: "#FF8A1F" }}>{goalLabel}</strong>.
      </p>
      <p className="text-base mb-8 max-w-sm" style={{ color: "#9A9AA8", fontFamily: "var(--font-inter)" }}>
        Another vote for who you&apos;re becoming. Now share it so your people can cheer you on.
      </p>

      <a href={WHATSAPP_URL || PLAYCLUB_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-black transition-all hover:-translate-y-0.5 mb-3"
        style={{ background: FLAME, fontFamily: "var(--font-inter)", fontSize: 16, boxShadow: "0 10px 40px rgba(255,106,26,0.4)" }}>
        <MessageCircle size={18} /> Share your win in the group
      </a>
      <a href={PLAYCLUB_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm font-semibold mb-6" style={{ color: "#FF8A1F", fontFamily: "var(--font-inter)" }}>
        <Camera size={14} /> Open playclub
      </a>
      <button onClick={onAgain} className="inline-flex items-center gap-2 text-sm" style={{ color: "#6B6B78", fontFamily: "var(--font-inter)" }}>
        <RotateCcw size={14} /> Another session
      </button>
    </div>
  );
}
