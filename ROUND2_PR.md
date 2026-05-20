## What this PR does
This PR turns SpendLens from a one-time audit into a live audit. Completed audits are now stored with the exact pricing snapshot used at the time, a server-side detection job can find when those saved audits are stale, affected users get a re-audit email, and the link in that email opens a diff page that compares the old audit against a fresh one.

## Why
The Round 1 version only helped at the moment the user clicked submit. That breaks down fast for AI tooling because pricing changes often enough that a saved recommendation can quietly become wrong. I assumed a user who trusted the first audit would want to know when the basis for that recommendation changed, instead of having to manually re-run the whole flow and guess whether anything important moved.

## How it works
1. When a user submits an audit, the app now stores the audit result, the original user input, the user email, the pricing snapshot, and a created timestamp in Firestore.
2. `/api/detect-changes` loads all saved audits, re-runs the deterministic audit engine against the current `pricingData`, and checks both direct price changes and audit-output changes.
3. Affected audits are grouped by user email so one user gets one consolidated email instead of one email per audit.
4. Each email explains what pricing changed, summarizes the effect on the saved audit, and links to `/audit/:id/diff`.
5. The diff page shows the old savings, the updated savings, the price deltas, and a tool-by-tool recommendation diff.

## What I cut
- I kept the trigger manual with `/api/detect-changes` instead of adding cron. The brief explicitly allows a manual trigger, and in 36 hours the safer trade-off was protecting the core detection + diff flow.
- I did not build unsubscribe links. That is a real product need, but it was lower value than proving the saved-audit, notification, and diff mechanics end-to-end.
- I did not add an admin UI for editing pricing or inspecting sent emails. Manual file edits plus redeploy are enough for this assignment.
- I did not add new automated tests for the server-side detection path. I chose to ship the end-to-end feature and document the testing gap honestly.

## How to test it manually
1. Open the deployed Round 2 URL.
2. Make sure `src/audit/pricingData.js` is on the original value you want to test with.
3. Submit a fresh audit with a real email address.
4. Change one of the relevant prices in `pricingData.js`.
5. Push the change so the deployment updates.
6. Trigger `GET` or `POST` on `/api/detect-changes`.
7. Check the JSON response for `affectedAudits`, `affectedUsers`, and `emailsSent`.
8. Open the email and click through to `/audit/:id/diff`.
9. Confirm the diff page shows old vs updated savings and the recommendation change for the affected tool.

Final preview verification on my branch returned:
- `affectedAudits: 5`
- `affectedUsers: 1`
- `emailsSent: 1`
- `sendFailures: 0`

## What's tested
- Existing audit engine tests still pass: `npm test`
- Lint passes for the new server route and diff page
- I manually tested the saved-audit flow, the detection route, and the diff page wiring on the deployed preview branch
- I did not add a mocked Firestore or mocked Resend test in this round

## Open questions / risks
- The pricing source of truth is still a local file. A bad edit to `pricingData.js` can trigger bad notifications, so an admin update flow with validation would be the next hardening step.
- The detection route currently relies on Firestore data and live Resend credentials, which makes it operationally useful but harder to test in isolation.
- Consolidated emails are grouped by user email, but without user accounts there is still no richer audit history or unsubscribe preference model.
