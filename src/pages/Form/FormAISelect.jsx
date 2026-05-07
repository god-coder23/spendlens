import React from 'react'
import chatgpt_icon from "../../assets/images/chatgpt-icon.webp"
import gemini_icon from "../../assets/images/google-gemini-icon.webp"
import claude_icon from "../../assets/images/claude-ai.svg"
import github_copliot_icon from "../../assets/images/github-copilot-icon.webp"
import cursor_icon from "../../assets/images/cursor-ai-code-icon.webp"
import anthropic_icon from "../../assets/images/Anthropic-Claude.png"
import windsurf_icon from "../../assets/images/windsurf-black-symbol.webp"
import { ArrowRight, ChartColumnDecreasing, ChevronDown, Code, Ellipsis, GitGraph, Pen, Target, Users } from 'lucide-react'

const FormAISelect = () => {
  return (
    <div className='py-8 px-30 h-screen flex flex-col gap-5 w-screen'>

      {/* Step 1 */}
      <div className='flex flex-row gap-2 items-center'>
        <h1 className='w-6 h-6 bg-green-700 text-white rounded-full justify-center items-center flex'>1</h1>
        <h1 className='text-lg font-semibold'>Select the AI tools you pay for</h1>
      </div>
      <div className='-mt-3'>
        <h1 className='text-gray-600 text-sm'>Choose from the tools below. You can select multiple.</h1>
      </div>

      {/* AI tools grid */}
      <div className='w-[95%] grid grid-cols-4 grid-rows-2 gap-5 py-2'>
        {/* ChatGPT */}
        <div className='relative flex flex-row gap-5 items-center w-[270px] h-fit py-6 pl-4 pr-10 border border-black/20 rounded-2xl'>
          <img src={chatgpt_icon} alt="" className='h-12 w-12 object-contain shrink-0' />
          <div className='flex flex-col gap-3'>
            <h1 className='font-bold'>ChatGPT</h1>
            <div className='flex flex-col'>
              <h1 className='text-xs text-gray-500'>AI assistant writing</h1>
              <h1 className='text-xs text-gray-500'>research & more.</h1>
            </div>
          </div>
          <input type="checkbox" className='w-4 h-4 top-6 right-5 absolute' />
        </div>

        {/* Claude */}
        <div className='relative flex flex-row gap-5 items-center w-[270px] h-fit py-6 pl-4 pr-10 border border-black/20 rounded-2xl'>
          <img src={claude_icon} alt="" className='h-12 w-12 object-contain shrink-0' />
          <div className='flex flex-col gap-3'>
            <h1 className='font-bold'>Claude</h1>
            <div className='flex flex-col'>
              <h1 className='text-xs text-gray-500'>AI assistant by Anthropic</h1>
              <h1 className='text-xs text-gray-500'>for complex reasoning.</h1>
            </div>
          </div>
          <input type="checkbox" className='w-4 h-4 top-6 right-5 absolute' />
        </div>

        {/* GitHub Copilot */}
        <div className='relative flex flex-row gap-5 items-center w-[270px] h-fit py-6 pl-4 pr-10 border border-black/20 rounded-2xl'>
          <img src={github_copliot_icon} alt="" className='h-12 w-12 object-contain shrink-0' />
          <div className='flex flex-col gap-3'>
            <h1 className='font-bold'>Github Copilot</h1>
            <div className='flex flex-col'>
              <h1 className='text-xs text-gray-500'>AI pair programmer</h1>
              <h1 className='text-xs text-gray-500'>for your IDE.</h1>
            </div>
          </div>
          <input type="checkbox" className='w-4 h-4 top-6 right-5 absolute' />
        </div>

        {/* Gemini */}
        <div className='relative flex flex-row gap-5 items-center w-[270px] h-fit py-6 pl-4 pr-10 border border-black/20 rounded-2xl'>
          <img src={gemini_icon} alt="" className='h-12 w-12 object-contain shrink-0' />
          <div className='flex flex-col gap-3'>
            <h1 className='font-bold'>Gemini</h1>
            <div className='flex flex-col'>
              <h1 className='text-xs text-gray-500'>AI by Google for</h1>
              <h1 className='text-xs text-gray-500'>multimodal tasks.</h1>
            </div>
          </div>
          <input type="checkbox" className='w-4 h-4 top-6 right-5 absolute' />
        </div>

        {/* Cursor */}
        <div className='relative flex flex-row gap-5 items-center w-[270px] h-fit py-6 pl-4 pr-10 border border-black/20 rounded-2xl'>
          <img src={cursor_icon} alt="" className='h-12 w-12 object-contain shrink-0' />
          <div className='flex flex-col gap-3'>
            <h1 className='font-bold'>Cursor</h1>
            <div className='flex flex-col'>
              <h1 className='text-xs text-gray-500'>The AI code editor</h1>
              <h1 className='text-xs text-gray-500'>for professional devs.</h1>
            </div>
          </div>
          <input type="checkbox" className='w-4 h-4 top-6 right-5 absolute' />
        </div>

        {/* OpenAI API */}
        <div className='relative flex flex-row gap-5 items-center w-[270px] h-fit py-6 pl-4 pr-10 border border-black/20 rounded-2xl'>
          <img src={chatgpt_icon} alt="" className='h-12 w-12 object-contain shrink-0' />
          <div className='flex flex-col gap-3'>
            <h1 className='font-bold'>OpenAI API</h1>
            <div className='flex flex-col'>
              <h1 className='text-xs text-gray-500'>Access GPT models</h1>
              <h1 className='text-xs text-gray-500'>via API.</h1>
            </div>
          </div>
          <input type="checkbox" className='w-4 h-4 top-6 right-5 absolute' />
        </div>

        {/* Anthropic API */}
        <div className='relative flex flex-row gap-5 items-center w-[270px] h-fit py-6 pl-4 pr-10 border border-black/20 rounded-2xl'>
          <img src={anthropic_icon} alt="" className='h-12 w-12 object-contain shrink-0' />
          <div className='flex flex-col gap-3'>
            <h1 className='font-bold'>Anthropic API</h1>
            <div className='flex flex-col'>
              <h1 className='text-xs text-gray-500'>Access Claude models</h1>
              <h1 className='text-xs text-gray-500'>via API.</h1>
            </div>
          </div>
          <input type="checkbox" className='w-4 h-4 top-6 right-5 absolute' />
        </div>

        {/* Windsurf */}
        <div className='relative flex flex-row gap-5 items-center w-[270px] h-fit py-6 pl-4 pr-10 border border-black/20 rounded-2xl'>
          <img src={windsurf_icon} alt="" className='h-12 w-12 object-contain shrink-0' />
          <div className='flex flex-col gap-3'>
            <h1 className='font-bold'>Windsurf</h1>
            <div className='flex flex-col'>
              <h1 className='text-xs text-gray-500'>AI powered IDE</h1>
              <h1 className='text-xs text-gray-500'>built for flow.</h1>
            </div>
          </div>
          <input type="checkbox" className='w-4 h-4 top-6 right-5 absolute' />
        </div>
      </div>

      {/* Steps 2 & 3 */}
      <div className='flex flex-row mt-1'>

        {/* Step 2 */}
        <div className='border-r border-black/20 pr-8 w-fit'>
          <div className='flex flex-row gap-2 items-center'>
            <h1 className='w-6 h-6 bg-green-700 text-white rounded-full justify-center items-center flex'>2</h1>
            <h1 className='text-lg font-semibold'>Tell us about your team</h1>
          </div>
          <h1 className='text-gray-600 text-sm mt-1 mb-3'>Help us understand your team and how you use those tools.</h1>

          <div className='flex flex-row gap-6'>
            {/* Team Size */}
            <div className='flex flex-col gap-1 border-r border-black/20 pr-8'>
              <h1 className='text-sm font-semibold'>Team Size (People)</h1>
              <div className='w-[350px] h-fit mt-2 py-1 pl-2 flex flex-row gap-2 items-center border rounded-lg border-black/10'>
                <Users className='h-4 w-4' />
                <input className='text-gray-500 outline-none w-full p-1' placeholder='e.g. 12' />
              </div>
              <h1 className='text-gray-600 text-sm mt-1'>Total number of people in your organization.</h1>
            </div>

            {/* Primary Use Case */}
            <div className='flex flex-col gap-1'>
              <h1 className='text-sm font-semibold'>Primary use case</h1>
              <h1 className='text-gray-600 text-sm mt-1'>What's the main purpose of using these tools?</h1>
              <div className='w-[350px] h-fit mt-2 py-1 pl-2 flex flex-row gap-2 items-center border rounded-lg border-black/10 justify-between'>
                <Target strokeWidth={1} className='h-4 w-4' />
                <h1 className='text-gray-500 text-sm px-3'>Select your primary use case</h1>
                <ChevronDown color='gray' size={20} className='mx-2' />
              </div>
              <div className='grid grid-cols-4 gap-2 mt-2'>
                <div className='w-20 justify-center h-fit gap-1 flex flex-row items-center border border-black/20 rounded-lg p-1'>
                  <Code size={15} color='gray' />
                  <h1 className='text-xs'>Coding</h1>
                </div>
                <div className='w-20 justify-center h-fit gap-1 flex flex-row items-center border border-black/20 rounded-lg p-1'>
                  <Pen size={15} color='gray' />
                  <h1 className='text-xs'>Writing</h1>
                </div>
                <div className='w-20 justify-center h-fit gap-1 flex flex-row items-center border border-black/20 rounded-lg p-1'>
                  <ChartColumnDecreasing size={15} color='gray' />
                  <h1 className='text-xs'>Data</h1>
                </div>
                <div className='w-20 justify-center h-fit gap-1 flex flex-row items-center border border-black/20 rounded-lg p-1'>
                  <Ellipsis size={15} color='gray' />
                  <h1 className='text-xs'>Mixed</h1>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Step 3 */}
        <div className='px-8'>
          <div className='flex flex-row gap-2 items-center'>
            <h1 className='w-6 h-6 bg-green-700 text-white rounded-full justify-center items-center flex'>3</h1>
            <h1 className='text-lg font-semibold'>
              Anything else our team should know? <span className='text-gray-500 text-sm font-normal'>(Optional)</span>
            </h1>
          </div>
          <h1 className='text-sm text-gray-500 mt-1 mb-3'>Add any context about how your team uses AI tools.</h1>
          <textarea
            placeholder='e.g. We use AI tools mainly for product development, customer support automation, content creation.'
            className='h-40 w-105 border px-3 py-3 outline-none rounded-xl text-xs border-black/20 resize-none'
          />
        </div>
      </div>

      {/* Continue Button */}
      <div className='flex justify-center items-center mt-2'>
        <div className='w-[80%] h-fit px-1 py-3 rounded-lg bg-green-900 gap-3 flex items-center justify-center cursor-pointer'>
          <h1 className='text-white'>Continue to audit</h1>
          <ArrowRight color='white' size={20} />
        </div>
      </div>

    </div>
  )
}

export default FormAISelect