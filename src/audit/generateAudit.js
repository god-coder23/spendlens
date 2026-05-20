import {evaluateAnthropicRule, evaluateChatGPTRule, evaluateClaudeRule, evaluateCopilotRule, evaluateCursorRule, evaluateGeminiRule, evaluateOpenAIRule, evaluateWindsurfRule } from "./rules.js"

export const generateAudit = (userInput) => {
  const recommendations = []

  userInput.tools.forEach((tool) => {
    let result = null

    switch (tool.tool) {
      case "ChatGPT": result = evaluateChatGPTRule(tool)
        break

      case "Cursor": result = evaluateCursorRule(tool)
        break

      case "Claude": result = evaluateClaudeRule(tool)
        break

      case "GitHub Copilot": result = evaluateCopilotRule(tool)
        break

      case "OpenAI API": result = evaluateOpenAIRule(tool)
        break

      case "Anthropic API": result = evaluateAnthropicRule(tool)
        break

      case "Gemini": result = evaluateGeminiRule(tool)
        break

      case "Windsurf": result = evaluateWindsurfRule(tool)
        break

      default:
        break
    }

    if (result) {
      recommendations.push(result)
    }
  })

  const totalMonthlySavings = recommendations.reduce(
    (acc, item) => acc + item.monthlySavings,
    0
  )

  const totalAnnualSavings = recommendations.reduce(
    (acc, item) => acc + item.annualSavings,
    0
  )

  const isOptimized = totalMonthlySavings < 50

  return { recommendations, totalMonthlySavings, totalAnnualSavings, isOptimized }
}
