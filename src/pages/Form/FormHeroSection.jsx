import { LockKeyhole } from 'lucide-react'

const FormHeroSection = () => {
  return (
    <div className='w-full'>
      <div className='mx-auto flex max-w-[980px] flex-col items-center gap-5 px-4 py-10 text-center md:py-12'>
        <h1 className='text-4xl font-semibold tracking-tight md:text-5xl'>Let's configure your AI tool stack</h1>
        <h1 className='max-w-2xl text-sm leading-6 text-gray-500 md:text-base'>
          Add the AI tools you pay for and we'll analyze your current setup to identify practical savings opportunities.
        </h1>
        <div className='flex flex-col items-center gap-3 rounded-2xl bg-green-500/10 px-5 py-3 text-center sm:flex-row'>
          <LockKeyhole size={18} color='green' />
          <h1 className='text-sm text-gray-700'>Your data is secure and never shared. We only use it to generate your audit.</h1>
        </div>
      </div>
    </div>
  )
}

export default FormHeroSection
