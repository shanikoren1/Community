# HANDOFF — Become (Hastandart Community)

_Last updated: 2026-06-18_

## What this is
**Become** — a goal-based community web app grounded in *Atomic Habits*. Members turn habits into identity, pick 2 focus goals for a 3-week sprint, schedule them, and run a daily loop: show up → photo proof → focus timer → group hype → reward. Lives at `C:\Users\shani.koren\projects\hastandart-community`. Target domain: community.hastandart.com.

## Goals accomplished this session
- Scaffolded a Next.js 16 + Tailwind v4 project (mirrors `projects/hastandart` stack).
- Built the full V1: landing page, interactive Join survey (identity → long-term menu → exactly-2 cap → schedule → calendar invites), focus-timer check-in with reward animation, two API routes.
- Wired the real Playclub link: `https://www.playclub.ai/join/become?code=FC9A8D`.
- Community named **Become** (chosen by Shani).
- `npm run build` passes clean; dev server serves `/` and `/checkin` at HTTP 200; API validation verified.
- Wrote `CLAUDE.md` + `COMMUNITY_SETUP.md` (incl. Google Apps Script for the Sheet).

## What worked
- Reusing the Hastandart design tokens + SurveyModal/Formspree patterns made the build fast.
- The 2-goal hard cap, calendar `.ics`/Google URL generation, and timer reward all function.

## What's changing next (Shani's feedback 2026-06-18)
1. **Visual redesign** — move AWAY from the Hastandart "standard" look. Base the design on the **two HAI inspiration websites** Shani will provide (URLs not yet captured — pending).
2. **Landing page** — add a section that summarizes the critical points of *Atomic Habits* (why it matters, that it's a proven method). This belongs on the LANDING, not inside the survey.
3. **Survey** — make it more interactive and **image-rich**, inspired by the Playclub app. The Atomic Habits summary must NOT appear during the survey.

## Exact next steps
1. Get the two HAI inspiration URLs from Shani → rework visual direction.
2. Add the "Atomic Habits in 90 seconds" section to `app/page.tsx`.
3. Redesign `components/JoinFlow.tsx` goal selection as image cards (Playclub-style).
4. Shani: deploy the Apps Script Sheet + set `SHEETS_WEBHOOK_URL` in `lib/config.ts`.
5. Shani: push to GitHub + deploy to Vercel + add `community.hastandart.com` (see `COMMUNITY_SETUP.md`).

## Deferred (V2 "connector")
Per-user Google Calendar OAuth · in-app photo storage · streaks/leaderboards/rewards DB · automated chat hype.

## Key files
`lib/config.ts` (all editable settings) · `components/JoinFlow.tsx` · `components/FocusTimer.tsx` · `app/page.tsx` · `app/checkin/page.tsx` · `lib/goals.ts` · `lib/calendar.ts`
