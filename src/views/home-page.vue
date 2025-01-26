<template>
  <main class="q-pa-md">
    <div class="help-section row items-center">
      <q-icon name="fa-solid fa-question" size="sm" class="q-mr-md" />
      <div>
        <div>
          ⚬ הוסף מחשבונים בעזרת כפתור
          <b> הוסף מחשבון פיננסי </b>
          , ישנם מחשבונים ייעודיים שמותאמים לכל כלי פיננסי, ומחשבון כללי לחישובים מורכבים
        </div>
        <div>
          ⚬ במחשבון הכללי ישנה אופציה להוספת הפקדות מחזוריות והפקדות חד פעמיות, על מנת להוסיף
          <b> הפקדה חד פעמית </b>
          יש להשאיר את מספר החודשים ומספר ההפקדות עם הערך
          <b>1</b>
        </div>
        <div>
          ⚬ ניתן לשמור את המחשבונים בעזרת כפתור
          <b> שמור </b>
          ,השמירה תתבצע באופן מקומי על הדפדפן ולא תשמור את הנתונים בשרת חיצוני
        </div>
      </div>
    </div>
    <section class="row q-gutter-md items-center">
      <q-btn color="primary" label="הוסף מחשבון פיננסי" icon="fa-regular fa-plus">
        <q-menu fit square>
          <q-list>
            <q-item
              clickable
              v-close-popup
              @click="addRetirementCalculator"
              class="row items-center"
            >
              <span>מחשבון פנסיה</span>
            </q-item>
            <!-- <q-item
            clickable
            v-close-popup
            @click="addContinuingEducationFundCalculator"
            class="row items-center"
            >
            <span>מחשבון קרן השתלמות</span>
          </q-item> -->
            <q-item
              clickable
              v-close-popup
              @click="addInvestmentCalculator"
              class="row items-center"
            >
              <span>מחשבון כללי</span>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>

      <q-btn :disable="!calculators.length" label="שמור" color="primary" @click="saveData">
        <q-tooltip v-if="!calculators.length">הוסף מחשבון תחילה</q-tooltip>
      </q-btn>
    </section>

    <section class="calculators-container-wrapper">
      <section class="calculators-container q-mt-sm row no-wrap q-gutter-md items-start">
        <component
          v-for="(calculator, i) in calculators"
          :key="i"
          :is="calculator.type"
          :calculator="calculator"
          @update-options="updateOptions(i, $event)"
          @update-name="updateName(i, $event)"
          @remove="removeCalculator(i)"
        ></component>
      </section>
    </section>
  </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
// Components
import { RetirementCalculator } from '@/components/retirement-calculator'
import { GeneralInvestmentCalculator } from '@/components/investment-calculator'
import { ContinuingEducationFundCalculator } from '@/components/continuing-education-fund-calculator'
// Models
import type { Calculator } from '@/models/calculator.model'

export default defineComponent({
  name: 'home-page',
  components: {
    RetirementCalculator,
    GeneralInvestmentCalculator,
    ContinuingEducationFundCalculator,
  },
  data() {
    return {
      calculators: [] as Calculator[],
    }
  },
  created() {
    const calculators = localStorage.getItem('calculators')
    if (calculators) {
      this.calculators = JSON.parse(calculators)
    }
  },
  methods: {
    addRetirementCalculator() {
      this.calculators.push({
        type: 'retirement-calculator',
        name: 'מחשבון פנסיה',
        options: {
          currentAccumulatedAmount: 0,
          monthlyIncome: 0,
          monthlyContributionPercentage: 18.5,
          yearsToCalculation: 0,
          accumulationAnnualFee: 0,
          depositFee: 0,
          interestRate: 0,
        },
      })
    },
    addContinuingEducationFundCalculator() {
      this.calculators.push({
        type: 'continuing-education-fund-calculator',
        name: 'מחשבון קרן השתלמות',
        options: {
          currentAccumulatedAmount: 0,
          monthlyIncome: 0,
          accumulationAnnualFee: 0,
          depositFee: 0,
          yearsToCalculation: 0,
          interestRate: 0,
          overTaxCeilingDeposit: false,
        },
      })
    },
    addInvestmentCalculator() {
      this.calculators.push({
        type: 'general-investment-calculator',
        name: 'מחשבון כללי',
        options: {
          currentAccumulatedAmount: 0,
          monthlyContribution: 0,
          yearsToCalculation: 0,
          accumulationAnnualFee: 0,
          depositFee: 0,
          interestRate: 0,
          periodicDeposits: [],
          incomeTaxRate: 0,
          reduceTaxAnnually: false,
        },
      })
    },
    removeCalculator(index: number) {
      this.calculators.splice(index, 1)
    },
    updateOptions(index: number, options: Record<string, unknown>) {
      this.calculators[index] = { ...this.calculators[index], options }
    },
    updateName(index: number, name: string) {
      this.calculators[index] = { ...this.calculators[index], name }
    },
    saveData() {
      localStorage.setItem('calculators', JSON.stringify(this.calculators))
      this.$q.notify({
        message: 'המחשבונים נשמרו בהצלחה',
        color: 'positive',
      })
    },
  },
})
</script>

<style lang="scss" scoped>
.calculators-container-wrapper {
  width: 100%;
  overflow-x: scroll;
  direction: ltr;
  transform: rotateX(180deg);
  .calculators-container {
    width: fit-content;
    transform: rotateX(180deg);
  }
}

.help-section {
  border-radius: 4px;
  border: 1px solid #21ba45;
  background-color: #daf8e1;
  padding: 8px 16px;
  margin: 16px 0;
}
</style>
