import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { CircleArrowOutUpRight, MoveLeft, TrendingDown, TrendingUp } from 'lucide-react'
import { getAudit } from '../../service/auditService'
import { generateAudit } from '../../audit/generateAudit'
import { pricingData } from '../../audit/pricingData'

const keyMap = {
  "ChatGPT": "chatgpt",
  "Claude": "claude",
  "Cursor": "cursor",
  "GitHub Copilot": "githubCopilot",
  "Gemini": "gemini",
  "Windsurf": "windsurf"
}

const formatMoney = (value) => `$${Number(value || 0).toFixed(0)}`

const formatPlanLabel = (plan) => {
  if (!plan) return "Unknown plan"

  return plan
    .split("-")
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ")
}

const getPriceChanges = (audit) => {
  const changes = []

  audit.userInput?.tools?.forEach((tool) => {
    const key = keyMap[tool.tool]
    if (!key) return

    const oldPrice = audit.pricingSnapshot?.[key]?.[tool.plan]
    const newPrice = pricingData[key]?.[tool.plan]

    if (oldPrice === undefined && newPrice === undefined) return

    changes.push({
      tool: tool.tool,
      plan: tool.plan,
      oldPrice,
      newPrice,
      changed: oldPrice !== newPrice
    })
  })

  return changes
}

const getRecommendationRows = (oldRecommendations = [], newRecommendations = []) => {
  const oldByTool = new Map(oldRecommendations.map((item) => [item.tool, item]))
  const newByTool = new Map(newRecommendations.map((item) => [item.tool, item]))
  const tools = Array.from(new Set([...oldByTool.keys(), ...newByTool.keys()]))

  return tools.map((tool) => {
    const oldItem = oldByTool.get(tool) || null
    const newItem = newByTool.get(tool) || null

    return {
      tool,
      oldItem,
      newItem,
      changed: JSON.stringify(oldItem) !== JSON.stringify(newItem)
    }
  })
}

const RecommendationCard = ({ title, item, accentClass }) => {
  if (!item) {
    return (
      <div className={`rounded-2xl border p-4 ${accentClass}`}>
        <p className='text-xs font-semibold uppercase tracking-[0.16em]'>{title}</p>
        <p className='mt-3 text-sm text-gray-500'>No recommendation for this tool in this version of the audit.</p>
      </div>
    )
  }

  return (
    <div className={`rounded-2xl border p-4 ${accentClass}`}>
      <p className='text-xs font-semibold uppercase tracking-[0.16em]'>{title}</p>
      <h3 className='mt-3 font-semibold text-gray-900'>{item.recommendation}</h3>
      <p className='mt-1 text-sm text-gray-500'>Current plan: {item.currentPlan}</p>
      <div className='mt-3 flex flex-wrap gap-3 text-sm'>
        <span>Current spend {formatMoney(item.currentSpend)}/mo</span>
        <span>Optimized spend {formatMoney(item.optimizedSpend)}/mo</span>
        <span>Savings {formatMoney(item.monthlySavings)}/mo</span>
      </div>
      <p className='mt-3 text-sm leading-6 text-gray-700'>{item.reason}</p>
    </div>
  )
}

const AuditDiff = () => {
  const { id } = useParams()
  const [oldAudit, setOldAudit] = useState(null)
  const [newAudit, setNewAudit] = useState(null)
  const [priceChanges, setPriceChanges] = useState([])
  const [recommendationRows, setRecommendationRows] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isActive = true

    const load = async () => {
      try {
        const data = await getAudit(id)
        if (!isActive) return

        if (!data) {
          setLoading(false)
          return
        }

        const nextAudit = generateAudit(data.userInput)

        setOldAudit(data)
        setNewAudit(nextAudit)
        setPriceChanges(getPriceChanges(data))
        setRecommendationRows(
          getRecommendationRows(data.auditResult?.recommendations, nextAudit.recommendations)
        )
      } finally {
        if (isActive) {
          setLoading(false)
        }
      }
    }

    load()

    return () => {
      isActive = false
    }
  }, [id])

  if (loading) return <div className='min-h-screen flex items-center justify-center'>Loading...</div>
  if (!oldAudit || !newAudit) return <div className='min-h-screen flex items-center justify-center'>Audit not found</div>

  const savingsDelta = Number(newAudit.totalMonthlySavings || 0) - Number(oldAudit.auditResult?.totalMonthlySavings || 0)
  const hasRecommendationChanges = recommendationRows.some((row) => row.changed)

  return (
    <div className='min-h-screen bg-[#fafaf8]'>
      <div className='border-b border-black/8 bg-white px-6 py-4 flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <CircleArrowOutUpRight size={22} color='green' />
          <span className='font-semibold'>SpendLens</span>
        </div>
        <Link to={`/audit/${id}`} className='flex items-center gap-2 text-sm text-gray-600'>
          <MoveLeft className='h-4 w-4' /> Back to audit
        </Link>
      </div>

      <div className='max-w-5xl mx-auto px-4 py-8 flex flex-col gap-6'>
        <div className='bg-white rounded-[28px] border border-black/8 p-6'>
          <h1 className='text-2xl font-semibold'>What changed since your last audit</h1>
          <p className='text-sm text-gray-500 mt-2'>
            This view compares the audit you originally saved with a fresh re-run using the current pricing data.
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <div className='bg-white rounded-[28px] border border-black/8 p-6'>
            <p className='text-xs font-semibold uppercase tracking-[0.16em] text-gray-500'>Previous savings</p>
            <p className='text-3xl font-semibold mt-3'>{formatMoney(oldAudit.auditResult?.totalMonthlySavings)}/mo</p>
            <p className='text-sm text-gray-500 mt-2'>{oldAudit.auditResult?.recommendations?.length || 0} recommendations</p>
          </div>

          <div className='bg-green-50 rounded-[28px] border border-green-200 p-6'>
            <p className='text-xs font-semibold uppercase tracking-[0.16em] text-green-700'>Updated savings</p>
            <p className='text-3xl font-semibold mt-3 text-green-700'>{formatMoney(newAudit.totalMonthlySavings)}/mo</p>
            <p className='text-sm text-green-700 mt-2'>{newAudit.recommendations?.length || 0} recommendations</p>
          </div>

          <div className='bg-white rounded-[28px] border border-black/8 p-6'>
            <p className='text-xs font-semibold uppercase tracking-[0.16em] text-gray-500'>Headline delta</p>
            <div className='mt-3 flex items-center gap-2'>
              {savingsDelta >= 0 ? (
                <TrendingUp className='h-5 w-5 text-green-700' />
              ) : (
                <TrendingDown className='h-5 w-5 text-red-600' />
              )}
              <p className={`text-3xl font-semibold ${savingsDelta >= 0 ? 'text-green-700' : 'text-red-600'}`}>
                {savingsDelta >= 0 ? '+' : '-'}{formatMoney(Math.abs(savingsDelta))}
              </p>
            </div>
            <p className='text-sm text-gray-500 mt-2'>
              {hasRecommendationChanges ? 'Recommendation details changed too.' : 'Recommendation set stayed the same.'}
            </p>
          </div>
        </div>

        <div className='bg-white rounded-[28px] border border-black/8 p-6'>
          <h2 className='font-semibold text-lg mb-4'>Price changes</h2>
          {priceChanges.length === 0 ? (
            <p className='text-gray-500 text-sm'>No direct price change rows were found for the plans in this audit.</p>
          ) : (
            priceChanges.map((item) => (
              <div
                key={`${item.tool}-${item.plan}`}
                className={`flex items-center justify-between rounded-2xl p-4 mb-3 border ${item.changed ? 'bg-amber-50 border-amber-200' : 'bg-gray-50 border-black/8'}`}
              >
                <div>
                  <p className='font-semibold'>{item.tool}</p>
                  <p className='text-sm text-gray-500'>{formatPlanLabel(item.plan)} plan</p>
                </div>
                <div className='text-sm font-medium text-right'>
                  {item.oldPrice === undefined && item.newPrice !== undefined ? (
                    <span className='text-green-700'>Now {formatMoney(item.newPrice)}/mo</span>
                  ) : item.oldPrice !== undefined && item.newPrice === undefined ? (
                    <span className='text-red-600'>Previous {formatMoney(item.oldPrice)}/mo removed</span>
                  ) : item.changed ? (
                    <div className='flex items-center gap-2'>
                      <span className='line-through text-gray-400'>{formatMoney(item.oldPrice)}/mo</span>
                      <span>→</span>
                      <span className={item.newPrice > item.oldPrice ? 'text-red-600' : 'text-green-700'}>
                        {formatMoney(item.newPrice)}/mo
                      </span>
                    </div>
                  ) : (
                    <span className='text-gray-500'>{formatMoney(item.oldPrice)}/mo unchanged</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <div className='bg-white rounded-[28px] border border-black/8 p-6'>
          <div className='flex items-end justify-between gap-4 mb-4'>
            <div>
              <h2 className='font-semibold text-lg'>Recommendation diff</h2>
              <p className='text-sm text-gray-500 mt-1'>Old recommendation vs fresh recommendation, grouped by tool.</p>
            </div>
          </div>

          {recommendationRows.length === 0 ? (
            <p className='text-sm text-gray-500'>No recommendations were generated in either version of the audit.</p>
          ) : (
            <div className='flex flex-col gap-5'>
              {recommendationRows.map((row) => (
                <div
                  key={row.tool}
                  className={`rounded-[24px] border p-4 ${row.changed ? 'border-green-200 bg-green-50/50' : 'border-black/8 bg-[#fcfcfb]'}`}
                >
                  <div className='flex items-center justify-between gap-3 mb-4'>
                    <h3 className='text-lg font-semibold'>{row.tool}</h3>
                    <span className={`text-xs font-semibold uppercase tracking-[0.16em] ${row.changed ? 'text-green-700' : 'text-gray-500'}`}>
                      {row.changed ? 'Changed' : 'Unchanged'}
                    </span>
                  </div>

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <RecommendationCard
                      title='Previous audit'
                      item={row.oldItem}
                      accentClass='border-black/8 bg-white'
                    />
                    <RecommendationCard
                      title='Updated audit'
                      item={row.newItem}
                      accentClass='border-green-200 bg-green-50'
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className='flex justify-center'>
          <Link to='/audit' className='bg-green-900 text-white px-8 py-4 rounded-2xl font-semibold'>
            Run a fresh audit
          </Link>
        </div>
      </div>
    </div>
  )
}

export default AuditDiff
