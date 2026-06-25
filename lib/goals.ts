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
  identity: string;
  icon: LucideIcon;
}

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
  firstStepHe: string;
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
    firstStepHe: "לבש/י בגדי ספורט ברגע שאת/ה קם/קמה. זה הצעד היחיד שנדרש ממך.",
    askTimePreference: true,
  },
  running: {
    duration: 60,
    defaultDays: ["MO", "WE", "FR"],
    defaultTime: "07:00",
    morningTime: "07:00",
    eveningTime: "20:00",
    firstStepHe: "שרוך/י נעליים וצא/צאי החוצה. רוץ/י 10 דקות בלבד.",
    askTimePreference: true,
  },
  walking: {
    duration: 30,
    defaultDays: ["MO", "TU", "WE", "TH", "FR", "SA", "SU"],
    defaultTime: "08:00",
    morningTime: "08:00",
    eveningTime: "19:00",
    firstStepHe: "לך/י סביב הבניין מיד אחרי הארוחה הראשונה.",
  },
  gym: {
    duration: 60,
    defaultDays: ["MO", "WE", "FR"],
    defaultTime: "09:00",
    morningTime: "07:00",
    eveningTime: "20:00",
    firstStepHe: "נסע/סעי לחדר הכושר. מספיק סט אחד.",
    askTimePreference: true,
  },
  reading: {
    duration: 20,
    defaultDays: ["MO", "TU", "WE", "TH", "FR", "SA", "SU"],
    defaultTime: "22:00",
    morningTime: "07:30",
    eveningTime: "22:00",
    firstStepHe: "קרא/י עמוד אחד לפני שמכבים אור.",
  },
  meditate: {
    duration: 10,
    defaultDays: ["MO", "TU", "WE", "TH", "FR", "SA", "SU"],
    defaultTime: "07:00",
    morningTime: "07:00",
    eveningTime: "21:00",
    firstStepHe: "שב/י בשקט 2 דקות מיד עם הקימה. ושוב בלילה לפני השינה.",
  },
  water: {
    duration: 5,
    defaultDays: ["MO", "TU", "WE", "TH", "FR", "SA", "SU"],
    defaultTime: "09:00",
    morningTime: "09:00",
    eveningTime: "09:00",
    firstStepHe: "מלא/י בקבוק 1 ליטר לפני שיוצאים מהמטבח בבוקר. המטרה: 2 ליטר ביום.",
    isReminder: true,
  },
  eat: {
    duration: 10,
    defaultDays: ["MO", "TU", "WE", "TH", "FR", "SA", "SU"],
    defaultTime: "18:00",
    morningTime: "08:00",
    eveningTime: "18:00",
    firstStepHe: "הכן/הכיני פריט בריא אחד לארוחת הבוקר של מחר, הערב.",
    isReminder: true,
  },
  sleep: {
    duration: 15,
    defaultDays: ["MO", "TU", "WE", "TH", "FR", "SA", "SU"],
    defaultTime: "23:00",
    morningTime: "23:00",
    eveningTime: "23:00",
    firstStepHe: "הגדר/י אזעקת טלפון 30 דקות לפני שעת השינה שבחרת.",
    isReminder: true,
  },
  yoga: {
    duration: 20,
    defaultDays: ["MO", "TU", "TH", "SA"],
    defaultTime: "07:30",
    morningTime: "07:30",
    eveningTime: "19:00",
    firstStepHe: "פתח/י מחצלת ועשה/י 5 דקות מתיחות.",
  },
  journal: {
    duration: 10,
    defaultDays: ["MO", "TU", "WE", "TH", "FR", "SA", "SU"],
    defaultTime: "21:00",
    morningTime: "07:30",
    eveningTime: "21:00",
    firstStepHe: "כתוב/י 5 דברים שאת/ה מודה עליהם.",
  },
  writing: {
    duration: 25,
    defaultDays: ["MO", "TU", "WE", "TH", "FR", "SA", "SU"],
    defaultTime: "17:00",
    morningTime: "08:00",
    eveningTime: "17:00",
    firstStepHe: "כתוב/י פסקה אחת על כל נושא, בלי לערוך.",
  },
  podcast: {
    duration: 60,
    defaultDays: ["MO", "TU", "WE", "TH", "FR", "SA", "SU"],
    defaultTime: "08:30",
    morningTime: "08:30",
    eveningTime: "19:00",
    firstStepHe: "בחר/י פרק אחד ותאזין/י בנסיעה הבאה. רוצה המלצות? בדוק/י את הקבוצה בפלייקלאב.",
  },
  savings: {
    duration: 10,
    defaultDays: ["SU"],
    defaultTime: "10:00",
    morningTime: "10:00",
    eveningTime: "10:00",
    firstStepHe: "הגדר/י העברה אוטומטית של ₪50 לחיסכון.",
    isReminder: true,
  },
  language: {
    duration: 15,
    defaultDays: ["MO", "TU", "WE", "TH", "FR", "SA", "SU"],
    defaultTime: "13:00",
    morningTime: "08:00",
    eveningTime: "13:00",
    firstStepHe: "עשה/י שיעור Duolingo אחד או למד/י 5 מילים חדשות.",
  },
  instrument: {
    duration: 20,
    defaultDays: ["MO", "TU", "WE", "TH", "FR", "SA", "SU"],
    defaultTime: "17:00",
    morningTime: "08:00",
    eveningTime: "17:00",
    firstStepHe: "שב/י עם הכלי ונגן/י שיר אחד או כמה.",
  },
  ai: {
    duration: 30,
    defaultDays: ["MO", "TU", "WE", "TH"],
    defaultTime: "16:00",
    morningTime: "09:00",
    eveningTime: "16:00",
    firstStepHe: "פתח/י כלי ובנה/י פרויקט קטן בתוך 20 דקות.",
  },
  sauna: {
    duration: 15,
    defaultDays: ["TU", "TH"],
    defaultTime: "19:00",
    morningTime: "08:00",
    eveningTime: "19:00",
    firstStepHe: "קבע/י את הסאונה הבאה עכשיו בלוח הזמנים.",
  },
};
