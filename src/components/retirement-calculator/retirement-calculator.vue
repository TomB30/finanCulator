<template>
  <section class="retirement-calculator">
    <q-btn class="remove-btn" round @click="$emit('remove')" icon="fa-regular fa-x" size="xs" />
    <div class="text-center q-my-sm q-mx-xl" contenteditable @blur="updateName">
      {{ calculator.name }}
    </div>
    <div class="wrapper column q-ma-sm">
      <q-input
        stack-label
        step="1"
        type="number"
        label="סכום צבירה נוכחי"
        :model-value="calculator.options.currentAccumulatedAmount"
        @update:model-value="updateCurrentAccumulatedAmount"
        suffix="₪"
      />
      <q-input
        stack-label
        step="1"
        type="number"
        label="משכורת חודשית"
        :model-value="calculator.options.monthlyIncome"
        @update:model-value="updateMonthlyIncome"
        suffix="₪"
      />
      <q-input
        stack-label
        step="1"
        type="number"
        label="אחוז הפרשה משכר"
        :model-value="calculator.options.monthlyContributionPercentage"
        @update:model-value="updateMonthlyContributionPercentage"
        suffix="%"
      />
      <q-input
        stack-label
        step="0.1"
        type="number"
        label="אחוז תשואה שנתי"
        :model-value="calculator.options.interestRate"
        @update:model-value="updateInterestRate"
        suffix="%"
      />
      <q-input
        stack-label
        step="0.01"
        type="number"
        label="דמי ניהול מצבירה"
        :model-value="calculator.options.accumulationAnnualFee"
        @update:model-value="updateAccumulationAnnualFee"
        suffix="%"
      />
      <q-input
        stack-label
        step="0.01"
        type="number"
        label="דמי ניהול מהפקדה"
        :model-value="calculator.options.depositFee"
        @update:model-value="updateDepositFee"
        suffix="%"
      />
      <q-input
        stack-label
        step="1"
        type="number"
        label="שנים לפרישה"
        :model-value="calculator.options.yearsToCalculation"
        @update:model-value="updateYearsToCalculation"
      />
    </div>
    <table v-if="calculator.options.yearsToCalculation">
      <thead>
        <tr>
          <th>שנים</th>
          <th>סכום צבירה</th>
          <th>דמי ניהול</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(year, i) in retirementFundOverYears" :key="i">
          <td>{{ i + 1 }}</td>
          <td>{{ year[0] }}</td>
          <td>{{ year[1] }}</td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import { retirementUtils } from '@/utils/retirement.utils'
// Models
import type { Calculator } from '@/models/calculator.model'

export default defineComponent({
  name: 'retirement-calculator',
  components: {},
  props: {
    calculator: {
      type: Object as PropType<Calculator>,
      required: true,
    },
    removeable: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    retirementFundOverYears(): string[][] {
      return retirementUtils.calculateRetirement(
        this.calculator.options.currentAccumulatedAmount || 0,
        this.monthlyContribution || 0,
        this.calculator.options.depositFee || 0,
        this.calculator.options.accumulationAnnualFee || 0,
        this.calculator.options.interestRate || 0,
        this.calculator.options.yearsToCalculation || 0,
      )
    },
    monthlyContribution(): number {
      return (
        (this.calculator.options.monthlyIncome || 0) *
        ((this.calculator.options.monthlyContributionPercentage || 0) / 100)
      )
    },
  },
  methods: {
    updateOptions(key: string, value: string | number) {
      this.$emit('update-options', {
        ...this.calculator.options,
        [key]: value,
      })
    },
    updateName(event: Event) {
      this.$emit('update-name', (event.target as HTMLDivElement).innerText)
    },
    updateAccumulationAnnualFee(val: string | number | null) {
      this.updateOptions('accumulationAnnualFee', val ? parseFloat(val as string) : 0)
    },
    updateDepositFee(val: string | number | null) {
      this.updateOptions('depositFee', val ? parseFloat(val as string) : 0)
    },
    updateInterestRate(val: string | number | null) {
      this.updateOptions('interestRate', val ? parseFloat(val as string) : 0)
    },
    updateMonthlyIncome(val: string | number | null) {
      this.updateOptions('monthlyIncome', val ? parseFloat(val as string) : 0)
    },
    updateMonthlyContributionPercentage(val: string | number | null) {
      this.updateOptions('monthlyContributionPercentage', val ? parseFloat(val as string) : 0)
    },
    updateYearsToCalculation(val: string | number | null) {
      this.updateOptions('yearsToCalculation', val ? parseFloat(val as string) : 0)
    },
    updateCurrentAccumulatedAmount(val: string | number | null) {
      this.updateOptions('currentAccumulatedAmount', val ? parseFloat(val as string) : 0)
    },
  },
})
</script>

<style lang="scss" scoped>
.retirement-calculator {
  position: relative;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;

  .column {
    gap: 8px;
  }

  .wrapper {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 8px;
    width: 350px;
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

  .remove-btn {
    position: absolute;
    top: 6px;
    left: 8px;
  }
}
</style>
