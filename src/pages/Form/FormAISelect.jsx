import { useMemo, useState } from 'react'
import Chatgpt_icon from "../../assets/images/chatgpt-icon.webp"
import Gemini_icon from "../../assets/images/google-gemini-icon.webp"
import Claude_icon from "../../assets/images/claude-ai.svg"
import Github_copliot_icon from "../../assets/images/github-copilot-icon.webp"
import Cursor_icon from "../../assets/images/cursor-ai-code-icon.webp"
import Anthropic_icon from "../../assets/images/Anthropic-Claude.png"
import Windsurf_icon from "../../assets/images/windsurf-black-symbol.webp"
import { ArrowRight, Check, CircleDollarSign, Code, PenSquare, Search, ShieldQuestion, Users, WandSparkles, X } from 'lucide-react'
import { useNavigate } from "react-router-dom"
import { nanoid } from 'nanoid'
import { generateAudit } from "../../audit/generateAudit"
import { generateSummary } from "../../api/generateSummary"
import { saveAudit } from "../../service/auditService"
import Loading from '../Loading'

const usageOptions = [
  { label: "Coding", value: "coding", icon: Code },
  { label: "Writing", value: "writing", icon: PenSquare },
  { label: "Research", value: "research", icon: Search },
  { label: "Support", value: "support", icon: ShieldQuestion },
  { label: "Data Analysis", value: "data analysis", icon: WandSparkles }
]

const aiTools = [
  {
    name: "ChatGPT",
    icon: Chatgpt_icon,
    tagLine1: "AI assistant writing",
    tagLine2: "research & more.",
    plans: [
      { label: "Free", value: "free" },
      { label: "Plus", value: "plus" },
      { label: "Team", value: "team" },
      { label: "Enterprise", value: "enterprise" }
    ],
    defaultPlan: "plus"
  },
  {
    name: "Claude",
    icon: Claude_icon,
    tagLine1: "AI assistant by Anthropic",
    tagLine2: "for complex reasoning.",
    plans: [
      { label: "Free", value: "free" },
      { label: "Pro", value: "pro" },
      { label: "Max", value: "max" },
      { label: "Team", value: "team" },
      { label: "Enterprise", value: "enterprise" }
    ],
    defaultPlan: "pro"
  },
  {
    name: "Github Copilot",
    icon: Github_copliot_icon,
    tagLine1: "AI pair programmer",
    tagLine2: "for your IDE.",
    plans: [
      { label: "Free", value: "free" },
      { label: "Individual", value: "individual" },
      { label: "Business", value: "business" },
      { label: "Enterprise", value: "enterprise" }
    ],
    defaultPlan: "business"
  },
  {
    name: "Gemini",
    icon: Gemini_icon,
    tagLine1: "AI by Google for",
    tagLine2: "multimodal tasks.",
    plans: [
      { label: "Free", value: "free" },
      { label: "Pro", value: "pro" },
      { label: "Ultra", value: "ultra" },
      { label: "Enterprise", value: "enterprise" }
    ],
    defaultPlan: "pro"
  },
  {
    name: "Cursor",
    icon: Cursor_icon,
    tagLine1: "The AI code editor",
    tagLine2: "for professional devs.",
    plans: [
      { label: "Hobby", value: "hobby" },
      { label: "Pro", value: "pro" },
      { label: "Business", value: "business" },
      { label: "Enterprise", value: "enterprise" }
    ],
    defaultPlan: "pro"
  },
  {
    name: "OpenAI API",
    icon: Chatgpt_icon,
    tagLine1: "Access GPT models",
    tagLine2: "via API.",
    plans: [
      { label: "Free Trial", value: "free" },
      { label: "Pay as you go", value: "api-direct" },
      { label: "Custom Contract", value: "enterprise" }
    ],
    defaultPlan: "api-direct"
  },
  {
    name: "Anthropic API",
    icon: Anthropic_icon,
    tagLine1: "Access Claude models",
    tagLine2: "via API.",
    plans: [
      { label: "Free Trial", value: "free" },
      { label: "Pay as you go", value: "api-direct" },
      { label: "Custom Contract", value: "enterprise" }
    ],
    defaultPlan: "api-direct"
  },
  {
    name: "Windsurf",
    icon: Windsurf_icon,
    tagLine1: "AI powered IDE",
    tagLine2: "built for flow.",
    plans: [
      { label: "Free", value: "free" },
      { label: "Pro", value: "pro" },
      { label: "Team", value: "team" },
      { label: "Enterprise", value: "enterprise" }
    ],
    defaultPlan: "pro"
  }
]

const getToolMeta = (toolName) => aiTools.find((tool) => tool.name === toolName)

const createDefaultToolConfig = (toolName) => {
  const toolMeta = getToolMeta(toolName)

  return {
    plan: toolMeta?.defaultPlan || "free",
    seats: 1,
    monthlySpend: "",
    usageTypes: []
  }
}

const formatPlanLabel = (toolName, planValue) => {
  const toolMeta = getToolMeta(toolName)
  return toolMeta?.plans.find((plan) => plan.value === planValue)?.label || planValue
}

const FormAISelect = () => {
  const [selectedTools, setSelectedTools] = useState([])
  const [toolConfigurations, setToolConfigurations] = useState({})
  const [activeToolName, setActiveToolName] = useState(null)
  const [extraInfo, setExtraInfo] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const activeToolConfig = activeToolName
    ? toolConfigurations[activeToolName] || createDefaultToolConfig(activeToolName)
    : null

  const configuredTools = useMemo(() => {
    return selectedTools.map((toolName) => ({
      name: toolName,
      ...toolConfigurations[toolName]
    }))
  }, [selectedTools, toolConfigurations])

  const ensureToolConfig = (toolName) => {
    setToolConfigurations((prev) => {
      if (prev[toolName]) {
        return prev
      }

      return {
        ...prev,
        [toolName]: createDefaultToolConfig(toolName)
      }
    })
  }

  const handleToolCardClick = (toolName) => {
    ensureToolConfig(toolName)
    setSelectedTools((prev) => prev.includes(toolName) ? prev : [...prev, toolName])
    setActiveToolName(toolName)
  }

  const handleToolSelectionToggle = (toolName) => {
    ensureToolConfig(toolName)
    setSelectedTools((prev) => {
      if (prev.includes(toolName)) {
        if (activeToolName === toolName) {
          setActiveToolName(null)
        }

        return prev.filter((item) => item !== toolName)
      }

      return [...prev, toolName]
    })
  }

  const updateToolConfig = (toolName, key, value) => {
    setToolConfigurations((prev) => ({
      ...prev,
      [toolName]: {
        ...(prev[toolName] || createDefaultToolConfig(toolName)),
        [key]: value
      }
    }))
  }

  const toggleUsageType = (toolName, usageType) => {
    const currentUsage = toolConfigurations[toolName]?.usageTypes || []
    const nextUsage = currentUsage.includes(usageType)
      ? currentUsage.filter((item) => item !== usageType)
      : [...currentUsage, usageType]

    updateToolConfig(toolName, "usageTypes", nextUsage)
  }

  const derivePrimaryUseCase = () => {
    const usageCounts = configuredTools.reduce((accumulator, tool) => {
      ;(tool.usageTypes || []).forEach((usageType) => {
        accumulator[usageType] = (accumulator[usageType] || 0) + 1
      })
      return accumulator
    }, {})

    const sortedUsageTypes = Object.entries(usageCounts).sort((left, right) => right[1] - left[1])
    return sortedUsageTypes[0]?.[0] || "mixed"
  }

  const handleGenerateAudit = async () => {
    if (isLoading) {
      return
    }

    try {
      setIsLoading(true)
      const auditId = nanoid(8)

      const normalizedTools = selectedTools.map((toolName) => {
        const toolConfig = toolConfigurations[toolName] || createDefaultToolConfig(toolName)
        const normalizedSeats = Math.max(Number(toolConfig.seats) || 1, 1)
        const normalizedSpend = toolConfig.monthlySpend === "" ? undefined : Number(toolConfig.monthlySpend)

        switch (toolName) {
          case "ChatGPT":
            return { tool: "ChatGPT", plan: toolConfig.plan, seats: normalizedSeats, spend: normalizedSpend, usageTypes: toolConfig.usageTypes }
          case "Claude":
            return { tool: "Claude", plan: toolConfig.plan, seats: normalizedSeats, spend: normalizedSpend, usageTypes: toolConfig.usageTypes }
          case "Cursor":
            return { tool: "Cursor", plan: toolConfig.plan, seats: normalizedSeats, spend: normalizedSpend, usageTypes: toolConfig.usageTypes }
          case "Github Copilot":
            return { tool: "GitHub Copilot", plan: toolConfig.plan, seats: normalizedSeats, spend: normalizedSpend, usageTypes: toolConfig.usageTypes }
          case "Gemini":
            return { tool: "Gemini", plan: toolConfig.plan, seats: normalizedSeats, spend: normalizedSpend, usageTypes: toolConfig.usageTypes }
          case "OpenAI API":
            return { tool: "OpenAI API", plan: toolConfig.plan, seats: normalizedSeats, spend: normalizedSpend || 0, usageTypes: toolConfig.usageTypes }
          case "Anthropic API":
            return { tool: "Anthropic API", plan: toolConfig.plan, seats: normalizedSeats, spend: normalizedSpend || 0, usageTypes: toolConfig.usageTypes }
          case "Windsurf":
            return { tool: "Windsurf", plan: toolConfig.plan, seats: normalizedSeats, spend: normalizedSpend, usageTypes: toolConfig.usageTypes }
          default:
            return null
        }
      }).filter(Boolean)

      const userInput = {
        teamSize: Math.max(...normalizedTools.map((tool) => tool.seats || 1), 1),
        useCase: derivePrimaryUseCase(),
        extraInfo,
        tools: normalizedTools
      }

      const auditResult = generateAudit(userInput)
      const summary = await generateSummary(userInput, auditResult)
      auditResult.summary = summary

      await saveAudit(auditId, {
        auditResult,
        userInput
      })

      navigate(`/audit/${auditId}`, {
        state: {
          auditResult,
          userInput
        }
      })
    } catch (err) {
      console.log(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      {isLoading ? (
        <div>
          <Loading />
        </div>
      ) : (
        <div className='px-6 py-8 md:px-12 xl:px-30 min-h-screen flex flex-col gap-6 w-screen'>
          <div className='flex flex-row gap-2 items-center'>
            <h1 className='w-6 h-6 bg-green-700 text-white rounded-full justify-center items-center flex'>1</h1>
            <h1 className='text-lg font-semibold'>Select the AI tools you pay for</h1>
          </div>
          <div className='-mt-3'>
            <h1 className='text-gray-600 text-sm'>Click any tool to configure its plan, seats, monthly spend, and usage profile.</h1>
          </div>

          <div className='w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 py-2'>
            {aiTools.map((tool) => {
              const isSelected = selectedTools.includes(tool.name)

              return (
                <div
                  key={tool.name}
                  onClick={() => handleToolCardClick(tool.name)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault()
                      handleToolCardClick(tool.name)
                    }
                  }}
                  className={`relative flex flex-row gap-5 items-center w-full min-h-[154px] py-6 pl-4 pr-12 border rounded-2xl text-left transition-all cursor-pointer ${
                    isSelected
                      ? "border-green-700 bg-green-50 shadow-[0_14px_32px_rgba(22,101,52,0.10)]"
                      : "border-black/15 bg-white hover:border-green-300 hover:shadow-[0_12px_28px_rgba(0,0,0,0.06)]"
                  }`}
                >
                  <img src={tool.icon} alt={tool.name} className='h-12 w-12 object-contain shrink-0' />
                  <div className='flex flex-col gap-3'>
                    <h1 className='font-bold'>{tool.name}</h1>
                    <div className='flex flex-col'>
                      <h1 className='text-xs text-gray-500'>{tool.tagLine1}</h1>
                      <h1 className='text-xs text-gray-500'>{tool.tagLine2}</h1>
                    </div>
                    {isSelected && toolConfigurations[tool.name] ? (
                      <p className='text-xs font-medium text-green-800'>
                        {formatPlanLabel(tool.name, toolConfigurations[tool.name].plan)} • {toolConfigurations[tool.name].seats} seat{toolConfigurations[tool.name].seats > 1 ? "s" : ""}
                      </p>
                    ) : null}
                  </div>
                  <button
                    type="button"
                    aria-label={`${isSelected ? "Deselect" : "Select"} ${tool.name}`}
                    onClick={(event) => {
                      event.stopPropagation()
                      handleToolSelectionToggle(tool.name)
                    }}
                    className={`w-5 h-5 top-6 right-5 absolute rounded border flex items-center justify-center transition-colors ${
                      isSelected
                        ? "border-green-700 bg-green-700 text-white"
                        : "border-black/25 bg-white text-transparent"
                    }`}
                  >
                    <Check className='h-3.5 w-3.5' />
                  </button>
                </div>
              )
            })}
          </div>

          <div className='grid grid-cols-1 xl:grid-cols-[1.15fr_0.85fr] gap-6 mt-1'>
            <div className='border border-black/10 rounded-3xl p-5 bg-white'>
              <div className='flex flex-row gap-2 items-center'>
                <h1 className='w-6 h-6 bg-green-700 text-white rounded-full justify-center items-center flex'>2</h1>
                <h1 className='text-lg font-semibold'>Configured tools</h1>
              </div>
              <h1 className='text-gray-600 text-sm mt-1 mb-4'>Each selected tool keeps its own plan, seat count, spend, and usage type.</h1>

              {configuredTools.length === 0 ? (
                <div className='rounded-2xl border border-dashed border-black/15 bg-gray-50 px-4 py-6 text-sm text-gray-500'>
                  Select a tool card above to open its setup card.
                </div>
              ) : (
                <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                  {configuredTools.map((tool) => (
                    <button
                      key={tool.name}
                      type="button"
                      onClick={() => setActiveToolName(tool.name)}
                      className='rounded-2xl border border-black/10 bg-[#fbfcfb] p-4 text-left hover:border-green-300 transition-colors'
                    >
                      <div className='flex items-start justify-between gap-3'>
                        <div>
                          <h2 className='font-semibold text-sm'>{tool.name}</h2>
                          <p className='text-xs text-gray-500 mt-1'>{formatPlanLabel(tool.name, tool.plan)} • {tool.seats} seat{tool.seats > 1 ? "s" : ""}</p>
                        </div>
                        <Check className='h-4 w-4 text-green-700 shrink-0' />
                      </div>
                      <div className='flex flex-wrap gap-2 mt-3'>
                        {(tool.usageTypes || []).length > 0 ? (
                          tool.usageTypes.map((usageType) => (
                            <span key={usageType} className='text-[11px] px-2.5 py-1 rounded-full bg-green-100 text-green-800 capitalize'>
                              {usageType}
                            </span>
                          ))
                        ) : (
                          <span className='text-[11px] px-2.5 py-1 rounded-full bg-gray-100 text-gray-600'>No usage types selected</span>
                        )}
                        {tool.monthlySpend !== "" ? (
                          <span className='text-[11px] px-2.5 py-1 rounded-full bg-gray-100 text-gray-700'>${tool.monthlySpend}/mo</span>
                        ) : null}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className='border border-black/10 rounded-3xl p-5 bg-white'>
              <div className='flex flex-row gap-2 items-center'>
                <h1 className='w-6 h-6 bg-green-700 text-white rounded-full justify-center items-center flex'>3</h1>
                <h1 className='text-lg font-semibold'>
                  Anything else our team should know? <span className='text-gray-500 text-sm font-normal'>(Optional)</span>
                </h1>
              </div>
              <h1 className='text-sm text-gray-500 mt-1 mb-3'>Add any context about how your team uses AI tools.</h1>
              <textarea
                value={extraInfo}
                onChange={(event) => setExtraInfo(event.target.value)}
                placeholder='e.g. We use AI tools mainly for product development, customer support automation, content creation.'
                className='h-48 w-full border px-3 py-3 outline-none rounded-xl text-xs border-black/20 resize-none'
              />
            </div>
          </div>

          <div className='flex justify-center items-center mt-2'>
            <button
              type="button"
              onClick={handleGenerateAudit}
              disabled={selectedTools.length === 0 || isLoading}
              className='w-full md:w-[80%] h-fit px-1 py-3 rounded-lg bg-green-900 gap-3 flex items-center justify-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
            >
              <h1 className='text-white'>Continue to audit</h1>
              <ArrowRight color='white' size={20} />
            </button>
          </div>

          {activeToolName && activeToolConfig ? (
            <div className='fixed inset-0 z-50 bg-black/35 backdrop-blur-[2px] flex items-center justify-center px-4'>
              <div className='w-full max-w-2xl rounded-[32px] bg-white shadow-[0_28px_80px_rgba(0,0,0,0.18)] border border-black/10 overflow-hidden'>
                <div className='px-6 py-5 border-b border-black/8 flex items-start justify-between gap-4'>
                  <div>
                    <p className='text-xs uppercase tracking-[0.24em] text-green-700 font-semibold'>Tool setup</p>
                    <h2 className='text-2xl font-semibold mt-1'>{activeToolName}</h2>
                    <p className='text-sm text-gray-500 mt-2'>Capture the current plan, seats, spend, and usage so the audit can make better recommendations.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveToolName(null)}
                    className='w-10 h-10 rounded-full border border-black/10 flex items-center justify-center hover:bg-gray-50'
                  >
                    <X className='h-4 w-4' />
                  </button>
                </div>

                <div className='px-6 py-6 grid grid-cols-1 md:grid-cols-2 gap-5'>
                  <div className='flex flex-col gap-2'>
                    <label className='text-sm font-semibold'>Current Plan</label>
                    <select
                      value={activeToolConfig.plan}
                      onChange={(event) => updateToolConfig(activeToolName, "plan", event.target.value)}
                      className='w-full rounded-xl border border-black/15 bg-white px-3 py-3 outline-none'
                    >
                      {getToolMeta(activeToolName)?.plans.map((plan) => (
                        <option key={plan.value} value={plan.value}>{plan.label}</option>
                      ))}
                    </select>
                    <p className='text-xs text-gray-500'>This directly powers <code>tool.plan</code>.</p>
                  </div>

                  <div className='flex flex-col gap-2'>
                    <label className='text-sm font-semibold'>Number of Seats</label>
                    <div className='w-full rounded-xl border border-black/15 bg-white px-3 py-3 flex items-center gap-2'>
                      <Users className='h-4 w-4 text-gray-500' />
                      <input
                        type="number"
                        min="1"
                        value={activeToolConfig.seats}
                        onChange={(event) => updateToolConfig(activeToolName, "seats", Math.max(Number(event.target.value) || 1, 1))}
                        placeholder='How many people use this tool?'
                        className='w-full outline-none'
                      />
                    </div>
                    <p className='text-xs text-gray-500'>This directly powers <code>tool.seats</code>.</p>
                  </div>

                  <div className='flex flex-col gap-2 md:col-span-2'>
                    <label className='text-sm font-semibold'>Monthly Spend</label>
                    <div className='w-full rounded-xl border border-black/15 bg-white px-3 py-3 flex items-center gap-2'>
                      <CircleDollarSign className='h-4 w-4 text-gray-500' />
                      <input
                        type="number"
                        min="0"
                        value={activeToolConfig.monthlySpend}
                        onChange={(event) => updateToolConfig(activeToolName, "monthlySpend", event.target.value)}
                        placeholder='Approx monthly spend'
                        className='w-full outline-none'
                      />
                    </div>
                    <p className='text-xs text-gray-500'>Optional, but useful for enterprise estimation, APIs, and future analytics.</p>
                  </div>

                  <div className='flex flex-col gap-3 md:col-span-2'>
                    <label className='text-sm font-semibold'>Usage Type</label>
                    <div className='flex flex-wrap gap-2'>
                      {usageOptions.map((usageOption) => {
                        const isActive = activeToolConfig.usageTypes.includes(usageOption.value)

                        return (
                          <button
                            key={usageOption.value}
                            type="button"
                            onClick={() => toggleUsageType(activeToolName, usageOption.value)}
                            className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm transition-colors ${
                              isActive
                                ? "border-green-700 bg-green-700 text-white"
                                : "border-black/15 bg-white text-gray-700 hover:border-green-300"
                            }`}
                          >
                            <usageOption.icon className='h-4 w-4' />
                            {usageOption.label}
                          </button>
                        )
                      })}
                    </div>
                    <p className='text-xs text-gray-500'>This improves recommendation quality.</p>
                  </div>
                </div>

                <div className='px-6 py-4 border-t border-black/8 flex items-center justify-between gap-3 bg-[#fcfcfa]'>
                  <button
                    type="button"
                    onClick={() => handleToolSelectionToggle(activeToolName)}
                    className='text-sm text-gray-600 hover:text-black'
                  >
                    Remove from selection
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveToolName(null)}
                    className='rounded-xl bg-green-900 px-4 py-2.5 text-sm font-medium text-white'
                  >
                    Save tool details
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}

export default FormAISelect
