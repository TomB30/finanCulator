export interface Calculator {
  type:
    | 'retirement-calculator'
    | 'continuing-education-fund-calculator'
    | 'general-investment-calculator'
  name: string
  options: {
    currentAccumulatedAmount?: number
    monthlyContribution?: number
    yearsToCalculation?: number
    accumulationAnnualFee?: number
    depositFee?: number
    interestRate?: number
    incomeTaxRate?: number
    reduceTaxAnnually?: boolean
    monthlyIncome?: number
    monthlyContributionPercentage?: number
    periodicDeposits?: PeriodicDeposit[]
    overTaxCeilingDeposit?: boolean
  }
}

export interface PeriodicDeposit {
  amount: number
  startDate: string
  monthInterval: number
  intervalRuns: number
}
