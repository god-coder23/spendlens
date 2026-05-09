# Pricing Data

Verified on `2026-05-09`.

Important note: the current implementation in `src/audit/pricingData.js` is a simplified placeholder dataset and does **not** fully match the current official pricing pages below. Before submission, the code and the recommendation rules should be updated to align with this document.

## Cursor

- Hobby: $0/month — https://cursor.com/en-US/pricing — verified 2026-05-09
- Pro: $20/month — https://cursor.com/en-US/pricing — verified 2026-05-09
- Teams: $40/user/month — https://cursor.com/en-US/pricing — verified 2026-05-09
- Enterprise: custom pricing — https://cursor.com/en-US/pricing — verified 2026-05-09

Note: Cursor’s pricing page currently uses `Teams` rather than `Business`, plus additional `Pro+` and `Ultra` individual tiers not used in this app.

## GitHub Copilot

- Free: $0/month — https://github.com/features/copilot/plans — verified 2026-05-09
- Individual / Pro: $10/user/month — https://github.com/features/copilot/plans — verified 2026-05-09
- Business: $19/user/month — https://docs.github.com/en/enterprise-cloud@latest/copilot/concepts/billing/organizations-and-enterprises — verified 2026-05-09
- Enterprise: $39/user/month — https://docs.github.com/en/enterprise-cloud@latest/copilot/concepts/billing/organizations-and-enterprises — verified 2026-05-09

## Claude

- Free: $0/month — https://www.anthropic.com/pricing?hsLang=en-us — verified 2026-05-09
- Pro: $20/month billed monthly, or $17/month equivalent billed annually — https://www.anthropic.com/pricing?hsLang=en-us — verified 2026-05-09
- Max: from $100/month — https://www.anthropic.com/pricing?hsLang=en-us — verified 2026-05-09
- Team: $30/user/month billed monthly, or $25/user/month billed annually — https://www.anthropic.com/pricing?hsLang=en-us — verified 2026-05-09
- Enterprise: custom pricing — https://www.anthropic.com/pricing?hsLang=en-us — verified 2026-05-09

## ChatGPT

- Free: $0/month — https://openai.com/chatgpt/pricing — verified 2026-05-09
- Plus: pricing varies by region; use the live consumer pricing page at https://openai.com/chatgpt/pricing — verified 2026-05-09
- Team / Business: OpenAI has renamed `Team` to `Business`; current public pricing is $20/user/month billed annually or $25/user/month billed monthly for Business ChatGPT & Codex — https://openai.com/business/chatgpt-pricing — verified 2026-05-09
- Enterprise: custom pricing — https://openai.com/business/chatgpt-pricing — verified 2026-05-09

Note: because the assignment still uses the older `ChatGPT Team` label, the app should normalize that to the current OpenAI `Business` plan in its pricing notes and UI copy.

## Anthropic API direct

- Claude Sonnet 4: $3 / 1M input tokens, $15 / 1M output tokens — https://docs.anthropic.com/en/docs/about-claude/pricing — verified 2026-05-09
- Claude Haiku 3.5: $0.80 / 1M input tokens, $4 / 1M output tokens — https://docs.anthropic.com/en/docs/about-claude/pricing — verified 2026-05-09
- Claude Opus 4 / 4.1: $15 / 1M input tokens, $75 / 1M output tokens — https://docs.anthropic.com/en/docs/about-claude/pricing — verified 2026-05-09

Note: there is no flat monthly list price for Anthropic API direct. In the current app, API users enter their own monthly spend and the audit engine applies optimization heuristics to that spend.

## OpenAI API direct

- GPT-5.5: $5 / 1M input tokens, $30 / 1M output tokens — https://openai.com/api/pricing/ — verified 2026-05-09
- GPT-5.4: $2.50 / 1M input tokens, $15 / 1M output tokens — https://openai.com/api/pricing/ — verified 2026-05-09
- GPT-5.4 mini: $0.75 / 1M input tokens, $4.50 / 1M output tokens — https://openai.com/api/pricing/ — verified 2026-05-09

Note: there is no flat monthly list price for OpenAI API direct. Like Anthropic API, this app treats the monthly figure as user-entered spend and recommends optimization against that baseline.

## Gemini

- Google AI Pro: $19.99/month — https://one.google.com/about/plans?hl=en_in — verified 2026-05-09
- Google AI Ultra: $249.99/month list price, currently shown as $124.99/month for the first 3 months in the public offer — https://one.google.com/about/ai-premium/?hc_location=ufi — verified 2026-05-09
- Gemini API / Vertex AI example reference: Gemini 2.5 Pro input pricing starts at $1.25 / 1M input tokens and $10 / 1M text output tokens for shorter contexts — https://cloud.google.com/vertex-ai/generative-ai/pricing — verified 2026-05-09

Note: the current code uses a simplified `Gemini Pro / Ultra / Enterprise` plan model. Before submission, the app should decide whether it is auditing the consumer Google AI plans, Google Workspace Gemini, or Gemini API, because those are different products with different pricing structures.

## Windsurf

- Free: $0/month — https://docs.windsurf.com/windsurf/accounts/usage — verified 2026-05-09
- Pro: official plan exists; use the current pricing table at https://windsurf.com/pricing for live amount — verified 2026-05-09
- Teams: official plan exists; use the current pricing table at https://windsurf.com/pricing for live amount — verified 2026-05-09
- Enterprise: custom / contact sales path — https://docs.windsurf.com/windsurf/accounts/usage — verified 2026-05-09

Note: Windsurf introduced usage-based self-serve changes in March 2026, so the app should not rely on stale seat-price assumptions without rechecking the live pricing page.

## Pricing model assumptions used by the current prototype

- Per-seat subscription products are modeled with flat monthly seat costs
- API products are modeled from user-entered monthly spend, not from token forecasting
- Enterprise pricing is treated as custom and should generally not trigger a naive downgrade recommendation without stronger context

## Follow-up needed before submission

- Update `src/audit/pricingData.js` to match these verified sources
- Revisit labels where vendor plan names changed
- Add source annotations or inline comments near any hardcoded numbers used by the audit engine
