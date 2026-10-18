import { MessageCircle, Users, Flame, Compass, ArrowRight, Linkedin } from "lucide-react";
import { SITE, WHATSAPP_URL } from "../../lib/config";

const CORAL = "#FF6F91";
const ORANGE = "#FF8A1F";
const AMBER = "#FFC24D";

const DOORS = [
  {
    href: "/connect",
    label: "Connect",
    accent: CORAL,
    grad: "linear-gradient(135deg, #FF6F91 0%, #FFB347 100%)",
    icon: Users,
    line: "Turn any gathering into a real conversation.",
    desc: "A question game for any group, on one phone.",
    enter: "Start the questions",
  },
  {
    href: "/habits",
    label: "Habits",
    accent: ORANGE,
    grad: "linear-gradient(135deg, #FF6A1A 0%, #FFB347 100%)",
    icon: Flame,
    line: "Become the person you are deciding to be.",
    desc: "A 3-week sprint for two habits that matter.",
    enter: "Begin your sprint",
  },
  {
    href: "/decide",
    label: "Decide",
    accent: AMBER,
    grad: "linear-gradient(135deg, #FFB347 0%, #FFD98C 100%)",
    icon: Compass,
    line: "Make the hard choice with a clear head.",
    desc: "A simple way to weigh a real decision.",
    enter: "Think it through",
  },
];

export default function Hub() {
  return (
    <main style={{ backgroundColor: "#0C0C11", color: "#fff" }}>
      {/* skip link for keyboard + screen-reader users */}
      <a href="#paths" className="sr-only focus:not-sr-only" style={{ position: "absolute", zIndex: 60, top: 8, left: 8, background: "#FFB347", color: "#0C0C11", padding: "8px 14px", borderRadius: 8, fontWeight: 700, fontFamily: "var(--font-inter)" }}>
        Skip to the three paths
      </a>

      {/* NAV */}
      <nav className="fixed top-0 inset-x-0 z-40 px-4 py-1.5 flex items-center justify-between"
        style={{ backgroundColor: "rgba(12,12,17,0.72)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <a href="/" aria-label="Become home"><img src="/logo.webp" alt="Become" className="h-24 w-auto" /></a>
        <span className="mono-label" style={{ color: "#9A9AA8" }}>by Shani Koren</span>
      </nav>

      {/* HERO — mission in Shani's own voice */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center overflow-hidden">
        <div aria-hidden="true" className="absolute inset-0 slow-zoom" style={{ backgroundImage: "url('/mountain-hero.webp')", backgroundSize: "cover", backgroundPosition: "center", opacity: 0.5 }} />
        <div aria-hidden="true" className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(12,12,17,0.72) 0%, rgba(12,12,17,0.82) 55%, #0C0C11 100%)" }} />

        <div className="relative z-10 max-w-3xl mx-auto float-up">
          <span className="mono-label inline-block mb-7 px-3 py-1 rounded-full"
            style={{ border: "1px solid rgba(255,179,71,0.4)", color: "#FFB347", backgroundColor: "rgba(255,106,26,0.08)" }}>
            Become · a platform by Shani Koren
          </span>

          <h1 className="font-black" style={{ fontFamily: "var(--font-outfit)", fontSize: "clamp(32px, 6.4vw, 62px)", lineHeight: 1.14, letterSpacing: "-0.03em" }}>
            I turned research into simple methods you can actually use.
            <span className="block mt-4">
              <span style={{ color: CORAL }}>How we communicate</span>,{" "}
              <span style={{ color: ORANGE }}>how we build habits</span>, and{" "}
              <span style={{ color: AMBER }}>how we make decisions</span>.
            </span>
          </h1>
          <p className="mono-label mt-8" style={{ color: "rgba(255,255,255,0.55)" }}>Pick a path below</p>
        </div>
      </section>

      {/* THREE DOORS */}
      <section id="paths" className="py-16 px-6" style={{ backgroundColor: "#0C0C11" }} aria-label="The three paths">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-5">
          {DOORS.map((d) => {
            const Icon = d.icon;
            return (
              <a key={d.href} href={d.href}
                aria-label={`${d.label}. ${d.line} ${d.desc}`}
                className="group relative rounded-3xl p-7 flex flex-col transition-all duration-300 hover:-translate-y-1.5"
                style={{ background: "linear-gradient(160deg, #17171F 0%, #121219 100%)", border: `1px solid ${d.accent}33` }}>
                <div aria-hidden="true" className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6" style={{ background: d.grad, boxShadow: `0 10px 30px ${d.accent}40` }}>
                  <Icon size={26} color="#0C0C11" />
                </div>
                <span className="mono-label mb-2" style={{ color: d.accent }}>{d.label}</span>
                <h2 className="font-black mb-2.5" style={{ fontFamily: "var(--font-outfit)", fontSize: 24, lineHeight: 1.12, letterSpacing: "-0.02em", color: "#fff" }}>
                  {d.line}
                </h2>
                <p className="text-sm leading-relaxed mb-6 flex-1" style={{ color: "#A6A6B2", fontFamily: "var(--font-inter)" }}>
                  {d.desc}
                </p>
                <span className="inline-flex items-center gap-2 font-semibold" style={{ color: d.accent, fontFamily: "var(--font-inter)", fontSize: 15 }}>
                  {d.enter}
                  <ArrowRight size={16} aria-hidden="true" className="transition-transform group-hover:translate-x-1" />
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

      {/* ABOUT SHANI */}
      <section className="py-16 px-6" style={{ backgroundColor: "#0C0C11" }}>
        <div className="max-w-2xl mx-auto rounded-3xl p-8 sm:p-10" style={{ background: "#121219", border: "1px solid rgba(255,255,255,0.07)" }}>
          <p className="mono-label mb-4" style={{ color: "#FF8A1F" }}>About</p>
          <p className="text-lg leading-relaxed mb-6" style={{ color: "#D4D4DC", fontFamily: "var(--font-inter)" }}>
            I&apos;m Shani Koren, 25, studying psychology and business with a focus on marketing and entrepreneurship. I turn research on how people think and act into simple methods anyone can use. My aim is to leave the world a little better than I found it.
          </p>
          <a href="https://www.linkedin.com/in/shani-koren-hastandart" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-semibold" style={{ color: "#FF8A1F", fontFamily: "var(--font-inter)", fontSize: 15 }}>
            <Linkedin size={17} /> Connect with me on LinkedIn
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
