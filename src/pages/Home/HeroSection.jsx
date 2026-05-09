import { ArrowRight, ChartNoAxesCombined, Clock, DollarSign, Gift, SunSnowIcon } from 'lucide-react'
import chatgpt_icon from "../../assets/images/chatgpt-icon.webp"
import gemini_icon from "../../assets/images/google-gemini-icon.webp"
import claude_icon from "../../assets/images/claude-ai.svg"
import github_copliot_icon from "../../assets/images/github-copilot-icon.webp"
import { useNavigate } from "react-router-dom"
const HeroSection = ({totalAnnualSavings}) => {
  const navigate = useNavigate()
  const handleButtonClick = () =>{
    navigate("/audit")
  }
  return (
    <div className='flex flex-col gap-10'>
        <div className='flex flex-row gap-0'>
        <div className='py-10 px-40 flex flex-col gap-7 '>
          <div className='flex flex-row gap-8 items-center'>
            <div className='flex flex-row gap-1 items-center bg-green-500/10 w-fit py-2 px-5 rounded-xl'>
                <SunSnowIcon color='#00A63C' size={20} />
                <h1 className='text-green-600 text-sm font-semibold'>Free 2-min trial</h1>
              </div>
              <h1 className='text-gray-500 text-md'>For Startups using Cursor, ChatGpt, Claude and more</h1>
            </div>
          <div className='flex flex-col gap-3'>
              <h1 className='text-7xl font-semibold'>Are You overpaying</h1>
              <h1 className='text-7xl font-semibold'>for <span className='text-green-600'>AI tools ?</span></h1>
          </div>
          <div className='flex flex-col gap-0'>
            <h1 className='text-gray-500 text-xl '>Get a free 2-minute audit and discover how much</h1>
            <h1 className='text-gray-500 text-xl'>you can save on AI subscriptions.</h1>
          </div>
          <div onClick={()=>handleButtonClick()} className='flex hover:cursor-pointer flex-row gap-2 items-center bg-green-700 w-fit py-4 px-10 rounded-xl'>
            <h1 className='text-lg text-gray-100'>Audit my spend</h1>
            <ArrowRight color='#E7E7EB' />
          </div>
        </div>
        <div className='py-10 pr-10'>
          <div className='w-[420px] h-[420px]  flex rounded-full items-center justify-center relative'>
              <img 
                src={chatgpt_icon} 
                className='h-20 w-20 shadow-lg shadow-black/20 rounded-2xl rotate-12 absolute top-12 -left-12' 
                alt="chatgpt" />
            <div className='w-fit h-fit p-10 border border-green-500/8 rounded-full'>
              <div className='w-fit h-fit p-20 bg-green-300/15 rounded-full shadow-2xl shadow-green-400/20 '>
                <ChartNoAxesCombined size={150} strokeWidth={0.5} color='#00A63C' className='' />
              </div>
            </div>
            <img 
            src={gemini_icon}
            alt="gemini" 
            className='h-20 w-20 shadow-lg shadow-black/20 rounded-2xl -rotate-12 absolute bottom-10 -left-12'  />
            <img
              src={claude_icon}
              alt="Claude"
              className='object-contain h-20 w-20 p-3 bg-white shadow-lg shadow-black/20 rounded-2xl -rotate-12 absolute top-10 -right-12'
            />
            <img
              src={github_copliot_icon}
              alt="github"
              className='object-contain h-20 w-20 p-3 bg-white shadow-lg shadow-black/20 rounded-2xl rotate-12 absolute bottom-10 -right-12'
            />
          </div>
        </div>
      </div>
      <div className='flex justify-center items-center'>
        <div className='flex flex-row gap-10 ml-15 shadow-xs shadow-black/10 w-[80%] rounded-2xl border-t border-black/5'>
          <div className='flex flex-row gap-10 items-center w-fit h-fit p-5 px-10'>
            <div className='w-fit h-fit p-4 rounded-full bg-green-500/20'>
              <DollarSign color='green' />
            </div>
            <div className='flex flex-col'>
              <h1 className='text-3xl font-semibold'>${360 || totalAnnualSavings}</h1>
              <h1 className='text-md text-gray-500'>Avg savings found</h1>
            </div>
            <div className='h-15 ml-10 w-[1px] bg-gray-300'></div>
          </div>
          <div className='flex flex-row gap-10 items-center w-fit h-fit p-5 px-10'>
            <div className='w-fit h-fit p-4 rounded-full bg-green-500/20'>
              <Clock color='green' />
            </div>
            <div className='flex flex-col'>
              <h1 className='text-3xl font-semibold'>2 min</h1>
              <h1 className='text-md text-gray-500'>To complete</h1>
            </div>
            <div className='h-15 ml-10 w-[1px] bg-gray-300'></div>
          </div>
          <div className='flex flex-row gap-10 items-center w-fit h-fit p-5 px-10'>
            <div className='w-fit h-fit p-4 rounded-full bg-green-500/20'>
              <Gift color='green' />
            </div>
            <div className='flex flex-col'>
              <h1 className='text-3xl font-semibold'>Free</h1>
              <h1 className='text-md text-gray-500'>Free always</h1>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default HeroSection
