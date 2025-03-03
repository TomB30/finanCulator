import type { PeriodicDeposit } from '@/models/calculator.model'
import { stringUtils } from './string.utils'

export const investmentUtils = {
  calculateInvestment,
}

function calculateInvestment(
  currentAmount: number,
  monthlyContribution: number,
  depositFee: number,
  annualAccumulationFee: number,
  annualReturnRate: number,
  incomeTaxRate: number,
  yearsToInvestment: number,
  reduceTaxAnnually: boolean,
  singleDeposits: PeriodicDeposit[],
): string[][] {
  const monthlyAccumulationFeeRate = annualAccumulationFee / 12 / 100
  const depositFeeRate = depositFee / 100

  let totalAmount = currentAmount
  let totalFees = 0
  const yearlyCalculations = []
  let totalProfit = 0

  const startDate = new Date()

  for (let month = 1; month <= yearsToInvestment * 12; month++) {
    // Add monthly contribution
    totalAmount = addPeriodicDeposits(startDate, totalAmount, month, depositFeeRate, singleDeposits)
    totalAmount += monthlyContribution * (1 - depositFeeRate)

    // Calculate profit
    const monthlyProfit = totalAmount * (annualReturnRate / 100 + 1) ** (1 / 12) - totalAmount

    totalAmount += monthlyProfit

    // Calculate accumulation and deposit fees
    const accumulationFee = totalAmount * monthlyAccumulationFeeRate
    const depositFee = monthlyContribution * depositFeeRate

    totalProfit += monthlyProfit - accumulationFee
    // Add fees to the total
    totalFees += accumulationFee + depositFee

    // Update total amount after profit and fees
    totalAmount = totalAmount * (1 - monthlyAccumulationFeeRate)

    // Apply income tax logic at the end of each year
    if (month % 12 === 0) {
      // Calculate income tax for the year's profit
      const incomeTaxAmount = (totalProfit * incomeTaxRate) / 100

      // Store yearly calculations: [totalAmountAfterFees, totalFees, incomeTaxAmount]
      yearlyCalculations.push([
        stringUtils.shekelFormat(totalAmount),
        stringUtils.shekelFormat(totalFees),
        stringUtils.shekelFormat(incomeTaxAmount),
      ])

      // Deduct income tax only if `reduceTaxAnnually` is true
      if (reduceTaxAnnually) {
        totalAmount -= incomeTaxAmount
        totalProfit = 0
      }
    }
  }

  return yearlyCalculations
}

function addPeriodicDeposits(
  startDate: Date,
  totalAmount: number,
  month: number,
  depositFeeRate: number,
  periodicDeposits: PeriodicDeposit[],
) {
  periodicDeposits.forEach((deposit) => {
    const depositStartDate = new Date(deposit.startDate)
    const startMonth =
      (depositStartDate.getFullYear() - startDate.getFullYear()) * 12 +
      (depositStartDate.getMonth() - startDate.getMonth()) +
      1

    if (month >= startMonth) {
      const elapsedMonths = month - startMonth
      const isDepositMonth = elapsedMonths % deposit.monthInterval === 0
      const depositIndex = Math.floor(elapsedMonths / deposit.monthInterval)

      if (isDepositMonth && depositIndex < deposit.intervalRuns) {
        totalAmount += deposit.amount * (1 - depositFeeRate)
      }
    }
  })

  return totalAmount
}
