/* eslint-disable no-undef */
import { initializeApp, cert, getApps } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"
import { Resend } from "resend"
import { pricingData } from "../src/audit/pricingData.js"
import { generateAudit } from "../src/audit/generateAudit.js"

const keyMap = {
  "ChatGPT": "chatgpt",
  "Claude": "claude",
  "Cursor": "cursor",
  "GitHub Copilot": "githubCopilot",
  "Gemini": "gemini",
  "Windsurf": "windsurf"
}

const getDb = () => {
  if (!getApps().length) {
    initializeApp({
      credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT))
    })
  }

  return getFirestore()
}

const getAppUrl = (req) => {
  if (process.env.VITE_APP_URL) {
    return process.env.VITE_APP_URL
  }

  const protocol = req.headers["x-forwarded-proto"] || "http"
  const host = req.headers.host

  return host ? `${protocol}://${host}` : null
}

const formatMoney = (value) => `$${Number(value || 0).toFixed(0)}`

const formatPlanLabel = (plan) => {
  if (!plan) return "unknown"

  return plan
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

const getPriceChanges = (tools = [], snapshot = {}) => {
  const changes = []

  tools.forEach((tool) => {
    const key = keyMap[tool.tool]
    if (!key) return

    const oldPrice = snapshot[key]?.[tool.plan]
    const newPrice = pricingData[key]?.[tool.plan]

    if (oldPrice === undefined && newPrice === undefined) return

    if (oldPrice === undefined && newPrice !== undefined) {
      changes.push(`${tool.tool} (${formatPlanLabel(tool.plan)}): now ${formatMoney(newPrice)}/mo`)
      return
    }

    if (oldPrice !== undefined && newPrice === undefined) {
      changes.push(`${tool.tool} (${formatPlanLabel(tool.plan)}): previous price ${formatMoney(oldPrice)}/mo no longer exists in current pricing data`)
      return
    }

    if (oldPrice !== newPrice) {
      changes.push(`${tool.tool} (${formatPlanLabel(tool.plan)}): ${formatMoney(oldPrice)}/mo -> ${formatMoney(newPrice)}/mo`)
    }
  })

  return changes
}

const getRecommendationSummary = (recommendations = []) =>
  recommendations
    .map((item) => `${item.tool}: ${item.recommendation}`)
    .sort()

const getImpactSummary = (oldAuditResult = {}, newAuditResult = {}) => {
  const oldMonthlySavings = Number(oldAuditResult.totalMonthlySavings || 0)
  const newMonthlySavings = Number(newAuditResult.totalMonthlySavings || 0)
  const savingsDelta = newMonthlySavings - oldMonthlySavings

  const oldRecommendations = getRecommendationSummary(oldAuditResult.recommendations)
  const newRecommendations = getRecommendationSummary(newAuditResult.recommendations)
  const recommendationsChanged =
    JSON.stringify(oldRecommendations) !== JSON.stringify(newRecommendations)

  const impact = []

  if (savingsDelta !== 0) {
    const direction = savingsDelta > 0 ? "higher" : "lower"
    impact.push(
      `Estimated monthly savings moved from ${formatMoney(oldMonthlySavings)} to ${formatMoney(newMonthlySavings)} (${formatMoney(Math.abs(savingsDelta))} ${direction}).`
    )
  }

  if (recommendationsChanged) {
    impact.push(
      `Recommendation set changed from ${oldRecommendations.length} item(s) to ${newRecommendations.length} item(s).`
    )
  }

  if (impact.length === 0) {
    impact.push("Pricing moved, but the headline recommendation stayed the same.")
  }

  return {
    summary: impact.join(" "),
    hasMeaningfulChange:
      savingsDelta !== 0 || recommendationsChanged,
    oldMonthlySavings,
    newMonthlySavings,
    oldRecommendationCount: oldRecommendations.length,
    newRecommendationCount: newRecommendations.length
  }
}

const buildAffectedAudit = (doc) => {
  const data = doc.data()
  const { userEmail, pricingSnapshot, userInput, auditResult } = data

  if (!userEmail || !pricingSnapshot || !Array.isArray(userInput?.tools) || userInput.tools.length === 0) {
    return null
  }

  const newAuditResult = generateAudit(userInput)
  const priceChanges = getPriceChanges(userInput.tools, pricingSnapshot)
  const impact = getImpactSummary(auditResult, newAuditResult)

  if (priceChanges.length === 0 && !impact.hasMeaningfulChange) {
    return null
  }

  return {
    auditId: doc.id,
    email: userEmail,
    priceChanges,
    impact,
    createdAt: data.createdAt || null
  }
}

const sortAuditsNewestFirst = (audits) =>
  [...audits].sort((a, b) => {
    const first = a.createdAt ? new Date(a.createdAt).getTime() : 0
    const second = b.createdAt ? new Date(b.createdAt).getTime() : 0
    return second - first
  })

const buildEmailHtml = (appUrl, audits) => {
  const auditSections = audits
    .map((audit) => {
      const priceLines =
        audit.priceChanges.length > 0
          ? `<ul>${audit.priceChanges.map((item) => `<li>${item}</li>`).join("")}</ul>`
          : `<p>No direct price-row change detected, but the new audit result is different.</p>`

      return `
        <div style="margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid #e5e7eb;">
          <h3 style="margin: 0 0 8px;">Audit ${audit.auditId}</h3>
          <p style="margin: 0 0 10px;"><strong>Impact:</strong> ${audit.impact.summary}</p>
          <p style="margin: 0 0 6px;"><strong>What changed:</strong></p>
          ${priceLines}
          <p style="margin: 12px 0 0;">
            <a href="${appUrl}/audit/${audit.auditId}/diff">Open updated diff view</a>
          </p>
        </div>
      `
    })
    .join("")

  return `
    <div style="font-family: Arial, sans-serif; color: #111827; line-height: 1.5;">
      <h2 style="margin-bottom: 8px;">AI pricing changed since your SpendLens audit</h2>
      <p style="margin-top: 0;">
        We re-checked your saved audit${audits.length > 1 ? "s" : ""} against the current pricing data and found change${audits.length > 1 ? "s" : ""}.
      </p>
      ${auditSections}
      <p style="margin-top: 20px;">You can re-run a fresh audit anytime in SpendLens.</p>
    </div>
  `
}

export default async function handler(req, res) {
  if (!["GET", "POST"].includes(req.method)) {
    return res.status(405).json({ error: "Method not allowed" })
  }

  if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
    return res.status(500).json({
      error: "Missing FIREBASE_SERVICE_ACCOUNT environment variable"
    })
  }

  if (!process.env.RESEND_API_KEY) {
    return res.status(500).json({
      error: "Missing RESEND_API_KEY environment variable"
    })
  }

  const appUrl = getAppUrl(req)
  if (!appUrl) {
    return res.status(500).json({
      error: "Unable to determine app URL. Set VITE_APP_URL for email links."
    })
  }

  try {
    const db = getDb()
    const resend = new Resend(process.env.RESEND_API_KEY)
    const snapshot = await db.collection("audits").get()

    const debug = {
      totalAudits: snapshot.size,
      validAuditsChecked: 0,
      affectedAudits: 0,
      affectedUsers: 0,
      skippedAudits: 0,
      sendAttempts: 0,
      sendFailures: 0
    }

    const auditsByEmail = new Map()

    snapshot.forEach((doc) => {
      const affectedAudit = buildAffectedAudit(doc)

      if (!affectedAudit) {
        debug.skippedAudits += 1
        console.log(`[detect-changes] skipped ${doc.id}: no current impact`)
        return
      }

      debug.validAuditsChecked += 1
      debug.affectedAudits += 1

      const existing = auditsByEmail.get(affectedAudit.email) || []
      existing.push(affectedAudit)
      auditsByEmail.set(affectedAudit.email, existing)

      console.log(
        `[detect-changes] matched ${doc.id} for ${affectedAudit.email}: ${affectedAudit.priceChanges.join(", ") || affectedAudit.impact.summary}`
      )
    })

    debug.affectedUsers = auditsByEmail.size

    for (const [email, audits] of auditsByEmail.entries()) {
      const consolidatedAudits = sortAuditsNewestFirst(audits)
      debug.sendAttempts += 1

      try {
        const sendResult = await resend.emails.send({
          from: "SpendLens <onboarding@resend.dev>",
          to: email,
          subject: "AI prices changed — your SpendLens audit needs a re-check",
          html: buildEmailHtml(appUrl, consolidatedAudits)
        })

        console.log(`[detect-changes] email sent to ${email}`, sendResult)
      } catch (sendError) {
        debug.sendFailures += 1
        console.error(`[detect-changes] email failed for ${email}`, sendError)
      }
    }

    return res.status(200).json({
      appUrl,
      auditsChecked: snapshot.size,
      affectedAudits: debug.affectedAudits,
      affectedUsers: debug.affectedUsers,
      emailsSent: debug.sendAttempts - debug.sendFailures,
      debug
    })
  } catch (error) {
    console.error("detect-changes failed", error)

    return res.status(500).json({
      error: error?.message || "Failed to detect pricing changes"
    })
  }
}
