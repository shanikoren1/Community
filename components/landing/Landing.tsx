"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  Camera, Timer, Users, ArrowRight, Headphones, Target,
  Flame, Mic, MessageCircle, CalendarCheck,
} from "lucide-react";
import { SITE, WHATSAPP_URL, AUDIOBOOK_URL, PODCAST_URL } from "../../lib/config";
import type { FocusGoal } from "../../lib/goals";
import type { StyleToken } from "./styles";

const JoinFlow = dynamic(() => import("../JoinFlow"), { ssr: false });

const HUB_KEY = "become_member";

const LOOP = [
  { icon: Target, title: "Show up", text: "Your calendar says it's time, so you start." },
  { icon: Camera, title: "Prepare your space", text: "Get everything you need in front of you, no excuses left." },
  { icon: Timer, title: "Focus", text: "Start the timer. 20, 45 or 60 minutes of just you and the work." },
  { icon: Users, title: "Get cheered on", text: "Share your win with the group and feel the cheers come back." },
];

export default function Landing({ t }: { t: StyleToken }) {
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

  const light = t.mood === "calm";

  return (
    <main style={{ backgroundColor: t.bg, color: t.text }}>
      {/* NAV */}
      <nav className="fixed top-0 inset-x-0 z-40 px-4 py-1.5 flex items-center justify-between"
        style={{ backgroundColor: light ? "rgba(251,248,243,0.78)" : "rgba(12,12,17,0.72)", backdropFilter: "blur(12px)", borderBottom: `1px solid ${t.border}` }}>
        <img src="/logo.webp" alt="Become" className="h-24 w-auto" style={light ? { filter: "invert(1) hue-rotate(180deg)" } : undefined} />
        <button onClick={open}
          className="px-5 py-2 rounded-lg text-sm font-bold transition-all hover:-translate-y-0.5"
          style={{ background: t.flame, color: t.onFlame, fontFamily: "var(--font-inter)", boxShadow: "0 4px 18px rgba(255,106,26,0.35)" }}>
          Start the sprint
        </button>
      </nav>

      {/* HERO — identity + the 3-week promise */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center overflow-hidden" style={{ background: t.heroBg }}>
        {t.heroImage && (
          <>
            <div className={`absolute inset-0 ${t.slowZoom ? "slow-zoom" : ""}`} style={{ backgroundImage: "url('/mountain-hero.webp')", backgroundSize: "cover", backgroundPosition: "center" }} />
            <div className="absolute inset-0" style={{ background: t.heroOverlay }} />
          </>
        )}

        <div className="relative z-10 max-w-3xl mx-auto float-up">
          <span className="mono-label inline-block mb-6 px-3 py-1 rounded-full"
            style={{ border: `1px solid ${t.accentSoft}66`, color: t.accentSoft, backgroundColor: `${t.accent}14` }}>
            Shani Koren · {SITE.parentBrand}
          </span>

          <h1 className="font-black mb-5" style={{
            color: t.text, fontFamily: "var(--font-outfit)", fontSize: "clamp(48px, 11vw, 100px)", lineHeight: 0.95, letterSpacing: "-0.04em",
            textShadow: t.heroImage ? "0 4px 40px rgba(0,0,0,0.5)" : "none",
          }}>
            You become<br />your habits.
          </h1>

          <p className="text-lg md:text-xl mx-auto mb-9" style={{ color: light ? t.textBody : "#D4D4DC", fontFamily: "var(--font-inter)", maxWidth: 540, textShadow: t.heroImage ? "0 2px 20px rgba(0,0,0,0.6)" : "none" }}>
            So choose who. Pick the few that matter, show up for 3 weeks, and become them, with people who show up too.
          </p>

          <div className="flex flex-col items-center gap-3">
            <button onClick={open}
              className={`group inline-flex items-center gap-2.5 px-9 py-4 rounded-xl font-bold transition-all duration-300 hover:-translate-y-1 ${t.ctaGlow ? "cta-glow" : ""}`}
              style={{ background: t.flame, color: t.onFlame, fontFamily: "var(--font-inter)", fontSize: "1.1rem", boxShadow: "0 10px 40px rgba(255,106,26,0.45)" }}>
              <Flame size={20} /> Start your 3-week sprint
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </button>
          </div>
          <p className="mono-label mt-4" style={{ color: light ? t.textMuted : "rgba(255,255,255,0.5)" }}>Free. Takes two minutes.</p>
        </div>
      </section>

      {/* THE VITAL FEW — Essentialism */}
      <section className="py-20 px-6" style={{ backgroundColor: t.bg }}>
        <div className="max-w-3xl mx-auto text-center">
          <p className="mono-label mb-4" style={{ color: t.accent }}>The essentialist idea</p>
          <h2 className="font-black mb-6" style={{ color: t.text, fontFamily: "var(--font-outfit)", fontSize: "clamp(30px, 6vw, 56px)", lineHeight: 1.05, letterSpacing: "-0.03em" }}>
            Less, <span style={{ fontStyle: "italic", color: t.accent }}>but better.</span>
          </h2>
          <p className="text-lg leading-relaxed mx-auto mb-10" style={{ color: t.textBody, fontFamily: "var(--font-inter)", maxWidth: 560 }}>
            Most goals fail because we chase too many at once. So we do the opposite: brainstorm wide, then cut to the <strong style={{ color: t.text }}>vital few</strong>. Two habits. The disciplined pursuit of less, so the few you keep actually happen.
          </p>
          <div className="grid sm:grid-cols-3 gap-4 text-left">
            {[
              { icon: Users, tag: "Explore", title: "Dream wide", text: "List everything you want to become. No filtering yet." },
              { icon: Target, tag: "Eliminate", title: "Say no, on purpose", text: "If it isn't a clear yes, it's a clear no. Let the rest go, for now." },
              { icon: Flame, tag: "Commit", title: "The vital few", text: "Keep two. Give them everything for three weeks." },
            ].map((c) => {
              const Icon = c.icon;
              return (
                <div key={c.tag} className="rounded-2xl p-6" style={{ background: t.card, border: `1px solid ${t.border}` }}>
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{ background: t.flame }}>
                    <Icon size={20} color={t.onFlame} />
                  </div>
                  <span className="mono-label block mb-2" style={{ color: t.accent }}>{c.tag}</span>
                  <h3 className="font-bold mb-1.5" style={{ color: t.text, fontFamily: "var(--font-outfit)", fontSize: 19 }}>{c.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: t.textMuted, fontFamily: "var(--font-inter)" }}>{c.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ATOMIC HABITS intro */}
      <section className="pt-6 pb-16 px-6" style={{ backgroundColor: t.bg }}>
        <div className="max-w-2xl mx-auto text-center">
          <p className="mono-label mb-4" style={{ color: t.accent }}>The method behind it</p>
          <h2 className="font-black" style={{ color: t.text, fontFamily: "var(--font-outfit)", fontSize: "clamp(24px, 5vw, 40px)", lineHeight: 1.15, letterSpacing: "-0.03em" }}>
            Built on <span style={{ color: t.accent }}>Atomic Habits</span>, a system that makes showing up the easy choice.
          </h2>
        </div>
      </section>

      {/* THE SYSTEM — daily loop + streak proof */}
      <section className="py-16 px-6" style={{ backgroundColor: t.bg2 }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="mono-label mb-3" style={{ color: t.accent }}>How it works, every day</p>
            <h2 className="font-black" style={{ color: t.text, fontFamily: "var(--font-outfit)", fontSize: "clamp(26px, 5vw, 44px)", letterSpacing: "-0.03em" }}>
              You don&apos;t rise to goals.<br />You fall to systems.
            </h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {LOOP.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={s.title} className="rounded-2xl p-5" style={{ background: t.card, border: `1px solid ${t.border}` }}>
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{ background: `${t.accent}1F`, border: `1px solid ${t.accentSoft}40` }}><Icon size={20} color={t.accent} /></div>
                  <span className="mono-label block mb-1.5" style={{ color: t.textMuted }}>Step {i + 1}</span>
                  <h3 className="font-bold mb-1.5" style={{ color: t.text, fontFamily: "var(--font-outfit)", fontSize: 18 }}>{s.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: t.textMuted, fontFamily: "var(--font-inter)" }}>{s.text}</p>
                </div>
              );
            })}
          </div>

          {/* Streak card */}
          <div className="max-w-md mx-auto rounded-3xl overflow-hidden" style={{ border: `1px solid ${t.border}` }}>
            <div className="px-7 pt-7 pb-6" style={{ background: t.flame }}>
              <span className="mono-label" style={{ color: t.onFlame, opacity: 0.8 }}>Your journey</span>
              <div className="flex items-center mt-1.5" style={{ color: t.onFlame }}>
                <Flame size={40} className="mr-2.5" />
                <span className="font-black" style={{ fontFamily: "var(--font-outfit)", fontSize: "clamp(40px, 11vw, 58px)", lineHeight: 1 }}>23 days</span>
              </div>
            </div>
            <div className="px-7 py-6" style={{ background: t.card }}>
              <p className="text-sm" style={{ color: t.textBody, fontFamily: "var(--font-inter)" }}>
                Every focus session and every cheer stacks up. Watch the streak climb. That number is who you&apos;re becoming.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SPRINT commitment */}
      <section className="py-20 px-6" style={{ backgroundColor: t.bg }}>
        <div className="max-w-3xl mx-auto rounded-3xl p-9 sm:p-12 text-center relative overflow-hidden"
          style={{ background: t.card, border: `1px solid ${t.accentSoft}40`, boxShadow: `0 0 80px ${t.accent}1A` }}>
          {t.bigNumber && (
            <span aria-hidden className="absolute -top-8 -right-2 font-black select-none reward-pop" style={{ fontFamily: "var(--font-outfit)", fontSize: 220, lineHeight: 1, color: `${t.accent}14` }}>21</span>
          )}
          <div className="relative z-10">
            <p className="mono-label mb-4" style={{ color: t.accent }}>The commitment</p>
            <h2 className="font-black mb-5" style={{ color: t.text, fontFamily: "var(--font-outfit)", fontSize: "clamp(28px, 5.5vw, 48px)", lineHeight: 1.05, letterSpacing: "-0.03em" }}>
              21 days. Two habits.<br />One version of you.
            </h2>
            <p className="text-base leading-relaxed mb-8 mx-auto" style={{ color: t.textBody, fontFamily: "var(--font-inter)", maxWidth: 440 }}>
              Three weeks is long enough to prove it to yourself, short enough to start today. Pick your vital few and we&apos;ll put the first step in your calendar.
            </p>
            <button onClick={open}
              className={`inline-flex items-center gap-2.5 px-9 py-4 rounded-xl font-bold transition-all duration-300 hover:-translate-y-1 ${t.ctaGlow ? "cta-glow" : ""}`}
              style={{ background: t.flame, color: t.onFlame, fontFamily: "var(--font-inter)", fontSize: "1.1rem", boxShadow: "0 10px 40px rgba(255,106,26,0.4)" }}>
              <CalendarCheck size={20} /> Start your sprint <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* WHATSAPP community */}
      <section className="py-14 px-6" style={{ backgroundColor: t.bg }}>
        <div className="max-w-3xl mx-auto rounded-3xl p-7 sm:p-9 flex flex-col sm:flex-row items-center gap-6"
          style={{ background: t.cardSoft, border: `1px solid ${t.accentSoft}4D` }}>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: t.flame }}>
            <MessageCircle size={26} color={t.onFlame} />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <p className="mono-label mb-1" style={{ color: t.accent }}>The community</p>
            <h3 className="font-black mb-1.5" style={{ color: t.text, fontFamily: "var(--font-outfit)", fontSize: "clamp(20px, 4vw, 28px)" }}>
              This is where we show up, together.
            </h3>
            <p className="text-sm" style={{ color: t.textMuted, fontFamily: "var(--font-inter)" }}>
              The daily check-in lives in WhatsApp. Share your win, get cheered on, every day.
            </p>
          </div>
          {WHATSAPP_URL && (
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer"
              className="flex-shrink-0 inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold transition-all hover:-translate-y-0.5"
              style={{ background: t.flame, color: t.onFlame, fontFamily: "var(--font-inter)", fontSize: 15, boxShadow: "0 8px 30px rgba(255,106,26,0.35)" }}>
              <MessageCircle size={17} /> Join the group
            </a>
          )}
        </div>
      </section>

      {/* LISTEN */}
      <section className="py-16 px-6" style={{ backgroundColor: t.bg }}>
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-black mb-3" style={{ color: t.text, fontFamily: "var(--font-outfit)", fontSize: "clamp(24px, 4vw, 36px)", letterSpacing: "-0.03em" }}>
            Listen along with us.
          </h2>
          <p className="text-base leading-relaxed mb-7 mx-auto" style={{ color: t.textMuted, fontFamily: "var(--font-inter)", maxWidth: 420 }}>
            We all speak one language here, <em>Atomic Habits</em> by James Clear.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a href={PODCAST_URL} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-7 py-3.5 font-bold rounded-xl transition-all hover:-translate-y-0.5"
              style={{ background: t.flame, color: t.onFlame, fontFamily: "var(--font-inter)" }}>
              <Mic size={17} /> Listen to the podcast
            </a>
            <a href={AUDIOBOOK_URL} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-7 py-3.5 font-semibold rounded-xl transition-all hover:-translate-y-0.5"
              style={{ border: `1.5px solid ${t.accentSoft}80`, color: t.accent, fontFamily: "var(--font-inter)" }}>
              <Headphones size={16} /> Full audiobook
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="pt-16 pb-10 px-6 text-center" style={{ backgroundColor: t.bg, borderTop: `1px solid ${t.border}` }}>
        <p className="font-black mb-5" style={{
          fontFamily: "var(--font-outfit)", fontSize: "clamp(56px, 16vw, 140px)", lineHeight: 0.9, letterSpacing: "-0.04em",
          background: t.flame, WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>{SITE.name}</p>
        <div className="flex items-center justify-center gap-6 mb-4 text-sm" style={{ color: t.textMuted, fontFamily: "var(--font-inter)" }}>
          <span>Privacy</span><span>Terms</span><span>Support</span>
        </div>
        <p className="text-xs" style={{ color: t.textMuted, fontFamily: "var(--font-inter)", opacity: 0.7 }}>
          Created by Shani Koren. A {SITE.parentBrand} community. 2026.
        </p>
      </footer>

      {/* Sticky CTA (mobile) */}
      {!showJoin && (
        <div className="fixed bottom-0 inset-x-0 z-40 p-4 sm:hidden" style={{ background: light ? "linear-gradient(180deg, rgba(251,248,243,0) 0%, rgba(251,248,243,0.92) 40%)" : "linear-gradient(180deg, rgba(12,12,17,0) 0%, rgba(12,12,17,0.9) 40%)" }}>
          {hubData ? (
            <button onClick={openHub}
              className="w-full inline-flex items-center justify-center gap-2 py-4 rounded-xl font-bold"
              style={{ background: t.flame, color: t.onFlame, fontFamily: "var(--font-inter)", fontSize: "1.05rem", boxShadow: "0 8px 36px rgba(255,106,26,0.55)" }}>
              Welcome back{hubData.firstName ? `, ${hubData.firstName}` : ""}! → your links
            </button>
          ) : (
            <button onClick={open}
              className="w-full inline-flex items-center justify-center gap-2 py-4 rounded-xl font-bold"
              style={{ background: t.flame, color: t.onFlame, fontFamily: "var(--font-inter)", fontSize: "1.05rem", boxShadow: "0 8px 36px rgba(255,106,26,0.55)" }}>
              <Flame size={19} /> Start your sprint <ArrowRight size={17} />
            </button>
          )}
        </div>
      )}

      {/* Returning member banner (desktop) */}
      {!showJoin && hubData && (
        <button onClick={openHub}
          className="fixed bottom-6 right-6 z-40 hidden sm:inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold shadow-xl transition-all hover:-translate-y-0.5"
          style={{ background: t.flame, color: t.onFlame, fontFamily: "var(--font-inter)", fontSize: 14, boxShadow: "0 8px 30px rgba(255,106,26,0.5)" }}>
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
