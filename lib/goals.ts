import {
  Languages,
  Music,
  Dumbbell,
  HeartPulse,
  Activity,
  Brain,
  BookOpen,
  Footprints,
  Headphones,
  Flame,
  PenLine,
  Sparkles,
  Apple,
  Droplet,
  Moon,
  NotebookPen,
  PiggyBank,
  Zap,
  type LucideIcon,
} from "lucide-react";

export interface GoalOption {
  id: string;
  label: string;
  /** Identity sentence: "I am becoming someone who ___" */
  identity: string;
  icon: LucideIcon;
}

/**
 * The long-term goal menu. Members pick as many as they like here, then narrow
 * to EXACTLY 2 short-term focus goals for the 3-week sprint.
 * Order/labels match Shani's brief.
 */
// Ordered most-common-first. This order is meant to be tuned over time from real
// signup data (see the continuous-improvement note in CLAUDE.md / project memory).
export const GOAL_OPTIONS: GoalOption[] = [
  { id: "workout", label: "Work out", identity: "trains their body", icon: Dumbbell },
  { id: "running", label: "Running", identity: "runs", icon: Zap },
  { id: "walking", label: "Walking", identity: "walks daily", icon: Footprints },
  { id: "gym", label: "Gym", identity: "shows up at the gym", icon: Activity },
  { id: "reading", label: "Read books", identity: "reads every day", icon: BookOpen },
  { id: "meditate", label: "Meditate", identity: "sits with a calm mind", icon: Brain },
  { id: "water", label: "Drink water", identity: "stays hydrated", icon: Droplet },
  { id: "eat", label: "Eat healthy", identity: "fuels their body well", icon: Apple },
  { id: "sleep", label: "Better sleep", identity: "protects their sleep", icon: Moon },
  { id: "yoga", label: "Yoga", identity: "moves with intention", icon: HeartPulse },
  { id: "journal", label: "Journaling", identity: "reflects every day", icon: NotebookPen },
  { id: "writing", label: "Writing", identity: "writes their thoughts", icon: PenLine },
  { id: "podcast", label: "Listen to podcasts", identity: "keeps learning", icon: Headphones },
  { id: "savings", label: "Save money", identity: "is smart with money", icon: PiggyBank },
  { id: "language", label: "Learn a language", identity: "speaks a new language", icon: Languages },
  { id: "instrument", label: "Play an instrument", identity: "makes music", icon: Music },
  { id: "ai", label: "Create with AI", identity: "builds with AI", icon: Sparkles },
  { id: "sauna", label: "Sauna", identity: "recovers on purpose", icon: Flame },
];

export function goalById(id: string): GoalOption | undefined {
  return GOAL_OPTIONS.find((g) => g.id === id);
}

/** Days of the week for the scheduling step. */
export const WEEKDAYS = [
  { id: "MO", label: "Mon" },
  { id: "TU", label: "Tue" },
  { id: "WE", label: "Wed" },
  { id: "TH", label: "Thu" },
  { id: "FR", label: "Fri" },
  { id: "SA", label: "Sat" },
  { id: "SU", label: "Sun" },
] as const;

export type WeekdayId = (typeof WEEKDAYS)[number]["id"];

/** A short-term focus goal with its schedule, captured in the survey. */
export interface FocusGoal {
  goalId: string;
  /** custom label if the member added their own goal */
  customLabel?: string;
  /** minutes per session */
  minutes: number;
  /** chosen weekdays (RRULE BYDAY codes) */
  days: WeekdayId[];
  /** HH:MM 24h start time */
  time: string;
  /** the 2-minute-rule "smallest version" */
  tiny: string;
}
