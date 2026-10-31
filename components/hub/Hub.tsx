"use client";

import { useState, useEffect, useRef } from "react";
import { MessageCircle, Users, Flame, Compass, ArrowRight, LinkedinIcon } from "lucide-react";
import { SITE, WHATSAPP_URL } from "../../lib/config";
import Confetti from "../Confetti";

const CORAL = "#FF6F91";
const ORANGE = "#FF8A1F";
const AMBER = "#FFC24D";

type CT = "coral" | "orange" | "amber";

const DOORS = [
  {
    href: "/connect",
    label: "Connect",
    accent: CORAL,
    grad: "linear-gradient(135deg, #FF6F91 0%, #FFB347 100%)",
    icon: Users,
    line: "Connect and get to know each other.",
    desc: "A fun question game for any group. One phone. No prep needed.",
    enter: "Start the questions",
    ct: "coral" as CT,
  },
  {
    href: "/habits",
    label: "Habits",
    accent: ORANGE,
    grad: "linear-gradient(135deg, #FF6A1A 0%, #FFB347 100%)",
    icon: Flame,
    line: "Build habits that actually stick.",
    desc: "A proven system based on Atomic Habits. 3 weeks. Two habits. Your pace.",
    enter: "There is a system to stick to your habits",
    ct: "orange" as CT,
  },
  {
    href: "/decide",
    label: "Decide",
    accent: AMBER,
    grad: "linear-gradient(135deg, #FFB347 0%, #FFD98C 100%)",
    icon: Compass,
    line: "Make your next decision with clarity.",
    desc: "Based on the Essentialism method and your own values.",
    enter: "Think it through",
    ct: "amber" as CT,
  },
];

const AMBIENT = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  x: (i * 3.37) % 100,
  delay: (i * 0.43) % 5,
  dur: 10 + (i % 6) * 1.7,
  size: 2 + (i % 3),
  color: ["#FF6F91", "#FFB347", "#FF8A1F", "#FFC24D", "#fff"][i % 5],
}));

export default function Hub() {
  const [doorConfetti, setDoorConfetti] = useState<CT | null>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = cardsRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        el.querySelectorAll(".card-reveal").forEach(c => c.classList.add("in-view"));
        obs.disconnect();
      }
    }, { threshold: 0.08 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  function handleDoorClick(e: React.MouseEvent<HTMLAnchorElement>, href: string, ct: CT) {
    e.preventDefault();
    setDoorConfetti(ct);
    setTimeout(() => { window.location.href = href; }, 1200);
  }

  return (
    <main style={{ backgroundColor: "#0C0C11", color: "#fff" }}>
      {doorConfetti && <Confetti active type={doorConfetti} big={doorConfetti === "coral"} />}

      <a href="#paths" className="sr-only focus:not-sr-only" style={{ position: "absolute", zIndex: 60, top: 8, left: 8, background: "#FFB347", color: "#0C0C11", padding: "8px 14px", borderRadius: 8, fontWeight: 700, fontFamily: "var(--font-inter)" }}>
        Skip to the three paths
      </a>

      {/* NAV */}
      <nav className="fixed top-0 inset-x-0 z-40 px-4 py-1.5 flex items-center justify-between"
        style={{ backgroundColor: "rgba(12,12,17,0.72)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <a href="/" aria-label="Become home"><img src="/logo.webp" alt="Become" className="h-24 w-auto" /></a>
        <span style={{ color: "#9A9AA8", fontFamily: "var(--font-inter)", fontSize: 13 }}>A platform by Shani Koren.</span>
      </nav>

      {/* HERO */}
      <section className="relative flex flex-col items-center justify-center px-5 text-center" style={{ minHeight: "72vh", paddingTop: 124, paddingBottom: 64 }}>
        {/* bg layers in their own overflow-hidden shell so drop-shadow on content isn't clipped */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <div className="absolute inset-0 slow-zoom" style={{ backgroundImage: "url('/mountain-hero.webp')", backgroundSize: "cover", backgroundPosition: "center", opacity: 0.5 }} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(12,12,17,0.72) 0%, rgba(12,12,17,0.82) 55%, #0C0C11 100%)" }} />
          <div className="orb-animate absolute" style={{ width: 600, height: 600, borderRadius: "50%", top: "0%", left: "50%", transform: "translateX(-50%)", background: "radial-gradient(circle, rgba(255,106,26,0.2) 0%, rgba(255,179,71,0.11) 40%, transparent 70%)", filter: "blur(72px)", animationDuration: "14s" }} />
          {AMBIENT.map(p => (
            <div key={p.id} className="ambient-particle absolute bottom-0 rounded-full" style={{ left: `${p.x}%`, width: p.size, height: p.size, backgroundColor: p.color, opacity: 0.55, animationDelay: `${p.delay}s`, animationDuration: `${p.dur}s` }} />
          ))}
        </div>

        <div className="relative z-10 w-full max-w-2xl mx-auto">
          {/* Become — wordmark, no overflow-hidden parent so B renders fully */}
          <div className="slide-from-left mb-4" style={{ animationDelay: "0.15s", paddingLeft: 2 }}>
            <div className="relative inline-block">
              <span className="font-black" style={{
                fontFamily: "var(--font-outfit)", fontSize: "clamp(52px, 12vw, 96px)",
                lineHeight: 0.9, letterSpacing: "-0.04em",
                background: "linear-gradient(135deg, #FF6A1A 0%, #FFB347 52%, #FFD98C 78%, #fff 100%)",
                WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent",
                filter: "drop-shadow(0 0 18px rgba(255,106,26,0.45))",
              }}>Become</span>
              <span aria-hidden className="absolute pointer-events-none select-none" style={{ top: "4%", right: "-15px", fontSize: 13, color: "#FFB347", opacity: 0.8, lineHeight: 1 }}>✦</span>
              <span aria-hidden className="absolute pointer-events-none select-none" style={{ bottom: "16%", right: "-24px", fontSize: 7, color: "#FF8A1F", opacity: 0.55, lineHeight: 1 }}>✦</span>
            </div>
          </div>

          <h1 className="font-black mb-9" style={{ fontFamily: "var(--font-outfit)", fontSize: "clamp(24px, 5.5vw, 46px)", lineHeight: 1.12, letterSpacing: "-0.03em", color: "#fff" }}>
            I turned research into simple methods you can actually use.
          </h1>

          <div className="flex flex-col items-stretch gap-3 w-full max-w-lg mx-auto">
            <a href="/connect" onClick={(e) => handleDoorClick(e, "/connect", "coral")} className="hero-tap-link stagger-1" style={{ borderColor: "rgba(255,111,145,0.38)", color: CORAL }}>
              <span>How we communicate</span>
              <ArrowRight size={20} aria-hidden="true" className="transition-transform duration-200 flex-shrink-0" />
            </a>
            <a href="/habits" onClick={(e) => handleDoorClick(e, "/habits", "orange")} className="hero-tap-link stagger-2" style={{ borderColor: "rgba(255,138,31,0.38)", color: ORANGE }}>
              <span>How we build habits</span>
              <ArrowRight size={20} aria-hidden="true" className="transition-transform duration-200 flex-shrink-0" />
            </a>
            <a href="/decide" onClick={(e) => handleDoorClick(e, "/decide", "amber")} className="hero-tap-link stagger-3" style={{ borderColor: "rgba(255,194,77,0.38)", color: AMBER }}>
              <span>How we make decisions</span>
              <ArrowRight size={20} aria-hidden="true" className="transition-transform duration-200 flex-shrink-0" />
            </a>
          </div>
        </div>
      </section>

      {/* THREE DOORS */}
      <section id="paths" className="py-14 px-6" style={{ backgroundColor: "#0C0C11" }} aria-label="The three paths">
        <div ref={cardsRef} className="max-w-5xl mx-auto grid md:grid-cols-3 gap-5">
          {DOORS.map((d, di) => {
            const Icon = d.icon;
            return (
              <a key={d.href} href={d.href}
                onClick={(e) => handleDoorClick(e, d.href, d.ct)}
                aria-label={`${d.label}. ${d.line} ${d.desc}`}
                className={`card-reveal card-delay-${di + 1} group relative rounded-3xl p-9 flex flex-col transition-all duration-300 hover:-translate-y-2`}
                style={{
                  background: `linear-gradient(145deg, ${d.accent}22 0%, ${d.accent}0C 45%, #0D0D15 100%)`,
                  border: `1.5px solid ${d.accent}70`,
                  boxShadow: `0 20px 56px ${d.accent}1A`,
                }}>
                <div aria-hidden="true" className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6" style={{ background: d.grad, boxShadow: `0 16px 48px ${d.accent}60` }}>
                  <Icon size={34} color="#0C0C11" />
                </div>
                <span className="mono-label mb-2" style={{ color: d.accent }}>{d.label}</span>
                <h2 className="font-black mb-3" style={{ fontFamily: "var(--font-outfit)", fontSize: 28, lineHeight: 1.12, letterSpacing: "-0.02em", color: "#fff" }}>
                  {d.line}
                </h2>
                <p className="leading-relaxed mb-7 flex-1" style={{ color: "#A6A6B2", fontFamily: "var(--font-inter)", fontSize: 15 }}>
                  {d.desc}
                </p>
                <span className="inline-flex items-center gap-2 font-bold" style={{ color: d.accent, fontFamily: "var(--font-inter)", fontSize: 16 }}>
                  {d.enter}
                  <ArrowRight size={17} aria-hidden="true" className="transition-transform group-hover:translate-x-1" />
                </span>
              </a>
            );
          })}
        </div>
      </section>

      {/* COMMUNITY */}
      {WHATSAPP_URL && (
        <section className="py-10 px-6" style={{ backgroundColor: "#0C0C11" }}>
          <div className="max-w-2xl mx-auto rounded-3xl p-7 flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left"
            style={{ background: "rgba(255,106,26,0.05)", border: "1px solid rgba(255,138,31,0.28)" }}>
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: "linear-gradient(135deg, #FF6A1A 0%, #FFB347 100%)" }}>
              <MessageCircle size={22} color="#0C0C11" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-white mb-1" style={{ fontFamily: "var(--font-outfit)", fontSize: 19 }}>There is a community behind this.</h3>
              <p className="text-sm" style={{ color: "#9A9AA8", fontFamily: "var(--font-inter)" }}>People trying the same things, cheering each other on. You are welcome to join us.</p>
            </div>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer"
              className="flex-shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all hover:-translate-y-0.5"
              style={{ border: "1.5px solid rgba(255,138,31,0.55)", color: "#FF8A1F", fontFamily: "var(--font-inter)", fontSize: 15 }}>
              Join on WhatsApp
            </a>
          </div>
        </section>
      )}

      {/* ABOUT */}
      <section className="py-16 px-6" style={{ backgroundColor: "#0C0C11" }}>
        <div className="max-w-2xl mx-auto rounded-3xl p-8 sm:p-10" style={{ background: "#121219", border: "1px solid rgba(255,255,255,0.07)" }}>
          <p className="mono-label mb-4" style={{ color: "#FF8A1F" }}>About</p>
          <p className="text-lg leading-relaxed mb-6" style={{ color: "#D4D4DC", fontFamily: "var(--font-inter)" }}>
            I&apos;m Shani Koren, 25, studying psychology and business with a focus on marketing and entrepreneurship. I turn research on how people think and act into simple methods anyone can use. My aim is to leave the world a little better than I found it.
          </p>
          <a href="https://www.linkedin.com/in/shani-koren-hastandart" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-semibold" style={{ color: "#FF8A1F", fontFamily: "var(--font-inter)", fontSize: 15 }}>
            <LinkedinIcon size={17} /> Connect with me on LinkedIn
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="pt-10 pb-10 px-6 text-center" style={{ backgroundColor: "#0C0C11", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <p className="font-black mb-4" style={{
          fontFamily: "var(--font-outfit)", fontSize: "clamp(44px, 12vw, 96px)", lineHeight: 0.9, letterSpacing: "-0.04em",
          background: "linear-gradient(135deg, #FF6A1A 0%, #FFB347 100%)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>{SITE.name}</p>
        <p className="text-xs" style={{ color: "#7A7A88", fontFamily: "var(--font-inter)" }}>
          Created by Shani Koren. A {SITE.parentBrand} project. 2026.
        </p>
      </footer>
    </main>
  );
}
