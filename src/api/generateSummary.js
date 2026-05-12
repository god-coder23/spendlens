import { GoogleGenAI } from "@google/genai"

const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY
})

export const generateSummary = async (userInput, auditResult) => {
  try {
    const recommendationText = auditResult.recommendations
      .map(
        (item) =>
          `Tool: ${item.tool} Recommendation: ${item.recommendation} Monthly Savings: $${item.monthlySavings} Reason: ${item.reason}`
      )
      .join("\n")

    const prompt = `You are generating a professional AI spend audit summary. Requirements:
- 80 to 120 words
- Professional and financially practical tone
- Do not exaggerate savings
- Do not invent information
- Avoid marketing language
- Be concise and realistic
- Mention operational efficiency naturally
Team Size: ${userInput.teamSize}
Primary Use Case: ${userInput.useCase}
Total Monthly Savings: $${auditResult.totalMonthlySavings}
Total Annual Savings: $${auditResult.totalAnnualSavings}
Recommendations:
${recommendationText}
If savings are low, acknowledge that the current stack already appears reasonably optimized.`

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt
    })

    return response.text
  } catch (err) {
    console.error("Summary generation failed:", err)

    if (auditResult.isOptimized) {
      return `Based on your ${userInput.teamSize}-person team's current AI stack, your tool selection appears reasonably optimized for ${userInput.useCase} workflows. No significant plan mismatches were identified. Continue monitoring seat utilization at renewal time and revisit if your team size or primary use case shifts.`
    }

    return `Your ${userInput.teamSize}-person team's AI stack has several optimization opportunities across ${auditResult.recommendations.length} tool${auditResult.recommendations.length !== 1 ? "s" : ""}. Addressing these plan and spend mismatches could reduce monthly AI costs by approximately $${auditResult.totalMonthlySavings}, or $${auditResult.totalAnnualSavings} annually, improving operational efficiency without changing your core workflows.`
  }
}