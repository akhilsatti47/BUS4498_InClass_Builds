# Handoff for Purajit

## What works now

The public [Club Event Radar website](https://akhilsatti47.github.io/BUS4498_InClass_Builds/event_radar/) accepts club announcements and optional JPG or PNG flyers. The Supabase Edge Function `submit-event` uses AI to make an event card, apply posting rules, and catch duplicates; posts with flyers or issues wait for moderator review. A moderator can sign in, approve or reject waiting posts, and approved events appear on the public board.

## Where things live

- **GitHub repository:** `akhilsatti47/BUS4498_InClass_Builds` (folder: `event_radar/`).
- **Supabase project:** `event-radar` — Project URL: https://isebqtcvcwzdudsraabi.supabase.co
- **Website files:** `index.html`, `app.js`, `style.css`, and `config.js`. The URL and public publishable key are in `config.js`.
- **Backend:** `supabase/migrations/` contains the database changes; `supabase/functions/submit-event/index.ts` is the AI agent. The database table is `public.events`, and flyer images are in the `flyers` storage bucket.
- **Reference material:** `context/posting-rules.md`, `context/campus-places.md`, and `test/sample-announcements.md`.

## Secrets

The AI key is named `ANTHROPIC_API_KEY` and is set in Supabase → Edge Functions → Secrets. The agent also reads `SUPABASE_SECRET_KEYS` (using its `default` entry) for database access, with `SUPABASE_SERVICE_ROLE_KEY` as a fallback. These are names only; Purajit does not need the secret values. Never put secret values in this repository or share them in chat.

## How to test

Use the builder’s checks: **Check the database**, **Check the agent**, and **Check sign-ups** should pass. Submit Post A from `test/sample-announcements.md`; it should publish when its date is within the next 60 days. Submit Post C after A; it should report “Already posted.” Send the sample flyer with its announcement; it should wait for review, then appear on the board with its photo after a moderator approves it. Update sample dates when they are no longer within the next 60 days.

## What’s next

Confirm the GitHub Pages site shows the latest version after each upload, and test moderator sign-in and flyer approval. Keep new sign-ups turned off so only the intended moderator accounts can review posts. A possible follow-up is the optional nightly clean-up that archives past events.

## How we take turns

Before starting, pull the latest changes from GitHub Desktop and tell each other you’re working on the project. When finished, upload your changes with GitHub Desktop and let the other person know. Avoid editing the same files at the same time.
