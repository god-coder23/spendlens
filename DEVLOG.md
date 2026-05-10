## Day 1 — 2026-05-06
**Hours worked:** 1
**What I did:** Set up the repository, scaffolded the Vite + React app, created the required root markdown files, and translated the assignment into a concrete product idea called SpendLens. I also decided that the audit engine should stay rule-based and that the AI model should only be used for the personalized summary.
**What I learned:** The assignment is less about flashy code and more about whether the product feels launchable, explainable, and disciplined. The repo structure itself is part of the evaluation.
**Blockers / what I'm stuck on:** No technical blockers yet. The bigger challenge is deciding how realistic the audit logic should be without overbuilding.
**Plan for tomorrow:** Build the landing page and establish the main product flow from home page to audit form.

## Day 2 — 2026-05-07
**Hours worked:** 6
**What I did:** Built the core frontend flow. I added routing in `src/App.jsx`, created the landing page UI, added the onboarding and tool-selection screen, and designed the first pass of the result page. I also wired the form to generate a unique audit identifier and navigate into the result route.
**What I learned:** The most important UX decision is keeping the form fast to complete while still asking for enough detail to produce credible savings recommendations. Per-tool configuration gives better output than one generic spend box.
**Blockers / what I'm stuck on:** At this point the flow looked polished, but the recommendations were still mostly UI placeholders and not backed by a real audit engine.
**Plan for tomorrow:** Replace placeholder outputs with structured recommendation logic and define pricing data in a separate audit module.

## Day 3 — 2026-05-08
**Hours worked:** 3
**What I did:** Added `src/audit/pricingData.js`, `src/audit/rules.js`, `src/audit/helper.js`, and `src/audit/generateAudit.js`. I separated recommendation logic by tool, added savings calculations, and introduced a manual spend-gap rule for cases where the user-entered bill is much higher than the catalog plan price. I also connected the audit engine to the form flow.
**What I learned:** Splitting pricing constants from rule evaluation made the code much easier to reason about. The recommendation engine is really a business-rules system, not a frontend problem.
**Blockers / what I'm stuck on:** The logic is still incomplete relative to the assignment. Some supported tools are collected in the UI but not yet covered by recommendations, and the pricing inputs need to be aligned to official sources.
**Plan for tomorrow:** Add the AI-generated summary, improve the result page, and review the app against the assignment checklist.

## Day 4 — 2026-05-9
**Hours worked:** 5
**What I did:** Refactored repetitive card components by replacing duplicated code with a reusable `.map()` function instead of creating the same cards repeatedly. Enhanced the Step 2 and Step 3 UI to improve the overall workflow and user experience. Connected the app with real input data instead of static placeholders, integrated Gemini AI to fetch and process the submitted data, and finalized the complete end-to-end working product flow.
**What I learned:** Using reusable rendering methods like `.map()` reduces code duplication and makes the project easier to maintain. I also learned that integrating real APIs and handling live user data introduces practical challenges beyond static UI development.
**Blockers / what I'm stuck on:** The Gemini AI integration still needs stronger validation and better handling for failed or unexpected API responses.
**Plan for tomorrow:** Conduct user interviews and gather feedback on the usability, workflow, and overall experience of the product to identify areas for improvement.

## Day 5 — 2026-05-10

**Hours worked:** 2

**What I did:**
Focused on improving the audit recommendation flow and validating whether the product logic actually makes sense to founders outside my own assumptions. I reviewed pricing recommendation edge cases, especially around small teams overpaying for ChatGPT Team and Cursor Business plans when cheaper alternatives or API usage would fit better. I also refined the wording on the results page so the savings recommendations sound financially credible instead of sounding like generic AI hype.

Spent the second half of the session doing three user interviews with people actively paying for AI tools. The goal was not validation bias, but understanding where AI spend actually becomes painful, how founders think about subscription overlap, and whether they would trust automated savings recommendations. I gathered feedback around trust, pricing transparency, and how teams decide when to downgrade or switch tools.

**What I learned:**
The interviews made it clear that most founders do not actively optimize AI spending unless costs become visibly painful. The bigger issue is usually subscription overlap and unused seats rather than one expensive tool. I also learned that users trust recommendations more when the product is willing to say their current setup is already reasonable instead of forcing unnecessary savings suggestions.

**Blockers / what I'm stuck on:**
The audit engine still needs better handling for mixed usage scenarios where teams use both subscriptions and APIs heavily. I also need to improve validation around edge cases so recommendations do not feel overly aggressive or unrealistic.

**Plan for tomorrow:**
Complete the entrepreneurial documentation files, finalize pricing source verification, and improve the AI summary fallback handling for failed API responses.
