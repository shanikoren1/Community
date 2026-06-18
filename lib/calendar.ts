import { SITE } from "./config";
import { goalById, type FocusGoal, type WeekdayId } from "./goals";

/**
 * Calendar invite generation for the 3-week sprint.
 *
 * V1 = no per-user OAuth. We generate:
 *   - a Google Calendar "template" URL (one tap to add)
 *   - a downloadable .ics file (works for Apple/iPhone + Outlook)
 * Both create a WEEKLY recurring event on the chosen days, for the sprint length.
 */

const DAY_TO_INDEX: Record<WeekdayId, number> = {
  SU: 0, MO: 1, TU: 2, WE: 3, TH: 4, FR: 5, SA: 6,
};

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

/** Build "YYYYMMDDTHHMMSS" (floating local time — interpreted in the user's TZ). */
function formatLocal(d: Date): string {
  return (
    `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}` +
    `T${pad(d.getHours())}${pad(d.getMinutes())}00`
  );
}

/** First occurrence: the soonest chosen weekday (today included) at the chosen time. */
function firstOccurrence(goal: FocusGoal, base: Date): Date {
  const [h, m] = goal.time.split(":").map(Number);
  const targetDays = goal.days.map((d) => DAY_TO_INDEX[d]);
  for (let offset = 0; offset < 7; offset++) {
    const candidate = new Date(base);
    candidate.setDate(base.getDate() + offset);
    candidate.setHours(h, m, 0, 0);
    if (targetDays.includes(candidate.getDay()) && candidate >= base) {
      return candidate;
    }
  }
  // Fallback: base at chosen time
  const fallback = new Date(base);
  fallback.setHours(h, m, 0, 0);
  return fallback;
}

export function goalTitle(goal: FocusGoal): string {
  const opt = goalById(goal.goalId);
  return goal.customLabel || opt?.label || "My habit";
}

function rrule(goal: FocusGoal): string {
  const count = Math.max(1, goal.days.length) * SITE.sprintWeeks;
  return `FREQ=WEEKLY;BYDAY=${goal.days.join(",")};COUNT=${count}`;
}

function describe(goal: FocusGoal): string {
  const opt = goalById(goal.goalId);
  const identity = opt ? `I am becoming someone who ${opt.identity}.` : "";
  const lines = [
    identity,
    goal.tiny ? `Smallest version on a hard day: ${goal.tiny}` : "",
    "",
    `Part of my ${SITE.sprintWeeks}-week ${SITE.name} sprint. Show up, take your photo proof, start the focus timer.`,
  ].filter(Boolean);
  return lines.join("\n");
}

/** Google Calendar one-tap "add event" template URL. */
export function googleCalendarUrl(goal: FocusGoal, base = new Date()): string {
  const start = firstOccurrence(goal, base);
  const end = new Date(start.getTime() + goal.minutes * 60000);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `${goalTitle(goal)} · ${SITE.name}`,
    dates: `${formatLocal(start)}/${formatLocal(end)}`,
    recur: `RRULE:${rrule(goal)}`,
    details: describe(goal),
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/** Raw .ics file content (Apple Calendar / Outlook / iPhone). */
export function icsContent(goal: FocusGoal, base = new Date()): string {
  const start = firstOccurrence(goal, base);
  const end = new Date(start.getTime() + goal.minutes * 60000);
  const uid = `${goal.goalId}-${formatLocal(start)}@community.hastandart.com`;
  // Escape commas/newlines per RFC 5545
  const esc = (s: string) => s.replace(/\\/g, "\\\\").replace(/,/g, "\\,").replace(/;/g, "\\;").replace(/\n/g, "\\n");
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Hastandart Community//Builders Sprint//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTART:${formatLocal(start)}`,
    `DTEND:${formatLocal(end)}`,
    `RRULE:${rrule(goal)}`,
    `SUMMARY:${esc(`${goalTitle(goal)} · ${SITE.name}`)}`,
    `DESCRIPTION:${esc(describe(goal))}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

/** Trigger a browser download of the .ics for a goal. */
export function downloadIcs(goal: FocusGoal, base = new Date()): void {
  const blob = new Blob([icsContent(goal, base)], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${goalTitle(goal).replace(/\s+/g, "-").toLowerCase()}-sprint.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
