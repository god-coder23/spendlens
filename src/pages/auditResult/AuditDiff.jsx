import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getAudit } from '../../service/auditService'
import { generateAudit } from '../../audit/generateAudit'
import { pricingData } from '../../audit/pricingData'
import { CircleArrowOutUpRight, MoveLeft } from 'lucide-react'

const keyMap = {
  "ChatGPT": "chatgpt",
  "Claude": "claude",
  "Cursor": "cursor",
  "GitHub Copilot": "githubCopilot",
  "Gemini": "gemini",
  "Windsurf": "windsurf"
}

const AuditDiff = () => {
  const { id } = useParams()
  const [oldAudit, setOldAudit] = useState(null)
  const [newAudit, setNewAudit] = useState(null)
  const [priceChanges, setPriceChanges] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const data = await getAudit(id)
      if (!data) return setLoading(false)

      const newResult = generateAudit(data.userInput)

      const changes = []
      data.userInput?.tools?.forEach((tool) => {
        const key = keyMap[tool.tool]
        if (!key) return

        const oldPrice = data.pricingSnapshot?.[key]?.[tool.plan]
        const newPrice = pricingData[key]?.[tool.plan]

        if (oldPrice !== undefined && newPrice !== undefined) {
          changes.push({tool: tool.tool, plan: tool.plan, oldPrice, newPrice, changed: oldPrice !== newPrice})}})

      setOldAudit(data)
      setNewAudit(newResult)
      setPriceChanges(changes)
      setLoading(false)
    }

    load()
  }, [id])

  if (loading) return <div className='min-h-screen flex items-center justify-center'>Loading...</div>
  if (!oldAudit) return <div className='min-h-screen flex items-center justify-center'>Audit not found</div>

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

      <div className='max-w-4xl mx-auto px-4 py-8 flex flex-col gap-6'>

        <div className='bg-white rounded-[28px] border border-black/8 p-6'>
          <h1 className='text-2xl font-semibold'>What changed since your last audit</h1>
          <p className='text-sm text-gray-500 mt-1'>Prices changed for some tools. Here's the old vs new breakdown.</p>
        </div>

        <div className='bg-white rounded-[28px] border border-black/8 p-6'>
          <h2 className='font-semibold text-lg mb-4'>Price changes</h2>
          {priceChanges.length === 0 ? (
            <p className='text-gray-500 text-sm'>No price changes detected.</p>): 
            (priceChanges.map((item) => (
              <div key={item.tool} className={`flex items-center justify-between rounded-2xl p-4 mb-3 border ${item.changed ? 'bg-amber-50 border-amber-200' : 'bg-gray-50 border-black/8'}`}>
                <div>
                  <p className='font-semibold'>{item.tool}</p>
                  <p className='text-sm text-gray-500 capitalize'>{item.plan} plan</p>
                </div>
                <div className='flex items-center gap-2 text-sm font-medium'>
                  {item.changed ? (
                    <>
                      <span className='line-through text-gray-400'>${item.oldPrice}/mo</span>
                      <span>→</span>
                      <span className={item.newPrice > item.oldPrice ? 'text-red-600' : 'text-green-600'}>
                        ${item.newPrice}/mo
                      </span>
                    </>
                  ) : (
                    <span className='text-gray-500'>${item.oldPrice}/mo — no change</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>

          <div className='bg-white rounded-[28px] border border-black/8 p-6'>
            <span className='text-xs font-semibold uppercase text-gray-500'>Previous audit</span>
            <p className='text-3xl font-semibold mt-3'>
              ${oldAudit.auditResult?.totalMonthlySavings || 0}
              <span className='text-sm font-normal text-gray-500'>/mo savings</span>
            </p>
            <p className='text-sm text-gray-500 mt-1'>
              {oldAudit.auditResult?.recommendations?.length || 0} recommendations
            </p>
          </div>

          <div className='bg-green-50 rounded-[28px] border border-green-200 p-6'>
            <span className='text-xs font-semibold uppercase text-green-700'>Updated audit</span>
            <p className='text-3xl font-semibold mt-3 text-green-700'>
              ${newAudit?.totalMonthlySavings || 0}
              <span className='text-sm font-normal text-green-600'>/mo savings</span>
            </p>
            <p className='text-sm text-green-600 mt-1'>
              {newAudit?.recommendations?.length || 0} recommendations
            </p>
          </div>

        </div>

        <div className='flex justify-center'>
          <Link to='/audit' className='bg-green-900 text-white px-8 py-4 rounded-2xl font-semibold'>
            Re-run audit with current prices
          </Link>
        </div>

      </div>
    </div>
  )
}

export default AuditDiff