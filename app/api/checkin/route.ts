import { SHEETS_WEBHOOK_URL } from "../../../lib/config";

interface CheckinPayload {
  goal: string;
  minutes: number;
  completedAt: string;
}

export async function POST(request: Request) {
  try {
    const data = (await request.json()) as CheckinPayload;
    if (!data.goal || !data.minutes) {
      return Response.json({ error: "Missing goal or minutes." }, { status: 400 });
    }

    // Log the completed focus session to the community Sheet (best-effort).
    if (SHEETS_WEBHOOK_URL) {
      try {
        await fetch(SHEETS_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "checkin",
            timestamp: data.completedAt || new Date().toISOString(),
            goal: data.goal,
            minutes: data.minutes,
          }),
        });
      } catch (e) {
        console.error("Checkin webhook failed:", e);
      }
    }

    return Response.json({ ok: true });
  } catch (err) {
    console.error("Checkin error:", err);
    return Response.json({ error: "Failed to log check-in." }, { status: 500 });
  }
}
