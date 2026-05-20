/* eslint-disable no-undef */
import { initializeApp, cert, getApps } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"
import { Resend } from "resend"
import { pricingData } from "../src/audit/pricingData.js"

const keyMap = {
  "ChatGPT": "chatgpt",
  "Claude": "claude",
  "Cursor": "cursor",
  "GitHub Copilot": "githubCopilot",
  "Gemini": "gemini",
  "Windsurf": "windsurf"
}

const getAppUrl = (req) => {
  if (process.env.VITE_APP_URL) {
    return process.env.VITE_APP_URL
  }

  const protocol = req.headers["x-forwarded-proto"] || "http"
  const host = req.headers.host

  return host ? `${protocol}://${host}` : null
}

const getDb = () => {
  if (!getApps().length) {
    initializeApp({
      credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT))
    })
  }

  return getFirestore()
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
    const emailsToSend = []
    const debug = {
      totalAudits: snapshot.size,
      auditsWithoutEmail: 0,
      auditsWithoutSnapshot: 0,
      auditsWithoutTools: 0,
      unchangedAudits: 0,
      matchedAudits: 0,
      sendAttempts: 0,
      sendFailures: 0
    }

    snapshot.forEach((doc) => {
      const { userEmail, pricingSnapshot, userInput } = doc.data()
      const tools = userInput?.tools

      if (!userEmail) {
        debug.auditsWithoutEmail += 1
        console.log(`[detect-changes] skipping ${doc.id}: missing userEmail`)
        return
      }

      if (!pricingSnapshot) {
        debug.auditsWithoutSnapshot += 1
        console.log(`[detect-changes] skipping ${doc.id}: missing pricingSnapshot`)
        return
      }

      if (!Array.isArray(tools) || tools.length === 0) {
        debug.auditsWithoutTools += 1
        console.log(`[detect-changes] skipping ${doc.id}: missing userInput.tools`)
        return
      }

      const changes = []
      tools.forEach((tool) => {
        const key = keyMap[tool.tool]
        if (!key) return
        const oldPrice = pricingSnapshot[key]?.[tool.plan]
        const newPrice = pricingData[key]?.[tool.plan]
        if (oldPrice !== undefined && newPrice !== undefined && oldPrice !== newPrice) {
          changes.push(`${tool.tool} (${tool.plan}): $${oldPrice} → $${newPrice}`)
        }
      })

      if (changes.length > 0) {
        debug.matchedAudits += 1
        console.log(`[detect-changes] matched ${doc.id} for ${userEmail}: ${changes.join(", ")}`)
        emailsToSend.push({ email: userEmail, auditId: doc.id, changes })
      } else {
        debug.unchangedAudits += 1
        console.log(`[detect-changes] no price changes for ${doc.id}`)
      }
    })

    for (const { email, auditId, changes } of emailsToSend) {
      debug.sendAttempts += 1
      try {
        const sendResult = await resend.emails.send({
          from: "SpendLens <onboarding@resend.dev>",
          to: email,
          subject: "AI prices changed — your audit is outdated",
          html: `
            <p>These prices changed since your audit:</p>
            <p>${changes.join("<br/>")}</p>
            <a href="${appUrl}/audit/${auditId}/diff">
              Click here to see updated audit
            </a>
          `
        })
        console.log(`[detect-changes] email sent for ${auditId} to ${email}`, sendResult)
      } catch (sendError) {
        debug.sendFailures += 1
        console.error(`[detect-changes] email failed for ${auditId} to ${email}`, sendError)
      }
    }

    return res.status(200).json({
      appUrl,
      auditsChecked: snapshot.size,
      emailsQueued: emailsToSend.length,
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
