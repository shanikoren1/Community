# Become — Launch Setup (Shani's checklist)

The website is built. To make it fully live, do these steps. Each is small.
כל שלב מוסבר גם בעברית כדי שיהיה ברור לגמרי.

---

## 1. Playclub group chat link  (2 min)

Open `lib/config.ts` and replace the `PLAYCLUB_URL` value with the real entry link
to the community group chat.

```ts
export const PLAYCLUB_URL = "https://www.playclub.ai/<your-community-entry>";
```

**עברית:** זה הקישור לצ'אט הקבוצתי. כל הכפתורים "Join the group chat" / "Post my photo"
מובילים לשם. תחליפי את הכתובת הזמנית בקישור האמיתי של הקהילה ב-Playclub.

---

## 2. Google Sheet for sign-ups + check-ins  (10 min)

We write data to a Google Sheet using a tiny **Apps Script Web App** — no passwords or
API keys live in the website. Steps:

1. Create a new Google Sheet (name it e.g. `Become — Members`).
2. Add two tabs: **`joins`** and **`checkins`**.
3. In the Sheet menu: **Extensions → Apps Script**. Delete the sample code and paste:

```javascript
function doPost(e) {
  const body = JSON.parse(e.postData.contents);
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  if (body.type === "join") {
    const sheet = ss.getSheetByName("joins");
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["timestamp","firstName","email","identity","longTerm","focus1","focus2"]);
    }
    sheet.appendRow([body.timestamp, body.firstName, body.email, body.identity,
                     body.longTerm, body.focus1, body.focus2]);
  } else if (body.type === "checkin") {
    const sheet = ss.getSheetByName("checkins");
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["timestamp","goal","minutes"]);
    }
    sheet.appendRow([body.timestamp, body.goal, body.minutes]);
  }

  return ContentService.createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

4. Click **Deploy → New deployment → Web app**.
   - Execute as: **Me**
   - Who has access: **Anyone**
   - Copy the **Web app URL**.
5. Paste that URL into `lib/config.ts`:

```ts
export const SHEETS_WEBHOOK_URL = "https://script.google.com/macros/s/XXXX/exec";
```

**עברית:** יוצרים גיליון Google עם שתי לשוניות (`joins` ו-`checkins`), מדביקים את הסקריפט
למעלה ב-Apps Script, מפרסמים כ-Web App, ומדביקים את הקישור שמתקבל לתוך `lib/config.ts`.
מאותו רגע כל הרשמה וכל "צ'ק-אין" נכנסים אוטומטית לגיליון.

---

## 3. Email notifications (optional — already works)

`FORMSPREE_URL` is set to the existing Hastandart Formspree endpoint, so you'll get an
email on every new member. To use a separate inbox, create a new form at
[formspree.io](https://formspree.io) and paste its URL into `lib/config.ts`.

---

## 4. Deploy + subdomain  (15 min)

```bash
npm install
npm run build      # confirm it builds clean
```

Then deploy on Vercel (same account as hastandart.com):
1. Push this folder to a GitHub repo, import it in Vercel — OR run `vercel` from this folder.
2. In Vercel → the project → **Settings → Domains** → add `community.hastandart.com`.
3. Vercel shows a CNAME record — add it at your domain registrar / DNS. Propagation is
   usually minutes.

**עברית:** מעלים ל-Vercel (אותו חשבון של hastandart.com), מוסיפים דומיין
`community.hastandart.com`, ומוסיפים את רשומת ה-CNAME שוורסל נותן אצל ספק הדומיין.

---

## Done = live

- [ ] Playclub URL set
- [ ] Apps Script deployed + `SHEETS_WEBHOOK_URL` set
- [ ] `npm run build` passes
- [ ] Deployed to Vercel
- [ ] `community.hastandart.com` resolves
