import { Calendar, ChevronDown, ChevronRight, CircleCheck, CircleOff, Info, Link2, Lock, Mail, ShieldCheck } from 'lucide-react'
import React from 'react'
import chatgpt_icon from '../../assets/images/chatgpt-icon.webp'
import gemini_icon from '../../assets/images/google-gemini-icon.webp'
import claude_icon from '../../assets/images/claude-ai.svg'
import cursor_icon from '../../assets/images/cursor-ai-code-icon.webp'

const AuditResultHero = () => {
    const recommendations = [
        {
            tool: 'Cursor',
            detail: '1 seat',
            image: cursor_icon,
            plan: 'Pro',
            price: '$20 / seat / mo',
            spend: '$20 / month',
            action: 'Switch to Hobby',
            actionPrice: 'Free',
            reason: 'Hobby includes the same core features. Perfect for solo developers.',
            savingsMonth: '$20 / month',
            savingsYear: '$240 / year',
            status: 'down'
        },
        {
            tool: 'ChatGPT',
            detail: 'Team • 2 seats',
            image: chatgpt_icon,
            plan: 'Team',
            price: '$25 / seat / mo',
            spend: '$50 / month',
            action: 'Downgrade to Plus',
            actionPrice: '$20 / month',
            reason: 'Team plan is overkill for under 3 users. Plus offers the same capabilities.',
            savingsMonth: '$40 / month',
            savingsYear: '$480 / year',
            status: 'down'
        },
        {
            tool: 'Claude',
            detail: 'Pro • 1 seat',
            image: claude_icon,
            plan: 'Pro',
            price: '$20 / seat / mo',
            spend: '$20 / month',
            action: 'Keep as is',
            actionPrice: 'Optimized',
            reason: 'Appropriate plan for your usage and team size.',
            savingsMonth: '$0 / month',
            savingsYear: '$0 / year',
            status: 'keep'
        },
        {
            tool: 'Gemini',
            detail: 'Pro • 1 seat',
            image: gemini_icon,
            plan: 'Pro',
            price: '$20 / seat / mo',
            spend: '$20 / month',
            action: 'Switch to Gemini API',
            actionPrice: '~$6 / month',
            reason: 'API usage fits your needs and is significantly cheaper.',
            savingsMonth: '$14 / month',
            savingsYear: '$168 / year',
            status: 'switch'
        },
        {
            tool: 'Anthropic API',
            detail: 'Direct',
            image: null,
            plan: 'Direct',
            price: 'Usage-based',
            spend: '$30 / month',
            action: 'Optimize usage',
            actionPrice: '~$20 / month',
            reason: 'Based on typical usage patterns, you can reduce spend by ~30%.',
            savingsMonth: '$10 / month',
            savingsYear: '$120 / year',
            status: 'down'
        }
    ]

    return (
        <div className='flex flex-col items-center pb-10'>
            <div className='w-full flex justify-center items-center flex-col gap-2'>
                <h1 className='text-4xl font-semibold mt-4'>Your AI spend audit is Ready!</h1>
                <h1 className='text-gray-500'>Here's your personalized audit with saving opportunities.</h1>
                <div className='flex justify-center gap-24 mt-10 border border-black/10 w-fit h-fit rounded-2xl p-6 px-12'>
                    <div className='flex flex-row gap-10 items-center'>
                        <div className='flex flex-col gap-2 items-center'>
                            <h1 className='text-gray-500 font-semibold'>Total potential savings</h1>
                            <h1 className='text-green-800 text-4xl font-semibold'>$ 1,920 <span className='text-green-800 text-2xl'>/ year</span></h1>
                            <h1 className='text-green-800 text-sm font-semibold'>$ 160 / month <span className='text-gray-500 text-sm'>in potential savings</span></h1>
                        </div>
                        <div className='h-20 w-0.5 bg-black/10'></div>
                    </div>
                    <div className='flex flex-row gap-10 items-center'>
                        <div className='flex flex-row gap-3 items-center'>
                            <div className='w-fit h-fit p-2 rounded-full bg-green-500/20'>
                                <Calendar color='green' size={30} />
                            </div>
                            <div className='flex flex-col gap-2'>
                                <h1 className='text-gray-500 font-semibold'>Monthly Savings</h1>
                                <h1 className='text-green-800 text-2xl font-semibold'>$ 160</h1>
                            </div>
                        </div>
                        <div className='h-20 w-0.5 bg-black/10'></div>
                    </div>
                    <div className='flex flex-row gap-3 items-center'>
                        <div className='w-fit h-fit p-2 rounded-full bg-green-500/20'>
                            <Calendar color='green' size={30} />
                        </div>
                        <div className='flex flex-col gap-2'>
                            <h1 className='text-gray-500 font-semibold'>Annual Savings</h1>
                            <h1 className='text-green-800 text-2xl font-semibold'>$ 1,920</h1>
                        </div>
                    </div>
                </div>
            </div>

            <div className='w-[72%] mt-2 bg-green-50 rounded-lg py-3 flex items-center justify-center gap-3 text-gray-500 text-sm'>
                <ShieldCheck size={18} color='green' />
                <h1>Savings are estimates based on your inputs and public pricing. Results may vary.</h1>
            </div>

            <div className='w-[72%] mt-4'>
                <h1 className='text-3xl font-semibold'>Recommendations</h1>
                <h1 className='text-gray-500 text-sm'>Review tool-by-tool recommendations and potential savings.</h1>
            </div>

            <div className='w-[72%] mt-3'>
                <div className='grid grid-cols-6 px-4 text-sm font-medium'>
                    <h1>Tool</h1>
                    <h1>Your current plan</h1>
                    <h1>Current spend</h1>
                    <h1>Recommended action</h1>
                    <h1>Why this change?</h1>
                    <h1 className='text-right'>Est. savings</h1>
                </div>

                <div className='mt-3 border border-black/10 rounded-2xl overflow-hidden'>
                    {recommendations.map((item, index) => (
                        <div key={index} className='grid grid-cols-6 items-center px-4 py-4 border-b last:border-b-0 border-black/10'>
                            <div className='flex flex-row gap-3 items-center'>
                                {item.image ? (
                                    <img src={item.image} alt={item.tool} className='w-10 h-10 object-contain rounded-xl bg-white' />
                                ) : (
                                    <div className='w-10 h-10 flex items-center justify-center rounded-xl bg-white text-2xl font-semibold'>
                                        AI
                                    </div>
                                )}
                                <div className='flex flex-col'>
                                    <h1 className='font-semibold'>{item.tool}</h1>
                                    <h1 className='text-gray-500 text-sm'>{item.detail}</h1>
                                </div>
                            </div>

                            <div className='flex flex-col'>
                                <h1 className='font-semibold'>{item.plan}</h1>
                                <h1 className='text-gray-500'>{item.price}</h1>
                            </div>

                            <div>
                                <h1 className='font-semibold text-gray-600'>{item.spend}</h1>
                            </div>

                            <div className='flex flex-row gap-3 items-start'>
                                <div className='mt-1'>
                                    {item.status === 'keep' ? (
                                        <CircleCheck size={22} color='#6B7280' fill='#E5E7EB' />
                                    ) : item.status === 'switch' ? (
                                        <CircleOff size={22} color='#16A34A' fill='#DCFCE7' />
                                    ) : (
                                        <CircleOff size={22} color='#16A34A' fill='#DCFCE7' />
                                    )}
                                </div>
                                <div className='flex flex-col'>
                                    <h1 className='font-semibold'>{item.action}</h1>
                                    <h1 className='text-gray-500'>{item.actionPrice}</h1>
                                </div>
                            </div>

                            <div>
                                <h1 className='text-gray-600'>{item.reason}</h1>
                            </div>

                            <div className='flex flex-row justify-end items-center gap-4'>
                                <div className='flex flex-col items-end'>
                                    <h1 className={`${item.savingsMonth === '$0 / month' ? 'text-gray-500' : 'text-green-700'} font-semibold`}>{item.savingsMonth}</h1>
                                    <h1 className='text-gray-500'>{item.savingsYear}</h1>
                                </div>
                                <ChevronRight size={18} className='text-gray-500' />
                            </div>
                        </div>
                    ))}
                </div>

                <div className='w-full flex justify-center mt-3'>
                    <div className='border border-black/10 rounded-xl px-8 py-2 flex flex-row items-center gap-3'>
                        <h1 className='font-semibold text-gray-600'>Show all details</h1>
                        <ChevronDown size={18} className='text-gray-600' />
                    </div>
                </div>
            </div>

            <div className='w-[72%] mt-4 grid grid-cols-3 gap-6'>
                <div className='border border-black/10 rounded-2xl p-6 flex flex-col gap-4'>
                    <h1 className='text-2xl font-semibold'>AI-generated summary</h1>
                    <h1 className='text-gray-600'>
                        Your team of 3 is paying for enterprise-grade collaboration features you're unlikely to use. By switching Cursor to Hobby, ChatGPT Team to Plus, using Gemini API, and optimizing Anthropic API usage, you can save $160 per month ($1,920 annually) with no meaningful capability loss for a coding-focused team at this size.
                    </h1>
                    <div className='flex flex-row gap-2 items-center text-gray-500 text-sm'>
                        <Info size={16} />
                        <h1>AI summary may contain mistakes. Please review recommendations.</h1>
                    </div>
                </div>

                <div className='border border-black/10 rounded-2xl p-6 flex flex-col gap-4'>
                    <div className='flex flex-row gap-3 items-center'>
                        <Mail size={20} className='text-gray-600' />
                        <h1 className='text-2xl font-semibold'>Get your full audit report</h1>
                    </div>
                    <h1 className='text-gray-600'>Enter your email to receive the full report with detailed breakdowns and next steps.</h1>
                    <div className='flex flex-row gap-3'>
                        <input type='text' placeholder='Enter your work email' className='w-full border border-black/10 rounded-xl px-4 outline-none' />
                        <button className='bg-green-700 text-white px-6 py-3 rounded-xl font-semibold'>Get full report</button>
                    </div>
                    <div className='flex flex-row gap-2 items-center text-gray-500 text-sm bg-green-50 rounded-lg p-3'>
                        <Lock size={16} color='green' />
                        <h1>We'll email your report and keep your data private.</h1>
                    </div>
                </div>

                <div className='border border-blue-100 bg-blue-50 rounded-2xl p-6 flex flex-col gap-4'>
                    <div className='flex flex-row gap-3 items-center'>
                        <Info size={20} className='text-blue-500' />
                        <h1 className='text-2xl font-semibold'>You're spending well!</h1>
                    </div>
                    <h1 className='text-gray-600'>Your current stack is already well optimized. We'll notify you when new savings opportunities apply to your setup.</h1>
                    <div className='flex flex-row gap-3'>
                        <input type='text' placeholder='Enter your work email' className='w-full border border-black/10 bg-white rounded-xl px-4 outline-none' />
                        <button className='bg-white border border-black/10 px-6 py-3 rounded-xl font-semibold'>Notify me</button>
                    </div>
                </div>
            </div>

            <div className='w-[72%] mt-6 grid grid-cols-2 border border-black/10 rounded-2xl overflow-hidden'>
                <div className='p-6 flex flex-row justify-between items-center border-r border-black/10 gap-4'>
                    <div className='flex flex-col'>
                        <h1 className='text-xl font-semibold'>Share your results</h1>
                        <h1 className='text-gray-500'>Anyone with the link can view this audit.</h1>
                    </div>
                    <div className='flex flex-row gap-3 items-center'>
                        <div className='border border-black/10 rounded-xl px-4 py-3 flex flex-row gap-3 items-center'>
                            <Link2 size={18} className='text-gray-500' />
                            <h1 className='text-gray-600'>https://spendlens.com/audit/7f4a2b3c</h1>
                        </div>
                        <button className='border border-black/10 rounded-xl px-5 py-3 font-semibold'>Copy link</button>
                    </div>
                </div>

                <div className='p-6 flex flex-row gap-3 items-start'>
                    <ShieldCheck size={18} color='green' className='mt-1' />
                    <div className='flex flex-col'>
                        <h1 className='text-gray-600'>Pricing verified from official vendor pages on May 19, 2025.</h1>
                        <h1 className='text-gray-700 font-semibold'>See sources</h1>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AuditResultHero
