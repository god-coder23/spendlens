## 2026-05-20 10:00 — Start
Read the Round 2 brief fully before touching code. The evaluation is much more about shipping a working feature and explaining trade-offs than about adding product polish. Decided to focus on the four required pieces only: persistence, change detection, notification email, and diff view.

## 2026-05-20 10:35 — Chose the backend path
My Round 1 app was basically frontend-only, so the first real choice was where to put server-side logic. I chose Vercel serverless functions because the app is already deployed there and it keeps the architecture small. Firestore from Round 1 stays the storage layer, Resend handles the one thing EmailJS cannot do safely here: send change emails from the server.

## 2026-05-20 11:20 — Saved audits working
Added `userEmail`, `pricingSnapshot`, and `createdAt` to the saved audit payload in `FormAISelect.jsx`. The useful part was not just storing the result JSON, but storing the exact inputs and price snapshot so the app can later explain what changed instead of only saying that something changed.

## 2026-05-20 12:10 — First detection route
Built the first version of `/api/detect-changes`. It could read stored audits, compare saved prices against current prices, and send a basic email. At this point the flow worked mechanically, but the email content was too thin and the route was still closer to “demo works” than “reviewer can trust the reasoning.”

## 2026-05-20 12:45 — Diff page added
Built `AuditDiff.jsx` and wired `/audit/:id/diff` into the router. The first pass showed price changes and old vs new savings totals, which was enough to prove the data flow, but not enough to clearly show recommendation changes.

## 2026-05-20 13:20 — CI and lint cleanup
Hit a couple of annoying issues after pushing: server-side env access and a React lint issue around state loading. Fixed those instead of suppressing the symptoms with hacks because this code will be read in the PR diff. I wanted the branch to look like an extension of Round 1, not like panic coding.

## 2026-05-20 19:10 — Local testing confusion
Lost time testing the change-detection route from plain localhost because Vite dev mode does not automatically mirror the deployed function setup the way I was assuming. That pushed me back toward verifying the server route through the deployed environment, which was the right call in hindsight.

## 2026-05-20 20:05 — Closed the real gaps
Compared the implementation back to the brief and found two important misses: I was effectively sending one email per audit instead of one consolidated email per user, and the diff page was not showing an actual recommendation diff. Reworked the route to group affected audits by email and rewrote the diff page to show old vs updated recommendation cards per tool.

## 2026-05-20 20:30 — Final pass
Ran lint and existing tests again. Cleaned up the Round 2 writeups so they match the implementation instead of describing an earlier version. At this point the core path is the one the rubric cares about: saved audit -> pricing change detection -> email -> diff view.

## 2026-05-20 21:40 — Preview-only blocker and final verification
The preview deployment still crashed even after the local code looked clean. Pulled the Vercel function logs and found the real issue: the serverless runtime could not resolve local ESM imports without explicit `.js` extensions. Fixed the import paths in the audit engine files, forced a fresh preview deployment, and re-ran `/api/detect-changes` on the preview URL. Final response showed `affectedAudits: 5`, `affectedUsers: 1`, `emailsSent: 1`, and `sendFailures: 0`, which confirmed the server-side detection and email path were working on the deployed branch, not just locally.
