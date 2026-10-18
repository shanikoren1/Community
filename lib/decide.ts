/**
 * Decide — Essentialism-grounded decision logic (Greg McKeown).
 *
 * The user names a decision, sets three non-negotiable criteria, lists their real
 * options, and scores each option against each criterion (0-100). We apply the
 * spirit of McKeown's 90% Rule: "If it isn't a clear yes, then it's a clear no."
 * An option only counts as a clear yes if it clears the bar on ALL THREE
 * non-negotiables. If nothing clears all three, that clarity is itself the answer.
 */

export const CLEAR_YES = 80; // the bar, per criterion, for a "clear yes"

export interface OptionResult {
  name: string;
  scores: number[]; // per criterion, 0-100
  min: number;      // weakest non-negotiable
  avg: number;      // overall
  passes: boolean;  // clear yes on all three
}

export interface DecideResult {
  ranked: OptionResult[];
  winner: OptionResult | null;   // the precise choice, if one clears all three
  closest: OptionResult | null;  // best near-miss, when nothing clears all three
  noneClear: boolean;
}

export function evaluate(options: string[], scoreMatrix: number[][]): DecideResult {
  const results: OptionResult[] = options.map((name, i) => {
    const scores = scoreMatrix[i] ?? [];
    const min = scores.length ? Math.min(...scores) : 0;
    const avg = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
    return { name, scores, min, avg, passes: scores.length > 0 && scores.every((s) => s >= CLEAR_YES) };
  });

  const ranked = [...results].sort((a, b) => {
    if (a.passes !== b.passes) return a.passes ? -1 : 1;
    if (b.avg !== a.avg) return b.avg - a.avg;
    return b.min - a.min;
  });

  const passers = ranked.filter((r) => r.passes);
  const winner = passers.length ? passers[0] : null;
  const noneClear = passers.length === 0;
  const closest = noneClear
    ? [...results].sort((a, b) => b.min - a.min || b.avg - a.avg)[0] ?? null
    : null;

  return { ranked, winner, closest, noneClear };
}

/** A few of McKeown's ideas, in plain language, for the reveal. */
export const ESSENTIALIST_NOTES = {
  rule: "If it isn't a clear yes, then it's a clear no.",
  less: "The disciplined pursuit of less, but better.",
  tradeoff: "You cannot have it all. Choosing what matters most is the whole point.",
};

export const LIFE_AREAS = ["Career", "Relationships", "Where to live", "Health", "A project", "Money"];
