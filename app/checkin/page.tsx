"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Target } from "lucide-react";
import FocusTimer from "../../components/FocusTimer";
import { SITE } from "../../lib/config";

export default function CheckinPage() {
  const [goal, setGoal] = useState<string | null>(null);
  const [custom, setCustom] = useState("");

  return (
    <main className="min-h-screen flex flex-col items-center px-6 py-10" style={{ backgroundColor: "#041A2A" }}>
      <div className="w-full max-w-md">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm mb-8 transition-opacity hover:opacity-70" style={{ color: "#64748B", fontFamily: "var(--font-inter)" }}>
          <ArrowLeft size={15} /> {SITE.name}
        </Link>

        {!goal ? (
          <div className="float-up">
            <div className="mb-6 w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #46CAC0 0%, #2184F9 60%, #5925DC 100%)" }}>
              <Target size={22} color="#fff" />
            </div>
            <h1 className="font-black text-white mb-3" style={{ fontFamily: "var(--font-outfit)", fontSize: "clamp(30px, 7vw, 44px)", letterSpacing: "-0.03em" }}>
              Time to show up.
            </h1>
            <p className="text-base mb-8" style={{ color: "#94A3B8", fontFamily: "var(--font-inter)" }}>
              Which habit are you doing right now? Take your photo proof, then start the timer.
            </p>

            <label className="block mb-2 text-sm font-semibold text-white" style={{ fontFamily: "var(--font-inter)" }}>
              I&apos;m working on…
            </label>
            <input
              autoFocus
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
              placeholder="e.g. Reading, Gym, Writing…"
              className="w-full rounded-xl px-4 py-3.5 text-base outline-none mb-4"
              style={{ border: "1.5px solid rgba(255,255,255,0.12)", background: "#0A2540", color: "#fff", fontFamily: "var(--font-inter)" }}
            />
            <button
              onClick={() => custom.trim() && setGoal(custom.trim())}
              disabled={!custom.trim()}
              className="w-full py-4 rounded-xl font-bold text-white transition-all hover:-translate-y-0.5 disabled:opacity-40"
              style={{ background: "linear-gradient(135deg, #46CAC0 0%, #2184F9 60%, #5925DC 100%)", fontFamily: "var(--font-inter)", fontSize: 16, boxShadow: "0 6px 30px rgba(70,202,192,0.35)" }}
            >
              Begin →
            </button>
          </div>
        ) : (
          <div className="float-up pt-4">
            <p className="text-center mb-8 text-sm font-semibold tracking-widest uppercase" style={{ color: "#46CAC0", fontFamily: "var(--font-inter)" }}>
              {goal}
            </p>
            <FocusTimer goalLabel={goal} />
          </div>
        )}
      </div>
    </main>
  );
}
