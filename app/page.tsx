"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  Camera, Timer, Users, ArrowRight, Headphones, Target,
  Fingerprint, Layers, Flame, Mic, MessageCircle,
} from "lucide-react";
import { SITE, PLAYCLUB_URL, WHATSAPP_URL, AUDIOBOOK_URL, PODCAST_URL } from "../lib/config";
import type { FocusGoal } from "../lib/goals";

const QRCodeSVG = dynamic(() => import("qrcode.react").then(m => m.QRCodeSVG), { ssr: false });

const HUB_KEY = "become_member";

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
  { icon: Users, tag: "Community", title: "You're not alone", text: "We do this together. Our home base is playclub, where the community plans events, meets up, and supports each other." },
];

export default function Home() {
  const [showJoin, setShowJoin] = useState(false);
  const [hubData, setHubData] = useState<{ firstName: string; focus: FocusGoal[] } | null>(null);
  const [joinInitial, setJoinInitial] = useState<{ step: "done"; focus: FocusGoal[]; firstName: string } | null>(null);

  const open = () => { setJoinInitial(null); setShowJoin(true); };

  useEffect(() => {
    if (window.location.hash === "#join") { setJoinInitial(null); setShowJoin(true); }
    try {
      const raw = localStorage.getItem(HUB_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.focus) setHubData(parsed);
      }
    } catch { /* ignore */ }
  }, []);

  function openHub() {
    if (!hubData) return;
    setJoinInitial({ step: "done", focus: hubData.focus, firstName: hubData.firstName });
    setShowJoin(true);
  }

  return (
    <main style={{ backgroundColor: "#0C0C11" }}>
      {/* NAV */}
      <nav className="fixed top-0 inset-x-0 z-40 px-4 py-1.5 flex items-center justify-between"
        style={{ backgroundColor: "rgba(12,12,17,0.72)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <img src="/logo.webp" alt="Become" className="h-24 w-auto" />
        <button onClick={open}
          className="px-5 py-2 rounded-lg text-sm font-bold text-black transition-all hover:-translate-y-0.5"
          style={{ background: FLAME, fontFamily: "var(--font-inter)", boxShadow: "0 4px 18px rgba(255,106,26,0.35)" }}>
          Quick habits survey
        </button>
      </nav>

      {/* HERO */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center overflow-hidden">
        <div className="absolute inset-0 slow-zoom" style={{ backgroundImage: "url('/mountain-hero.webp')", backgroundSize: "cover", backgroundPosition: "center" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(12,12,17,0.55) 0%, rgba(12,12,17,0.35) 45%, rgba(12,12,17,0.95) 100%)" }} />

        <div className="relative z-10 max-w-3xl mx-auto">
          <span className="mono-label inline-block mb-6 px-3 py-1 rounded-full"
            style={{ border: "1px solid rgba(255,179,71,0.4)", color: "#FFB347", backgroundColor: "rgba(255,106,26,0.08)" }}>
            Shani Koren · {SITE.parentBrand}
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

      {/* PLAYCLUB — with QR code */}
      <section className="py-20 px-6" style={{ backgroundColor: "#111119" }}>
        <div className="max-w-3xl mx-auto rounded-3xl p-8 sm:p-10" style={{ background: "#15151D", border: "1px solid rgba(255,138,31,0.3)", boxShadow: "0 0 60px rgba(255,106,26,0.12)" }}>
          <div className="flex flex-col sm:flex-row items-center gap-8">
            <div className="flex-1 text-center sm:text-left">
              <div className="mx-auto sm:mx-0 mb-5 w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: FLAME }}>
                <Users size={24} color="#0C0C11" />
              </div>
              <p className="mono-label mb-3" style={{ color: "#FF8A1F" }}>Where it all happens</p>
              <h2 className="font-black text-white mb-4" style={{ fontFamily: "var(--font-outfit)", fontSize: "clamp(24px, 4vw, 38px)", letterSpacing: "-0.03em" }}>
                We do this together on playclub.
              </h2>
              <p className="text-base leading-relaxed mb-6" style={{ color: "#C4C4CC", fontFamily: "var(--font-inter)", maxWidth: 380 }}>
                Events, meetups, wins, support. The Become community lives here.
              </p>
              <a href={PLAYCLUB_URL} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl font-bold text-black transition-all duration-300 hover:-translate-y-1"
                style={{ background: FLAME, fontFamily: "var(--font-inter)", fontSize: "1rem", boxShadow: "0 10px 40px rgba(255,106,26,0.45)" }}>
                <Users size={19} /> Join the Become group
                <ArrowRight size={17} />
              </a>
            </div>
            {/* QR code — desktop only */}
            <div className="hidden sm:flex flex-col items-center gap-3 flex-shrink-0">
              <div className="p-3 rounded-2xl" style={{ background: "#1C1C24", border: "1px solid rgba(255,138,31,0.2)" }}>
                <QRCodeSVG value={PLAYCLUB_URL} size={130} bgColor="#1C1C24" fgColor="#FF8A1F" level="M" />
              </div>
              <p className="text-xs text-center" style={{ color: "#6B6B78", fontFamily: "var(--font-inter)" }}>Scan to join on mobile</p>
            </div>
          </div>
        </div>
      </section>

      {/* WHATSAPP */}
      <section className="py-14 px-6" style={{ backgroundColor: "#0C0C11" }}>
        <div className="max-w-3xl mx-auto rounded-3xl p-7 sm:p-9 flex flex-col sm:flex-row items-center gap-6"
          style={{ background: "rgba(255,106,26,0.06)", border: "1px solid rgba(255,138,31,0.3)", boxShadow: "0 0 50px rgba(255,106,26,0.08)" }}>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: FLAME }}>
            <MessageCircle size={26} color="#0C0C11" />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <p className="mono-label mb-1" style={{ color: "#FF8A1F" }}>WhatsApp group</p>
            <h3 className="font-black text-white mb-1.5" style={{ fontFamily: "var(--font-outfit)", fontSize: "clamp(20px, 4vw, 28px)" }}>
              The daily check-in lives here.
            </h3>
            <p className="text-sm" style={{ color: "#9A9AA8", fontFamily: "var(--font-inter)" }}>
              Show up, share your win, get cheered on. Every day.
            </p>
          </div>
          {WHATSAPP_URL && (
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer"
              className="flex-shrink-0 inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-black transition-all hover:-translate-y-0.5"
              style={{ background: FLAME, fontFamily: "var(--font-inter)", fontSize: 15, boxShadow: "0 8px 30px rgba(255,106,26,0.35)" }}>
              <MessageCircle size={17} /> Join group
            </a>
          )}
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
          <div className="relative px-7 pt-8 pb-7" style={{ backgroundImage: "linear-gradient(180deg, rgba(12,12,17,0.5), #15151D), url('/mountain-hero.webp')", backgroundSize: "cover", backgroundPosition: "center" }}>
            <span className="mono-label" style={{ color: "#FFB347" }}>Your journey</span>
            <h2 className="font-black text-white mt-2" style={{ fontFamily: "var(--font-outfit)", fontSize: "clamp(26px, 5vw, 40px)" }}>Watch yourself climb.</h2>
          </div>
          <div className="px-7 py-7" style={{ background: "#15151D" }}>
            <div className="mb-2">
              <span className="mono-label block mb-2" style={{ color: "#6B6B78" }}>Current streak</span>
              <span className="font-black text-white inline-flex items-center" style={{ fontFamily: "var(--font-outfit)", fontSize: "clamp(40px, 11vw, 60px)", lineHeight: 1 }}>
                <Flame size={42} className="mr-2.5" color="#FF8A1F" />23 days
              </span>
            </div>
            <p className="text-sm mt-4" style={{ color: "#9A9AA8", fontFamily: "var(--font-inter)" }}>
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

      {/* Sticky CTA (mobile) */}
      {!showJoin && (
        <div className="fixed bottom-0 inset-x-0 z-40 p-4 sm:hidden" style={{ background: "linear-gradient(180deg, rgba(12,12,17,0) 0%, rgba(12,12,17,0.9) 40%)" }}>
          {hubData ? (
            <button onClick={openHub}
              className="w-full inline-flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-black"
              style={{ background: FLAME, fontFamily: "var(--font-inter)", fontSize: "1.05rem", boxShadow: "0 8px 36px rgba(255,106,26,0.55)" }}>
              Welcome back {hubData.firstName ? `, ${hubData.firstName}` : ""}! → your links
            </button>
          ) : (
            <button onClick={open}
              className="w-full inline-flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-black"
              style={{ background: FLAME, fontFamily: "var(--font-inter)", fontSize: "1.05rem", boxShadow: "0 8px 36px rgba(255,106,26,0.55)" }}>
              <Flame size={19} /> Start now <ArrowRight size={17} />
            </button>
          )}
        </div>
      )}

      {/* Returning member banner (desktop) */}
      {!showJoin && hubData && (
        <button onClick={openHub}
          className="fixed bottom-6 right-6 z-40 hidden sm:inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-black shadow-xl transition-all hover:-translate-y-0.5"
          style={{ background: FLAME, fontFamily: "var(--font-inter)", fontSize: 14, boxShadow: "0 8px 30px rgba(255,106,26,0.5)" }}>
          🔥 Your links →
        </button>
      )}

      {showJoin && (
        <JoinFlow
          onClose={() => setShowJoin(false)}
          initialStep={joinInitial?.step}
          initialFocus={joinInitial?.focus}
          initialFirstName={joinInitial?.firstName}
        />
      )}
    </main>
  );
}
