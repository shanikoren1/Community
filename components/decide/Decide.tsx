"use client";

import { useState } from "react";
import { ArrowRight, ArrowLeft, Plus, X, Check, Sparkles, RotateCcw, MessageCircle } from "lucide-react";
import { evaluate, CLEAR_YES, ESSENTIALIST_NOTES, LIFE_AREAS, type DecideResult } from "../../lib/decide";
import { SITE, WHATSAPP_URL } from "../../lib/config";

type Step = "decision" | "criteria" | "options" | "score" | "reveal";
const STEPS: Step[] = ["decision", "criteria", "options", "score"];

const BG = "#0C0C11";
const CARD = "#15151D";
const AMBER = "#FFC24D";
const GRAD = "linear-gradient(135deg, #FFB347 0%, #FFD98C 100%)";

const input: React.CSSProperties = {
  border: "1.5px solid rgba(255,255,255,0.1)", background: CARD, color: "#fff",
  fontFamily: "var(--font-inter)", fontSize: 16,
};

export default function Decide() {
  const [step, setStep] = useState<Step>("decision");
  const [decision, setDecision] = useState("");
  const [area, setArea] = useState("");
  const [criteria, setCriteria] = useState<string[]>(["", "", ""]);
  const [options, setOptions] = useState<string[]>(["", ""]);
  const [active, setActive] = useState<string[]>([]);
  const [matrix, setMatrix] = useState<number[][]>([]);
  const [result, setResult] = useState<DecideResult | null>(null);

  const critFilled = criteria.map((c) => c.trim());
  const optsFilled = options.map((o) => o.trim()).filter(Boolean);

  function toScore() {
    const act = options.map((o) => o.trim()).filter(Boolean);
    setActive(act);
    setMatrix(act.map(() => [70, 70, 70]));
    setStep("score");
  }
  function setScore(oi: number, ci: number, v: number) {
    setMatrix((m) => m.map((row, i) => (i === oi ? row.map((s, j) => (j === ci ? v : s)) : row)));
  }
  function reveal() {
    setResult(evaluate(active, matrix));
    setStep("reveal");
  }
  function restart() {
    setDecision(""); setArea(""); setCriteria(["", "", ""]); setOptions(["", ""]);
    setActive([]); setMatrix([]); setResult(null); setStep("decision");
  }

  const idx = STEPS.indexOf(step);
  const pct = step === "reveal" ? 100 : Math.round(((idx + 1) / STEPS.length) * 100);

  return (
    <main className="min-h-screen" style={{ backgroundColor: BG, color: "#fff" }}>
      <div className="pointer-events-none fixed inset-0 z-0" style={{ background: `radial-gradient(60% 50% at 50% 0%, ${AMBER}12 0%, transparent 70%)` }} />

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
              <span className="mono-label" style={{ color: AMBER }}>Step {idx + 1} of {STEPS.length}</span>
              <span className="mono-label" style={{ color: "#6B6B78" }}>{pct}%</span>
            </div>
            <div className="h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }}>
              <div className="h-full rounded-full" style={{ width: `${pct}%`, background: GRAD, transition: "width 0.4s ease" }} />
            </div>
          </div>
        )}

        {/* 1 — DECISION */}
        {step === "decision" && (
          <div className="lift-in">
            <Head title="What are you deciding?" sub="Name the real choice in front of you. The clearer the question, the clearer the answer." />
            <input value={decision} onChange={(e) => setDecision(e.target.value)} autoFocus
              placeholder="e.g. Which job offer should I take?"
              className="w-full rounded-xl px-4 py-3.5 outline-none mb-5" style={input} />
            <label className="mono-label block mb-2.5" style={{ color: "#9A9AA8" }}>What part of life is this? (optional)</label>
            <div className="flex flex-wrap gap-2">
              {LIFE_AREAS.map((a) => {
                const on = area === a;
                return (
                  <button key={a} onClick={() => setArea(on ? "" : a)}
                    className="px-3.5 py-2 rounded-full text-sm font-semibold transition-all"
                    style={{ border: on ? "none" : "1.5px solid rgba(255,255,255,0.12)", background: on ? GRAD : "transparent", color: on ? "#0C0C11" : "#C4C4CC", fontFamily: "var(--font-inter)" }}>
                    {a}
                  </button>
                );
              })}
            </div>
            <Nav onNext={() => setStep("criteria")} nextLabel="Next" disabled={!decision.trim()} />
          </div>
        )}

        {/* 2 — CRITERIA */}
        {step === "criteria" && (
          <div className="lift-in">
            <Head title="Your three non-negotiables." sub={`What will you not compromise on? ${ESSENTIALIST_NOTES.rule}`} />
            <div className="flex flex-col gap-2.5">
              {criteria.map((c, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "rgba(255,194,77,0.14)", color: AMBER, fontWeight: 700, fontSize: 13, fontFamily: "var(--font-inter)" }}>{i + 1}</div>
                  <input value={c} onChange={(e) => setCriteria((p) => p.map((x, j) => (j === i ? e.target.value : x)))}
                    placeholder={["e.g. Lets me keep learning", "e.g. People I respect", "e.g. Protects my evenings"][i]}
                    className="flex-1 rounded-xl px-4 py-3 outline-none" style={input} />
                </div>
              ))}
            </div>
            <Nav onBack={() => setStep("decision")} onNext={() => setStep("options")} nextLabel="Next" disabled={critFilled.some((c) => !c)} />
          </div>
        )}

        {/* 3 — OPTIONS */}
        {step === "options" && (
          <div className="lift-in">
            <Head title="What are your options?" sub="List the real choices you are weighing. Two to six." />
            <div className="flex flex-col gap-2.5 mb-4">
              {options.map((o, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "rgba(255,194,77,0.14)", color: AMBER, fontWeight: 700, fontSize: 13, fontFamily: "var(--font-inter)" }}>{String.fromCharCode(65 + i)}</div>
                  <input value={o} onChange={(e) => setOptions((p) => p.map((x, j) => (j === i ? e.target.value : x)))}
                    onKeyDown={(e) => { if (e.key === "Enter" && i === options.length - 1 && o.trim() && options.length < 6) setOptions((p) => [...p, ""]); }}
                    placeholder={`Option ${String.fromCharCode(65 + i)}`}
                    className="flex-1 rounded-xl px-4 py-3 outline-none" style={input} />
                  {options.length > 2 && (
                    <button onClick={() => setOptions((p) => p.filter((_, j) => j !== i))} className="w-9 h-9 flex items-center justify-center rounded-lg" style={{ color: "#6B6B78" }} aria-label="Remove"><X size={16} /></button>
                  )}
                </div>
              ))}
            </div>
            {options.length < 6 && (
              <button onClick={() => setOptions((p) => [...p, ""])} className="inline-flex items-center gap-2 text-sm font-semibold" style={{ color: AMBER, fontFamily: "var(--font-inter)" }}>
                <Plus size={16} /> Add an option
              </button>
            )}
            <Nav onBack={() => setStep("criteria")} onNext={toScore} nextLabel="Score them" disabled={optsFilled.length < 2} />
          </div>
        )}

        {/* 4 — SCORE */}
        {step === "score" && (
          <div className="lift-in">
            <Head title="Score each option." sub={`Honestly, how well does each one meet every non-negotiable? ${CLEAR_YES} or higher counts as a clear yes.`} />
            <div className="flex flex-col gap-5">
              {active.map((opt, oi) => (
                <div key={oi} className="rounded-2xl p-4" style={{ background: CARD, border: "1px solid rgba(255,255,255,0.08)" }}>
                  <div className="flex items-center gap-2.5 mb-4">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: GRAD, color: "#0C0C11", fontWeight: 800, fontSize: 13, fontFamily: "var(--font-outfit)" }}>{String.fromCharCode(65 + oi)}</div>
                    <span className="font-bold text-white" style={{ fontFamily: "var(--font-outfit)", fontSize: 17 }}>{opt}</span>
                  </div>
                  <div className="flex flex-col gap-3.5">
                    {critFilled.map((c, ci) => (
                      <div key={ci}>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-sm" style={{ color: "#C4C4CC", fontFamily: "var(--font-inter)" }}>{c}</span>
                          <span className="mono-label" style={{ color: (matrix[oi]?.[ci] ?? 0) >= CLEAR_YES ? AMBER : "#6B6B78" }}>{matrix[oi]?.[ci] ?? 0}</span>
                        </div>
                        <input type="range" min={0} max={100} step={5} value={matrix[oi]?.[ci] ?? 70}
                          onChange={(e) => setScore(oi, ci, Number(e.target.value))}
                          className="w-full decide-range" style={{ accentColor: AMBER }} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <Nav onBack={() => setStep("options")} onNext={reveal} nextLabel="Reveal the clear choice" />
          </div>
        )}

        {/* REVEAL */}
        {step === "reveal" && result && (
          <div className="lift-in pt-2 text-center">
            <div className="mx-auto mb-5 w-16 h-16 rounded-full flex items-center justify-center soft-pulse" style={{ background: GRAD, boxShadow: "0 12px 50px rgba(255,194,77,0.4)" }}>
              <Sparkles size={30} color="#0C0C11" />
            </div>

            {result.winner ? (
              <>
                <p className="mono-label mb-3" style={{ color: AMBER }}>Your clear yes</p>
                <h2 className="font-black mb-4" style={{ fontFamily: "var(--font-outfit)", fontSize: "clamp(30px, 8vw, 50px)", lineHeight: 1.02, letterSpacing: "-0.03em", background: GRAD, WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  {result.winner.name}
                </h2>
                <p className="text-base leading-relaxed mx-auto mb-2" style={{ color: "#C4C4CC", fontFamily: "var(--font-inter)", maxWidth: 400 }}>
                  It is the choice that stayed a clear yes on all three of your non-negotiables.
                </p>
              </>
            ) : (
              <>
                <p className="mono-label mb-3" style={{ color: AMBER }}>No clear yes</p>
                <h2 className="font-black mb-4" style={{ fontFamily: "var(--font-outfit)", fontSize: "clamp(26px, 6.5vw, 40px)", lineHeight: 1.05, letterSpacing: "-0.03em" }}>
                  Nothing here cleared all three.
                </h2>
                <p className="text-base leading-relaxed mx-auto mb-2" style={{ color: "#C4C4CC", fontFamily: "var(--font-inter)", maxWidth: 420 }}>
                  That is a real answer, not a failure. {ESSENTIALIST_NOTES.rule} Keep looking, or decide which criterion you can honestly live without.
                  {result.closest && <> The closest was <strong style={{ color: "#fff" }}>{result.closest.name}</strong>.</>}
                </p>
              </>
            )}

            <p className="mono-label mt-2 mb-7" style={{ color: "#6B6B78" }}>{ESSENTIALIST_NOTES.less}</p>

            {/* ranked list */}
            <div className="flex flex-col gap-2 text-left mb-8">
              {result.ranked.map((r) => (
                <div key={r.name} className="flex items-center justify-between rounded-xl px-4 py-3" style={{ background: CARD, border: r.passes ? `1px solid ${AMBER}4D` : "1px solid rgba(255,255,255,0.07)" }}>
                  <span className="font-semibold text-sm" style={{ color: r.passes ? "#fff" : "#9A9AA8", fontFamily: "var(--font-inter)" }}>
                    {r.passes && <Check size={14} className="inline mr-1.5" color={AMBER} />}{r.name}
                  </span>
                  <span className="mono-label" style={{ color: r.passes ? AMBER : "#6B6B78" }}>
                    avg {r.avg} · low {r.min}
                  </span>
                </div>
              ))}
            </div>

            <button onClick={restart} className="w-full inline-flex items-center justify-center gap-2 py-4 rounded-xl font-bold transition-all hover:-translate-y-0.5" style={{ background: GRAD, color: "#0C0C11", fontFamily: "var(--font-inter)", fontSize: 16 }}>
              <RotateCcw size={17} /> Work through another decision
            </button>
            {WHATSAPP_URL && (
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="mt-3 w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold transition-all hover:-translate-y-0.5" style={{ border: `1.5px solid ${AMBER}66`, color: AMBER, fontFamily: "var(--font-inter)", fontSize: 15 }}>
                <MessageCircle size={16} /> Join the {SITE.name} community
              </a>
            )}
            <a href="/" className="mt-5 inline-block text-sm font-semibold" style={{ color: "#6B6B78", fontFamily: "var(--font-inter)" }}>Back to the three paths</a>
          </div>
        )}
      </div>
    </main>
  );
}

function Head({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="mb-6 pl-4" style={{ borderLeft: `4px solid ${AMBER}` }}>
      <h2 className="font-black text-white mb-2" style={{ fontFamily: "var(--font-outfit)", fontSize: "clamp(24px, 6vw, 34px)", lineHeight: 1.1 }}>{title}</h2>
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
        style={{ background: GRAD, color: "#0C0C11", fontFamily: "var(--font-inter)", fontSize: 15 }}>
        {nextLabel} <ArrowRight size={16} />
      </button>
    </div>
  );
}
