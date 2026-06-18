"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, Camera, MessageCircle, Check } from "lucide-react";
import { PLAYCLUB_URL, SITE } from "../lib/config";

const GRADIENT = "linear-gradient(135deg, #46CAC0 0%, #2184F9 60%, #5925DC 100%)";
const DURATIONS = [20, 45, 60];

interface Props {
  /** the habit the member is focusing on */
  goalLabel: string;
}

type Phase = "setup" | "running" | "paused" | "done";

export default function FocusTimer({ goalLabel }: Props) {
  const [minutes, setMinutes] = useState(20);
  const [phase, setPhase] = useState<Phase>("setup");
  const [remaining, setRemaining] = useState(20 * 60); // seconds
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const total = minutes * 60;

  useEffect(() => {
    if (phase === "setup") setRemaining(minutes * 60);
  }, [minutes, phase]);

  useEffect(() => {
    if (phase === "running") {
      intervalRef.current = setInterval(() => {
        setRemaining((r) => {
          if (r <= 1) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            setPhase("done");
            return 0;
          }
          return r - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [phase]);

  function reset() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setPhase("setup");
    setRemaining(minutes * 60);
  }

  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");
  const progress = total > 0 ? 1 - remaining / total : 0;

  // SVG ring geometry
  const R = 120;
  const C = 2 * Math.PI * R;

  if (phase === "done") {
    return <RewardScreen goalLabel={goalLabel} minutes={minutes} onAgain={reset} />;
  }

  return (
    <div className="flex flex-col items-center">
      {/* timer ring */}
      <div className="relative" style={{ width: 280, height: 280 }}>
        <svg width="280" height="280" viewBox="0 0 280 280" className="-rotate-90">
          <circle cx="140" cy="140" r={R} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="14" />
          <circle
            cx="140" cy="140" r={R} fill="none"
            stroke="url(#grad)" strokeWidth="14" strokeLinecap="round"
            strokeDasharray={C} strokeDashoffset={C * (1 - progress)}
            style={{ transition: "stroke-dashoffset 1s linear" }}
          />
          <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#46CAC0" />
              <stop offset="60%" stopColor="#2184F9" />
              <stop offset="100%" stopColor="#5925DC" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-black text-white" style={{ fontFamily: "var(--font-outfit)", fontSize: 56, letterSpacing: "-0.03em" }}>
            {mm}:{ss}
          </span>
          <span className="text-sm mt-1" style={{ color: "#64748B", fontFamily: "var(--font-inter)" }}>
            {phase === "setup" ? "ready" : phase === "paused" ? "paused" : "stay focused"}
          </span>
        </div>
      </div>

      {/* duration picker (setup only) */}
      {phase === "setup" && (
        <div className="flex gap-2.5 mt-8">
          {DURATIONS.map((d) => (
            <button
              key={d}
              onClick={() => setMinutes(d)}
              className="px-5 py-2.5 rounded-full text-sm font-semibold transition-all"
              style={{
                border: minutes === d ? "1.5px solid #46CAC0" : "1.5px solid rgba(255,255,255,0.12)",
                background: minutes === d ? "rgba(70,202,192,0.12)" : "transparent",
                color: minutes === d ? "#46CAC0" : "#94A3B8",
                fontFamily: "var(--font-inter)",
              }}
            >
              {d} min
            </button>
          ))}
        </div>
      )}

      {/* controls */}
      <div className="flex items-center gap-3 mt-8">
        {phase === "setup" && (
          <button
            onClick={() => setPhase("running")}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-white transition-all hover:-translate-y-0.5"
            style={{ background: GRADIENT, fontFamily: "var(--font-inter)", boxShadow: "0 6px 30px rgba(70,202,192,0.35)" }}
          >
            <Play size={18} /> Start focus
          </button>
        )}
        {phase === "running" && (
          <button
            onClick={() => setPhase("paused")}
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold transition-all"
            style={{ border: "1.5px solid rgba(255,255,255,0.15)", color: "#CBD5E1", fontFamily: "var(--font-inter)" }}
          >
            <Pause size={16} /> Pause
          </button>
        )}
        {phase === "paused" && (
          <button
            onClick={() => setPhase("running")}
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-bold text-white transition-all hover:-translate-y-0.5"
            style={{ background: GRADIENT, fontFamily: "var(--font-inter)", boxShadow: "0 6px 30px rgba(70,202,192,0.35)" }}
          >
            <Play size={16} /> Resume
          </button>
        )}
        {phase !== "setup" && (
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full font-semibold transition-all"
            style={{ color: "#64748B", fontFamily: "var(--font-inter)" }}
          >
            <RotateCcw size={16} /> Reset
          </button>
        )}
      </div>

      <p className="mt-8 text-sm text-center max-w-xs" style={{ color: "#475569", fontFamily: "var(--font-inter)" }}>
        Take your photo proof first, then focus. When the timer ends, the celebration begins.
      </p>
    </div>
  );
}

function RewardScreen({ goalLabel, minutes, onAgain }: { goalLabel: string; minutes: number; onAgain: () => void }) {
  // log the check-in (best-effort, non-blocking)
  useEffect(() => {
    fetch("/api/checkin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ goal: goalLabel, minutes, completedAt: new Date().toISOString() }),
    }).catch(() => {});
  }, [goalLabel, minutes]);

  const confetti = Array.from({ length: 24 });

  return (
    <div className="relative flex flex-col items-center text-center">
      {/* confetti */}
      <div className="pointer-events-none absolute -top-6 left-0 right-0 flex justify-center overflow-visible" aria-hidden="true">
        {confetti.map((_, i) => {
          const colors = ["#46CAC0", "#2184F9", "#5925DC", "#FBBF24"];
          const left = (i / confetti.length) * 100;
          const delay = (i % 6) * 0.12;
          return (
            <span
              key={i}
              style={{
                position: "absolute",
                left: `${left}%`,
                width: 8,
                height: 8,
                borderRadius: 2,
                background: colors[i % colors.length],
                animation: `confetti-fall 1.4s ease-in ${delay}s both`,
              }}
            />
          );
        })}
      </div>

      <div className="reward-pop mb-6 w-24 h-24 rounded-full flex items-center justify-center" style={{ background: GRADIENT, boxShadow: "0 12px 50px rgba(70,202,192,0.45)" }}>
        <Check size={48} color="#fff" strokeWidth={3} />
      </div>

      <h2 className="font-black text-white mb-2" style={{ fontFamily: "var(--font-outfit)", fontSize: 34, letterSpacing: "-0.03em" }}>
        You showed up.
      </h2>
      <p className="text-lg mb-1" style={{ color: "#CBD5E1", fontFamily: "var(--font-inter)" }}>
        {minutes} focused minutes on <strong style={{ color: "#46CAC0" }}>{goalLabel}</strong>.
      </p>
      <p className="text-base mb-8 max-w-sm" style={{ color: "#64748B", fontFamily: "var(--font-inter)" }}>
        That&apos;s another vote for who you&apos;re becoming. Now share it — let your people cheer you on.
      </p>

      <a
        href={PLAYCLUB_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-white transition-all hover:-translate-y-0.5 mb-3"
        style={{ background: GRADIENT, fontFamily: "var(--font-inter)", fontSize: 16, boxShadow: "0 6px 30px rgba(70,202,192,0.35)" }}
      >
        <Camera size={18} /> Post my photo to the chat
      </a>
      <a
        href={PLAYCLUB_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-sm font-semibold mb-6"
        style={{ color: "#46CAC0", fontFamily: "var(--font-inter)" }}
      >
        <MessageCircle size={14} /> Open {SITE.name} group chat
      </a>

      <button onClick={onAgain} className="inline-flex items-center gap-2 text-sm" style={{ color: "#64748B", fontFamily: "var(--font-inter)" }}>
        <RotateCcw size={14} /> Another session
      </button>
    </div>
  );
}
