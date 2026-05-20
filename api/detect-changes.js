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

    snapshot.forEach((doc) => {
      const { userEmail, pricingSnapshot, userInput } = doc.data()
      if (!userEmail || !pricingSnapshot) return

      const changes = []
      userInput?.tools?.forEach((tool) => {
        const key = keyMap[tool.tool]
        if (!key) return
        const oldPrice = pricingSnapshot[key]?.[tool.plan]
        const newPrice = pricingData[key]?.[tool.plan]
        if (oldPrice !== undefined && newPrice !== undefined && oldPrice !== newPrice) {
          changes.push(`${tool.tool} (${tool.plan}): $${oldPrice} → $${newPrice}`)
        }
      })

      if (changes.length > 0) {
        emailsToSend.push({ email: userEmail, auditId: doc.id, changes })
      }
    })

    for (const { email, auditId, changes } of emailsToSend) {
      await resend.emails.send({
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
    }

    return res.status(200).json({
      appUrl,
      auditsChecked: snapshot.size,
      emailsSent: emailsToSend.length
    })
  } catch (error) {
    console.error("detect-changes failed", error)

    return res.status(500).json({
      error: error?.message || "Failed to detect pricing changes"
    })
  }
}
