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
              <span>מחשבון השקעות</span>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>

      <q-btn :disable="!calculators.length" label="שמור" color="primary" @click="saveData">
        <q-tooltip v-if="!calculators.length">הוסף מחשבון תחילה</q-tooltip>
      </q-btn>
    </section>

    <q-tabs
      v-model="selectedTab"
      active-color="primary"
      indicator-color="primary"
      align="left"
      class="q-mt-md"
    >
      <q-tab class="q-px-lg" name="פנסיה" label="פנסיה" />
      <q-tab class="q-px-lg" name="השקעות" label="השקעות" />
    </q-tabs>

    <q-separator />

    <q-tab-panels v-model="selectedTab" animated>
      <q-tab-panel name="פנסיה">
        <div v-if="!retirementsCalculators.length">
          <div class="help-section row items-center">
            <q-icon name="fa-solid fa-exclamation" size="sm" class="q-mr-md" />
            <div>הוסף מחשבון פנסיה על מנת להתחיל לחשב</div>
          </div>
          <q-btn icon="fa-regular fa-plus" @click="addRetirementCalculator"
            >הוסף מחשבון פנסיה</q-btn
          >
        </div>
        <div v-else class="row q-gutter-md">
          <component
            v-for="calculator in retirementsCalculators"
            :key="calculator.id"
            :is="calculator.type"
            :calculator="calculator"
            @update-options="updateOptions(calculator.id, $event)"
            @update-name="updateName(calculator.id, $event)"
            @remove="removeCalculator(calculator.id)"
          ></component>
        </div>
      </q-tab-panel>

      <q-tab-panel name="השקעות">
        <div v-if="!investmentCalculators.length">
          <div class="help-section row items-center">
            <q-icon name="fa-solid fa-exclamation" size="sm" class="q-mr-md" />
            <div>הוסף מחשבון השקעות על מנת להתחיל לחשב</div>
          </div>
          <q-btn icon="fa-regular fa-plus" @click="addInvestmentCalculator"
            >הוסף מחשבון השקעות</q-btn
          >
        </div>
        <div v-else class="row q-gutter-md">
          <component
            v-for="calculator in investmentCalculators"
            :key="calculator.id"
            :is="calculator.type"
            :calculator="calculator"
            @update-options="updateOptions(calculator.id, $event)"
            @update-name="updateName(calculator.id, $event)"
            @remove="removeCalculator(calculator.id)"
          ></component>
        </div>
      </q-tab-panel>
    </q-tab-panels>
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
// Utils
import { uid } from 'quasar'

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
      selectedTab: 'פנסיה',
    }
  },
  created() {
    const calculators = localStorage.getItem('calculators')
    if (calculators) {
      this.calculators = JSON.parse(calculators)
    }
  },
  computed: {
    retirementsCalculators() {
      return this.calculators.filter((calculator) => calculator.type === 'retirement-calculator')
    },
    investmentCalculators() {
      return this.calculators.filter(
        (calculator) => calculator.type === 'general-investment-calculator',
      )
    },
  },
  methods: {
    addRetirementCalculator() {
      this.calculators.push({
        type: 'retirement-calculator',
        name: 'מחשבון פנסיה',
        id: uid(),
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
      this.selectedTab = 'פנסיה'
    },
    addContinuingEducationFundCalculator() {
      this.calculators.push({
        type: 'continuing-education-fund-calculator',
        name: 'מחשבון קרן השתלמות',
        id: uid(),
        options: {
          currentAccumulatedAmount: 0,
          monthlyIncome: 0,
          accumulationAnnualFee: 0,
          depositFee: 0,
          yearsToCalculation: 0,
          interestRate: 0,
          isTaxFreeDeposit: false,
        },
      })
    },
    addInvestmentCalculator() {
      this.calculators.push({
        type: 'general-investment-calculator',
        name: 'מחשבון השקעות',
        id: uid(),
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
      this.selectedTab = 'השקעות'
    },
    removeCalculator(id: string) {
      this.calculators = this.calculators.filter((calculator) => calculator.id !== id)
    },
    updateOptions(id: string, options: Record<string, unknown>) {
      this.calculators = this.calculators.map((calculator) =>
        id === calculator.id ? { ...calculator, options } : calculator,
      )
    },
    updateName(id: string, name: string) {
      this.calculators = this.calculators.map((calculator) =>
        id === calculator.id ? { ...calculator, name } : calculator,
      )
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
  width: fit-content;
  border-radius: 4px;
  border: 1px solid #21ba45;
  background-color: #daf8e1;
  padding: 8px 16px;
  margin: 8px 0;
}
</style>
