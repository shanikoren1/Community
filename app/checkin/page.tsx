"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Target } from "lucide-react";
import FocusTimer from "../../components/FocusTimer";
import { SITE } from "../../lib/config";

const FLAME = "linear-gradient(135deg, #FF6A1A 0%, #FFB347 100%)";

export default function CheckinPage() {
  const [goal, setGoal] = useState<string | null>(null);
  const [custom, setCustom] = useState("");

  return (
    <main className="min-h-screen flex flex-col items-center px-6 py-10" style={{ backgroundColor: "#0C0C11" }}>
      <div className="w-full max-w-md">
        <Link href="/" className="inline-flex items-center gap-2 mb-8 transition-opacity hover:opacity-70" style={{ color: "#6B6B78", fontFamily: "var(--font-inter)" }}>
          <ArrowLeft size={15} />
          <img src="/logo.png" alt="Become" width={24} height={24} className="rounded-md" />
          <span className="text-sm font-semibold text-white">Become</span>
        </Link>

        {!goal ? (
          <div className="float-up">
            <div className="mb-6 w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: FLAME }}>
              <Target size={22} color="#0C0C11" />
            </div>
            <h1 className="font-black text-white mb-3" style={{ fontFamily: "var(--font-outfit)", fontSize: "clamp(30px, 7vw, 44px)", letterSpacing: "-0.03em" }}>Time to show up.</h1>
            <p className="text-base mb-8" style={{ color: "#9A9AA8", fontFamily: "var(--font-inter)" }}>
              Which habit are you doing right now? Take your photo proof, then start the timer.
            </p>
            <label className="block mb-2 text-sm font-semibold text-white" style={{ fontFamily: "var(--font-inter)" }}>I&apos;m working on…</label>
            <input autoFocus value={custom} onChange={(e) => setCustom(e.target.value)} placeholder="e.g. Reading, Gym, Writing…"
              className="w-full rounded-xl px-4 py-3.5 text-base outline-none mb-4"
              style={{ border: "1.5px solid rgba(255,255,255,0.1)", background: "#15151D", color: "#fff", fontFamily: "var(--font-inter)" }} />
            <button onClick={() => custom.trim() && setGoal(custom.trim())} disabled={!custom.trim()}
              className="w-full py-4 rounded-xl font-bold text-black transition-all hover:-translate-y-0.5 disabled:opacity-30"
              style={{ background: FLAME, fontFamily: "var(--font-inter)", fontSize: 16, boxShadow: "0 10px 40px rgba(255,106,26,0.35)" }}>
              Begin →
            </button>
          </div>
        ) : (
          <div className="float-up pt-4">
            <p className="text-center mb-8 mono-label" style={{ color: "#FF8A1F" }}>{goal}</p>
            <FocusTimer goalLabel={goal} />
          </div>
        )}
      </div>
    </main>
  );
}
