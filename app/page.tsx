"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Camera, Timer, Users, Sparkles, ArrowRight, Headphones, Target } from "lucide-react";
import { SITE, PLAYCLUB_URL, AUDIOBOOK_URL } from "../lib/config";

const JoinFlow = dynamic(() => import("../components/JoinFlow"), { ssr: false });

const GRADIENT = "linear-gradient(135deg, #46CAC0 0%, #2184F9 60%, #5925DC 100%)";

const LOOP = [
  { icon: Target, title: "Show up", text: "Your calendar tells you it's time. You begin." },
  { icon: Camera, title: "Take the photo", text: "Proof of the moment. You showed up — capture it." },
  { icon: Timer, title: "Focus", text: "A timer runs. 20, 45, 60 minutes. Just you and the work." },
  { icon: Users, title: "Get hyped", text: "The group sees it. The cheers come. The reward lands." },
];

export default function Home() {
  const [showJoin, setShowJoin] = useState(false);

  return (
    <main>
      {/* HERO */}
      <section
        className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center overflow-hidden"
        style={{ backgroundColor: "#041A2A" }}
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(33,132,249,0.15) 0%, rgba(70,202,192,0.05) 50%, transparent 75%)",
          }}
        />

        <div className="relative z-10 max-w-4xl mx-auto">
          <span
            className="inline-block mb-10 px-4 py-1.5 text-xs font-semibold tracking-[0.2em] uppercase rounded-full"
            style={{
              border: "1px solid rgba(70,202,192,0.4)",
              color: "#46CAC0",
              backgroundColor: "rgba(70,202,192,0.06)",
              fontFamily: "var(--font-inter)",
            }}
          >
            {SITE.parentBrand} Community · Atomic Habits
          </span>

          <h1
            className="font-black text-white mb-8"
            style={{
              fontFamily: "var(--font-outfit)",
              fontSize: "clamp(64px, 11vw, 120px)",
              lineHeight: 0.98,
              letterSpacing: "-0.04em",
            }}
          >
            {SITE.name}.
          </h1>

          <p
            className="font-black uppercase tracking-tight mb-8"
            style={{
              fontFamily: "var(--font-outfit)",
              fontSize: "clamp(22px, 5vw, 52px)",
              background: GRADIENT,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              lineHeight: 1.1,
            }}
          >
            The best time is now.
          </p>

          <div className="flex flex-col items-center gap-2 mb-4">
            <p className="text-xl md:text-2xl" style={{ color: "#CBD5E1", fontFamily: "var(--font-inter)", fontWeight: 400 }}>
              Be a builder of your own life.
            </p>
            <p className="text-base md:text-lg max-w-xl" style={{ color: "#64748B", fontFamily: "var(--font-inter)" }}>
              You don&apos;t set goals. You become the person who lives them — one habit, one day, one photo at a time.
              Together.
            </p>
          </div>

          <div className="mt-10">
            <button
              onClick={() => setShowJoin(true)}
              className="group inline-flex items-center gap-3 px-9 py-4 font-bold text-white rounded-full transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
              style={{
                background: GRADIENT,
                fontFamily: "var(--font-inter)",
                fontSize: "1.05rem",
                letterSpacing: "-0.01em",
                boxShadow: "0 6px 30px rgba(70,202,192,0.35)",
              }}
            >
              <Sparkles size={18} />
              Start my journey
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </button>
            <p className="mt-3 text-xs" style={{ color: "rgba(255,255,255,0.3)", fontFamily: "var(--font-inter)" }}>
              Free · Pick 2 goals · Choose who you become
            </p>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ color: "#46CAC0" }}>
            <path d="M10 4v12M4 10l6 6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </section>

      {/* IDENTITY MANIFESTO */}
      <section className="py-28 px-6" style={{ backgroundColor: "#F8F9FC" }}>
        <div className="max-w-2xl mx-auto text-center">
          <p className="mb-5 text-xs font-semibold tracking-[0.18em] uppercase" style={{ color: "#2184F9", fontFamily: "var(--font-inter)" }}>
            The idea
          </p>
          <h2
            className="font-black mb-6"
            style={{ fontFamily: "var(--font-outfit)", fontSize: "clamp(28px, 5vw, 52px)", lineHeight: 1.1, color: "#0F172A", letterSpacing: "-0.03em" }}
          >
            Every action is a vote
            <br />
            for who you become.
          </h2>
          <p className="text-lg leading-relaxed mb-4" style={{ color: "#475569", fontFamily: "var(--font-inter)" }}>
            It&apos;s so easy to do nothing. It&apos;s just as easy to build a business, get strong, learn, and grow —
            the same easy. The difference is <strong>identity</strong>. Not &ldquo;I want to read more,&rdquo; but
            &ldquo;I am a reader.&rdquo; Not &ldquo;I&apos;m trying to work out,&rdquo; but &ldquo;I am someone who
            trains.&rdquo;
          </p>
          <p className="text-lg leading-relaxed" style={{ color: "#475569", fontFamily: "var(--font-inter)" }}>
            {SITE.name} is the community that turns your habits into your identity — and surrounds you with people who
            are doing the exact same thing.
          </p>
        </div>
      </section>

      {/* THE LOOP */}
      <section className="py-28 px-6" style={{ backgroundColor: "#041A2A" }}>
        <div className="max-w-4xl mx-auto">
          <p className="mb-3 text-xs font-semibold tracking-[0.18em] uppercase text-center" style={{ color: "#46CAC0", fontFamily: "var(--font-inter)" }}>
            The daily loop
          </p>
          <h2
            className="font-black text-white text-center mb-14"
            style={{ fontFamily: "var(--font-outfit)", fontSize: "clamp(28px, 5vw, 48px)", letterSpacing: "-0.03em" }}
          >
            How a habit becomes you.
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {LOOP.map((s, i) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.title}
                  className="relative rounded-2xl p-6"
                  style={{ background: "#0A2540", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: GRADIENT }}>
                      <Icon size={20} color="#fff" />
                    </div>
                    <span className="text-xs font-bold tracking-widest uppercase" style={{ color: "#46CAC0", fontFamily: "var(--font-inter)" }}>
                      Step {i + 1}
                    </span>
                  </div>
                  <h3 className="font-bold text-white mb-1.5" style={{ fontFamily: "var(--font-outfit)", fontSize: "20px" }}>
                    {s.title}
                  </h3>
                  <p className="text-base leading-relaxed" style={{ color: "#94A3B8", fontFamily: "var(--font-inter)" }}>
                    {s.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* AUDIOBOOK */}
      <section className="py-24 px-6" style={{ backgroundColor: "#EEF2FF" }}>
        <div className="max-w-2xl mx-auto text-center">
          <div className="mx-auto mb-6 w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #5925DC, #2184F9)" }}>
            <Headphones size={24} color="#fff" />
          </div>
          <h2 className="font-black mb-4" style={{ fontFamily: "var(--font-outfit)", fontSize: "clamp(26px, 4vw, 40px)", color: "#0F172A", letterSpacing: "-0.03em" }}>
            Read the playbook with us.
          </h2>
          <p className="text-lg leading-relaxed mb-8 mx-auto" style={{ color: "#475569", fontFamily: "var(--font-inter)", maxWidth: 460 }}>
            Our whole community is built on <em>Atomic Habits</em> by James Clear. Listen along — it&apos;s our shared
            language.
          </p>
          <a
            href={AUDIOBOOK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-7 py-3.5 font-semibold rounded-full transition-all hover:-translate-y-0.5 hover:shadow-lg"
            style={{ border: "2px solid #5925DC", color: "#5925DC", fontFamily: "var(--font-inter)", background: "transparent" }}
          >
            <Headphones size={16} /> Listen on Spotify
          </a>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 text-center" style={{ backgroundColor: "#041A2A" }}>
        <div className="max-w-md mx-auto">
          <h2
            className="font-black text-white mb-4"
            style={{ fontFamily: "var(--font-outfit)", fontSize: "clamp(28px, 4vw, 48px)", letterSpacing: "-0.03em" }}
          >
            The best time is now.
          </h2>
          <p className="mb-8 text-base" style={{ color: "#64748B", fontFamily: "var(--font-inter)" }}>
            Pick your two goals. Put them in your calendar. Show up with your people.
          </p>
          <button
            onClick={() => setShowJoin(true)}
            className="group inline-flex items-center gap-2 px-8 py-4 font-semibold text-white rounded-full transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
            style={{ background: GRADIENT, fontSize: "1rem", fontFamily: "var(--font-inter)", boxShadow: "0 6px 30px rgba(70,202,192,0.35)" }}
          >
            Start my journey
            <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
          </button>
          <p className="mt-7 text-sm">
            <a href={PLAYCLUB_URL} target="_blank" rel="noopener noreferrer" className="transition-opacity hover:opacity-70" style={{ color: "#46CAC0", fontFamily: "var(--font-inter)" }}>
              Already in? Open the group chat →
            </a>
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-6 px-6 text-center" style={{ backgroundColor: "#041A2A", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <p className="text-sm" style={{ color: "#334155", fontFamily: "var(--font-inter)" }}>
          {SITE.name} · a {SITE.parentBrand} community · 2026
        </p>
      </footer>

      {showJoin && <JoinFlow onClose={() => setShowJoin(false)} />}
    </main>
  );
}
