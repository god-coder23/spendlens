/* eslint-disable no-undef */
import { initializeApp, cert, getApps } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"
import { Resend } from "resend"
import { pricingData } from "../src/audit/pricingData.js"

if (!getApps().length) {
  initializeApp({
    credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT))
  })
}

const db = getFirestore()
const resend = new Resend(process.env.RESEND_API_KEY)

const keyMap = {
  "ChatGPT": "chatgpt",
  "Claude": "claude",
  "Cursor": "cursor",
  "GitHub Copilot": "githubCopilot",
  "Gemini": "gemini",
  "Windsurf": "windsurf"
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

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
        <a href="${process.env.VITE_APP_URL}/audit/${auditId}/diff">
          Click here to see updated audit
        </a>
      `
    })
  }

  return res.status(200).json({ emailsSent: emailsToSend.length })
}