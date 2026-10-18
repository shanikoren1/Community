"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, X, ArrowRight, Check, Users, Heart, RotateCcw, MessageCircle } from "lucide-react";
import { CONNECT_LAYERS } from "../../lib/connectQuestions";
import { SITE, WHATSAPP_URL } from "../../lib/config";

type Phase = "setup" | "play" | "done";

const BG = "#0C0C11";
const CARD = "#15151D";
const CORAL = "#FF6F91";
const GRAD = "linear-gradient(135deg, #FF6F91 0%, #FFB347 100%)";
const WARMTH_TARGET = 12;

interface Current { person: string; layerIdx: number; question: string; }

export default function Connect() {
  const [phase, setPhase] = useState<Phase>("setup");
  const [names, setNames] = useState<string[]>(["", ""]);
  const [round, setRound] = useState(0);
  const [current, setCurrent] = useState<Current | null>(null);
  const [usedByLayer, setUsedByLayer] = useState<Record<string, number[]>>({});
  const [celebrating, setCelebrating] = useState(false);

  const validNames = names.map((n) => n.trim()).filter(Boolean);

  function setName(i: number, v: string) {
    setNames((p) => p.map((n, idx) => (idx === i ? v : n)));
  }
  function addName() { setNames((p) => [...p, ""]); }
  function removeName(i: number) { setNames((p) => (p.length <= 2 ? p : p.filter((_, idx) => idx !== i))); }

  // Compute the person + question for a given round, drawing from the right depth layer.
  const advanceTo = useCallback((r: number, names: string[], used: Record<string, number[]>) => {
    const n = names.length;
    const person = names[r % n];
    const roundsPerLayer = Math.max(n, 3);
    const layerIdx = Math.min(CONNECT_LAYERS.length - 1, Math.floor(r / roundsPerLayer));
    const layer = CONNECT_LAYERS[layerIdx];
    const all = layer.questions.map((_, i) => i);
    let usedForLayer = used[layer.id] ?? [];
    let pool = all.filter((i) => !usedForLayer.includes(i));
    if (pool.length === 0) { usedForLayer = []; pool = all; }
    const qi = pool[Math.floor(Math.random() * pool.length)];
    setUsedByLayer({ ...used, [layer.id]: [...usedForLayer, qi] });
    setCurrent({ person, layerIdx, question: layer.questions[qi] });
    setRound(r);
  }, []);

  function start() {
    if (validNames.length < 2) return;
    setUsedByLayer({});
    advanceTo(0, validNames, {});
    setPhase("play");
  }

  const handleDone = useCallback(() => {
    if (celebrating) return;
    setCelebrating(true);
    window.setTimeout(() => {
      advanceTo(round + 1, validNames, usedByLayer);
      setCelebrating(false);
    }, 950);
  }, [celebrating, round, validNames, usedByLayer, advanceTo]);

  function playAgain() {
    setNames(["", ""]);
    setRound(0);
    setCurrent(null);
    setUsedByLayer({});
    setPhase("setup");
  }

  // Spacebar / Enter triggers Done during play, for a shared screen.
  useEffect(() => {
    if (phase !== "play") return;
    const h = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "Enter") { e.preventDefault(); handleDone(); }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [phase, handleDone]);

  const warmth = Math.min(100, Math.round((round / WARMTH_TARGET) * 100));
  const layer = current ? CONNECT_LAYERS[current.layerIdx] : CONNECT_LAYERS[0];

  return (
    <main className="min-h-screen" style={{ backgroundColor: BG, color: "#fff" }}>
      {/* soft atmospheric glow */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0" style={{ background: `radial-gradient(60% 50% at 50% 0%, ${CORAL}14 0%, transparent 70%)` }} />

      {/* header */}
      <nav className="relative z-10 px-5 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <a href="/" className="flex items-center gap-2.5">
          <img src="/logo.webp" alt="Become" width={28} height={28} className="rounded-lg" />
          <span className="font-extrabold" style={{ fontFamily: "var(--font-outfit)" }}>Become</span>
        </a>
        <span className="mono-label" style={{ color: CORAL }}>Connect</span>
      </nav>

      <div className="relative z-10 max-w-xl mx-auto px-6 pt-10 pb-24">
        {/* SETUP */}
        {phase === "setup" && (
          <div className="lift-in">
            <div className="mb-8">
              <span className="mono-label" style={{ color: CORAL }}>A question game</span>
              <h1 className="font-black mt-2 mb-3" style={{ fontFamily: "var(--font-outfit)", fontSize: "clamp(34px, 8vw, 56px)", lineHeight: 1.02, letterSpacing: "-0.03em" }}>
                Turn the room into a real conversation.
              </h1>
              <p className="text-base leading-relaxed" style={{ color: "#C4C4CC", fontFamily: "var(--font-inter)" }}>
                Add everyone who is here. One phone, passed around. It asks a different person a warm question each turn, and the questions open up as you go. Answer out loud, tap done, keep going.
              </p>
            </div>

            <label className="mono-label block mb-3" style={{ color: "#9A9AA8" }}>Who is playing?</label>
            <div className="flex flex-col gap-2.5 mb-4">
              {names.map((n, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div aria-hidden="true" className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "rgba(255,111,145,0.12)", color: CORAL, fontFamily: "var(--font-inter)", fontWeight: 700, fontSize: 13 }}>{i + 1}</div>
                  <input value={n} onChange={(e) => setName(i, e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" && i === names.length - 1 && n.trim()) addName(); }}
                    aria-label={`Participant name ${i + 1}`}
                    placeholder={`Name ${i + 1}`} autoCapitalize="words"
                    className="flex-1 rounded-xl px-4 py-3 outline-none"
                    style={{ border: "1.5px solid rgba(255,255,255,0.1)", background: CARD, color: "#fff", fontFamily: "var(--font-inter)", fontSize: 16 }} />
                  {names.length > 2 && (
                    <button onClick={() => removeName(i)} className="w-9 h-9 flex items-center justify-center rounded-lg" style={{ color: "#8E8E9E" }} aria-label="Remove">
                      <X size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button onClick={addName} className="inline-flex items-center gap-2 text-sm font-semibold mb-8" style={{ color: CORAL, fontFamily: "var(--font-inter)" }}>
              <Plus size={16} /> Add another person
            </button>

            <button onClick={start} disabled={validNames.length < 2}
              className="w-full inline-flex items-center justify-center gap-2.5 py-4 rounded-xl font-bold transition-all hover:-translate-y-0.5 disabled:opacity-40"
              style={{ background: GRAD, color: "#0C0C11", fontFamily: "var(--font-inter)", fontSize: 16, boxShadow: "0 10px 40px rgba(255,111,145,0.3)" }}>
              Start the questions <ArrowRight size={18} />
            </button>
            <p className="mono-label mt-3 text-center" style={{ color: "#8E8E9E" }}>Two people or more. No sign up.</p>
          </div>
        )}

        {/* PLAY */}
        {phase === "play" && current && (
          <div>
            {/* warmth meter + round */}
            <div className="mb-7">
              <div className="flex items-center justify-between mb-2.5">
                <span className="mono-label" style={{ color: CORAL }}>{layer.title}</span>
                <span className="mono-label" style={{ color: "#8E8E9E" }}>Round {round + 1}</span>
              </div>
              <div className="h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }}>
                <div className="h-full rounded-full" style={{ width: `${warmth}%`, background: GRAD, transition: "width 0.6s ease" }} />
              </div>
              <p className="text-xs mt-2" style={{ color: "#8E8E9E", fontFamily: "var(--font-inter)" }}>{layer.subtitle}</p>
            </div>

            {/* question card */}
            <div key={round} className="lift-in relative rounded-3xl px-7 py-12 text-center overflow-hidden" style={{ background: CARD, border: `1px solid ${CORAL}3D`, boxShadow: `0 0 70px ${CORAL}1A`, minHeight: 320 }}>
              {/* celebration */}
              {celebrating && (
                <>
                  <div className="pointer-events-none absolute left-0 right-0 top-0 flex justify-center" aria-hidden>
                    {Array.from({ length: 22 }).map((_, i) => (
                      <span key={i} style={{ position: "absolute", left: `${(i / 22) * 100}%`, width: 8, height: 8, borderRadius: 2, background: ["#FF6F91", "#FFB347", "#FF8A1F", "#FFD98C"][i % 4], animation: `confetti-fall 1.3s ease-in ${(i % 6) * 0.1}s both` }} />
                    ))}
                  </div>
                  <span aria-hidden="true" className="rise-away absolute left-1/2 top-1/3 -translate-x-1/2 inline-flex items-center gap-1.5 font-bold" style={{ color: CORAL, fontFamily: "var(--font-outfit)", fontSize: 22 }}>
                    <Heart size={20} fill={CORAL} /> warmer
                  </span>
                </>
              )}

              <div role="status" aria-live="polite" className={celebrating ? "opacity-30 transition-opacity" : "transition-opacity"}>
                <p className="mono-label mb-5" style={{ color: CORAL }}>Over to</p>
                <h2 className="font-black mb-6" style={{ fontFamily: "var(--font-outfit)", fontSize: "clamp(30px, 8vw, 52px)", lineHeight: 1, letterSpacing: "-0.03em", background: GRAD, WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  {current.person}
                </h2>
                <p className="text-xl md:text-2xl leading-snug mx-auto" style={{ color: "#fff", fontFamily: "var(--font-outfit)", maxWidth: 420, fontWeight: 600 }}>
                  {current.question}
                </p>
              </div>
            </div>

            {/* done */}
            <button onClick={handleDone} disabled={celebrating}
              className="mt-6 w-full inline-flex items-center justify-center gap-2.5 py-4 rounded-xl font-bold transition-all hover:-translate-y-0.5 disabled:opacity-70"
              style={{ background: GRAD, color: "#0C0C11", fontFamily: "var(--font-inter)", fontSize: 16, boxShadow: "0 10px 40px rgba(255,111,145,0.3)" }}>
              <Check size={18} /> Done, next person
            </button>
            <button onClick={() => setPhase("done")} className="mt-3 w-full text-sm text-center" style={{ color: "#8E8E9E", fontFamily: "var(--font-inter)" }}>
              We are warmed up, finish
            </button>
          </div>
        )}

        {/* DONE */}
        {phase === "done" && (
          <div className="lift-in pt-6 text-center">
            <div className="mx-auto mb-6 w-20 h-20 rounded-full flex items-center justify-center soft-pulse" style={{ background: GRAD, boxShadow: "0 12px 50px rgba(255,111,145,0.4)" }}>
              <Users size={36} color="#0C0C11" />
            </div>
            <h2 className="font-black mb-3" style={{ fontFamily: "var(--font-outfit)", fontSize: "clamp(28px, 7vw, 42px)", lineHeight: 1.05, letterSpacing: "-0.03em" }}>
              You just built something real.
            </h2>
            <p className="text-base leading-relaxed mx-auto mb-9" style={{ color: "#C4C4CC", fontFamily: "var(--font-inter)", maxWidth: 380 }}>
              The best connections start with a real question. Keep them going whenever you are together.
            </p>

            <button onClick={playAgain}
              className="w-full inline-flex items-center justify-center gap-2 py-4 rounded-xl font-bold transition-all hover:-translate-y-0.5"
              style={{ background: GRAD, color: "#0C0C11", fontFamily: "var(--font-inter)", fontSize: 16 }}>
              <RotateCcw size={17} /> Play again
            </button>

            {WHATSAPP_URL && (
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer"
                className="mt-3 w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold transition-all hover:-translate-y-0.5"
                style={{ border: `1.5px solid ${CORAL}66`, color: CORAL, fontFamily: "var(--font-inter)", fontSize: 15 }}>
                <MessageCircle size={16} /> Join the {SITE.name} community
              </a>
            )}
            <a href="/" className="mt-5 inline-block text-sm font-semibold" style={{ color: "#8E8E9E", fontFamily: "var(--font-inter)" }}>
              Back to the three paths
            </a>
          </div>
        )}
      </div>
    </main>
  );
}
