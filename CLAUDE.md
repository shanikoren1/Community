# CLAUDE.md — Become (Hastandart Community)

Guidance for Claude Code when working in this repo.

## Project

**Become** — a goal-based community where members turn habits into identity, grounded in *Atomic Habits*. Lives at **community.hastandart.com** (subdomain of hastandart.com, deployed on Vercel). A sibling of `projects/hastandart` and reuses its design language.

## The product in one paragraph

A member clicks **Join** → interactive survey: declares the identity they're becoming → picks long-term goals → narrows to **exactly 2** short-term focus goals for a **3-week sprint** → schedules each (days + time + the 2-minute-rule "tiny version") → gets one-tap **calendar invites** (Google URL + `.ics`) → joins the **playclub group chat**. The daily loop: show up → photo proof → **focus timer** → group hype → **visual reward**. The reward + check-in lives at `/checkin`.

## Atomic Habits → code map

- Identity-based habits → the survey opens with "I am becoming someone who…"; each goal carries an `identity` string (`lib/goals.ts`).
- Systems over goals → short-term is hard-capped at 2 (`JoinFlow.tsx`, `toggleFocus`).
- Law 1 Obvious → calendar invites (`lib/calendar.ts`).
- Law 3 Easy → 2-minute "tiny version" field.
- Law 4 Satisfying → `FocusTimer.tsx` reward screen + confetti + chat share.

## Important: Next.js 16

Breaking changes vs older Next. Read `node_modules/next/dist/docs/` before writing Next-specific code.

## Dev commands

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
npm run lint
```

## Architecture

- `app/layout.tsx` — Outfit + Inter fonts, metadata.
- `app/page.tsx` — landing (hero, manifesto, the loop, audiobook, CTA). Opens `JoinFlow` modal.
- `app/checkin/page.tsx` — focus-timer check-in flow.
- `components/JoinFlow.tsx` — the multi-step survey (identity → long-term → 2-goal cap → schedule → contact → calendar+chat).
- `components/FocusTimer.tsx` — timer ring + reward screen + confetti.
- `lib/config.ts` — **EDIT HERE**: site name/tagline, playclub URL, audiobook URL, Sheets webhook, Formspree.
- `lib/goals.ts` — the long-term goal menu + types.
- `lib/calendar.ts` — Google Calendar URL + `.ics` generation (no OAuth).
- `app/api/join/route.ts` — join → Sheets webhook + Formspree notification.
- `app/api/checkin/route.ts` — completed focus session → Sheets webhook.

## Design rules (inherited from Hastandart)

- Tailwind v4 (`@import "tailwindcss"` + `@theme` in `globals.css`, no config file).
- Colors: bg `#041A2A` / card `#0A2540`; light `#F8F9FC` / `#EEF2FF`; signature gradient `linear-gradient(135deg, #46CAC0 0%, #2184F9 60%, #5925DC 100%)`.
- Fonts: Outfit (headings, 700/900) + Inter (body).
- `rounded-full` buttons; hover `-translate-y-1`; teal glow `0 6px 30px rgba(70,202,192,0.35)`.
- Pure CSS motion (no animation library). Icons via `lucide-react`.

## Open items before launch

See `COMMUNITY_SETUP.md`. Short version: set `PLAYCLUB_URL` + deploy the Apps Script Sheet and set `SHEETS_WEBHOOK_URL` in `lib/config.ts`.
