# Architecture

## System diagram

```mermaid
flowchart TD
    A[Visitor lands on marketing page] --> B[React Router]
    B --> C[/ route]
    B --> D[/audit route]
    B --> E[/audit/:audit route]

    D --> F[FormAISelect]
    F --> G[Normalize tool inputs]
    G --> H[Rule-based audit engine]
    H --> I[pricingData.js]
    H --> J[rules.js]
    H --> K[generateAudit.js]

    G --> L[generateSummary.js]
    L --> M[Gemini model API]
    M --> N[Summary text or fallback summary]

    H --> O[Audit result object]
    N --> O
    O --> P[React Router navigate with state]
    P --> E
    E --> Q[AuditResultHero]
    Q --> R[Share link]
    Q --> S[EmailJS send report]
```

## Data flow

1. The user lands on `/` and clicks through to `/audit`.
2. `FormAISelect.jsx` lets the user choose AI tools and configure a plan, seat count, optional monthly spend, and usage tags for each selected tool.
3. On submit, the form normalizes those entries into a single `userInput` object with:
   - `tools`
   - derived `teamSize`
   - derived primary `useCase`
   - optional free-text context
4. `generateAudit()` loops over the selected tools and delegates each one to a specific rule evaluator in `src/audit/rules.js`.
5. Each rule compares the entered plan and spend against the hardcoded catalog prices in `src/audit/pricingData.js` and returns either:
   - no recommendation, or
   - a recommendation with current spend, optimized spend, monthly savings, annual savings, reason, and confidence
6. `generateAudit()` aggregates all recommendations into a single audit result with total monthly savings, total annual savings, and a low-savings flag.
7. `generateSummary()` sends the recommendations and totals to Gemini and asks for a short personalized audit paragraph. If that fails, the UI falls back to a generic summary.
8. The app navigates to `/audit/:auditId` and passes `userInput` and `auditResult` through router state.
9. `AuditResultHero.jsx` renders the result cards, breakdowns, summary, share link, and email send action.

## Why I chose this stack

- `React`: enough structure to build a multi-step product flow quickly without locking the project into heavier conventions.
- `Vite`: fastest way to get a polished frontend running and deployed with minimal configuration.
- `Tailwind CSS v4`: useful for rapidly iterating on visual polish, spacing, and responsive layout during a short assignment window.
- `react-router-dom`: simple route-based separation between landing page, audit form, and result page.
- `@google/genai`: a straightforward way to add the one required AI-powered feature without making the pricing logic depend on a model.
- `EmailJS`: a quick transactional-email stopgap while the backend is still missing.

## Current architectural limitations

- Audit data is not persisted anywhere durable. The result page only works when route state is present.
- The LLM call currently runs from the client and exposes a secret in source code, which is not acceptable for production.
- Lead capture is not stored in a real database yet.
- Open Graph previews are not generated from stored audit records yet.
- Rate limiting and abuse protection are not implemented yet.
- The audit rules only cover a subset of the full product logic described in the assignment.

## What I would change for 10k audits/day

- Move audit creation to a backend API so the frontend only submits normalized form data.
- Store audits and lead submissions in a real database such as Supabase Postgres.
- Persist result payloads by `auditId` so public share URLs work on refresh and can power OG tags.
- Move summary generation behind a server endpoint with queueing, retries, and per-provider timeout handling.
- Cache pricing data centrally and version it so pricing logic can be audited and updated safely.
- Add server-side rate limiting, bot protection, and basic fraud checks on email capture.
- Add analytics events for form completion, result views, lead conversion, and share opens.
- Add a dedicated test suite around the audit engine and a CI gate before deploy.
