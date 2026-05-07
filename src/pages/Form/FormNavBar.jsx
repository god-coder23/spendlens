import { CircleArrowOutUpRight, Drone } from 'lucide-react'
import React from 'react'
import FormHeroSection from './FormHeroSection'
import FormAISelect from './FormAISelect'

const Form = () => {
  return (
    <div>
      <div className='py-3 px-10 flex flex-row justify-between'>
        <div className='flex gap-2 px-4 items-center'>
            <CircleArrowOutUpRight size={25} color='green' />
            <h1 className='text-xl'>SpendLens</h1>
        </div>
        <div className='flex flex-row items-center justify-center gap-10'>
          <div className='flex flex-row gap-2 items-center'>
            <h1 className='h-8 w-8 p-2 rounded-full bg-green-800 flex items-center justify-center text-white'>1</h1>
            <h1>Welcome</h1>
            <div className='w-20 h-[0.7px] bg-green-500 ml-3'></div>
          </div>
          <div className='flex flex-row gap-2 items-center'>
            <h1 className='h-8 w-8 p-2 rounded-full bg-green-800 flex items-center justify-center text-white'>2</h1>
            <h1 className='text-green-700'>Select your tools</h1>
            <div className='w-20 h-[0.7px] bg-green-500 ml-3'></div>
          </div>
          <div className='flex flex-row gap-2 items-center'>
            <h1 className='h-8 w-8 p-2 rounded-full bg-green-800 flex items-center justify-center text-white'>3</h1>
            <h1>Get your audit</h1>
          </div>
        </div>
        <div className='w-fit h-fit py-1 px-3 rounded-2xl border border-black/10 flex flex-row gap-2'>
          <Drone color='green' />
          <h1 className='font-semibold'>Why we ask</h1>
        </div>
      </div>
      <FormHeroSection />
      <FormAISelect />
    </div>
  )
}

export default Form
