import { LockKeyhole } from 'lucide-react'
import React from 'react'

const FormHeroSection = () => {
  return (
    <div className='h-fit w-screen'>
      <div className='flex flex-col gap-5 justify-center items-center py-2'>
        <h1 className='text-4xl font-semibold'>Let's configure you AI tool stack</h1>
        <h1 className='text-gray-400 text-sm'>Add the AI tools you pay for and we will analyze your spend to find savings.</h1>
       <div className='flex flex-row gap-3 w-fit h-fit py-2 px-4 bg-green-500/10 rounded-xl'>
            <LockKeyhole size={18} color='green' />
            <h1 className='text-gray-700 text-sm'>Your data is secure and never shared. We only use it to generate your audit.</h1>
       </div>
      </div>
    </div>
  )
}

export default FormHeroSection
