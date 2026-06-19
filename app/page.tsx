"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import {
  Camera, Timer, Users, ArrowRight, Headphones, Target,
  Fingerprint, Layers, Flame, Mic,
} from "lucide-react";
import { SITE, PLAYCLUB_URL, AUDIOBOOK_URL, PODCAST_URL } from "../lib/config";

const JoinFlow = dynamic(() => import("../components/JoinFlow"), { ssr: false });

const FLAME = "linear-gradient(135deg, #FF6A1A 0%, #FFB347 100%)";

const LOOP = [
  { icon: Target, title: "Show up", text: "Your calendar says it's time, so you start." },
  { icon: Camera, title: "Prepare your space", text: "Get everything you need in front of you, no excuses left." },
  { icon: Timer, title: "Focus", text: "Start the timer. 20, 45 or 60 minutes of just you and the work." },
  { icon: Users, title: "Get cheered on", text: "Share your win with the group and feel the cheers come back." },
];

const TRUTHS = [
  { icon: Fingerprint, tag: "Identity", title: "You become your habits", text: "Every action is a vote for the person you want to be." },
  { icon: Layers, tag: "Systems", title: "Systems beat goals", text: "You don't rise to your goals, you fall to your systems. So we build you one: two habits, a time, a place." },
  { icon: Users, tag: "Community", title: "You're not alone", text: "We do this together. Playclub is our platform where the community plans events, meets up, and supports each other." },
];

export default function Home() {
  const [showJoin, setShowJoin] = useState(false);
  const open = () => setShowJoin(true);

  return (
    <main style={{ backgroundColor: "#0C0C11" }}>
      {/* NAV */}
      <nav className="fixed top-0 inset-x-0 z-40 px-5 py-3 flex items-center justify-between"
        style={{ backgroundColor: "rgba(12,12,17,0.72)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Become" width={64} height={64} className="rounded-xl" />
          <span className="font-extrabold text-white text-2xl" style={{ fontFamily: "var(--font-outfit)" }}>Become</span>
        </div>
        <button onClick={open}
          className="px-5 py-2 rounded-lg text-sm font-bold text-black transition-all hover:-translate-y-0.5"
          style={{ background: FLAME, fontFamily: "var(--font-inter)", boxShadow: "0 4px 18px rgba(255,106,26,0.35)" }}>
          Join now
        </button>
      </nav>

      {/* HERO */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center overflow-hidden">
        <div className="absolute inset-0 slow-zoom" style={{ backgroundImage: "url('/mountain-hero.png')", backgroundSize: "cover", backgroundPosition: "center" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(12,12,17,0.55) 0%, rgba(12,12,17,0.35) 45%, rgba(12,12,17,0.95) 100%)" }} />

        <div className="relative z-10 max-w-3xl mx-auto">
          <span className="mono-label inline-block mb-6 px-3 py-1 rounded-full"
            style={{ border: "1px solid rgba(255,179,71,0.4)", color: "#FFB347", backgroundColor: "rgba(255,106,26,0.08)" }}>
            By Shani Koren · {SITE.parentBrand}
          </span>

          <h1 className="font-black text-white mb-5" style={{
            fontFamily: "var(--font-outfit)", fontSize: "clamp(52px, 12vw, 104px)", lineHeight: 0.95, letterSpacing: "-0.04em", textShadow: "0 4px 40px rgba(0,0,0,0.5)",
          }}>
            The best<br />time is now.
          </h1>

          <p className="text-lg md:text-xl mx-auto mb-9" style={{ color: "#D4D4DC", fontFamily: "var(--font-inter)", maxWidth: 520, textShadow: "0 2px 20px rgba(0,0,0,0.6)" }}>
            You get to decide who you become. Pick two habits, show up for them every day, and do it with people who actually have your back.
          </p>

          <button onClick={open}
            className="group inline-flex items-center gap-2.5 px-9 py-4 rounded-xl font-bold text-black transition-all duration-300 hover:-translate-y-1"
            style={{ background: FLAME, fontFamily: "var(--font-inter)", fontSize: "1.1rem", boxShadow: "0 10px 40px rgba(255,106,26,0.45)" }}>
            <Flame size={20} /> Start now
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </button>
          <p className="mono-label mt-4" style={{ color: "rgba(255,255,255,0.45)" }}>Free. Takes two minutes.</p>
        </div>
      </section>

      {/* ONE-SENTENCE INTRO */}
      <section className="pt-14 pb-10 px-6" style={{ backgroundColor: "#0C0C11" }}>
        <div className="max-w-2xl mx-auto text-center">
          <p className="mono-label mb-4" style={{ color: "#FF8A1F" }}>The idea</p>
          <h2 className="font-black text-white" style={{ fontFamily: "var(--font-outfit)", fontSize: "clamp(26px, 5vw, 44px)", lineHeight: 1.15, letterSpacing: "-0.03em" }}>
            After analyzing the book <span className="text-sunset">Atomic Habits</span>, we build a system that actually works.
          </h2>
        </div>
      </section>

      {/* THE DAILY LOOP — moved up */}
      <section className="py-16 px-6" style={{ backgroundColor: "#111119" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="mono-label mb-3" style={{ color: "#FF8A1F" }}>How it works, every day</p>
            <h2 className="font-black text-white" style={{ fontFamily: "var(--font-outfit)", fontSize: "clamp(26px, 5vw, 44px)", letterSpacing: "-0.03em" }}>
              Four steps. Every single day.
            </h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {LOOP.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={s.title} className="rounded-2xl p-5" style={{ background: "#17171F", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{ background: "rgba(255,106,26,0.12)", border: "1px solid rgba(255,138,31,0.25)" }}><Icon size={20} color="#FF8A1F" /></div>
                  <span className="mono-label block mb-1.5" style={{ color: "#6B6B78" }}>Step {i + 1}</span>
                  <h3 className="font-bold text-white mb-1.5" style={{ fontFamily: "var(--font-outfit)", fontSize: 18 }}>{s.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "#9A9AA8", fontFamily: "var(--font-inter)" }}>{s.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* IDENTITY / SYSTEMS / COMMUNITY */}
      <section className="py-16 px-6" style={{ backgroundColor: "#0C0C11" }}>
        <div className="max-w-5xl mx-auto">
          <div className="grid sm:grid-cols-3 gap-4">
            {TRUTHS.map((l) => {
              const Icon = l.icon;
              return (
                <div key={l.tag} className="rounded-2xl p-6" style={{ background: "#15151D", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: FLAME }}><Icon size={20} color="#0C0C11" /></div>
                    <span className="mono-label" style={{ color: "#FF8A1F" }}>{l.tag}</span>
                  </div>
                  <h3 className="font-bold text-white mb-2" style={{ fontFamily: "var(--font-outfit)", fontSize: 20 }}>{l.title}</h3>
                  <p className="text-base leading-relaxed" style={{ color: "#9A9AA8", fontFamily: "var(--font-inter)" }}>{l.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* PLAYCLUB — shorter, hype, CTA */}
      <section className="py-20 px-6" style={{ backgroundColor: "#111119" }}>
        <div className="max-w-3xl mx-auto rounded-3xl p-8 sm:p-10 text-center" style={{ background: "#15151D", border: "1px solid rgba(255,138,31,0.3)", boxShadow: "0 0 60px rgba(255,106,26,0.12)" }}>
          <div className="mx-auto mb-6 w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: FLAME }}>
            <Users size={24} color="#0C0C11" />
          </div>
          <p className="mono-label mb-3" style={{ color: "#FF8A1F" }}>Where it all happens</p>
          <h2 className="font-black text-white mb-4" style={{ fontFamily: "var(--font-outfit)", fontSize: "clamp(26px, 5vw, 44px)", letterSpacing: "-0.03em" }}>
            We do this together on Playclub.
          </h2>
          <p className="text-lg leading-relaxed mb-8 mx-auto" style={{ color: "#C4C4CC", fontFamily: "var(--font-inter)", maxWidth: 460 }}>
            Playclub is where Become lives. You share your wins, cheer each other on, and your group pulls you forward.
          </p>
          <a href={PLAYCLUB_URL} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-9 py-4 rounded-xl font-bold text-black transition-all duration-300 hover:-translate-y-1"
            style={{ background: FLAME, fontFamily: "var(--font-inter)", fontSize: "1.05rem", boxShadow: "0 10px 40px rgba(255,106,26,0.45)" }}>
            <Users size={19} /> Join the group on Playclub
            <ArrowRight size={17} />
          </a>
          <p className="mono-label mt-4" style={{ color: "#6B6B78" }}>Your first step. Take it now.</p>
        </div>
      </section>

      {/* LISTEN — podcast first */}
      <section className="py-16 px-6" style={{ backgroundColor: "#0C0C11" }}>
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-black text-white mb-3" style={{ fontFamily: "var(--font-outfit)", fontSize: "clamp(24px, 4vw, 36px)", letterSpacing: "-0.03em" }}>
            Listen along with us.
          </h2>
          <p className="text-base leading-relaxed mb-7 mx-auto" style={{ color: "#9A9AA8", fontFamily: "var(--font-inter)", maxWidth: 420 }}>
            We all speak one language here, <em>Atomic Habits</em> by James Clear.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a href={PODCAST_URL} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-7 py-3.5 font-bold rounded-xl text-black transition-all hover:-translate-y-0.5"
              style={{ background: FLAME, fontFamily: "var(--font-inter)" }}>
              <Mic size={17} /> Listen to the podcast
            </a>
            <a href={AUDIOBOOK_URL} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-7 py-3.5 font-semibold rounded-xl transition-all hover:-translate-y-0.5"
              style={{ border: "1.5px solid rgba(255,138,31,0.5)", color: "#FF8A1F", fontFamily: "var(--font-inter)" }}>
              <Headphones size={16} /> Full audiobook
            </a>
          </div>
        </div>
      </section>

      {/* JOURNEY — streak card (the version Shani preferred) */}
      <section className="py-20 px-6" style={{ backgroundColor: "#0C0C11" }}>
        <div className="max-w-3xl mx-auto rounded-3xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="relative px-7 pt-8 pb-7" style={{ backgroundImage: "linear-gradient(180deg, rgba(12,12,17,0.5), #15151D), url('/mountain-hero.png')", backgroundSize: "cover", backgroundPosition: "center" }}>
            <span className="mono-label" style={{ color: "#FFB347" }}>Your journey</span>
            <h2 className="font-black text-white mt-2" style={{ fontFamily: "var(--font-outfit)", fontSize: "clamp(26px, 5vw, 40px)" }}>Watch yourself climb.</h2>
          </div>
          <div className="px-7 py-7" style={{ background: "#15151D" }}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <span className="mono-label block mb-1" style={{ color: "#6B6B78" }}>Current streak</span>
                <span className="font-black text-white" style={{ fontFamily: "var(--font-outfit)", fontSize: 32 }}>
                  <Flame size={26} className="inline mr-1.5" color="#FF8A1F" />23 days
                </span>
              </div>
              <div className="text-right">
                <span className="mono-label block mb-1" style={{ color: "#6B6B78" }}>This week</span>
                <span className="text-sunset font-black" style={{ fontFamily: "var(--font-outfit)", fontSize: 32 }}>82%</span>
              </div>
            </div>
            <div className="flex items-end gap-2 h-24">
              {[40, 65, 50, 90, 70, 100, 60].map((h, i) => (
                <div key={i} className="flex-1 rounded-t-md" style={{ height: `${h}%`, background: i === 5 ? FLAME : "rgba(255,255,255,0.08)" }} />
              ))}
            </div>
            <p className="text-sm mt-5" style={{ color: "#9A9AA8", fontFamily: "var(--font-inter)" }}>
              Every focus session and every cheer stacks up. The mountain gets smaller as you get bigger.
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="pt-16 pb-10 px-6 text-center" style={{ backgroundColor: "#0C0C11", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <p className="text-sunset font-black mb-5" style={{ fontFamily: "var(--font-outfit)", fontSize: "clamp(56px, 16vw, 140px)", lineHeight: 0.9, letterSpacing: "-0.04em" }}>{SITE.name}</p>
        <div className="flex items-center justify-center gap-6 mb-4 text-sm" style={{ color: "#9A9AA8", fontFamily: "var(--font-inter)" }}>
          <span>Privacy</span><span>Terms</span><span>Support</span>
        </div>
        <p className="text-xs" style={{ color: "#4B4B57", fontFamily: "var(--font-inter)" }}>
          Created by Shani Koren. A {SITE.parentBrand} community. 2026.
        </p>
      </footer>

      {/* Sticky always-visible CTA (mobile) */}
      {!showJoin && (
        <div className="fixed bottom-0 inset-x-0 z-40 p-4 sm:hidden" style={{ background: "linear-gradient(180deg, rgba(12,12,17,0) 0%, rgba(12,12,17,0.9) 40%)" }}>
          <button onClick={open}
            className="w-full inline-flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-black"
            style={{ background: FLAME, fontFamily: "var(--font-inter)", fontSize: "1.05rem", boxShadow: "0 8px 36px rgba(255,106,26,0.55)" }}>
            <Flame size={19} /> Start now
            <ArrowRight size={17} />
          </button>
        </div>
      )}

      {showJoin && <JoinFlow onClose={() => setShowJoin(false)} />}
    </main>
  );
}
