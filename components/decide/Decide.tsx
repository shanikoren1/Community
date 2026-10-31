"use client";

import { useState } from "react";
import { ArrowRight, ArrowLeft, Plus, X, Check, Sparkles, RotateCcw } from "lucide-react";
import { evaluate, CLEAR_YES, ESSENTIALIST_NOTES, type DecideResult } from "../../lib/decide";
import { WHATSAPP_URL } from "../../lib/config";
import Confetti from "../Confetti";

type Step = "setup" | "score" | "reveal";

const BG = "#0C0C11";
const CARD = "#15151D";
const AMBER = "#FFC24D";
const CORAL = "#FF6F91";
const GRAD = "linear-gradient(135deg, #FFB347 0%, #FFD98C 100%)";

const inputStyle: React.CSSProperties = {
  border: "1.5px solid rgba(255,255,255,0.1)", background: CARD, color: "#fff",
  fontFamily: "var(--font-inter)", fontSize: 16,
};

export default function Decide() {
  const [step, setStep] = useState<Step>("setup");
  const [decision, setDecision] = useState("");
  const [criteria, setCriteria] = useState<string[]>(["", "", ""]);
  const [options, setOptions] = useState<string[]>(["", ""]);
  const [matrix, setMatrix] = useState<number[][]>([[70, 70, 70], [70, 70, 70]]);
  const [result, setResult] = useState<DecideResult | null>(null);

  const critFilled = criteria.map(c => c.trim());
  const canSetup = decision.trim() && critFilled.every(Boolean);
  const optsFilled = options.filter(o => o.trim());

  function setScore(oi: number, ci: number, v: number) {
    setMatrix(m => m.map((row, i) => i === oi ? row.map((s, j) => j === ci ? v : s) : row));
  }
  function addOption() {
    setOptions(p => [...p, ""]);
    setMatrix(m => [...m, [70, 70, 70]]);
  }
  function removeOption(i: number) {
    setOptions(p => p.filter((_, j) => j !== i));
    setMatrix(m => m.filter((_, j) => j !== i));
  }
  function reveal() {
    const pairs = options.map((o, i) => ({ o: o.trim(), row: matrix[i] ?? [70, 70, 70] })).filter(p => p.o);
    setResult(evaluate(pairs.map(p => p.o), pairs.map(p => p.row)));
    setStep("reveal");
  }
  function restart() {
    setDecision(""); setCriteria(["", "", ""]); setOptions(["", ""]);
    setMatrix([[70, 70, 70], [70, 70, 70]]); setResult(null); setStep("setup");
  }

  const pct = step === "setup" ? 50 : step === "score" ? 90 : 100;

  return (
    <main className="min-h-screen" style={{ backgroundColor: BG, color: "#fff" }}>
      <Confetti active={step === "reveal"} type="amber" />
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0" style={{ background: `radial-gradient(60% 50% at 50% 0%, ${AMBER}12 0%, transparent 70%)` }} />

      <nav className="relative z-10 px-5 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <a href="/" className="flex items-center gap-2.5">
          <img src="/logo.webp" alt="Become" width={28} height={28} className="rounded-lg" />
          <span className="font-extrabold" style={{ fontFamily: "var(--font-outfit)" }}>Become</span>
        </a>
        <span className="mono-label" style={{ color: AMBER }}>Decide</span>
      </nav>

      <div className="relative z-10 max-w-xl mx-auto px-6 pt-8 pb-24">
        {step !== "reveal" && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2.5">
              <span className="mono-label" style={{ color: AMBER }}>Step {step === "setup" ? 1 : 2} of 2</span>
              <span className="mono-label" style={{ color: "#8E8E9E" }}>{pct}%</span>
            </div>
            <div className="h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }}>
              <div className="h-full rounded-full" style={{ width: `${pct}%`, background: GRAD, transition: "width 0.4s ease" }} />
            </div>
          </div>
        )}

        {/* STEP 1 — decision + criteria (WOW) */}
        {step === "setup" && (
          <div className="lift-in flex flex-col gap-10">
            {/* Hero header */}
            <div className="text-center">
              <div className="mx-auto mb-5 w-18 h-18 flex items-center justify-center" style={{ width: 72, height: 72, borderRadius: 22, background: GRAD, boxShadow: `0 16px 48px ${AMBER}55` }}>
                <Sparkles size={34} color="#0C0C11" />
              </div>
              <h2 className="font-black mb-3" style={{ fontFamily: "var(--font-outfit)", fontSize: "clamp(34px, 9vw, 56px)", lineHeight: 1.02, letterSpacing: "-0.03em", background: GRAD, WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                What are you deciding?
              </h2>
              <p style={{ color: "#9A9AA8", fontFamily: "var(--font-inter)", fontSize: 15, maxWidth: 340, margin: "0 auto" }}>
                Name the real choice. The clearer the question, the clearer the answer.
              </p>
            </div>

            {/* Big glowing input */}
            <input value={decision} onChange={e => setDecision(e.target.value)} autoFocus
              placeholder="e.g. Which job offer should I take?"
              className="w-full rounded-2xl px-5 py-5 outline-none text-center"
              style={{ ...inputStyle, fontSize: 18, fontWeight: 600,
                border: decision.trim() ? `1.5px solid ${AMBER}99` : "1.5px solid rgba(255,255,255,0.1)",
                boxShadow: decision.trim() ? `0 0 36px ${AMBER}28` : "none",
                transition: "border 0.3s, box-shadow 0.3s" }} />

            {/* Non-negotiables */}
            <div>
              <div className="mb-4 text-center">
                <h3 className="font-black text-white mb-1" style={{ fontFamily: "var(--font-outfit)", fontSize: "clamp(22px, 5vw, 30px)", letterSpacing: "-0.02em" }}>Three non-negotiables.</h3>
                <p style={{ color: "#9A9AA8", fontFamily: "var(--font-inter)", fontSize: 14 }}>What will you not compromise on?</p>
              </div>
              <div className="flex flex-col gap-2.5">
                {criteria.map((c, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "rgba(255,194,77,0.14)", color: AMBER, fontWeight: 700, fontSize: 13, fontFamily: "var(--font-inter)" }}>{i + 1}</div>
                    <input value={c} onChange={e => setCriteria(p => p.map((x, j) => j === i ? e.target.value : x))}
                      placeholder={["e.g. Lets me keep learning", "e.g. People I respect", "e.g. Protects my evenings"][i]}
                      className="flex-1 rounded-xl px-4 py-3 outline-none" style={inputStyle} />
                  </div>
                ))}
              </div>
            </div>

            <Nav onNext={() => setStep("score")} nextLabel="Add my options →" disabled={!canSetup} />
          </div>
        )}

        {/* STEP 2 — options + inline scoring */}
        {step === "score" && (
          <div className="lift-in">
            <Head title="Score your options." sub={`Type each option and rate it against your three non-negotiables. ${CLEAR_YES}+ = a clear yes.`} />
            <div className="flex flex-col gap-4 mb-4">
              {options.map((opt, oi) => (
                <div key={oi} className="rounded-2xl overflow-hidden" style={{ background: CARD, border: "1px solid rgba(255,255,255,0.08)" }}>
                  <div className="flex items-center gap-2 p-4" style={{ borderBottom: opt.trim() ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: GRAD, color: "#0C0C11", fontWeight: 800, fontSize: 13, fontFamily: "var(--font-outfit)" }}>
                      {String.fromCharCode(65 + oi)}
                    </div>
                    <input value={opt} onChange={e => setOptions(p => p.map((x, j) => j === oi ? e.target.value : x))}
                      placeholder={`Option ${String.fromCharCode(65 + oi)}`}
                      className="flex-1 rounded-lg px-3 py-2.5 outline-none" style={inputStyle} />
                    {options.length > 2 && (
                      <button onClick={() => removeOption(oi)} className="w-8 h-8 flex items-center justify-center rounded-lg flex-shrink-0" style={{ color: "#8E8E9E" }} aria-label="Remove">
                        <X size={15} />
                      </button>
                    )}
                  </div>
                  {opt.trim() && (
                    <div className="px-4 pb-4 pt-3 flex flex-col gap-3.5">
                      {critFilled.map((c, ci) => (
                        <div key={ci}>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs" style={{ color: "#C4C4CC", fontFamily: "var(--font-inter)" }}>{c}</span>
                            <span className="mono-label" style={{ color: (matrix[oi]?.[ci] ?? 70) >= CLEAR_YES ? AMBER : "#8E8E9E" }}>{matrix[oi]?.[ci] ?? 70}</span>
                          </div>
                          <input type="range" min={0} max={100} step={5} value={matrix[oi]?.[ci] ?? 70}
                            onChange={e => setScore(oi, ci, Number(e.target.value))}
                            aria-label={`${opt}: "${c}"`}
                            className="w-full decide-range" style={{ accentColor: AMBER }} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            {options.length < 6 && (
              <button onClick={addOption} className="inline-flex items-center gap-2 text-sm font-semibold mb-2" style={{ color: AMBER, fontFamily: "var(--font-inter)" }}>
                <Plus size={16} /> Add an option
              </button>
            )}
            <Nav onBack={() => setStep("setup")} onNext={reveal} nextLabel="Reveal my answer" disabled={optsFilled.length < 2} />
          </div>
        )}

        {/* REVEAL */}
        {step === "reveal" && result && (
          <div className="lift-in pt-2 text-center">
            <div className="mx-auto mb-5 w-20 h-20 rounded-full flex items-center justify-center soft-pulse" style={{ background: GRAD, boxShadow: "0 12px 50px rgba(255,194,77,0.4)" }}>
              <Sparkles size={36} color="#0C0C11" />
            </div>

            {result.winner ? (
              <>
                <p className="mono-label mb-3" style={{ color: AMBER }}>Your clear yes</p>
                <h2 className="font-black mb-4" style={{ fontFamily: "var(--font-outfit)", fontSize: "clamp(30px, 8vw, 52px)", lineHeight: 1.02, letterSpacing: "-0.03em", background: GRAD, WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  {result.winner.name}
                </h2>
                <p className="text-base leading-relaxed mx-auto mb-4" style={{ color: "#C4C4CC", fontFamily: "var(--font-inter)", maxWidth: 400 }}>
                  It cleared all three of your non-negotiables.
                </p>
              </>
            ) : (
              <>
                <p className="mono-label mb-3" style={{ color: AMBER }}>No clear yes</p>
                <h2 className="font-black mb-4" style={{ fontFamily: "var(--font-outfit)", fontSize: "clamp(26px, 6.5vw, 44px)", lineHeight: 1.05, letterSpacing: "-0.03em" }}>
                  Nothing cleared all three.
                </h2>
                <p className="text-base leading-relaxed mx-auto mb-4" style={{ color: "#C4C4CC", fontFamily: "var(--font-inter)", maxWidth: 420 }}>
                  That is a real answer, not a failure. {ESSENTIALIST_NOTES.rule}
                  {result.closest && <> Closest: <strong style={{ color: "#fff" }}>{result.closest.name}</strong>.</>}
                </p>
              </>
            )}

            <p className="mono-label mb-7" style={{ color: "#8E8E9E" }}>{ESSENTIALIST_NOTES.less}</p>

            <div className="flex flex-col gap-2 text-left mb-8">
              {result.ranked.map(r => (
                <div key={r.name} className="flex items-center justify-between rounded-xl px-4 py-3" style={{ background: CARD, border: r.passes ? `1px solid ${AMBER}4D` : "1px solid rgba(255,255,255,0.07)" }}>
                  <span className="font-semibold text-sm" style={{ color: r.passes ? "#fff" : "#9A9AA8", fontFamily: "var(--font-inter)" }}>
                    {r.passes && <Check size={14} className="inline mr-1.5" color={AMBER} />}{r.name}
                  </span>
                  <span className="mono-label" style={{ color: r.passes ? AMBER : "#8E8E9E" }}>avg {r.avg} · low {r.min}</span>
                </div>
              ))}
            </div>

            {/* Prominent next-survey CTA */}
            <div className="w-full rounded-2xl overflow-hidden mb-3" style={{ border: "1.5px solid rgba(255,111,145,0.38)", background: "rgba(255,111,145,0.07)" }}>
              <div className="px-5 pt-5 pb-4 text-left">
                <p className="mono-label mb-1" style={{ color: CORAL }}>You&apos;re on a roll →</p>
                <h3 className="font-black text-white mb-1.5" style={{ fontFamily: "var(--font-outfit)", fontSize: "clamp(18px, 4vw, 24px)", lineHeight: 1.1 }}>Connect with the people around you.</h3>
                <p className="text-sm mb-4" style={{ color: "#9A9AA8", fontFamily: "var(--font-inter)" }}>A fun question game. One phone. No prep needed.</p>
                <a href="/connect"
                  className="inline-flex items-center justify-center gap-2 w-full py-4 rounded-xl font-bold transition-all hover:-translate-y-0.5"
                  style={{ background: "linear-gradient(135deg, #FF6F91 0%, #FFB347 100%)", color: "#0C0C11", fontFamily: "var(--font-inter)", fontSize: 16, boxShadow: "0 12px 40px rgba(255,111,145,0.4)" }}>
                  Start a connection now <ArrowRight size={18} />
                </a>
              </div>
            </div>

            <button onClick={restart}
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold transition-all hover:-translate-y-0.5"
              style={{ border: `1.5px solid ${AMBER}66`, color: AMBER, fontFamily: "var(--font-inter)", fontSize: 15 }}>
              <RotateCcw size={17} /> Decide something else
            </button>
            {WHATSAPP_URL && (
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer"
                className="mt-3 w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl font-medium"
                style={{ color: "#8E8E9E", fontFamily: "var(--font-inter)", fontSize: 14 }}>
                Join the community on WhatsApp
              </a>
            )}
            <a href="/" className="mt-4 inline-block text-sm font-semibold" style={{ color: "#6B6B78", fontFamily: "var(--font-inter)" }}>Back to home</a>
          </div>
        )}
      </div>
    </main>
  );
}

function Head({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="mb-5 pl-4" style={{ borderLeft: `4px solid ${AMBER}` }}>
      <h2 className="font-black text-white mb-2" style={{ fontFamily: "var(--font-outfit)", fontSize: "clamp(28px, 7vw, 42px)", lineHeight: 1.1 }}>{title}</h2>
      <p className="text-base" style={{ color: "#9A9AA8", fontFamily: "var(--font-inter)" }}>{sub}</p>
    </div>
  );
}

function Nav({ onBack, onNext, nextLabel, disabled }: { onBack?: () => void; onNext: () => void; nextLabel: string; disabled?: boolean }) {
  return (
    <div className="mt-8 flex items-center gap-3">
      {onBack && (
        <button onClick={onBack} className="inline-flex items-center gap-1.5 px-4 py-3.5 rounded-xl text-sm font-semibold" style={{ color: "#9A9AA8", fontFamily: "var(--font-inter)" }}>
          <ArrowLeft size={15} /> Back
        </button>
      )}
      <button onClick={onNext} disabled={disabled}
        className="flex-1 inline-flex items-center justify-center gap-2 py-4 rounded-xl font-bold transition-all hover:-translate-y-0.5 disabled:opacity-40"
        style={{ background: GRAD, color: "#0C0C11", fontFamily: "var(--font-inter)", fontSize: 16, boxShadow: "0 10px 36px rgba(255,194,77,0.25)" }}>
        {nextLabel} <ArrowRight size={16} />
      </button>
    </div>
  );
}
