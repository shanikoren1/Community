import { SHEETS_WEBHOOK_URL, FORMSPREE_URL } from "../../../lib/config";

interface JoinPayload {
  firstName: string;
  email: string;
  identity: string;
  longTerm: string[];
  focus: {
    title: string;
    minutes: number;
    days: string[];
    time: string;
    tiny: string;
  }[];
}

export async function POST(request: Request) {
  try {
    const data = (await request.json()) as JoinPayload;

    if (!data.email || !data.firstName || !data.focus || data.focus.length !== 2) {
      return Response.json(
        { error: "Name, email, and exactly 2 focus goals are required." },
        { status: 400 }
      );
    }

    const row = {
      timestamp: new Date().toISOString(),
      firstName: data.firstName,
      email: data.email,
      identity: data.identity,
      longTerm: data.longTerm.join(", "),
      focus1: data.focus[0]
        ? `${data.focus[0].title} · ${data.focus[0].minutes}min · ${data.focus[0].days.join("/")} @ ${data.focus[0].time}`
        : "",
      focus2: data.focus[1]
        ? `${data.focus[1].title} · ${data.focus[1].minutes}min · ${data.focus[1].days.join("/")} @ ${data.focus[1].time}`
        : "",
    };

    // 1) Append a row to the community Google Sheet (via Apps Script Web App).
    if (SHEETS_WEBHOOK_URL) {
      try {
        await fetch(SHEETS_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "join", ...row }),
        });
      } catch (e) {
        console.error("Sheets webhook failed:", e);
        // non-fatal — we still notify by email below
      }
    }

    // 2) Email notification to Shani so no signup is missed.
    if (FORMSPREE_URL) {
      await fetch(FORMSPREE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          email: data.email,
          _replyto: data.email,
          _subject: `New Builder: ${data.firstName}`,
          Name: data.firstName,
          Identity: data.identity,
          "Long-term goals": row.longTerm,
          "Focus goal 1": row.focus1,
          "Focus goal 2": row.focus2,
        }),
      });
    }

    return Response.json({ ok: true });
  } catch (err) {
    console.error("Join error:", err);
    return Response.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
