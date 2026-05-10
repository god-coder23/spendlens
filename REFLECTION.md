# Reflection

## 1. The hardest bug I hit this week, and how I debugged it

The hardest bug was not a crashing error. It was a product bug hidden inside the routing model: the audit result page looked correct when I navigated to it from the form, but the data disappeared on refresh because the page depended entirely on `react-router-dom` navigation state. At first I treated it like a rendering problem because the UI fell back to an “Audit data not found” state. My first hypothesis was that I had a mismatch in the route param or that the audit ID was not being passed correctly. I traced the navigation from `FormAISelect.jsx` into `/audit/:audit` and confirmed that the route param itself was fine.

The next hypothesis was that I was generating the result correctly but not storing it anywhere durable. I checked `navigate()` and saw that I was only passing `auditResult` and `userInput` through `location.state`. That explained why the page worked in-session and failed after refresh or when opened from a copied link: the URL looked shareable, but the payload only existed in memory. The thing that finally made the bug obvious was testing the flow exactly like a real user would: generate report, copy URL, open a fresh tab, refresh. Once I did that, the problem stopped looking like a React issue and started looking like an architecture issue. The immediate fix was to render a graceful fallback message; the real fix is to persist audits by `auditId` in a backend and hydrate the result page from storage.

## 2 Why I used JavaScript instead of TypeScript

I chose JavaScript for speed of iteration during the 7-day assignment window. My priority was shipping a complete end-to-end product flow with working audit logic, UI polish, and deployment rather than spending additional time defining and maintaining TypeScript types across rapidly changing components and pricing schemas.

The project structure still keeps concerns separated (`audit`, `components`, `pages`, `api`) so migrating to TypeScript later would be straightforward. If this were moving beyond MVP stage or supporting a larger team, I would switch to TypeScript for stronger type safety around pricing data, audit result objects, and API responses.

## 3. A decision I reversed mid-week, and what made me reverse it

The biggest decision I reversed was how much of the recommendation logic should be “smart” versus explicit. My earliest instinct was to let an LLM do more of the reasoning because the assignment is about AI tooling and the result page benefits from personalized language. But once I reread the prompt carefully, it became clear that the assignment was testing judgment, not just AI usage. It explicitly says the audit math itself should be hardcoded and defensible, and that knowing when not to use AI is part of the test.

That changed my approach. Instead of asking a model to infer whether a plan was too expensive, I moved the core audit into deterministic rules inside `src/audit/rules.js`. For example, small teams on ChatGPT Team or Cursor Business can be mapped to cheaper options in a way that is easy to inspect and easy to challenge. I kept the LLM only for the ~100-word summary layer. That reversal improved the product in two ways. First, it made the savings logic explainable. Second, it made the failure mode better because a model outage no longer breaks the audit itself. In hindsight, this was the right reversal because the most important part of the app is not sounding intelligent, but producing recommendations that a finance-minded person would trust.

## 4. What I would build in week 2 if I had it

If I had a second week, I would spend most of it on turning the prototype into a genuinely launchable lead-gen product rather than adding more frontend surface area. The first priority would be persistence: a real database-backed audit creation flow, audit retrieval by `auditId`, and share pages that survive refresh and support Open Graph previews. Right now the UI implies virality, but the backend does not support it yet. Fixing that would immediately improve both product quality and submission quality.

The second major area would be pricing fidelity and recommendation breadth. I would replace the simplified catalog prices with a versioned pricing dataset sourced from official pricing pages, expand the rules for Gemini and Windsurf, and make API recommendations more concrete instead of relying on broad percentage optimizations. I would also add company size bands, primary use-case weighting, and “already well optimized” branches that are even more explicit and trustworthy.

The third area would be lead capture and operations. I would add a backend for storing leads, transactional email via a server-side provider, rate limiting, abuse protection, and analytics instrumentation across landing, completion, share, and conversion steps. Finally, I would use the real user interviews to tighten the copy and reduce friction in the form. In week 1 I shipped the skeleton of the product. In week 2 I would make it durable, measurable, and credible enough to put real traffic through it.

## 5. How I used AI tools

I used AI tools as accelerators for structure, copy iteration, and implementation support, but not as final authority for pricing logic. The main tools I used were Codex and ChatGPT. I used them for brainstorming naming directions, refining landing-page language, improving UI structure, and moving faster on component-level implementation in React. I also used AI to help rewrite explanations into clearer user-facing language and to pressure-test whether certain sections of the app felt too generic.

What I did not trust AI with was the core audit reasoning. I deliberately kept the recommendation engine rule-based because the assignment values defensible logic over persuasive wording. I also did not trust AI to be correct about current pricing without verification. In a product like this, an elegant explanation built on bad pricing is worse than a plain explanation built on accurate inputs.

One specific time the AI was wrong and I caught it was around secret handling. An AI-assisted implementation path left the Gemini API key directly in `src/api/generateSummary.js`, which is fine for a quick local prototype but clearly unacceptable for a public submission. I caught that by reviewing the code as if it were production code rather than assuming the generated integration was acceptable. That was a good reminder that AI is useful for speed, but it does not own the security model, product judgment, or final review. I treated it as a collaborator, not a source of truth.

## 6. Self-rating

### Discipline

**7/10** — I moved quickly from zero to a visible product flow, but the repo does not yet show the multi-day commit discipline the assignment explicitly asks for, so I would not rate this higher.

### Code quality

**6/10** — The code is readable and the audit logic is at least separated from the UI, but there are still major production issues such as client-side secrets, missing tests, and route-state dependence.

### Design sense

**7/10** — The landing page and result page feel product-oriented rather than template-like, and I put attention into hierarchy, spacing, and the screenshot-worthiness of the savings output. There is still room to improve responsiveness and edge-case polish.

### Problem-solving

**7/10** — The strongest decision was recognizing that the problem is mostly about trustworthy business rules and product flow, not clever AI usage. The next step is showing the same rigor in persistence, testing, and reliability.

### Entrepreneurial thinking

**8/10** — I understood that the assignment is really a lead-generation product masquerading as an audit tool. The design tries to create value before gating, keep the result shareable, and use savings as the bridge into the Credex consultation path.

