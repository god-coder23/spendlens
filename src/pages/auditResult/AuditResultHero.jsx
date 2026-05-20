import {
  ArrowRight,
  BadgeDollarSign,
  Calendar,
  CheckCircle2,
  Copy,
  Info,
  Link2,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
  TriangleAlert
} from 'lucide-react'
import Chatgpt_icon from '../../assets/images/chatgpt-icon.webp'
import Gemini_icon from '../../assets/images/google-gemini-icon.webp'
import Claude_icon from '../../assets/images/claude-ai.svg'
import Cursor_icon from '../../assets/images/cursor-ai-code-icon.webp'
import Github_copliot_icon from '../../assets/images/github-copilot-icon.webp'
import Anthropic_icon from '../../assets/images/Anthropic-Claude.png'
import Windsurf_icon from '../../assets/images/windsurf-black-symbol.webp'
import React, { useState } from 'react'
import emailjs from "@emailjs/browser"
const toolIconMap = {
  ChatGPT: Chatgpt_icon,
  Claude: Claude_icon,
  "GitHub Copilot": Github_copliot_icon,
  "Github Copilot": Github_copliot_icon,
  Gemini: Gemini_icon,
  Cursor: Cursor_icon,
  "OpenAI API": Chatgpt_icon,
  "Anthropic API": Anthropic_icon,
  Windsurf: Windsurf_icon
}

const formatCurrency = (value) => {
  const normalizedValue = Number(value) || 0
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(normalizedValue)
}

const formatPlanLabel = (plan) => {
  if (!plan) return "Unknown plan"

  return plan
    .split("-")
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ")
}

const formatUsageLabel = (usageType) => {
  if (!usageType) return ""

  return usageType
    .split(" ")
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ")
}

const AuditResultHero = ({ userInput, auditResult }) => {
  const recommendations = auditResult?.recommendations || []
  const selectedTools = userInput?.tools || []
  const totalMonthlySavings = auditResult?.totalMonthlySavings || 0
  const totalAnnualSavings = auditResult?.totalAnnualSavings || 0
  const [isCopyClicked, setIsCopyClicked] = React.useState(false);
  const [showCopied, setShowCopied] = useState(false);
  const [email, setEmail] = useState("")
  const shareLink = typeof window !== "undefined"
    ? `${window.location.origin}${window.location.pathname}`
    : "https://spendlens.com/audit"
  const isOptimized = auditResult?.isOptimized
  const handleCopyLink = () =>{
    navigator.clipboard.writeText(shareLink)
    setIsCopyClicked(true)
    setShowCopied(true);
    setTimeout(() => {
        setShowCopied(false);
    }, 1000);
  }
  const handleSendReport = async () =>{
    try {
        await emailjs.send(
        "service_wvr7z9o",
        "template_dtosguk",
        {
            to_email: email,
            monthly_savings: `$${totalMonthlySavings}`,
            annual_savings: `$${totalAnnualSavings}`,
            summary: auditResult?.summary,
            audit_link: shareLink
        },
        "tvn77IHi_NeRgIRBu"
        )

        alert("Report sent")
    }catch (error) {
    console.log("FULL ERROR:", error)
    console.log("STATUS:", error?.status)
    console.log("TEXT:", error?.text)

    alert(error?.text || "Failed to send")
}

  }
  return (
    <div className='w-full pb-14'>
      <div className='mx-auto flex w-full max-w-[1280px] flex-col gap-8 px-4 py-6 md:px-8 xl:px-10'>
        <section className='rounded-[32px] border border-black/8 bg-[linear-gradient(135deg,#f8fff7_0%,#ffffff_45%,#f4f7ff_100%)] p-6 md:p-8 xl:p-10'>
          <div className='flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between'>
            <div className='max-w-3xl'>
              <div className='mb-4 inline-flex items-center gap-2 rounded-full border border-green-200 bg-white/80 px-3 py-1.5 text-sm font-medium text-green-800'>
                <Sparkles className='h-4 w-4' />
                Audit complete
              </div>
              <h1 className='text-3xl font-semibold tracking-tight text-black md:text-5xl'>Your AI spend audit is ready</h1>
              <p className='mt-4 max-w-2xl text-sm leading-6 text-gray-600 md:text-base'>
                This report uses the plans, seats, monthly spend, and usage data you entered to surface practical savings opportunities without changing your team&apos;s workflow.
              </p>
            </div>

            <div className='grid w-full max-w-xl grid-cols-1 gap-3 sm:grid-cols-3'>
              <div className='rounded-2xl border border-black/8 bg-white p-4 shadow-sm'>
                <div className='mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-700'>
                  <BadgeDollarSign className='h-5 w-5' />
                </div>
                <p className='text-sm text-gray-500'>Monthly savings</p>
                <h2 className='mt-2 text-2xl font-semibold text-green-800'>{formatCurrency(totalMonthlySavings)}</h2>
              </div>

              <div className='rounded-2xl border border-black/8 bg-white p-4 shadow-sm'>
                <div className='mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-700'>
                  <Calendar className='h-5 w-5' />
                </div>
                <p className='text-sm text-gray-500'>Annual savings</p>
                <h2 className='mt-2 text-2xl font-semibold text-green-800'>{formatCurrency(totalAnnualSavings)}</h2>
              </div>

              <div className='rounded-2xl border border-black/8 bg-white p-4 shadow-sm'>
                <div className='mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-700'>
                  <CheckCircle2 className='h-5 w-5' />
                </div>
                <p className='text-sm text-gray-500'>Recommendations</p>
                <h2 className='mt-2 text-2xl font-semibold text-gray-900'>{recommendations.length}</h2>
              </div>
            </div>
          </div>
        </section>

        <div className='grid grid-cols-1 gap-4 xl:grid-cols-[1.25fr_0.75fr]'>
          <section className='rounded-[28px] border border-black/8 bg-white p-6 shadow-sm'>
            <div className='flex items-start gap-3'>
              <ShieldCheck className='mt-0.5 h-5 w-5 text-green-700' />
              <div>
                <h2 className='font-semibold text-gray-900'>Your audit inputs</h2>
                <p className='mt-1 text-sm text-gray-600'>These recommendations reflect the actual tool data you entered.</p>
              </div>
            </div>

            <div className='mt-5 grid grid-cols-1 gap-3 lg:grid-cols-2'>
              {selectedTools.map((tool) => (
                <div key={tool.tool} className='rounded-2xl border border-black/8 bg-[#fcfcfb] p-4'>
                  <div className='flex items-start gap-3'>
                    <img src={toolIconMap[tool.tool]} alt={tool.tool} className='h-11 w-11 rounded-xl object-contain' />
                    <div className='min-w-0'>
                      <h3 className='font-semibold text-gray-900'>{tool.tool}</h3>
                      <p className='mt-1 text-sm text-gray-500'>
                        {formatPlanLabel(tool.plan)} • {tool.seats || 1} seat{(tool.seats || 1) > 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                  <div className='mt-4 flex flex-wrap gap-2'>
                    {(tool.usageTypes || []).length > 0 ? (
                      tool.usageTypes.map((usageType) => (
                        <span key={usageType} className='rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-800'>
                          {formatUsageLabel(usageType)}
                        </span>
                      ))
                    ) : (
                      <span className='rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600'>No usage tags</span>
                    )}
                    {typeof tool.spend === "number" && tool.spend > 0 ? (
                      <span className='rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700'>
                        Spend {formatCurrency(tool.spend)}/mo
                      </span>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className='rounded-[28px] border border-green-100 bg-green-50 p-6 shadow-sm'>
            <div className='flex items-start gap-3'>
              <Info className='mt-0.5 h-5 w-5 text-green-700' />
              <div>
                <h2 className='font-semibold text-gray-900'>Notes</h2>
                <p className='mt-1 text-sm leading-6 text-gray-600'>
                  Savings are estimated from your inputs and the pricing rules currently used in SpendLens. They are best treated as directional guidance for plan cleanup and cost review.
                </p>
              </div>
            </div>

            {userInput?.extraInfo ? (
              <div className='mt-5 rounded-2xl border border-green-200 bg-white/80 p-4'>
                <p className='text-xs font-semibold uppercase tracking-[0.18em] text-green-800'>Your note</p>
                <p className='mt-2 text-sm leading-6 text-gray-700'>{userInput.extraInfo}</p>
              </div>
            ) : null}
          </section>
        </div>

        <section className='rounded-[28px] border border-black/8 bg-white p-6 shadow-sm'>
          <div className='flex flex-col gap-2 md:flex-row md:items-end md:justify-between'>
            <div>
              <h2 className='text-2xl font-semibold text-gray-900'>Recommendations</h2>
              <p className='mt-1 text-sm text-gray-600'>Review each recommendation with current spend, optimized spend, and expected savings.</p>
            </div>
          </div>

          {recommendations.length === 0 ? (
            <div className='mt-6 rounded-3xl border border-blue-100 bg-blue-50 p-6'>
              <div className='flex items-start gap-3'>
                <CheckCircle2 className='mt-0.5 h-5 w-5 text-blue-600' />
                <div>
                  <h3 className='font-semibold text-gray-900'>Your stack already looks well optimized</h3>
                  <p className='mt-2 text-sm leading-6 text-gray-600'>
                    Based on the current inputs, SpendLens did not find a major plan-change opportunity. That usually means your current setup is already reasonably aligned with team size and usage.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className='mt-6 grid grid-cols-1 gap-4'>
              {recommendations.map((item) => (
                <article key={`${item.tool}-${item.recommendation}`} className='rounded-3xl border border-black/8 bg-[#fcfcfb] p-5'>
                  <div className='flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between'>
                    <div className='flex min-w-0 gap-4'>
                      <img src={toolIconMap[item.tool]} alt={item.tool} className='h-12 w-12 rounded-2xl object-contain' />
                      <div className='min-w-0'>
                        <div className='flex flex-wrap items-center gap-2'>
                          <h3 className='text-lg font-semibold text-gray-900'>{item.tool}</h3>
                          <span className='rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700'>
                            Current plan: {item.currentPlan}
                          </span>
                          <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${item.confidence === "high" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}`}>
                            {item.confidence} confidence
                          </span>
                        </div>
                        <p className='mt-3 max-w-3xl text-sm leading-6 text-gray-600'>{item.reason}</p>
                      </div>
                    </div>

                    <div className='rounded-2xl bg-white px-4 py-3 xl:min-w-[220px]'>
                      <p className='text-sm text-gray-500'>Recommended action</p>
                      <p className='mt-1 font-semibold text-gray-900'>{item.recommendation}</p>
                    </div>
                  </div>

                  <div className='mt-5 grid grid-cols-1 gap-3 md:grid-cols-3'>
                    <div className='rounded-2xl border border-black/8 bg-white p-4'>
                      <p className='text-sm text-gray-500'>Current monthly spend</p>
                      <p className='mt-2 text-xl font-semibold text-gray-900'>{formatCurrency(item.currentSpend)}</p>
                    </div>

                    <div className='rounded-2xl border border-black/8 bg-white p-4'>
                      <p className='text-sm text-gray-500'>Optimized monthly spend</p>
                      <p className='mt-2 text-xl font-semibold text-gray-900'>{formatCurrency(item.optimizedSpend)}</p>
                    </div>

                    <div className='rounded-2xl border border-green-200 bg-green-50 p-4'>
                      <p className='text-sm text-green-800'>Estimated savings</p>
                      <p className='mt-2 text-xl font-semibold text-green-800'>
                        {formatCurrency(item.monthlySavings)}
                        <span className='ml-1 text-sm font-medium text-green-700'>/ month</span>
                      </p>
                      <p className='mt-1 text-sm text-green-700'>{formatCurrency(item.annualSavings)} / year</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <div className='grid grid-cols-1 gap-4 xl:grid-cols-[1.1fr_0.9fr]'>
          <section className='rounded-[28px] border border-black/8 bg-white p-6 shadow-sm'>
            <div className='flex items-start gap-3'>
              <Sparkles className='mt-0.5 h-5 w-5 text-green-700' />
              <div>
                <h2 className='text-xl font-semibold text-gray-900'>AI-generated summary</h2>
                <p className='mt-3 text-sm leading-7 text-gray-700'>
                  {auditResult?.summary || "We generated a concise summary of your current setup and the savings opportunities identified in this audit."}
                </p>
              </div>
            </div>
            <div className='mt-4 flex items-start gap-2 rounded-2xl bg-gray-50 p-3 text-sm text-gray-500'>
              <TriangleAlert className='mt-0.5 h-4 w-4 shrink-0' />
              AI summaries can be imperfect, so it's worth reviewing the recommendations above before making plan changes.
            </div>
          </section>

          <section className='rounded-[28px] border border-black/8 bg-white p-6 shadow-sm'>
            <div className='flex items-start gap-3'>
              <Mail className='mt-0.5 h-5 w-5 text-gray-700' />
              <div>
                <h2 className='text-xl font-semibold text-gray-900'>{isOptimized ? "Stay updated on future savings" : "Get your full audit report"}</h2>
                <p className='mt-2 text-sm leading-6 text-gray-600'>
                  {isOptimized
                    ? "Your stack looks solid right now. Leave an email if you want future pricing or optimization updates."
                    : "Enter your email to receive a report with the recommendations, savings summary, and next steps."}
                </p>
              </div>
            </div>

            <div className='mt-5 flex flex-col gap-3 sm:flex-row'>
              <input
                type='text'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='Enter your work email'
                className='h-12 w-full rounded-2xl border border-black/10 px-4 outline-none'
                />
              <button onClick={handleSendReport} className='inline-flex h-12 w-fit items-center justify-center gap-2 rounded-2xl bg-green-900 px-5 font-semibold text-white'>
                {isOptimized ? "Notify me" : "Send report"}
                <ArrowRight className='h-4 w-4' />
              </button>
            </div>

            <div className='mt-4 flex items-start gap-2 rounded-2xl bg-green-50 p-3 text-sm text-gray-600'>
              <Lock className='mt-0.5 h-4 w-4 shrink-0 text-green-700' />
              We'll keep your audit data private and only use this email for your report or updates.
            </div>
          </section>
        </div>

        <section className='grid grid-cols-1 gap-4 xl:grid-cols-[1.15fr_0.85fr]'>
          <div className='rounded-[28px] border border-black/8 bg-white p-6 shadow-sm'>
            <div className='flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'>
              <div>
                <h2 className='text-xl font-semibold text-gray-900'>Share your results</h2>
                <p className='mt-1 text-sm text-gray-600'>Anyone with the link can view this audit page.</p>
              </div>

              <div className='flex flex-col gap-3 sm:flex-row'>
                <div className='flex items-center gap-3 rounded-2xl border border-black/10 bg-[#fcfcfb] px-4 py-3 text-sm text-gray-600'>
                  <Link2 className='h-4 w-4 shrink-0' />
                  <span className='truncate'>{shareLink}</span>
                </div>
                <div className="relative">
                    <button
                        onClick={handleCopyLink}
                        className={`inline-flex items-center justify-center gap-2 rounded-2xl border border-black/10 px-4 py-3 ${
                        isCopyClicked ? "bg-green-500/30" : "bg-white"
                        } font-medium text-gray-800`}
                    >
                        <Copy className='h-4 w-4' />
                        Copy link
                    </button>

                    {showCopied && (
                        <div className="absolute -top-12 left-1/2 z-50 -translate-x-1/2 rounded-xl bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-xl whitespace-nowrap">
                        Link copied
                        </div>
                    )}
                    </div>
              </div>
            </div>
          </div>

          <div className='rounded-[28px] border border-black/8 bg-white p-6 shadow-sm'>
            <div className='flex items-start gap-3'>
              <ShieldCheck className='mt-0.5 h-5 w-5 text-green-700' />
              <div>
                <h2 className='text-xl font-semibold text-gray-900'>Pricing note</h2>
                <p className='mt-2 text-sm leading-6 text-gray-600'>
                  Recommendations are based on the pricing rules currently configured in this app and the real inputs you entered for plans, seats, spend, and usage.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default AuditResultHero
