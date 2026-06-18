/**
 * Central config for the community site.
 * EDIT THESE when Shani provides the real values — nothing else needs to change.
 */

export const SITE = {
  name: "Become",
  // The community is a wing of Hastandart, living on community.hastandart.com
  parentBrand: "Hastandart",
  tagline: "The best time is now.",
  subTagline: "Be a builder of your own life.",
  sprintWeeks: 3,
};

/**
 * The three "get in" actions after the survey.
 *
 * WHATSAPP_URL: the community WhatsApp group invite link.
 *   TODO(Shani): paste your WhatsApp group link (looks like https://chat.whatsapp.com/XXXX).
 *   Until set, the WhatsApp action is hidden so nothing links to a dead URL.
 *
 * PLAYCLUB_URL: the dedicated PlayClub group invite.
 */
export const WHATSAPP_URL = "";
export const PLAYCLUB_URL = "https://www.playclub.ai/join/become?code=FC9A8D";

/**
 * Atomic Habits on Spotify. Podcast (the show) comes first, audiobook second.
 */
export const PODCAST_URL = "https://open.spotify.com/show/1IoRb7aM7p7tKObpxpf6TO";
export const AUDIOBOOK_URL = "https://open.spotify.com/episode/2FNSkBN1muPkO88xtXN1Sm";

/**
 * Where join + check-in data is stored.
 *
 * SHEETS_WEBHOOK_URL: a Google Apps Script Web App bound to the community
 *   Google Sheet that appends a row on POST. See COMMUNITY_SETUP.md for the
 *   exact script + deploy steps. Leave "" until deployed — the app still works
 *   (it just relies on the Formspree notification below).
 *
 * FORMSPREE_URL: email notification so Shani gets pinged on every join.
 *   Reuses the existing Hastandart Formspree endpoint by default.
 */
export const SHEETS_WEBHOOK_URL = "";
export const FORMSPREE_URL = "https://formspree.io/f/mkokewkq";
