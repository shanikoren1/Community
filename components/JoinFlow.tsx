"use client";

import { useState, useEffect } from "react";
import { Check, ArrowRight, ArrowLeft, X, CalendarPlus, MessageCircle, Flame } from "lucide-react";
import { GOAL_OPTIONS, WEEKDAYS, goalById, type FocusGoal, type WeekdayId } from "../lib/goals";
import { googleCalendarUrl, downloadIcs, goalTitle } from "../lib/calendar";
import { PLAYCLUB_URL, SITE } from "../lib/config";

interface Props { onClose: () => void; }

const FLAME = "linear-gradient(135deg, #FF6A1A 0%, #FFB347 100%)";
const FLAME_BAR = "linear-gradient(90deg, #FF6A1A 0%, #FFB347 100%)";

type Step = "identity" | "longterm" | "shortterm" | "schedule" | "contact" | "calendar";
const ORDER: Step[] = ["identity", "longterm", "shortterm", "schedule", "contact"];

export default function JoinFlow({ onClose }: Props) {
  const [step, setStep] = useState<Step>("identity");
  const [identity, setIdentity] = useState("");
  const [longTerm, setLongTerm] = useState<string[]>([]);
  const [focusIds, setFocusIds] = useState<string[]>([]);
  const [focus, setFocus] = useState<FocusGoal[]>([]);
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  function toggleLongTerm(id: string) {
    setLongTerm((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  }
  function toggleFocus(id: string) {
    setFocusIds((p) => {
      if (p.includes(id)) return p.filter((x) => x !== id);
      if (p.length >= 2) return p;
      return [...p, id];
    });
  }
  function startSchedule() {
    setFocus(focusIds.map((goalId) => ({ goalId, minutes: 30, days: [], time: "18:00", tiny: "" })));
    setStep("schedule");
  }
  function updateFocus(idx: number, patch: Partial<FocusGoal>) {
    setFocus((p) => p.map((f, i) => (i === idx ? { ...f, ...patch } : f)));
  }
  function toggleDay(idx: number, day: WeekdayId) {
    setFocus((p) => p.map((f, i) => i === idx
      ? { ...f, days: f.days.includes(day) ? f.days.filter((d) => d !== day) : [...f.days, day] } : f));
  }
  const scheduleValid = focus.length === 2 && focus.every((f) => f.days.length > 0 && f.minutes > 0);

  async function submit() {
    setError("");
    if (!firstName || !email) { setError("Please add your name and email."); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/join", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName, email, identity,
          longTerm: longTerm.map((id) => goalById(id)?.label || id),
          focus: focus.map((f) => ({ title: goalTitle(f), minutes: f.minutes, days: f.days, time: f.time, tiny: f.tiny })),
        }),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || "Something went wrong."); }
      setStep("calendar");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally { setLoading(false); }
  }

  const stepIdx = ORDER.indexOf(step);
  const pct = step === "calendar" ? 100 : Math.round(((stepIdx + 1) / ORDER.length) * 100);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" style={{ backgroundColor: "#0C0C11" }}>
      {/* top bar */}
      <div className="sticky top-0 z-10 px-5 py-4 flex items-center justify-between"
        style={{ backgroundColor: "rgba(12,12,17,0.85)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="flex items-center gap-2.5">
          <img src="/logo.png" alt="Become" width={30} height={30} className="rounded-lg" />
          <span className="font-extrabold text-white" style={{ fontFamily: "var(--font-outfit)" }}>Become</span>
        </div>
        <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-full transition-all hover:bg-white/10" style={{ color: "#9A9AA8" }} aria-label="Close">
          <X size={18} />
        </button>
      </div>

      <div className="max-w-xl mx-auto px-6 pt-8 pb-20">
        {/* progress */}
        {step !== "calendar" && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2.5">
              <span className="mono-label" style={{ color: "#FF8A1F" }}>Step {stepIdx + 1} of {ORDER.length}</span>
              <span className="mono-label" style={{ color: "#6B6B78" }}>{pct}% complete</span>
            </div>
            <div className="h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }}>
              <div className="h-full rounded-full" style={{ width: `${pct}%`, background: FLAME_BAR, transition: "width 0.4s ease" }} />
            </div>
          </div>
        )}

        {/* STEP 1 — IDENTITY */}
        {step === "identity" && (
          <div className="float-up">
            <Question title="Who are you becoming?" sub="Not what you want to do — who you want to be. Finish the sentence." />
            <label className="block mb-2 text-sm font-semibold text-white" style={{ fontFamily: "var(--font-inter)" }}>I am becoming someone who…</label>
            <input autoFocus value={identity} onChange={(e) => setIdentity(e.target.value)}
              placeholder="…shows up for themselves every day." style={inputStyle} className="w-full rounded-xl px-4 py-3.5 text-base outline-none" />
            <Nav onNext={() => setStep("longterm")} nextDisabled={identity.trim().length < 3} nextLabel="This is me" />
          </div>
        )}

        {/* STEP 2 — LONG-TERM */}
        {step === "longterm" && (
          <div className="float-up">
            <Question title="What do you want in your life?" sub="Pick everything you want over the long run. No limit — dream wide." />
            <div className="grid grid-cols-2 gap-3">
              {GOAL_OPTIONS.map((g) => <GoalCard key={g.id} g={g} active={longTerm.includes(g.id)} onClick={() => toggleLongTerm(g.id)} accent="#FFB347" />)}
            </div>
            <Nav onBack={() => setStep("identity")} onNext={() => setStep("shortterm")} nextDisabled={longTerm.length === 0} nextLabel={`Continue${longTerm.length ? ` (${longTerm.length})` : ""}`} />
          </div>
        )}

        {/* STEP 3 — SHORT-TERM (2) */}
        {step === "shortterm" && (
          <div className="float-up">
            <Question title="Your focus for 3 weeks." sub="Now the hard part: choose only 2. Focus beats scatter — that's the whole point." />
            <div className="grid grid-cols-2 gap-3">
              {(longTerm.length ? longTerm : GOAL_OPTIONS.map((g) => g.id)).map((id) => {
                const g = goalById(id); if (!g) return null;
                const active = focusIds.includes(id);
                const dimmed = !active && focusIds.length >= 2;
                return <GoalCard key={id} g={g} active={active} dimmed={dimmed} onClick={() => toggleFocus(id)} accent="#FF8A1F" badge={active} />;
              })}
            </div>
            <p className="mt-5 text-center font-bold mono-label" style={{ color: focusIds.length === 2 ? "#FF8A1F" : "#6B6B78" }}>{focusIds.length} / 2 chosen</p>
            <Nav onBack={() => setStep("longterm")} onNext={startSchedule} nextDisabled={focusIds.length !== 2} nextLabel="Schedule them" />
          </div>
        )}

        {/* STEP 4 — SCHEDULE */}
        {step === "schedule" && (
          <div className="float-up">
            <Question title="When will you show up?" sub="A habit needs a time and a place. We'll drop it straight into your calendar." />
            <div className="flex flex-col gap-4">
              {focus.map((f, idx) => {
                const g = goalById(f.goalId);
                return (
                  <div key={f.goalId} className="rounded-2xl p-5" style={{ background: "#15151D", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <p className="font-bold text-white mb-1" style={{ fontFamily: "var(--font-outfit)", fontSize: 18 }}>{g?.label}</p>
                    <p className="text-xs mb-4" style={{ color: "#6B6B78", fontFamily: "var(--font-inter)" }}>I am becoming someone who {g?.identity}.</p>

                    <label className="mono-label block mb-2" style={{ color: "#9A9AA8" }}>Which days?</label>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {WEEKDAYS.map((d) => {
                        const on = f.days.includes(d.id);
                        return (
                          <button key={d.id} onClick={() => toggleDay(idx, d.id)} className="w-11 h-10 rounded-lg text-xs font-bold transition-all"
                            style={{ border: on ? "1.5px solid #FF8A1F" : "1.5px solid rgba(255,255,255,0.1)", background: on ? FLAME : "transparent", color: on ? "#0C0C11" : "#9A9AA8", fontFamily: "var(--font-inter)" }}>
                            {d.label}
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex gap-3 mb-4">
                      <div className="flex-1">
                        <label className="mono-label block mb-2" style={{ color: "#9A9AA8" }}>Time</label>
                        <input type="time" value={f.time} onChange={(e) => updateFocus(idx, { time: e.target.value })} style={inputStyle} className="w-full rounded-lg px-3 py-2.5 text-sm outline-none" />
                      </div>
                      <div className="flex-1">
                        <label className="mono-label block mb-2" style={{ color: "#9A9AA8" }}>Minutes</label>
                        <select value={f.minutes} onChange={(e) => updateFocus(idx, { minutes: Number(e.target.value) })} style={inputStyle} className="w-full rounded-lg px-3 py-2.5 text-sm outline-none">
                          {[10, 15, 20, 30, 45, 60, 90].map((m) => <option key={m} value={m} style={{ background: "#15151D" }}>{m} min</option>)}
                        </select>
                      </div>
                    </div>

                    <label className="mono-label block mb-2" style={{ color: "#9A9AA8" }}>Smallest version on a hard day</label>
                    <input value={f.tiny} onChange={(e) => updateFocus(idx, { tiny: e.target.value })} placeholder="e.g. just put on my shoes" style={inputStyle} className="w-full rounded-lg px-3 py-2.5 text-sm outline-none" />
                  </div>
                );
              })}
            </div>
            <Nav onBack={() => setStep("shortterm")} onNext={() => setStep("contact")} nextDisabled={!scheduleValid} nextLabel="Almost there" />
          </div>
        )}

        {/* STEP 5 — CONTACT */}
        {step === "contact" && (
          <div className="float-up">
            <Question title="Join the community." sub="Last step. This is how Become welcomes you in." />
            <label className="block mb-2 text-sm font-semibold text-white" style={{ fontFamily: "var(--font-inter)" }}>First name</label>
            <input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Your name" style={inputStyle} className="w-full rounded-xl px-4 py-3.5 text-base outline-none mb-4" />
            <label className="block mb-2 text-sm font-semibold text-white" style={{ fontFamily: "var(--font-inter)" }}>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" style={inputStyle} className="w-full rounded-xl px-4 py-3.5 text-base outline-none" />
            {error && <p className="mt-4 text-sm text-center" style={{ color: "#F87171" }}>{error}</p>}
            <button onClick={submit} disabled={loading}
              className="mt-6 w-full py-4 rounded-xl font-bold text-black transition-all hover:-translate-y-0.5 disabled:opacity-60"
              style={{ background: FLAME, fontFamily: "var(--font-inter)", fontSize: 16, boxShadow: "0 10px 40px rgba(255,106,26,0.35)" }}>
              {loading ? "Joining…" : "Start my journey →"}
            </button>
            <button onClick={() => setStep("schedule")} className="mt-3 w-full text-sm" style={{ color: "#6B6B78", fontFamily: "var(--font-inter)" }}>← Back</button>
          </div>
        )}

        {/* DONE — CALENDAR + CHAT */}
        {step === "calendar" && (
          <div className="float-up text-center pt-6">
            <div className="mx-auto mb-5 w-20 h-20 rounded-full flex items-center justify-center reward-pop" style={{ background: FLAME, boxShadow: "0 12px 50px rgba(255,106,26,0.45)" }}>
              <Check size={38} color="#0C0C11" strokeWidth={3} />
            </div>
            <h2 className="font-black text-white mb-2" style={{ fontFamily: "var(--font-outfit)", fontSize: 30 }}>Welcome, {firstName}. 🎉</h2>
            <p className="text-base leading-relaxed mb-7 mx-auto" style={{ color: "#9A9AA8", fontFamily: "var(--font-inter)", maxWidth: 380 }}>
              Now lock it in. Add each habit to your calendar — that&apos;s your cue, every week, for the next {SITE.sprintWeeks} weeks.
            </p>
            <div className="flex flex-col gap-3 mb-7 text-left">
              {focus.map((f) => (
                <div key={f.goalId} className="rounded-2xl p-5" style={{ background: "#15151D", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <p className="font-bold text-white mb-3" style={{ fontFamily: "var(--font-outfit)", fontSize: 17 }}>{goalTitle(f)}</p>
                  <div className="flex flex-wrap gap-2">
                    <a href={googleCalendarUrl(f)} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-bold text-black transition-all hover:-translate-y-0.5" style={{ background: FLAME, fontFamily: "var(--font-inter)" }}>
                      <CalendarPlus size={14} /> Google Calendar
                    </a>
                    <button onClick={() => downloadIcs(f)}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-bold transition-all hover:-translate-y-0.5" style={{ border: "1.5px solid rgba(255,138,31,0.5)", color: "#FF8A1F", fontFamily: "var(--font-inter)" }}>
                      <CalendarPlus size={14} /> Apple / iPhone
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <a href={PLAYCLUB_URL} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full py-4 rounded-xl font-bold text-black transition-all hover:-translate-y-0.5"
              style={{ background: FLAME, fontFamily: "var(--font-inter)", fontSize: 16, boxShadow: "0 10px 40px rgba(255,106,26,0.35)" }}>
              <MessageCircle size={18} /> Join the group chat
            </a>
            <p className="mono-label mt-3" style={{ color: "#6B6B78" }}>This is where the magic is — your people</p>
            <button onClick={onClose} className="mt-5 w-full text-sm font-semibold" style={{ color: "#FF8A1F", fontFamily: "var(--font-inter)" }}>Done</button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- pieces ---------- */

const inputStyle: React.CSSProperties = {
  border: "1.5px solid rgba(255,255,255,0.1)",
  color: "#FFFFFF",
  fontFamily: "var(--font-inter)",
  backgroundColor: "#15151D",
};

function Question({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="mb-6 pl-4" style={{ borderLeft: "4px solid #FF8A1F" }}>
      <h2 className="font-black text-white mb-2" style={{ fontFamily: "var(--font-outfit)", fontSize: "clamp(26px, 6vw, 38px)", lineHeight: 1.1 }}>{title}</h2>
      <p className="text-base" style={{ color: "#9A9AA8", fontFamily: "var(--font-inter)" }}>{sub}</p>
    </div>
  );
}

function GoalCard({ g, active, dimmed, onClick, accent, badge }: {
  g: { label: string; identity: string; icon: React.ComponentType<{ size?: number; style?: React.CSSProperties; color?: string }> };
  active: boolean; dimmed?: boolean; onClick: () => void; accent: string; badge?: boolean;
}) {
  const Icon = g.icon;
  return (
    <button onClick={onClick} disabled={dimmed}
      className="relative flex flex-col items-start gap-3 p-4 rounded-2xl text-left transition-all disabled:opacity-30 disabled:cursor-not-allowed"
      style={{
        border: active ? `1.5px solid ${accent}` : "1.5px solid rgba(255,255,255,0.08)",
        background: active ? "rgba(255,106,26,0.1)" : "#15151D",
        minHeight: 92,
      }}>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: active ? FLAME : "rgba(255,255,255,0.05)" }}>
        <Icon size={18} color={active ? "#0C0C11" : "#9A9AA8"} />
      </div>
      <span className="text-sm font-semibold" style={{ color: active ? "#fff" : "#C4C4CC", fontFamily: "var(--font-inter)" }}>{g.label}</span>
      {badge && active && (
        <span className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: FLAME }}>
          <Check size={12} color="#0C0C11" strokeWidth={3} />
        </span>
      )}
    </button>
  );
}

function Nav({ onBack, onNext, nextDisabled, nextLabel }: { onBack?: () => void; onNext: () => void; nextDisabled?: boolean; nextLabel: string }) {
  return (
    <div className="flex items-center gap-3 mt-8">
      {onBack && (
        <button onClick={onBack} className="inline-flex items-center gap-1.5 px-4 py-3.5 rounded-xl text-sm font-semibold" style={{ color: "#9A9AA8", fontFamily: "var(--font-inter)" }}>
          <ArrowLeft size={15} /> Back
        </button>
      )}
      <button onClick={onNext} disabled={nextDisabled}
        className="flex-1 inline-flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-black transition-all hover:-translate-y-0.5 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:translate-y-0"
        style={{ background: FLAME, fontFamily: "var(--font-inter)", fontSize: 15, boxShadow: "0 10px 40px rgba(255,106,26,0.3)" }}>
        {nextLabel} <ArrowRight size={16} />
      </button>
    </div>
  );
}
