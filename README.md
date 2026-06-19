<div align="center">

<img src="public/logo.png" alt="Become" width="96" />

# Become

### The best time is now. Be a builder of your own life.

A goal based community where members turn habits into identity, built on the ideas in *Atomic Habits* by James Clear. A community of [Hastandart](https://hastandart.com).

</div>

---

## What it is

**Become** helps people stop "trying" and start *being*. You choose who you want to become, pick two habits to focus on for three weeks, schedule them, and show up every day with a community that cheers you on.

The daily loop:

1. **Show up** — your calendar tells you it is time.
2. **Take a photo** — proof that you showed up.
3. **Focus** — a timer runs for 20, 45 or 60 minutes.
4. **Get cheered on** — share it with the group and feel the reward.

## How it works for a member

1. Open the site and tap **Start now**.
2. **Survey:** pick long term goals, choose two main goals for the next three weeks, say who you want to become and why, set the days and times.
3. **Three actions to get in:**
   - Add your habits to your calendar (Google and Apple).
   - Join the WhatsApp group.
   - Join the group on PlayClub.
4. Each day, run a focus session at `/checkin` and share your photo proof in the chat.

## The Atomic Habits idea behind it

| Principle | In the product |
| --- | --- |
| Identity based habits | "I want to become someone who…" sets the frame |
| Systems over goals | Just two habits for a three week sprint |
| Make it obvious | Habits go straight into your calendar |
| Make it easy | Start small, pick only two goals |
| Make it satisfying | Photo proof, focus timer, group hype, visual reward |

## Tech

- [Next.js 16](https://nextjs.org) (App Router) + React 19
- TypeScript
- Tailwind CSS v4
- [lucide-react](https://lucide.dev) icons
- Deployed on [Vercel](https://vercel.com)

## Run it locally

```bash
npm install
npm run dev      # http://localhost:3000
```

Other commands:

```bash
npm run build    # production build
npm run start    # run the production build
npm run lint     # lint
```

## Project structure

```
app/
  page.tsx            landing page
  checkin/page.tsx    focus timer and daily check in
  api/join/route.ts   new member signup
  api/checkin/route.ts logs a completed focus session
components/
  JoinFlow.tsx        the join survey
  FocusTimer.tsx      timer + reward screen
lib/
  config.ts           all editable links and settings (start here)
  goals.ts            the habit menu
  calendar.ts         Google Calendar and .ics generation
public/
  logo.png, mountain-hero.png
```

## Configuration

Everything you might change lives in [`lib/config.ts`](lib/config.ts): community name, the WhatsApp and PlayClub links, the podcast and audiobook links, and where signups are stored. See [`COMMUNITY_SETUP.md`](COMMUNITY_SETUP.md) for the launch checklist, including the optional Google Sheet for signups.

## Roadmap

- Per member calendar sync (one tap, no manual add)
- In app photo storage and a streaks dashboard
- Leaderboards and automated chat encouragement

---

<div align="center">
Built with care for the Hastandart community. 2026.
</div>
