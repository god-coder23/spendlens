export const calculateAnnualSavings = (monthlySavings) => {
  return monthlySavings * 12
}

export const formatCurrency = (value) => {
  return `$${value}`
}

export const calculatePercentageSavings = (currentSpend,optimizedSpend) => {
  if (currentSpend === 0) return 0
  return Math.round(
    ((currentSpend - optimizedSpend) /currentSpend) *100
  )
}