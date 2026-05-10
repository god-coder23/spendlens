# Tests

All tests cover the audit engine in `src/audit/`. Run with:

\```bash
npm test
\```

## Test file

**`src/audit/__tests__/rules.test.js`**

Framework: Vitest

| Test | What it covers |
|------|----------------|
| ChatGPT business plan ≤2 seats → downgrade | evaluateChatGPTRule fires the correct recommendation |
| ChatGPT business plan ≥3 seats → null | Rule correctly withholds recommendation |
| ChatGPT plus plan → null | No false positive on already-optimal plan |
| ChatGPT manual spend gap → flag | evaluateManualSpendGap fires when entered spend exceeds catalog by 25% |
| Claude Max without research → downgrade | evaluateClaudeRule fires for non-research users |
| Claude Max with research → null | Research usage type suppresses the downgrade |
| Claude Team ≤2 seats → downgrade | Team-to-Pro downgrade fires correctly |
| Claude Team ≥3 seats → null | Rule withheld for appropriately-sized teams |
| Cursor Teams ≤3 seats → downgrade | evaluateCursorRule fires |
| Cursor Teams ≥4 seats → null | Rule correctly withheld |
| Cursor Pro → null | No false positive |
| Copilot Enterprise <10 seats → downgrade | evaluateCopilotRule fires |
| Copilot Enterprise ≥10 seats → null | Governance features justified at scale |
| Copilot Business → null | No false positive |
| OpenAI API spend ≥$100 → optimize | evaluateOpenAIRule fires with positive savings |
| OpenAI API spend <$100 → null | Threshold not met |
| OpenAI API no spend → null | Missing spend handled gracefully |
| Anthropic API spend ≥$100 → optimize | evaluateAnthropicRule returns 20% savings |
| Anthropic API spend <$100 → null | Threshold not met |
| Gemini Ultra no research/data → downgrade | evaluateGeminiRule fires |
| Gemini Ultra with research → null | Usage type suppresses recommendation |
| Gemini Ultra with data → null | Usage type suppresses recommendation |
| Windsurf Teams ≤2 seats → downgrade | evaluateWindsurfRule fires |
| Windsurf Teams ≥3 seats → null | Rule correctly withheld |
| generateAudit: annual = monthly × 12 | Integration check on savings aggregation |
| generateAudit: isOptimized true when savings <$50 | Low-savings flag set correctly |
| generateAudit: no negative monthlySavings | All recommendations clamp at zero |