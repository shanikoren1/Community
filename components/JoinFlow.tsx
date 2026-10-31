"use client";

import { useState, useEffect } from "react";
import { Check, ArrowRight, ArrowLeft, X, CalendarPlus, MessageCircle, Plus, Star, Sun, Moon } from "lucide-react";
import { GOAL_OPTIONS, WEEKDAYS, FIRST_STEPS, goalById, type FocusGoal, type WeekdayId } from "../lib/goals";
import { googleCalendarUrl, downloadIcsAll, goalTitle } from "../lib/calendar";
import Confetti from "./Confetti";
import { WHATSAPP_URL } from "../lib/config";

interface Props {
  onClose: () => void;
  initialStep?: Step;
  initialFocus?: FocusGoal[];
  initialFirstName?: string;
  mountBg?: boolean;
}

const FLAME = "linear-gradient(135deg, #FF6A1A 0%, #FFB347 100%)";
const FLAME_BAR = "linear-gradient(90deg, #FF6A1A 0%, #FFB347 100%)";

type Step = "longterm" | "shortterm" | "bridge" | "done";
const PROGRESS_STEPS: Step[] = ["longterm", "shortterm", "bridge"];

interface CustomGoal { id: string; label: string; }

const HUB_KEY = "become_member";

export default function JoinFlow({ onClose, initialStep, initialFocus, initialFirstName, mountBg }: Props) {
  const [step, setStep] = useState<Step>(initialStep ?? "longterm");
  const [longTerm, setLongTerm] = useState<string[]>([]);
  const [selectionTick, setSelectionTick] = useState(0);
  const [customGoals, setCustomGoals] = useState<CustomGoal[]>([]);
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState("");
  const [focusIds, setFocusIds] = useState<string[]>([]);
  const [focus, setFocus] = useState<FocusGoal[]>(initialFocus ?? []);
  const [timePrefs, setTimePrefs] = useState<Record<string, "morning" | "evening">>({});
  const [firstName] = useState(initialFirstName ?? "");

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  function optionFor(id: string): { id: string; label: string; identity: string; icon: React.ComponentType<{ size?: number; color?: string }> } {
    const g = goalById(id);
    if (g) return g;
    const c = customGoals.find((x) => x.id === id);
    return { id, label: c?.label || "My habit", identity: "chose their own path", icon: Star };
  }

  function toggleLongTerm(id: string) {
    setLongTerm((p) => {
      if (p.includes(id)) return p.filter((x) => x !== id);
      const next = [...p, id];
      setSelectionTick((t) => t + 1);
      if (next.length === 2) setTimeout(() => onLongtermNextWith(next), 650);
      return next;
    });
  }

  function onLongtermNextWith(ids: string[]) {
    if (ids.length === 2) goToBridge(ids);
    else if (ids.length > 0) setStep("shortterm");
    else goToBridge(GOAL_OPTIONS.slice(0, 2).map((g) => g.id));
  }
  function addCustom() {
    const label = draft.trim();
    if (!label) return;
    const id = `custom-${Date.now()}`;
    setCustomGoals((p) => [...p, { id, label }]);
    setLongTerm((p) => [...p, id]);
    setDraft("");
    setAdding(false);
  }
  function toggleFocus(id: string) {
    setFocusIds((p) => {
      if (p.includes(id)) return p.filter((x) => x !== id);
      if (p.length >= 2) return p;
      return [...p, id];
    });
  }

  function buildFocusFromIds(ids: string[]): FocusGoal[] {
    return ids.map((goalId) => {
      const fs = FIRST_STEPS[goalId];
      const custom = customGoals.find((c) => c.id === goalId);
      return {
        goalId,
        customLabel: custom?.label,
        minutes: fs?.duration ?? 30,
        days: fs?.defaultDays ? [...fs.defaultDays] : [],
        time: fs?.defaultTime ?? "18:00",
        tiny: fs?.firstStep ?? "",
      };
    });
  }

  function goToBridge(ids: string[]) {
    const built = buildFocusFromIds(ids);
    setFocusIds(ids);
    setFocus(built);
    setTimePrefs({});
    setStep("bridge");
  }

  function onLongtermNext() {
    onLongtermNextWith(longTerm);
  }

  function onShorttermNext() {
    if (focusIds.length > 0) {
      goToBridge(focusIds.length === 2 ? focusIds : [...focusIds, ...GOAL_OPTIONS.filter(g => !focusIds.includes(g.id)).map(g => g.id)].slice(0, 2));
    } else {
      goToBridge(longTerm.slice(0, 2).length === 2 ? longTerm.slice(0, 2) : GOAL_OPTIONS.slice(0, 2).map(g => g.id));
    }
  }

  function applyTimePref(goalId: string, pref: "morning" | "evening") {
    setTimePrefs((p) => ({ ...p, [goalId]: pref }));
    const fs = FIRST_STEPS[goalId];
    if (!fs) return;
    const time = pref === "morning" ? fs.morningTime : fs.eveningTime;
    setFocus((prev) => prev.map((f) => f.goalId === goalId ? { ...f, time } : f));
  }

  function updateFocus(idx: number, patch: Partial<FocusGoal>) {
    setFocus((p) => p.map((f, i) => (i === idx ? { ...f, ...patch } : f)));
  }
  function toggleDay(idx: number, day: WeekdayId) {
    setFocus((p) => p.map((f, i) => i === idx
      ? { ...f, days: f.days.includes(day) ? f.days.filter((d) => d !== day) : [...f.days, day] }
      : f));
  }

  function saveToHub(name: string, focusGoals: FocusGoal[]) {
    try {
      localStorage.setItem(HUB_KEY, JSON.stringify({ firstName: name, focus: focusGoals, ts: Date.now() }));
    } catch { /* storage not available */ }
  }

  function goToDone() {
    saveToHub(firstName || "there", focus);
    setStep("done");
  }

  const progressStep = PROGRESS_STEPS.indexOf(step);
  const pct = step === "done" ? 100 : Math.round(((progressStep + 1) / PROGRESS_STEPS.length) * 100);
  const shortList = longTerm.length ? longTerm : GOAL_OPTIONS.map((g) => g.id);

  return (
    <>
      {/* All fixed layers outside the scroll container — iOS Safari requires this */}
      {selectionTick > 0 && <Confetti key={selectionTick} active type="orange" />}
      {mountBg && (
        <>
          <div className="fixed inset-0 pointer-events-none slow-zoom" style={{ zIndex: 49, backgroundImage: "url('/mountain-hero.webp')", backgroundSize: "cover", backgroundPosition: "center", opacity: 0.22 }} />
          <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 49, background: "linear-gradient(180deg, rgba(12,12,17,0.82) 0%, rgba(12,12,17,0.93) 50%, rgba(12,12,17,1) 100%)" }} />
        </>
      )}
    <div className="fixed inset-0 z-50 overflow-y-auto overscroll-contain" style={{ backgroundColor: mountBg ? "transparent" : "#0C0C11", WebkitOverflowScrolling: "touch" }}>
      <div className="sticky top-0 z-10 px-5 py-4 flex items-center justify-between"
        style={{ backgroundColor: "rgba(12,12,17,0.85)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="flex items-center gap-2.5">
          <img src="/logo.webp" alt="Become" width={30} height={30} className="rounded-lg" />
          <span className="font-extrabold text-white" style={{ fontFamily: "var(--font-outfit)" }}>Become</span>
        </div>
        <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-full transition-all hover:bg-white/10" style={{ color: "#D8D8E8" }}>
          <X size={18} />
        </button>
      </div>

      <div className="max-w-xl mx-auto px-6 pt-8 pb-20">
        {mountBg && step === "longterm" && (
          <div className="slide-from-left text-left mb-10 overflow-hidden" style={{ animationDelay: "0.85s" }}>
            <h1 className="font-black" style={{
              fontFamily: "var(--font-outfit)",
              fontSize: "clamp(52px, 13vw, 104px)",
              lineHeight: 0.9,
              letterSpacing: "-0.04em",
              background: "linear-gradient(135deg, #FF6A1A 0%, #FFB347 55%, #fff 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: "drop-shadow(0 2px 24px rgba(255,106,26,0.55))",
            }}>
              Do it<br />now.
            </h1>
          </div>
        )}

        {step !== "done" && (
          <>
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2.5">
                <span className="mono-label" style={{ color: "#FF8A1F" }}>Step {progressStep + 1} of {PROGRESS_STEPS.length}</span>
                <span className="mono-label" style={{ color: "#D4D4DC" }}>{pct}% done</span>
              </div>
              <div className="h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }}>
                <div className="h-full rounded-full" style={{ width: `${pct}%`, background: FLAME_BAR, transition: "width 0.4s ease" }} />
              </div>
            </div>
          </>
        )}

        {/* 1 — LONG-TERM */}
        {step === "longterm" && (
          <div className="float-up">
            <Question title="Pursue Your Habits" sub="Choose 2 habits you want to build. We'll put them in your calendar." big />
            {/* Live selection counter */}
            <div className="flex items-center justify-between mb-4 px-1">
              <span style={{ fontFamily: "var(--font-inter)", fontSize: 14, color: "#E0E0EA", fontWeight: 500 }}>
                {longTerm.length === 0 ? "Pick 2 to continue" : longTerm.length === 1 ? "One more →" : "Ready ✓"}
              </span>
              <span className="font-black" style={{ fontFamily: "var(--font-outfit)", fontSize: 22, color: longTerm.length >= 2 ? "#FF8A1F" : "#A0A0B0", transition: "color 0.3s" }}>
                {longTerm.length} / 2
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {GOAL_OPTIONS.map((g) => <GoalCard key={g.id} g={g} active={longTerm.includes(g.id)} onClick={() => toggleLongTerm(g.id)} />)}
              {customGoals.map((c) => <GoalCard key={c.id} g={optionFor(c.id)} active={longTerm.includes(c.id)} onClick={() => toggleLongTerm(c.id)} />)}
              <button onClick={() => setAdding(true)}
                className="flex flex-col items-start gap-3 p-4 rounded-2xl text-left transition-all"
                style={{ border: "1.5px dashed rgba(255,138,31,0.5)", background: "transparent", minHeight: 92 }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(255,106,26,0.12)" }}>
                  <Plus size={18} color="#FF8A1F" />
                </div>
                <span className="text-sm font-semibold" style={{ color: "#FF8A1F", fontFamily: "var(--font-inter)" }}>Add something else</span>
              </button>
            </div>
            {adding && (
              <div className="flex gap-2 mt-3">
                <input autoFocus value={draft} onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") addCustom(); }}
                  placeholder="Write your own habit" style={inputStyle} className="flex-1 rounded-xl px-4 py-3 text-base outline-none" />
                <button onClick={addCustom} disabled={!draft.trim()}
                  className="px-5 rounded-xl font-bold text-black transition-all disabled:opacity-40" style={{ background: FLAME, fontFamily: "var(--font-inter)" }}>
                  Add
                </button>
              </div>
            )}
            <Nav onNext={onLongtermNext} nextLabel={longTerm.length === 2 ? `Continue (${longTerm.length} ✓)` : longTerm.length > 0 ? `Continue (${longTerm.length})` : "Continue"} onSkip={() => goToBridge(GOAL_OPTIONS.slice(0, 2).map(g => g.id))} />
          </div>
        )}

        {/* 2 — SHORT-TERM */}
        {step === "shortterm" && (
          <div className="float-up">
            <Question title="Pursue Your Habits" sub="Two habits for the next 3 weeks. Two is enough to change everything." />
            <div className="grid grid-cols-2 gap-3">
              {shortList.map((id) => {
                const g = optionFor(id);
                const active = focusIds.includes(id);
                const dimmed = !active && focusIds.length >= 2;
                return <GoalCard key={id} g={g} active={active} dimmed={dimmed} onClick={() => toggleFocus(id)} badge={active} />;
              })}
            </div>
            <p className="mt-5 text-center font-bold mono-label" style={{ color: focusIds.length === 2 ? "#FF8A1F" : "#8E8E9E" }}>
              {focusIds.length} of 2 picked
            </p>
            <Nav onBack={() => setStep("longterm")} onNext={onShorttermNext} nextLabel="Set my schedule" onSkip={() => goToBridge(longTerm.slice(0, 2).length >= 2 ? longTerm.slice(0, 2) : GOAL_OPTIONS.slice(0, 2).map(g => g.id))} />
          </div>
        )}

        {/* 3 — BRIDGE: first step + schedule */}
        {step === "bridge" && (
          <div className="float-up">
            <Question title="Your first step" sub="Based on the habits you chose, here is a science-backed first step for each one. Edit to fit your schedule." />
            <div className="flex flex-col gap-5">
              {focus.map((f, idx) => {
                const g = optionFor(f.goalId);
                const Icon = g.icon;
                const fs = FIRST_STEPS[f.goalId];
                const pref = timePrefs[f.goalId];
                return (
                  <div key={f.goalId} className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(255,138,31,0.25)" }}>
                    {/* Habit header */}
                    <div className="flex items-center gap-3 px-5 py-4" style={{ background: "rgba(255,106,26,0.08)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: FLAME }}>
                        <Icon size={18} color="#0C0C11" />
                      </div>
                      <span className="font-bold text-white" style={{ fontFamily: "var(--font-outfit)", fontSize: 18 }}>{g.label}</span>
                    </div>

                    <div className="px-5 py-4" style={{ background: "#15151D" }}>
                      {/* First step tip */}
                      {fs?.firstStep && (
                        <div className="mb-4 p-3 rounded-xl" style={{ background: "rgba(255,106,26,0.08)", border: "1px solid rgba(255,138,31,0.2)" }}>
                          <p className="text-sm" style={{ color: "#FFB347", fontFamily: "var(--font-inter)", lineHeight: 1.6 }}>
                            {fs.firstStep}
                          </p>
                        </div>
                      )}

                      {/* Morning / Evening toggle for physical habits */}
                      {fs?.askTimePreference && (
                        <div className="mb-4">
                          <label className="mono-label block mb-2" style={{ color: "#D8D8E8" }}>When works best?</label>
                          <div className="flex gap-2">
                            <button onClick={() => applyTimePref(f.goalId, "morning")}
                              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all"
                              style={{ background: pref === "morning" ? FLAME : "rgba(255,255,255,0.05)", color: pref === "morning" ? "#0C0C11" : "#E0E0EA", border: pref === "morning" ? "none" : "1px solid rgba(255,255,255,0.1)", fontFamily: "var(--font-inter)" }}>
                              <Sun size={15} /> Morning
                            </button>
                            <button onClick={() => applyTimePref(f.goalId, "evening")}
                              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all"
                              style={{ background: pref === "evening" ? FLAME : "rgba(255,255,255,0.05)", color: pref === "evening" ? "#0C0C11" : "#E0E0EA", border: pref === "evening" ? "none" : "1px solid rgba(255,255,255,0.1)", fontFamily: "var(--font-inter)" }}>
                              <Moon size={15} /> Evening
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Reminder badge for non-session habits */}
                      {fs?.isReminder && (
                        <div className="mb-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold" style={{ background: "rgba(255,138,31,0.12)", color: "#FF8A1F", fontFamily: "var(--font-inter)" }}>
                          ⏰ Daily reminder
                        </div>
                      )}

                      {/* Days */}
                      <label className="mono-label block mb-2" style={{ color: "#D8D8E8" }}>Which days?</label>
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {WEEKDAYS.map((d) => {
                          const on = f.days.includes(d.id);
                          return (
                            <button key={d.id} onClick={() => toggleDay(idx, d.id)}
                              className="w-11 h-10 rounded-lg text-xs font-bold transition-all"
                              style={{ border: on ? "1.5px solid #FF8A1F" : "1.5px solid rgba(255,255,255,0.1)", background: on ? FLAME : "transparent", color: on ? "#0C0C11" : "#E0E0EA", fontFamily: "var(--font-inter)" }}>
                              {d.label}
                            </button>
                          );
                        })}
                      </div>

                      {/* Time + Duration */}
                      <div className="flex gap-3">
                        <div className="flex-1">
                          <label className="mono-label block mb-2" style={{ color: "#D8D8E8" }}>Time</label>
                          <input type="time" value={f.time} onChange={(e) => updateFocus(idx, { time: e.target.value })} style={inputStyle} className="w-full rounded-lg px-3 py-2.5 text-sm outline-none" />
                        </div>
                        {!fs?.isReminder && (
                          <div className="flex-1">
                            <label className="mono-label block mb-2" style={{ color: "#D8D8E8" }}>How long?</label>
                            <select value={f.minutes} onChange={(e) => updateFocus(idx, { minutes: Number(e.target.value) })} style={inputStyle} className="w-full rounded-lg px-3 py-2.5 text-sm outline-none">
                              {[10, 15, 20, 30, 45, 60, 90].map((m) => <option key={m} value={m} style={{ background: "#15151D" }}>{m} min</option>)}
                            </select>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <Nav onBack={() => setStep(longTerm.length === 2 ? "longterm" : "shortterm")} onNext={goToDone} nextLabel="Save to calendar ✓" onSkip={goToDone} skipLabel="Skip schedule" />
          </div>
        )}

        {/* DONE — HUB */}
        {step === "done" && (
          <div className="float-up pt-4">
            <Confetti active type="orange" />
            <div className="text-center mb-9">
              <div className="mx-auto mb-5 w-20 h-20 rounded-full flex items-center justify-center reward-pop" style={{ background: FLAME, boxShadow: "0 12px 50px rgba(255,106,26,0.45)" }}>
                <Check size={38} color="#0C0C11" strokeWidth={3} />
              </div>
              <h2 className="font-black text-white mb-2" style={{ fontFamily: "var(--font-outfit)", fontSize: 30 }}>
                {firstName ? `Welcome, ${firstName}!` : "Welcome!"}
              </h2>
              <p className="text-base leading-relaxed mx-auto" style={{ color: "#D8D8E8", fontFamily: "var(--font-inter)", maxWidth: 360 }}>
                You made it. Three quick things to lock it in.
              </p>
            </div>

            <ActionStep n={1} title="Join the WhatsApp group" sub="The people who push each other forward every day.">
              {WHATSAPP_URL ? (
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-bold text-black transition-all hover:-translate-y-0.5"
                  style={{ background: "linear-gradient(135deg, #25D366 0%, #128C7E 100%)", fontFamily: "var(--font-inter)", fontSize: 15 }}>
                  <MessageCircle size={17} /> Open WhatsApp group
                </a>
              ) : (
                <p className="text-sm text-center py-3 rounded-xl" style={{ color: "#C8C8D8", background: "#101017", border: "1px dashed rgba(255,255,255,0.12)", fontFamily: "var(--font-inter)" }}>
                  WhatsApp link coming soon
                </p>
              )}
            </ActionStep>

            <ActionStep n={2} title="Put it in your calendar" sub="3 weeks of reminders. Set it once, show up every day." last>
              {focus.length > 0 ? (
                <>
                  <button onClick={() => downloadIcsAll(focus)}
                    className="inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-bold text-black transition-all hover:-translate-y-0.5"
                    style={{ background: FLAME, fontFamily: "var(--font-inter)", fontSize: 15 }}>
                    <CalendarPlus size={17} /> Add both to my calendar
                  </button>
                  <p className="text-xs mt-3 text-center" style={{ color: "#C8C8D8", fontFamily: "var(--font-inter)" }}>
                    Google Calendar:{" "}
                    {focus.map((f, i) => (
                      <span key={f.goalId}>
                        <a href={googleCalendarUrl(f)} target="_blank" rel="noopener noreferrer" style={{ color: "#FF8A1F", textDecoration: "underline" }}>{goalTitle(f)}</a>
                        {i === 0 && " · "}
                      </span>
                    ))}
                  </p>
                </>
              ) : (
                <p className="text-sm py-3 text-center rounded-xl" style={{ color: "#C8C8D8", background: "#101017", border: "1px dashed rgba(255,255,255,0.12)", fontFamily: "var(--font-inter)" }}>
                  Set your schedule above to turn on calendar export.
                </p>
              )}
            </ActionStep>

            {/* Next survey — prominent CTA */}
            <div className="mt-8 rounded-2xl overflow-hidden" style={{ border: "1.5px solid rgba(255,194,77,0.35)", background: "rgba(255,179,71,0.06)" }}>
              <div className="px-5 pt-5 pb-4">
                <p className="mono-label mb-1" style={{ color: "#FFC24D" }}>You&apos;re on a roll →</p>
                <h3 className="font-black text-white mb-1.5" style={{ fontFamily: "var(--font-outfit)", fontSize: "clamp(20px, 4vw, 26px)", lineHeight: 1.1 }}>Ready to make a decision?</h3>
                <p className="text-sm mb-4" style={{ color: "#D8D8E8", fontFamily: "var(--font-inter)" }}>Using the Essentialism method. 5 minutes to real clarity.</p>
                <a href="/decide"
                  className="inline-flex items-center justify-center gap-2 w-full py-4 rounded-xl font-bold transition-all hover:-translate-y-0.5"
                  style={{ background: "linear-gradient(135deg, #FFB347 0%, #FFD98C 100%)", color: "#0C0C11", fontFamily: "var(--font-inter)", fontSize: 16, boxShadow: "0 12px 40px rgba(255,194,77,0.4)" }}>
                  Make a decision now <ArrowRight size={18} />
                </a>
              </div>
            </div>
            <button onClick={onClose} className="mt-5 w-full text-sm font-semibold" style={{ color: "#FF8A1F", fontFamily: "var(--font-inter)" }}>
              I&apos;m all set
            </button>
          </div>
        )}
      </div>
    </div>
    </>
  );
}

const inputStyle: React.CSSProperties = {
  border: "1.5px solid rgba(255,255,255,0.1)",
  color: "#FFFFFF",
  fontFamily: "var(--font-inter)",
  backgroundColor: "#15151D",
  fontSize: 16,
};

function Question({ title, sub, big }: { title: string; sub: string; big?: boolean }) {
  return (
    <div className="mb-6">
      <h2 className="font-black mb-3" style={{
        fontFamily: "var(--font-outfit)",
        fontSize: big ? "clamp(40px, 10vw, 64px)" : "clamp(32px, 8vw, 48px)",
        lineHeight: 0.95,
        letterSpacing: "-0.04em",
        background: "linear-gradient(135deg, #FF6A1A 0%, #FFB347 55%, #fff 100%)",
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        WebkitTextFillColor: "transparent",
      }}>{title}</h2>
      <p className="text-base leading-relaxed" style={{ color: "#E8E8F2", fontFamily: "var(--font-inter)", fontSize: 16 }}>{sub}</p>
    </div>
  );
}

function ActionStep({ n, title, sub, children, last }: { n: number; title: string; sub: string; children: React.ReactNode; last?: boolean }) {
  return (
    <div className="flex gap-4" style={{ paddingBottom: last ? 0 : 20 }}>
      <div className="flex flex-col items-center">
        <div className="w-9 h-9 rounded-full flex items-center justify-center font-black text-black flex-shrink-0" style={{ background: "linear-gradient(135deg, #FF6A1A 0%, #FFB347 100%)", fontFamily: "var(--font-outfit)" }}>{n}</div>
        {!last && <div className="w-px flex-1 mt-1" style={{ background: "rgba(255,255,255,0.1)" }} />}
      </div>
      <div className="flex-1 pb-1">
        <h3 className="font-bold text-white mb-1" style={{ fontFamily: "var(--font-outfit)", fontSize: 18 }}>{title}</h3>
        <p className="text-sm mb-3.5" style={{ color: "#D8D8E8", fontFamily: "var(--font-inter)" }}>{sub}</p>
        {children}
      </div>
    </div>
  );
}

function GoalCard({ g, active, dimmed, onClick, badge }: {
  g: { label: string; identity: string; icon: React.ComponentType<{ size?: number; color?: string }> };
  active: boolean; dimmed?: boolean; onClick: () => void; badge?: boolean;
}) {
  const Icon = g.icon;
  return (
    <button onClick={onClick} disabled={dimmed}
      className="relative flex flex-col items-start gap-3 p-4 rounded-2xl text-left transition-all disabled:opacity-30 disabled:cursor-not-allowed"
      style={{ border: active ? "1.5px solid #FF8A1F" : "1.5px solid rgba(255,255,255,0.22)", background: active ? "rgba(255,106,26,0.14)" : "rgba(21,21,29,0.95)", minHeight: 92 }}>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: active ? "linear-gradient(135deg, #FF6A1A 0%, #FFB347 100%)" : "rgba(255,255,255,0.05)" }}>
        <Icon size={18} color={active ? "#0C0C11" : "#D8D8E8"} />
      </div>
      <span className="text-sm font-semibold" style={{ color: "#fff", fontFamily: "var(--font-inter)" }}>{g.label}</span>
      {badge && active && (
        <span className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, #FF6A1A 0%, #FFB347 100%)" }}>
          <Check size={12} color="#0C0C11" strokeWidth={3} />
        </span>
      )}
    </button>
  );
}

function Nav({ onBack, onNext, nextLabel, onSkip, skipLabel }: {
  onBack?: () => void;
  onNext: () => void;
  nextLabel: string;
  onSkip?: () => void;
  skipLabel?: string;
}) {
  return (
    <div className="mt-8">
      <div className="flex items-center gap-3">
        {onBack && (
          <button onClick={onBack} className="inline-flex items-center gap-1.5 px-4 py-3.5 rounded-xl text-sm font-semibold" style={{ color: "#D8D8E8", fontFamily: "var(--font-inter)" }}>
            <ArrowLeft size={15} /> Back
          </button>
        )}
        {nextLabel && (
          <button onClick={onNext}
            className="flex-1 inline-flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-black transition-all hover:-translate-y-0.5"
            style={{ background: "linear-gradient(135deg, #FF6A1A 0%, #FFB347 100%)", fontFamily: "var(--font-inter)", fontSize: 15, boxShadow: "0 10px 40px rgba(255,106,26,0.3)" }}>
            {nextLabel} <ArrowRight size={16} />
          </button>
        )}
      </div>
      {onSkip && (
        <button onClick={onSkip} className="mt-3 w-full text-sm text-center" style={{ color: "#C8C8D8", fontFamily: "var(--font-inter)" }}>
          {skipLabel ?? "Skip this step →"}
        </button>
      )}
    </div>
  );
}
