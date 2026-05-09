import { CircleArrowOutUpRight, Drone } from 'lucide-react'
import FormHeroSection from './FormHeroSection'
import FormAISelect from './FormAISelect'

const Form = () => {
  return (
    <div className='min-h-screen bg-[#fafaf8]'>
      <div className='border-b border-black/8 bg-white/90 backdrop-blur'>
        <div className='mx-auto flex max-w-[1280px] flex-col gap-4 px-4 py-4 md:px-8 xl:flex-row xl:items-center xl:justify-between'>
          <div className='flex items-center gap-2'>
            <CircleArrowOutUpRight size={25} color='green' />
            <h1 className='text-xl font-semibold'>SpendLens</h1>
          </div>
          <div className='flex flex-wrap items-center gap-3 text-sm md:gap-5'>
            <div className='flex items-center gap-2'>
              <h1 className='flex h-8 w-8 items-center justify-center rounded-full bg-green-800 text-white'>1</h1>
              <h1 className='text-gray-700'>Welcome</h1>
              <div className='hidden h-px w-10 bg-green-500 md:block'></div>
            </div>
            <div className='flex items-center gap-2'>
              <h1 className='flex h-8 w-8 items-center justify-center rounded-full bg-green-800 text-white'>2</h1>
              <h1 className='font-medium text-green-700'>Select your tools</h1>
              <div className='hidden h-px w-10 bg-green-500 md:block'></div>
            </div>
            <div className='flex items-center gap-2'>
              <h1 className='flex h-8 w-8 items-center justify-center rounded-full bg-green-800 text-white'>3</h1>
              <h1 className='text-gray-700'>Get your audit</h1>
            </div>
          </div>
          <div className='inline-flex w-fit items-center gap-2 rounded-2xl border border-black/10 px-3 py-2'>
            <Drone color='green' size={18} />
            <h1 className='font-semibold text-gray-800'>Why we ask</h1>
          </div>
        </div>
      </div>
      <FormHeroSection />
      <FormAISelect />
    </div>
  )
}

export default Form
