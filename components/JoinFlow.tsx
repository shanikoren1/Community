"use client";

import { useState, useEffect } from "react";
import { Check, ArrowRight, ArrowLeft, X, CalendarPlus, MessageCircle } from "lucide-react";
import { GOAL_OPTIONS, WEEKDAYS, goalById, type FocusGoal, type WeekdayId } from "../lib/goals";
import { googleCalendarUrl, downloadIcs, goalTitle } from "../lib/calendar";
import { PLAYCLUB_URL, SITE } from "../lib/config";

interface Props {
  onClose: () => void;
}

const GRADIENT = "linear-gradient(135deg, #46CAC0 0%, #2184F9 60%, #5925DC 100%)";
const PURPLE_GRADIENT = "linear-gradient(135deg, #5925DC 0%, #2184F9 100%)";

type Step = "identity" | "longterm" | "shortterm" | "schedule" | "contact" | "calendar" | "done";

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
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  function toggleLongTerm(id: string) {
    setLongTerm((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  // Short-term: hard cap of exactly 2.
  function toggleFocus(id: string) {
    setFocusIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 2) return prev; // cap enforced
      return [...prev, id];
    });
  }

  function startSchedule() {
    // seed focus goals from chosen ids
    setFocus(
      focusIds.map((goalId) => ({
        goalId,
        minutes: 30,
        days: [],
        time: "18:00",
        tiny: "",
      }))
    );
    setStep("schedule");
  }

  function updateFocus(idx: number, patch: Partial<FocusGoal>) {
    setFocus((prev) => prev.map((f, i) => (i === idx ? { ...f, ...patch } : f)));
  }

  function toggleDay(idx: number, day: WeekdayId) {
    setFocus((prev) =>
      prev.map((f, i) =>
        i === idx
          ? { ...f, days: f.days.includes(day) ? f.days.filter((d) => d !== day) : [...f.days, day] }
          : f
      )
    );
  }

  const scheduleValid = focus.length === 2 && focus.every((f) => f.days.length > 0 && f.minutes > 0);

  async function submit() {
    setError("");
    if (!firstName || !email) {
      setError("Please add your name and email.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          email,
          identity,
          longTerm: longTerm.map((id) => goalById(id)?.label || id),
          focus: focus.map((f) => ({
            title: goalTitle(f),
            minutes: f.minutes,
            days: f.days,
            time: f.time,
            tiny: f.tiny,
          })),
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong.");
      }
      setStep("calendar");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(4, 26, 42, 0.85)", backdropFilter: "blur(6px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-2xl"
        style={{ backgroundColor: "#FFFFFF", boxShadow: "0 24px 80px rgba(0,0,0,0.4)" }}
      >
        {/* Header */}
        <div
          className="sticky top-0 z-10 px-8 pt-8 pb-6"
          style={{ background: GRADIENT, borderRadius: "16px 16px 0 0" }}
        >
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full transition-all hover:bg-white/20"
            style={{ color: "rgba(255,255,255,0.8)" }}
            aria-label="Close"
          >
            <X size={16} />
          </button>

          <span
            className="inline-block mb-3 px-3 py-1 text-xs font-bold tracking-[0.2em] uppercase rounded-full"
            style={{ backgroundColor: "rgba(255,255,255,0.18)", color: "#fff" }}
          >
            Join {SITE.name}
          </span>

          <h2
            className="font-black text-white"
            style={{ fontFamily: "var(--font-outfit)", fontSize: "clamp(22px, 4vw, 30px)", letterSpacing: "-0.03em", lineHeight: 1.12 }}
          >
            {headerTitle(step)}
          </h2>
          {step !== "done" && step !== "calendar" && (
            <ProgressDots step={step} />
          )}
        </div>

        {/* Body */}
        <div className="px-7 py-7" style={{ color: "#0F172A" }}>
          {/* STEP 1 — IDENTITY */}
          {step === "identity" && (
            <div className="float-up">
              <p className="text-base leading-relaxed mb-5" style={{ color: "#475569", fontFamily: "var(--font-inter)" }}>
                Atomic Habits starts with one decision: <strong>who do you want to become?</strong> Not what you want to
                do — who you want to <em>be</em>. Finish the sentence.
              </p>
              <label className="block mb-2 text-sm font-semibold" style={{ fontFamily: "var(--font-inter)" }}>
                I am becoming someone who…
              </label>
              <input
                autoFocus
                value={identity}
                onChange={(e) => setIdentity(e.target.value)}
                placeholder="…shows up for themselves every day."
                className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all"
                style={inputStyle}
                onFocus={focusStyle}
                onBlur={blurStyle}
              />
              <NavRow
                onNext={() => setStep("longterm")}
                nextDisabled={identity.trim().length < 3}
                nextLabel="This is me"
              />
            </div>
          )}

          {/* STEP 2 — LONG-TERM MENU */}
          {step === "longterm" && (
            <div className="float-up">
              <p className="text-base leading-relaxed mb-5" style={{ color: "#475569", fontFamily: "var(--font-inter)" }}>
                Pick everything you want in your life over the long run. No limit here — dream wide.
              </p>
              <div className="grid grid-cols-2 gap-2.5">
                {GOAL_OPTIONS.map((g) => {
                  const active = longTerm.includes(g.id);
                  const Icon = g.icon;
                  return (
                    <button
                      key={g.id}
                      onClick={() => toggleLongTerm(g.id)}
                      className="flex items-center gap-2.5 px-3.5 py-3 rounded-xl text-sm font-medium text-left transition-all"
                      style={{
                        border: active ? "1.5px solid #2184F9" : "1.5px solid #E2E8F0",
                        background: active ? "#EEF2FF" : "#F8F9FC",
                        color: active ? "#1E3A8A" : "#475569",
                        fontFamily: "var(--font-inter)",
                      }}
                    >
                      <Icon size={17} style={{ color: active ? "#2184F9" : "#94A3B8", flexShrink: 0 }} />
                      {g.label}
                    </button>
                  );
                })}
              </div>
              <NavRow
                onBack={() => setStep("identity")}
                onNext={() => setStep("shortterm")}
                nextDisabled={longTerm.length === 0}
                nextLabel={`Continue${longTerm.length ? ` (${longTerm.length})` : ""}`}
              />
            </div>
          )}

          {/* STEP 3 — SHORT-TERM (exactly 2) */}
          {step === "shortterm" && (
            <div className="float-up">
              <p className="text-base leading-relaxed mb-1.5" style={{ color: "#475569", fontFamily: "var(--font-inter)" }}>
                Now the hard part: <strong>choose only 2.</strong>
              </p>
              <p className="text-sm leading-relaxed mb-5" style={{ color: "#94A3B8", fontFamily: "var(--font-inter)" }}>
                These are your single focus for the next {SITE.sprintWeeks} weeks. Focus beats scatter — that&apos;s the
                whole point.
              </p>
              <div className="grid grid-cols-2 gap-2.5">
                {(longTerm.length ? longTerm : GOAL_OPTIONS.map((g) => g.id)).map((id) => {
                  const g = goalById(id);
                  if (!g) return null;
                  const active = focusIds.includes(id);
                  const dimmed = !active && focusIds.length >= 2;
                  const Icon = g.icon;
                  return (
                    <button
                      key={id}
                      onClick={() => toggleFocus(id)}
                      disabled={dimmed}
                      className="relative flex items-center gap-2.5 px-3.5 py-3 rounded-xl text-sm font-medium text-left transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                      style={{
                        border: active ? "1.5px solid #5925DC" : "1.5px solid #E2E8F0",
                        background: active ? "#EEF2FF" : "#F8F9FC",
                        color: active ? "#5925DC" : "#475569",
                        fontFamily: "var(--font-inter)",
                      }}
                    >
                      <Icon size={17} style={{ color: active ? "#5925DC" : "#94A3B8", flexShrink: 0 }} />
                      {g.label}
                      {active && (
                        <span
                          className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center"
                          style={{ background: PURPLE_GRADIENT }}
                        >
                          <Check size={12} color="#fff" strokeWidth={3} />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
              <p className="mt-4 text-center text-sm font-semibold" style={{ color: focusIds.length === 2 ? "#16A34A" : "#94A3B8", fontFamily: "var(--font-inter)" }}>
                {focusIds.length}/2 chosen
              </p>
              <NavRow
                onBack={() => setStep("longterm")}
                onNext={startSchedule}
                nextDisabled={focusIds.length !== 2}
                nextLabel="Schedule them"
              />
            </div>
          )}

          {/* STEP 4 — SCHEDULE */}
          {step === "schedule" && (
            <div className="float-up">
              <p className="text-base leading-relaxed mb-5" style={{ color: "#475569", fontFamily: "var(--font-inter)" }}>
                A habit needs a time and a place. Tell me <strong>when</strong> — we&apos;ll drop it straight into your
                calendar.
              </p>
              <div className="flex flex-col gap-5">
                {focus.map((f, idx) => {
                  const g = goalById(f.goalId);
                  return (
                    <div key={f.goalId} className="rounded-xl p-4" style={{ background: "#F8F9FC", border: "1.5px solid #E2E8F0" }}>
                      <p className="font-bold mb-1" style={{ fontFamily: "var(--font-outfit)", color: "#0F172A" }}>{g?.label}</p>
                      <p className="text-xs mb-3" style={{ color: "#94A3B8", fontFamily: "var(--font-inter)" }}>
                        I am becoming someone who {g?.identity}.
                      </p>

                      {/* days */}
                      <label className="block mb-1.5 text-xs font-semibold uppercase tracking-wide" style={{ color: "#64748B" }}>Which days?</label>
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {WEEKDAYS.map((d) => {
                          const on = f.days.includes(d.id);
                          return (
                            <button
                              key={d.id}
                              onClick={() => toggleDay(idx, d.id)}
                              className="w-10 h-9 rounded-lg text-xs font-bold transition-all"
                              style={{
                                border: on ? "1.5px solid #2184F9" : "1.5px solid #E2E8F0",
                                background: on ? "#2184F9" : "#fff",
                                color: on ? "#fff" : "#64748B",
                                fontFamily: "var(--font-inter)",
                              }}
                            >
                              {d.label}
                            </button>
                          );
                        })}
                      </div>

                      <div className="flex gap-3 mb-3">
                        <div className="flex-1">
                          <label className="block mb-1.5 text-xs font-semibold uppercase tracking-wide" style={{ color: "#64748B" }}>Time</label>
                          <input
                            type="time"
                            value={f.time}
                            onChange={(e) => updateFocus(idx, { time: e.target.value })}
                            className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                            style={{ border: "1.5px solid #E2E8F0", color: "#0F172A", fontFamily: "var(--font-inter)", background: "#fff" }}
                          />
                        </div>
                        <div className="flex-1">
                          <label className="block mb-1.5 text-xs font-semibold uppercase tracking-wide" style={{ color: "#64748B" }}>Minutes</label>
                          <select
                            value={f.minutes}
                            onChange={(e) => updateFocus(idx, { minutes: Number(e.target.value) })}
                            className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                            style={{ border: "1.5px solid #E2E8F0", color: "#0F172A", fontFamily: "var(--font-inter)", background: "#fff" }}
                          >
                            {[10, 15, 20, 30, 45, 60, 90].map((m) => (
                              <option key={m} value={m}>{m} min</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <label className="block mb-1.5 text-xs font-semibold uppercase tracking-wide" style={{ color: "#64748B" }}>
                        Smallest version on a hard day (2-minute rule)
                      </label>
                      <input
                        value={f.tiny}
                        onChange={(e) => updateFocus(idx, { tiny: e.target.value })}
                        placeholder="e.g. just put on my shoes"
                        className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                        style={{ border: "1.5px solid #E2E8F0", color: "#0F172A", fontFamily: "var(--font-inter)", background: "#fff" }}
                      />
                    </div>
                  );
                })}
              </div>
              <NavRow
                onBack={() => setStep("shortterm")}
                onNext={() => setStep("contact")}
                nextDisabled={!scheduleValid}
                nextLabel="Almost there"
              />
            </div>
          )}

          {/* STEP 5 — CONTACT */}
          {step === "contact" && (
            <div className="float-up">
              <p className="text-base leading-relaxed mb-5" style={{ color: "#475569", fontFamily: "var(--font-inter)" }}>
                Last step. This is how the community welcomes you in.
              </p>
              <label className="block mb-2 text-sm font-semibold" style={{ fontFamily: "var(--font-inter)" }}>First name</label>
              <input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Your name"
                className="w-full rounded-xl px-4 py-3 text-sm outline-none mb-4"
                style={inputStyle}
                onFocus={focusStyle}
                onBlur={blurStyle}
              />
              <label className="block mb-2 text-sm font-semibold" style={{ fontFamily: "var(--font-inter)" }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl px-4 py-3 text-sm outline-none"
                style={inputStyle}
                onFocus={focusStyle}
                onBlur={blurStyle}
              />
              {error && <p className="mt-4 text-sm text-center" style={{ color: "#EF4444" }}>{error}</p>}
              <button
                onClick={submit}
                disabled={loading}
                className="mt-6 w-full py-4 rounded-xl font-bold text-white transition-all hover:-translate-y-0.5 disabled:opacity-60"
                style={{ background: GRADIENT, fontFamily: "var(--font-inter)", fontSize: "16px", boxShadow: "0 6px 30px rgba(70,202,192,0.35)" }}
              >
                {loading ? "Joining…" : "Start my journey →"}
              </button>
              <button onClick={() => setStep("schedule")} className="mt-3 w-full text-sm" style={{ color: "#94A3B8", fontFamily: "var(--font-inter)" }}>
                ← Back
              </button>
            </div>
          )}

          {/* STEP 6 — CALENDAR + CHAT */}
          {step === "calendar" && (
            <div className="float-up text-center">
              <div className="mx-auto mb-5 w-16 h-16 rounded-full flex items-center justify-center reward-pop" style={{ background: GRADIENT }}>
                <Check size={30} color="#fff" strokeWidth={3} />
              </div>
              <h3 className="font-black mb-2" style={{ fontFamily: "var(--font-outfit)", fontSize: "24px", color: "#0F172A" }}>
                Welcome, {firstName}. 🎉
              </h3>
              <p className="text-base leading-relaxed mb-6" style={{ color: "#475569", fontFamily: "var(--font-inter)" }}>
                Now lock it in. Add each habit to your calendar — that&apos;s your cue, every week, for the next {SITE.sprintWeeks} weeks.
              </p>

              <div className="flex flex-col gap-3 mb-6 text-left">
                {focus.map((f) => (
                  <div key={f.goalId} className="rounded-xl p-4" style={{ background: "#F8F9FC", border: "1.5px solid #E2E8F0" }}>
                    <p className="font-bold mb-2" style={{ fontFamily: "var(--font-outfit)", color: "#0F172A" }}>{goalTitle(f)}</p>
                    <div className="flex flex-wrap gap-2">
                      <a
                        href={googleCalendarUrl(f)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-white transition-all hover:-translate-y-0.5"
                        style={{ background: PURPLE_GRADIENT, fontFamily: "var(--font-inter)" }}
                      >
                        <CalendarPlus size={14} /> Google Calendar
                      </a>
                      <button
                        onClick={() => downloadIcs(f)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all hover:-translate-y-0.5"
                        style={{ border: "1.5px solid #5925DC", color: "#5925DC", fontFamily: "var(--font-inter)", background: "#fff" }}
                      >
                        <CalendarPlus size={14} /> Apple / iPhone (.ics)
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <a
                href={PLAYCLUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 w-full justify-center py-4 rounded-xl font-bold text-white transition-all hover:-translate-y-0.5"
                style={{ background: GRADIENT, fontFamily: "var(--font-inter)", fontSize: "16px", boxShadow: "0 6px 30px rgba(70,202,192,0.35)" }}
              >
                <MessageCircle size={18} /> Join the group chat
              </a>
              <p className="mt-3 text-xs" style={{ color: "#94A3B8", fontFamily: "var(--font-inter)" }}>
                This is where the magic is — your people, cheering you on.
              </p>
              <button onClick={onClose} className="mt-4 w-full text-sm font-semibold" style={{ color: "#5925DC", fontFamily: "var(--font-inter)" }}>
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------- helpers ---------- */

const inputStyle: React.CSSProperties = {
  border: "1.5px solid #E2E8F0",
  color: "#0F172A",
  fontFamily: "var(--font-inter)",
  backgroundColor: "#F8F9FC",
};
function focusStyle(e: React.FocusEvent<HTMLInputElement>) {
  e.currentTarget.style.borderColor = "#2184F9";
  e.currentTarget.style.backgroundColor = "#fff";
}
function blurStyle(e: React.FocusEvent<HTMLInputElement>) {
  e.currentTarget.style.borderColor = "#E2E8F0";
  e.currentTarget.style.backgroundColor = "#F8F9FC";
}

function headerTitle(step: Step): string {
  switch (step) {
    case "identity": return "Who are you becoming?";
    case "longterm": return "What do you want in your life?";
    case "shortterm": return "Your focus for 3 weeks.";
    case "schedule": return "When will you show up?";
    case "contact": return "Join the community.";
    case "calendar": return "You're in.";
    default: return "";
  }
}

const ORDER: Step[] = ["identity", "longterm", "shortterm", "schedule", "contact"];
function ProgressDots({ step }: { step: Step }) {
  const idx = ORDER.indexOf(step);
  return (
    <div className="flex gap-1.5 mt-4">
      {ORDER.map((_, i) => (
        <div
          key={i}
          className="h-1 rounded-full transition-all"
          style={{ width: i === idx ? 24 : 12, background: i <= idx ? "#fff" : "rgba(255,255,255,0.35)" }}
        />
      ))}
    </div>
  );
}

function NavRow({
  onBack, onNext, nextDisabled, nextLabel,
}: {
  onBack?: () => void; onNext: () => void; nextDisabled?: boolean; nextLabel: string;
}) {
  return (
    <div className="flex items-center gap-3 mt-7">
      {onBack && (
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all"
          style={{ color: "#64748B", fontFamily: "var(--font-inter)" }}
        >
          <ArrowLeft size={15} /> Back
        </button>
      )}
      <button
        onClick={onNext}
        disabled={nextDisabled}
        className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-white transition-all hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0"
        style={{ background: "linear-gradient(135deg, #46CAC0 0%, #2184F9 60%, #5925DC 100%)", fontFamily: "var(--font-inter)", fontSize: "15px", boxShadow: "0 6px 30px rgba(70,202,192,0.35)" }}
      >
        {nextLabel} <ArrowRight size={16} />
      </button>
    </div>
  );
}
