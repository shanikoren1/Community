import {
  Languages,
  Dumbbell,
  Brain,
  BookOpen,
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
  identity: string;
  icon: LucideIcon;
}

export const GOAL_OPTIONS: GoalOption[] = [
  { id: "workout", label: "Work out", identity: "trains their body", icon: Dumbbell },
  { id: "running", label: "Running", identity: "runs", icon: Zap },
  { id: "reading", label: "Read books", identity: "reads every day", icon: BookOpen },
  { id: "meditate", label: "Meditate", identity: "sits with a calm mind", icon: Brain },
  { id: "water", label: "Drink water", identity: "stays hydrated", icon: Droplet },
  { id: "eat", label: "Eat healthy", identity: "fuels their body well", icon: Apple },
  { id: "sleep", label: "Better sleep", identity: "protects their sleep", icon: Moon },
  { id: "journal", label: "Journaling", identity: "reflects every day", icon: NotebookPen },
  { id: "writing", label: "Writing", identity: "writes their thoughts", icon: PenLine },
  { id: "savings", label: "Save money", identity: "is smart with money", icon: PiggyBank },
  { id: "language", label: "Learn a language", identity: "speaks a new language", icon: Languages },
  { id: "ai", label: "Create with AI", identity: "builds with AI", icon: Sparkles },
];

export function goalById(id: string): GoalOption | undefined {
  return GOAL_OPTIONS.find((g) => g.id === id);
}

export const WEEKDAYS = [
  { id: "SU", label: "ראשון" },
  { id: "MO", label: "שני" },
  { id: "TU", label: "שלישי" },
  { id: "WE", label: "רביעי" },
  { id: "TH", label: "חמישי" },
  { id: "FR", label: "שישי" },
  { id: "SA", label: "שבת" },
] as const;

export type WeekdayId = (typeof WEEKDAYS)[number]["id"];

export interface FocusGoal {
  goalId: string;
  customLabel?: string;
  minutes: number;
  days: WeekdayId[];
  time: string;
  tiny: string;
}

export interface FirstStep {
  duration: number;
  defaultDays: WeekdayId[];
  defaultTime: string;
  morningTime: string;
  eveningTime: string;
  firstStep: string;
  isReminder?: boolean;
  askTimePreference?: boolean;
}

export const FIRST_STEPS: Record<string, FirstStep> = {
  workout: {
    duration: 60,
    defaultDays: ["MO", "WE", "FR"],
    defaultTime: "09:00",
    morningTime: "07:00",
    eveningTime: "20:00",
    firstStep: "Put on your workout clothes the moment you wake up. That's the only step required.",
    askTimePreference: true,
  },
  running: {
    duration: 60,
    defaultDays: ["MO", "WE", "FR"],
    defaultTime: "07:00",
    morningTime: "07:00",
    eveningTime: "20:00",
    firstStep: "Lace up your shoes and step outside. Run for just 10 minutes.",
    askTimePreference: true,
  },
  walking: {
    duration: 30,
    defaultDays: ["MO", "TU", "WE", "TH", "FR", "SA", "SU"],
    defaultTime: "08:00",
    morningTime: "08:00",
    eveningTime: "19:00",
    firstStep: "Walk around the block right after your first meal.",
  },
  gym: {
    duration: 60,
    defaultDays: ["MO", "WE", "FR"],
    defaultTime: "09:00",
    morningTime: "07:00",
    eveningTime: "20:00",
    firstStep: "Show up at the gym. One set is enough.",
    askTimePreference: true,
  },
  reading: {
    duration: 20,
    defaultDays: ["MO", "TU", "WE", "TH", "FR", "SA", "SU"],
    defaultTime: "22:00",
    morningTime: "07:30",
    eveningTime: "22:00",
    firstStep: "Read one page before turning off the light.",
  },
  meditate: {
    duration: 10,
    defaultDays: ["MO", "TU", "WE", "TH", "FR", "SA", "SU"],
    defaultTime: "07:00",
    morningTime: "07:00",
    eveningTime: "21:00",
    firstStep: "Sit in silence for 2 minutes right after waking up. Repeat at night before sleep.",
  },
  water: {
    duration: 5,
    defaultDays: ["MO", "TU", "WE", "TH", "FR", "SA", "SU"],
    defaultTime: "09:00",
    morningTime: "09:00",
    eveningTime: "09:00",
    firstStep: "Fill a 1-liter bottle before leaving the kitchen in the morning. Goal: 2 liters a day.",
    isReminder: true,
  },
  eat: {
    duration: 10,
    defaultDays: ["MO", "TU", "WE", "TH", "FR", "SA", "SU"],
    defaultTime: "18:00",
    morningTime: "08:00",
    eveningTime: "18:00",
    firstStep: "Tonight, prep one healthy item for tomorrow's breakfast.",
    isReminder: true,
  },
  sleep: {
    duration: 15,
    defaultDays: ["MO", "TU", "WE", "TH", "FR", "SA", "SU"],
    defaultTime: "23:00",
    morningTime: "23:00",
    eveningTime: "23:00",
    firstStep: "Set a phone alarm 30 minutes before your chosen bedtime.",
    isReminder: true,
  },
  yoga: {
    duration: 20,
    defaultDays: ["MO", "TU", "TH", "SA"],
    defaultTime: "07:30",
    morningTime: "07:30",
    eveningTime: "19:00",
    firstStep: "Unroll your mat and do 5 minutes of stretching.",
  },
  journal: {
    duration: 10,
    defaultDays: ["MO", "TU", "WE", "TH", "FR", "SA", "SU"],
    defaultTime: "21:00",
    morningTime: "07:30",
    eveningTime: "21:00",
    firstStep: "Write 5 things you're grateful for.",
  },
  writing: {
    duration: 25,
    defaultDays: ["MO", "TU", "WE", "TH", "FR", "SA", "SU"],
    defaultTime: "17:00",
    morningTime: "08:00",
    eveningTime: "17:00",
    firstStep: "Write one paragraph on any topic. No editing.",
  },
  podcast: {
    duration: 60,
    defaultDays: ["MO", "TU", "WE", "TH", "FR", "SA", "SU"],
    defaultTime: "08:30",
    morningTime: "08:30",
    eveningTime: "19:00",
    firstStep: "Pick one episode and listen on your next commute.",
  },
  savings: {
    duration: 10,
    defaultDays: ["SU"],
    defaultTime: "10:00",
    morningTime: "10:00",
    eveningTime: "10:00",
    firstStep: "Set up an automatic transfer of $50 to savings.",
    isReminder: true,
  },
  language: {
    duration: 15,
    defaultDays: ["MO", "TU", "WE", "TH", "FR", "SA", "SU"],
    defaultTime: "13:00",
    morningTime: "08:00",
    eveningTime: "13:00",
    firstStep: "Do one Duolingo lesson or learn 5 new words.",
  },
  instrument: {
    duration: 20,
    defaultDays: ["MO", "TU", "WE", "TH", "FR", "SA", "SU"],
    defaultTime: "17:00",
    morningTime: "08:00",
    eveningTime: "17:00",
    firstStep: "Pick up your instrument and play one song.",
  },
  ai: {
    duration: 30,
    defaultDays: ["MO", "TU", "WE", "TH"],
    defaultTime: "16:00",
    morningTime: "09:00",
    eveningTime: "16:00",
    firstStep: "Open an AI tool and build something small in 20 minutes.",
  },
  sauna: {
    duration: 15,
    defaultDays: ["TU", "TH"],
    defaultTime: "19:00",
    morningTime: "08:00",
    eveningTime: "19:00",
    firstStep: "Schedule your next sauna session right now.",
  },
};
