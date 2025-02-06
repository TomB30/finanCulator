<template>
  <section class="investment-calculator">
    <q-btn class="remove-btn" round size="xs" @click="$emit('remove')" icon="fa-regular fa-x">
    </q-btn>
    <div class="text-center q-my-sm q-mx-xl" contenteditable @blur="updateName">
      {{ calculator.name }}
    </div>
    <div class="wrapper q-ma-sm">
      <q-input
        :model-value="calculator.options.currentAccumulatedAmount"
        @update:model-value="updateAccumulatedAmount"
        label="סכום צבירה נוכחי"
        type="number"
        suffix="₪"
      />
      <q-input
        :model-value="calculator.options.monthlyContribution"
        @update:model-value="updateMonthlyContribution"
        label="הפקדה חודשית"
        type="number"
        suffix="₪"
      />

      <q-input
        :model-value="calculator.options.accumulationAnnualFee"
        @update:model-value="updateAccumulationAnnualFee"
        label="דמי ניהול מצבירה"
        type="number"
        step="0.01"
        suffix="%"
      />
      <q-input
        :model-value="calculator.options.depositFee"
        @update:model-value="updateDepositFee"
        label="דמי ניהול מהפקדה"
        type="number"
        step="0.01"
        suffix="%"
      />
      <q-input
        :model-value="calculator.options.interestRate"
        @update:model-value="updateInterestRate"
        label="אחוז תשואה שנתי"
        type="number"
        step="0.1"
        suffix="%"
      />
      <q-input
        :model-value="calculator.options.incomeTaxRate"
        @update:model-value="updateIncomeTaxRate"
        label="שיעור מס הכנסה"
        type="number"
        suffix="%"
      />
      <q-input
        :model-value="calculator.options.yearsToCalculation"
        @update:model-value="updateYearsToCalculation"
        label="שנים עד פרישה"
        type="number"
      />
      <q-toggle
        dense
        :model-value="calculator.options.reduceTaxAnnually"
        @update:model-value="updateReduceTaxAnnually"
        label="תשלום מס שנתי"
        left-label
      >
        <q-tooltip> תשלום מס על רווחי הון כל שנה במקום בסיום התקופה. </q-tooltip>
      </q-toggle>
    </div>
    <q-btn color="primary" class="q-ma-sm" size="sm" @click="addDeposit">
      הוסף הפקדה מחזורית / חד פעמית
    </q-btn>
    <div
      class="periodic-deposit row justify-around items-center"
      v-for="(singleDeposit, i) in calculator.options.periodicDeposits"
      :key="i"
    >
      <q-input
        class="periodic-deposit-date-input"
        type="date"
        dense
        stack-label
        label="תאריך הפקדה"
        :model-value="singleDeposit.startDate"
        @update:model-value="
          updatePeriodicDeposits(i, { ...singleDeposit, startDate: String($event) || '' })
        "
      />
      <q-input
        class="periodic-deposit-amount-input"
        :model-value="singleDeposit.amount"
        type="number"
        dense
        label="סכום הפקדה"
        stack-label
        @update:model-value="
          updatePeriodicDeposits(i, { ...singleDeposit, amount: $event ? +$event : 0 })
        "
      />
      <q-input
        class="periodic-deposit-months-input"
        dense
        stack-label
        type="number"
        :model-value="singleDeposit.monthInterval"
        @update:model-value="
          updatePeriodicDeposits(i, { ...singleDeposit, monthInterval: Number($event) })
        "
        label="כל כמה חודשים"
      />
      <q-input
        class="periodic-deposit-num-of-deposits-input"
        dense
        stack-label
        type="number"
        :model-value="singleDeposit.intervalRuns"
        @update:model-value="
          updatePeriodicDeposits(i, { ...singleDeposit, intervalRuns: Number($event) })
        "
        label="מספר חזרות"
      />
      <q-btn flat round size="xs" @click="removeDeposit(i)">
        <span class="icon">✕</span>
      </q-btn>
    </div>
    <table v-if="calculator.options.yearsToCalculation">
      <thead>
        <tr>
          <th>שנים</th>
          <th>סכום צבירה</th>
          <th>דמי ניהול</th>
          <th>מס הכנסה</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(fundCalculation, i) in investmentOverYears" :key="i">
          <td>{{ i + 1 }}</td>
          <td>{{ fundCalculation[0] }}</td>
          <td>{{ fundCalculation[1] }}</td>
          <td>{{ fundCalculation[2] }}</td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import { investmentUtils } from '@/utils/investment.utils'
import type { Calculator, PeriodicDeposit } from '@/models/calculator.model'

export default defineComponent({
  props: {
    calculator: {
      type: Object as PropType<Calculator>,
      required: true,
    },
  },
  computed: {
    investmentOverYears(): string[][] {
      return investmentUtils.calculateInvestment(
        this.calculator.options.currentAccumulatedAmount || 0,
        this.calculator.options.monthlyContribution || 0,
        this.calculator.options.depositFee || 0,
        this.calculator.options.accumulationAnnualFee || 0,
        this.calculator.options.interestRate || 0,
        this.calculator.options.incomeTaxRate || 0,
        this.calculator.options.yearsToCalculation || 0,
        this.calculator.options.reduceTaxAnnually || false,
        this.calculator.options.periodicDeposits || [],
      )
    },
  },
  methods: {
    addDeposit() {
      this.updateOptions('periodicDeposits', [
        { startDate: '', amount: 0, monthInterval: 1, intervalRuns: 1 },
        ...(this.calculator.options.periodicDeposits || []),
      ])
    },
    removeDeposit(index: number) {
      this.updateOptions(
        'periodicDeposits',
        (this.calculator.options.periodicDeposits || []).filter((_, i: number) => i !== index),
      )
    },
    updatePeriodicDeposits(index: number, value: PeriodicDeposit) {
      this.updateOptions(
        'periodicDeposits',
        (this.calculator.options.periodicDeposits || []).map((d, i) => (i === index ? value : d)),
      )
    },
    updateName(event: Event) {
      this.$emit('update-name', (event.target as HTMLDivElement).innerText)
    },
    updateAccumulatedAmount(value: string | number | null) {
      if (value === null) return
      this.updateOptions('currentAccumulatedAmount', +value)
    },
    updateMonthlyContribution(value: string | number | null) {
      if (value === null) return
      this.updateOptions('monthlyContribution', +value)
    },
    updateAccumulationAnnualFee(value: string | number | null) {
      if (value === null) return
      this.updateOptions('accumulationAnnualFee', +value)
    },
    updateDepositFee(value: string | number | null) {
      if (value === null) return
      this.updateOptions('depositFee', +value)
    },
    updateInterestRate(value: string | number | null) {
      if (value === null) return
      this.updateOptions('interestRate', +value)
    },
    updateIncomeTaxRate(value: string | number | null) {
      if (value === null) return
      this.updateOptions('incomeTaxRate', +value)
    },
    updateYearsToCalculation(value: string | number | null) {
      if (value === null) return
      this.updateOptions('yearsToCalculation', +value)
    },
    updateReduceTaxAnnually(value: boolean) {
      this.updateOptions('reduceTaxAnnually', value)
    },
    updateOptions(key: string, value: string | number | PeriodicDeposit[] | boolean) {
      this.$emit('update-options', { ...this.calculator.options, [key]: value })
    },
  },
})
</script>

<style lang="scss" scoped>
.investment-calculator {
  position: relative;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;

  .wrapper {
    display: grid;
    width: 350px;
    gap: 8px;
    grid-template-columns: 1fr 1fr 1fr;
  }

  table {
    border-collapse: collapse;
    border-radius: 0 0 4px 4px;
    width: 100%;
    th {
      background-color: #16a085;
      color: white;
      padding: 8px;
      text-align: center;
    }

    td {
      border-bottom: 1px solid #e0e0e0;
      padding: 8px;
      text-align: center;
    }
  }

  .periodic-deposit {
    gap: 8px;
    padding: 8px;
    border-bottom: 1px solid #e0e0e0;
    &:first-of-type {
      border-top: 1px solid #e0e0e0;
    }

    .periodic-deposit-amount-input,
    .periodic-deposit-months-input,
    .periodic-deposit-num-of-deposits-input {
      width: 65px;
    }
    .periodic-deposit-amount-input {
      width: 70px;
    }

    .periodic-deposit-date-input {
      width: 105px;
    }
  }

  .remove-btn {
    position: absolute;
    top: 6px;
    left: 8px;
  }
}
</style>
