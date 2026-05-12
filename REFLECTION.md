
---

# REFLECTION.md

```md
# Reflection

## 1. The hardest bug I hit this week, and how I debugged it

The hardest bug was related to the audit results page disappearing after a browser refresh. Initially the feature looked complete because the audit page worked correctly when navigating from the form flow. But when I copied the URL into a new tab or refreshed the page, the audit data disappeared and the UI fell back to an error state.

My first assumption was that the route parameter itself was broken. I checked the audit ID generation logic and verified that the route path was being constructed correctly. After tracing the navigation flow more carefully, I realized the issue was architectural rather than visual: the page depended entirely on `react-router-dom` route state. The audit result existed only in memory after navigation and was never persisted anywhere durable.

The thing that exposed the problem clearly was testing the app like a real user instead of a developer. A normal user would refresh, reopen, or share the link immediately. Once I tested those flows, the issue became obvious.

I had already initialized Firebase and Firestore in the project, but I had not yet completed the write-and-fetch flow for audit persistence. The short-term fix was improving the fallback UI so the page failed gracefully. The proper fix is storing audits by `auditId` and hydrating the page from Firestore on load. That became the highest-priority backend task after the core frontend flow was stable.

---

## 2. A decision I reversed mid-week, and what made me reverse it

The biggest decision I reversed was how much of the recommendation engine should rely on AI-generated reasoning. My first instinct was to let the language model handle more of the optimization logic because the assignment revolves around AI tooling and personalized recommendations.

After rereading the assignment more carefully, I realized that was the wrong direction. The prompt repeatedly emphasizes that the audit logic itself should be defensible and rule-based, and that understanding when not to use AI is part of the evaluation.

That changed the architecture of the app significantly. I moved the pricing and recommendation logic into deterministic rules inside the audit engine. Each rule compares plans, seats, and estimated usage against pricing data collected from official vendor pages. The LLM is used only for generating the short personalized summary layer after the calculations are already complete.

That reversal improved the product in two ways. First, the recommendations became easier to explain and validate. A reviewer can inspect the logic directly instead of trusting a black-box response from a model. Second, the failure mode became much safer. If the model fails or rate-limits, the audit itself still works and only the summary falls back to a template.

In hindsight this was the right trade-off. The core value of the product is trustworthy recommendations, not sounding intelligent.

---

## 3. What I would build in week 2 if I had it

If I had a second week, I would focus less on adding new frontend features and more on making the product production-ready.

The first priority would be finishing backend persistence properly. Right now the product generates unique audit URLs, but the share flow still depends too heavily on route state. I would fully persist audits in Firestore and hydrate public result pages directly from the database. That would also enable proper Open Graph previews and make the sharing loop work reliably.

The second priority would be improving pricing fidelity and recommendation depth. The current pricing catalog works well for the MVP, but I would expand the rules engine to support more edge cases, more API pricing scenarios, and better optimization logic for mixed-team usage patterns.

The third priority would be operational tooling. I would move all model calls behind server-side endpoints, add proper rate limiting, add transactional email infrastructure, and instrument analytics around audit completion, sharing, and consultation conversions.

I would also complete the automated test suite described in `TESTS.md`, especially around pricing logic and edge-case calculations. The audit engine is the highest-risk part of the application, so that is where the strongest test coverage belongs.

---

## 4. How I used AI tools

I used AI tools primarily as accelerators for implementation speed, copy refinement, and UI iteration rather than as decision-makers. The main tools I used were ChatGPT, Codex, and Cursor.

I used them to brainstorm naming ideas, improve landing-page copy, speed up React component implementation, and pressure-test whether sections of the UI felt too generic or unclear. They were especially useful for helping restructure copy into cleaner user-facing language and reducing time spent on repetitive frontend work.

What I did not trust AI with was the actual audit reasoning. The pricing recommendations are intentionally rule-based because pricing logic needs to be inspectable and defensible. I cross-checked pricing information manually against official vendor pricing pages instead of trusting generated responses.

One specific case where the AI was wrong was during an early Gemini integration attempt. The generated code left the API key directly in the source file instead of using environment variables properly. It also introduced an unused import that remained in the project after the integration path changed. I only caught both issues during a manual review pass.

That experience reinforced something important for me during this project: AI is very useful for acceleration, but it is unreliable as a final reviewer. I treated it as a collaborator, not as a source of truth.

---

## 5. Self-rating

### Discipline — 7/10

I worked consistently across multiple days, maintained a running devlog, and shipped a working end-to-end product within the assignment window. The biggest gap was underestimating the remaining backend work around persistence.

### Code quality — 6/10

The audit engine and UI structure are reasonably clean and separated well enough for an MVP, but there are still rough edges, unfinished infrastructure work, and places where refactoring would improve maintainability.

### Design sense — 7/10

I spent deliberate time on hierarchy, readability, and making the result page feel shareable rather than dashboard-like. The product feels more like a startup landing flow than a school project, although responsiveness and polish could still improve.

### Problem-solving — 7/10

The strongest technical decision was recognizing that deterministic pricing logic mattered more than maximizing AI usage. Catching the route-state persistence issue by simulating real user behavior was another useful lesson during debugging.

### Entrepreneurial thinking — 8/10

I approached the assignment as a lead-generation product rather than only a coding task. The flow is designed to provide immediate value first, surface savings clearly, and create a natural bridge into consultation or future conversion.