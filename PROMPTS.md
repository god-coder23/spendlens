# Prompts

## Current summary-generation prompt

The current app uses Gemini through `src/api/generateSummary.js` and builds this prompt dynamically from user input and audit recommendations:

```text
You are generating a professional AI spend audit summary. Requirements:
- 80 to 120 words
- Professional and financially practical tone
- Do not exaggerate savings
- Do not invent information
- Avoid marketing language
- Be concise and realistic
- Mention operational efficiency naturally
Team Size:{teamSize}
Primary Use Case:{useCase}
Total Monthly Savings: ${totalMonthlySavings}
Total Annual Savings: ${totalAnnualSavings}
Recommendations:
{recommendationText}
If savings are low, acknowledge that the current stack already appears reasonably optimized.
```

Where `recommendationText` is a line-by-line serialization of each recommendation in this shape:

```text
Tool: {tool}
Recommendation: {recommendation}
Monthly Savings: ${monthlySavings}
Reason: {reason}
```

## Why I wrote it this way

- I wanted the model to behave like a financially grounded assistant, not a growth marketer.
- I constrained the length because the result page needs a summary paragraph, not a second report.
- I explicitly told the model not to invent information because pricing and savings claims are the highest-trust part of the product.
- I added the low-savings instruction so the experience can still feel honest when the user is already on a reasonable stack.
- I kept all quantitative inputs outside the model’s control. The model receives the recommendation outputs rather than calculating them itself.

## Fallback behavior

If the model call fails, the app returns this templated fallback:

```text
Your current AI stack contains several opportunities for operational cost optimization based on your current team structure and usage patterns.
```

That fallback is intentionally generic. Before submission, I would make it more specific by branching on:

- whether savings are high or low
- whether the stack is coding-heavy or mixed-use
- whether recommendations are plan downgrades or spend-gap reviews

## What I tried conceptually that did not work well

### 1. Letting the model infer savings logic

This was the wrong abstraction. The assignment wants defensible pricing math, and model-generated savings language is too hard to verify line by line.

### 2. Writing a more promotional prompt

Prompt variants that sounded more salesy produced copy that felt less trustworthy. For this product, “measured and specific” works better than “punchy and exciting.”

### 3. Passing too much raw form data

The summary became noisy when the prompt included too many unstructured details from the UI. Passing a compact recommendation list worked better than feeding every raw input directly.

## Model/provider choice

The current implementation uses Gemini via `@google/genai`, even though the assignment says Anthropic is preferred. That was a speed decision for the prototype, not a principled product choice. Before submission, I would either:

- switch to Anthropic for alignment with the prompt, or
- keep Gemini and justify it clearly in the docs as a pragmatic provider choice

## Security note

The current file contains a hardcoded API key in client code. That is not acceptable for a public repository and must be moved behind environment variables and a server endpoint before submission.
