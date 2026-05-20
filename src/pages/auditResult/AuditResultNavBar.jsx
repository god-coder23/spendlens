import { CircleArrowOutUpRight, Drone, MoveLeft } from 'lucide-react'
import { useEffect, useState } from 'react'
import AuditResultHero from './AuditResultHero'
import { Link, useLocation, useParams } from 'react-router-dom'
import { getAudit } from '../../service/auditService'

const AuditResultNavBar = () => {
  const { id } = useParams()
  const location = useLocation()
  const [auditPayload, setAuditPayload] = useState(location.state || null)
  const [isLoadingAudit, setIsLoadingAudit] = useState(!location.state)

  useEffect(() => {
    if (location.state?.auditResult && location.state?.userInput) {
      setAuditPayload(location.state)
      setIsLoadingAudit(false)
      return
    }

    let isActive = true

    const loadAudit = async () => {
      setIsLoadingAudit(true)

      try {
        const persistedAudit = await getAudit(id)

        if (isActive && persistedAudit) {
          setAuditPayload(persistedAudit)
        }
      } catch (error) {
        console.log(error)
      } finally {
        if (isActive) {
          setIsLoadingAudit(false)
        }
      }
    }

    loadAudit()

    return () => {
      isActive = false
    }
  }, [id, location.state])

  const { auditResult, userInput } = auditPayload || {}

  if (isLoadingAudit) {
    return (
      <div className='min-h-screen bg-[#fafaf8] px-4 py-10 md:px-8'>
        <div className='mx-auto flex max-w-3xl flex-col gap-4 rounded-[32px] border border-black/8 bg-white p-8 shadow-sm'>
          <div className='flex items-center gap-2'>
            <CircleArrowOutUpRight size={24} color='green' />
            <h1 className='text-xl font-semibold'>SpendLens</h1>
          </div>
          <div>
            <h2 className='text-3xl font-semibold text-gray-900'>Loading audit</h2>
            <p className='mt-3 text-sm leading-6 text-gray-600'>
              We&apos;re pulling this saved audit from Firestore so the shared link works across refreshes and browsers.
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (!auditResult || !userInput) {
    return (
      <div className='min-h-screen bg-[#fafaf8] px-4 py-10 md:px-8'>
        <div className='mx-auto flex max-w-3xl flex-col gap-6 rounded-[32px] border border-black/8 bg-white p-8 shadow-sm'>
          <div className='flex items-center gap-2'>
            <CircleArrowOutUpRight size={24} color='green' />
            <h1 className='text-xl font-semibold'>SpendLens</h1>
          </div>
          <div>
            <h2 className='text-3xl font-semibold text-gray-900'>Audit data not found</h2>
            <p className='mt-3 text-sm leading-6 text-gray-600'>
              We couldn't find this audit in the shared link store. The link may be invalid, or the audit may not have been saved successfully.
            </p>
          </div>
          <Link to="/audit" className='inline-flex w-fit items-center gap-2 rounded-2xl bg-green-900 px-5 py-3 font-medium text-white'>
            <MoveLeft className='h-4 w-4' />
            Back to audit form
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-[#fafaf8]'>
      <div className='border-b border-black/8 bg-white/90 backdrop-blur'>
        <div className='mx-auto flex max-w-[1280px] flex-col gap-4 px-4 py-4 md:px-8 xl:px-10 xl:flex-row xl:items-center xl:justify-between'>
          <div className='flex items-center gap-2'>
            <CircleArrowOutUpRight size={25} color='green' />
            <h1 className='text-xl font-semibold'>SpendLens</h1>
          </div>

          <div className='flex flex-wrap items-center gap-3 text-sm md:gap-5'>
            <div className='flex items-center gap-2'>
              <span className='flex h-8 w-8 items-center justify-center rounded-full bg-green-800 text-white'>1</span>
              <span className='text-gray-700'>Welcome</span>
            </div>
            <div className='hidden h-px w-10 bg-green-500 md:block' />
            <div className='flex items-center gap-2'>
              <span className='flex h-8 w-8 items-center justify-center rounded-full bg-green-800 text-white'>2</span>
              <span className='text-gray-700'>Select your tools</span>
            </div>
            <div className='hidden h-px w-10 bg-green-500 md:block' />
            <div className='flex items-center gap-2'>
              <span className='flex h-8 w-8 items-center justify-center rounded-full bg-green-800 text-white'>3</span>
              <span className='font-medium text-green-700'>Get your audit</span>
            </div>
          </div>

          <div className='inline-flex w-fit items-center gap-2 rounded-2xl border border-black/10 px-3 py-2'>
            <Drone color='green' size={18} />
            <h1 className='font-semibold text-gray-800'>Why we ask</h1>
          </div>
        </div>
      </div>

      <AuditResultHero auditResult={auditResult} userInput={userInput} />
    </div>
  )
}

export default AuditResultNavBar
