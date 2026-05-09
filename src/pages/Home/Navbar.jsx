import { CircleArrowOutUpRight, MoveRight } from 'lucide-react';
const Navbar = () => {
  return (
    <div className='w-screen'>
      <div className='flex items-center justify-center p-4'>
        <div className='flex flex-row gap-2 justify-between w-[90%] h-full p-4 rounded-4xl shadow-lg shadow-black/5'>
            <div className='flex gap-2 px-4 items-center'>
                <CircleArrowOutUpRight size={25} color='green' />
                <h1 className='text-xl'>SpendLens</h1>
            </div>
            <div className='flex gap-2 items-center w-fit h-fit rounded-4xl p-3 bg-green-700'>
                <h1 className='text-white'>Audit my spend</h1>
                <MoveRight color='white' />
            </div>
        </div>
      </div>
    </div>
  )
}

export default Navbar
