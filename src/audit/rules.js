import { pricingData } from "./pricingData.js"
import { calculateAnnualSavings } from "./helper.js"

const hasEnteredSpend = (tool) =>
  typeof tool.spend === "number" && !Number.isNaN(tool.spend) && tool.spend > 0

const getCatalogSpend = (tool, pricingGroup) => {
  const planPrice = pricingGroup?.[tool.plan]
  if (typeof planPrice !== "number") return 0
  return planPrice * Math.max(tool.seats || 1, 1)
}

const createRecommendation = ({ tool,currentPlan,recommendation,currentSpend,optimizedSpend,reason,confidence}) => ({tool,currentPlan,recommendation,currentSpend,optimizedSpend,monthlySavings: Math.max(currentSpend -optimizedSpend, 0),annualSavings: calculateAnnualSavings(Math.max(currentSpend - optimizedSpend, 0)),reason,confidence})

const evaluateManualSpendGap = (tool, pricingGroup) => {
  if (!hasEnteredSpend(tool)) return null

  const catalogSpend = getCatalogSpend(tool, pricingGroup)
  if (catalogSpend <= 0 || tool.spend <= catalogSpend * 1.25) return null

  return createRecommendation({
    tool: tool.tool,
    currentPlan: tool.plan.charAt(0).toUpperCase() + tool.plan.slice(1),
    recommendation: "Review unexpected billed spend",
    currentSpend: tool.spend,
    optimizedSpend: catalogSpend,
    reason:
      "Your entered monthly spend is much higher than the expected catalog price for this plan and seat count. This can indicate duplicate subscriptions, extra billed seats, or add-on charges worth reviewing.",
    confidence: "high"
  })
}

export const evaluateChatGPTRule = (tool) => {
  const manualSpendRecommendation = evaluateManualSpendGap(tool, pricingData.chatgpt)
  if (manualSpendRecommendation) return manualSpendRecommendation

  if ((tool.plan === "team" || tool.plan === "business") && tool.seats <= 2) {
    const currentSpend = hasEnteredSpend(tool)
      ? tool.spend
      : pricingData.chatgpt.team * tool.seats
    const optimizedSpend = pricingData.chatgpt.plus * tool.seats

    return createRecommendation({
      tool: "ChatGPT",
      currentPlan: "Business",
      recommendation: "Downgrade to ChatGPT Plus per seat",
      currentSpend,
      optimizedSpend,
      reason:
        "The Business plan's collaboration features are unlikely to justify the added per-seat cost for teams under 3 users. Individual Plus licenses cover the same core capabilities.",
      confidence: "high"
    })
  }

  return null
}

export const evaluateCursorRule = (tool) => {
  const manualSpendRecommendation = evaluateManualSpendGap(tool, pricingData.cursor)
  if (manualSpendRecommendation) return manualSpendRecommendation

  if ((tool.plan === "business" || tool.plan === "teams") && tool.seats <= 3) {
    const currentSpend = hasEnteredSpend(tool)
      ? tool.spend
      : pricingData.cursor.teams * tool.seats
    const optimizedSpend = pricingData.cursor.pro * tool.seats

    return createRecommendation({
      tool: "Cursor",
      currentPlan: "Teams",
      recommendation: "Downgrade to Cursor Pro",
      currentSpend,
      optimizedSpend,
      reason:
        "Teams plan administration controls add $20/seat/month over Pro. For teams of 3 or fewer, individual Pro licenses cover the same AI features without the overhead.",
      confidence: "high"
    })
  }

  return null
}

export const evaluateClaudeRule = (tool) => {
  const manualSpendRecommendation = evaluateManualSpendGap(tool, pricingData.claude)
  if (manualSpendRecommendation) return manualSpendRecommendation

  const usesResearch = tool.usageTypes?.includes("research")

  if (tool.plan === "max" && !usesResearch) {
    const currentSpend = hasEnteredSpend(tool)
      ? tool.spend
      : pricingData.claude.max * Math.max(tool.seats || 1, 1)
    const optimizedSpend = pricingData.claude.pro * Math.max(tool.seats || 1, 1)

    return createRecommendation({
      tool: "Claude",
      currentPlan: "Max",
      recommendation: "Downgrade to Claude Pro",
      currentSpend,
      optimizedSpend,
      reason:
        "Claude Max is designed for heavy long-context and research-intensive workflows. Without a research use case, Claude Pro covers the same day-to-day needs at 80% lower cost.",
      confidence: "medium"
    })
  }

  if (tool.plan === "team" && tool.seats <= 2) {
    const currentSpend = hasEnteredSpend(tool)
      ? tool.spend
      : pricingData.claude.team * tool.seats
    const optimizedSpend = pricingData.claude.pro * tool.seats

    return createRecommendation({
      tool: "Claude",
      currentPlan: "Team",
      recommendation: "Downgrade to Claude Pro per seat",
      currentSpend,
      optimizedSpend,
      reason:
        "The Team plan adds collaborative workspace features at $10/user/month over Pro. For teams of 2 or fewer, individual Pro licenses cover the same capabilities.",
      confidence: "high"
    })
  }

  return null
}

export const evaluateCopilotRule = (tool) => {
  const manualSpendRecommendation = evaluateManualSpendGap(tool, pricingData.githubCopilot)
  if (manualSpendRecommendation) return manualSpendRecommendation

  if (tool.plan === "enterprise" && tool.seats < 10) {
    const currentSpend = hasEnteredSpend(tool)
      ? tool.spend
      : pricingData.githubCopilot.enterprise * tool.seats
    const optimizedSpend = pricingData.githubCopilot.business * tool.seats

    return createRecommendation({
      tool: "GitHub Copilot",
      currentPlan: "Enterprise",
      recommendation: "Downgrade to GitHub Copilot Business",
      currentSpend,
      optimizedSpend,
      reason:
        "Enterprise adds fine-tuned model access and audit log controls for $20/seat/month over Business. These governance features are typically only justified at 10+ seats with compliance requirements.",
      confidence: "high"
    })
  }

  return null
}

export const evaluateOpenAIRule = (tool) => {
  if (!hasEnteredSpend(tool)) return null

  if (tool.spend >= 100) {
    const currentSpend = tool.spend
    const optimizedSpend = Math.round(tool.spend * 0.85)

    return createRecommendation({
      tool: "OpenAI API",
      currentPlan: "API Direct",
      recommendation: "Optimize API usage patterns",
      currentSpend,
      optimizedSpend,
      reason:
        "At this spend level, switching high-volume non-critical calls to GPT-4o mini, enabling prompt caching, and batching async requests typically yields 10–20% cost reduction with no change in output quality for most use cases.",
      confidence: "medium"
    })
  }

  return null
}

export const evaluateAnthropicRule = (tool) => {
  if (!hasEnteredSpend(tool)) return null

  if (tool.spend >= 100) {
    const currentSpend = tool.spend
    const optimizedSpend = Math.round(tool.spend * 0.8)

    return createRecommendation({
      tool: "Anthropic API",
      currentPlan: "API Direct",
      recommendation: "Optimize model routing and prompt design",
      currentSpend,
      optimizedSpend,
      reason:
        "Routing classification and summarization tasks to Claude Haiku 3.5 ($0.80/1M input tokens vs $3 for Sonnet 4) and enabling prompt caching for repeated context can reduce API costs by 15–25% without degrading output quality on most tasks.",
      confidence: "medium"
    })
  }

  return null
}

export const evaluateGeminiRule = (tool) => {
  const manualSpendRecommendation = evaluateManualSpendGap(tool, pricingData.gemini)
  if (manualSpendRecommendation) return manualSpendRecommendation

  const usesResearch = tool.usageTypes?.includes("research")
  const usesData = tool.usageTypes?.includes("data")

  if (tool.plan === "ultra" && !usesResearch && !usesData) {
    const currentSpend = hasEnteredSpend(tool)
      ? tool.spend
      : pricingData.gemini.ultra
    const optimizedSpend = pricingData.gemini.pro

    return createRecommendation({
      tool: "Gemini",
      currentPlan: "Google AI Ultra",
      recommendation: "Downgrade to Google AI Pro",
      currentSpend,
      optimizedSpend,
      reason:
        "Google AI Ultra is designed for heavy multimodal, long-context, and data-intensive workflows. Without research or data use cases, Google AI Pro at $19.99/month provides equivalent capability for most coding and writing workflows.",
      confidence: "medium"
    })
  }

  return null
}

export const evaluateWindsurfRule = (tool) => {
  const manualSpendRecommendation = evaluateManualSpendGap(tool, pricingData.windsurf)
  if (manualSpendRecommendation) return manualSpendRecommendation

  if (tool.plan === "teams" && tool.seats <= 2) {
    const currentSpend = hasEnteredSpend(tool)
      ? tool.spend
      : pricingData.windsurf.teams * tool.seats
    const optimizedSpend = pricingData.windsurf.pro * tool.seats

    return createRecommendation({
      tool: "Windsurf",
      currentPlan: "Teams",
      recommendation: "Downgrade to Windsurf Pro per seat",
      currentSpend,
      optimizedSpend,
      reason:
        "The Teams plan adds shared admin controls that provide limited value for teams under 3. Individual Pro licenses cover the same AI coding features at a lower per-seat cost.",
      confidence: "medium"
    })
  }

  return null
}
