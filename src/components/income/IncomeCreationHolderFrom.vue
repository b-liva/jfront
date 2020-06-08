<template>
  <div>
    <v-card>
      <v-toolbar
        flat
        color="transparent">
        <v-toolbar-title>دریافتی</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn
          icon
          @click="$emit('closeIncomeCreationHolder')"
        >
          <v-icon class="red--text">mdi-close-circle</v-icon>
        </v-btn>
      </v-toolbar>
    </v-card>
    <v-stepper>
      <v-stepper-header>
        <v-stepper-step
          step="1"
          v-model="e1"
          :complete="e1 > 1"
          :editable="editable">ثبت دریافتی</v-stepper-step>
        <v-stepper-step
          step="2"
          v-model="e1"
          :complete="e1 > 2"
          :editable="editable">تخصیص دریافتی</v-stepper-step>
      </v-stepper-header>
      <v-stepper-items>
        <v-stepper-content step="1">
          <income-form v-on:incomeCreated="incomeCreated"/>
        </v-stepper-content>
        <v-stepper-content step="2">
          <income-assignment-form
            v-if="incomeAssignmentFormIsActive"
            :income-id="incomeId"
            :income="income"
            :income-assignment-row-id="incomeAssignmentId"
          />
          <p v-else>دریافتی ثبت نشده است.</p>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
  </div>
</template>

<script>
  import IncomeForm from "./IncomeForm";
  import IncomeAssignmentForm from "./assignment/IncomeAssignmentForm";

  export default {
    data(){
      return {
        name: "IncomeCreationHolderFrom",
        e1: 1,
        editable: true,
        incomeId: '',
        income: '',
        incomeAssignmentId: '',
        incomeAssignmentFormIsActive: false,
      }
    },
    components: {
      IncomeAssignmentForm,
      IncomeForm
    },
    methods: {
      incomeCreated(income){
        this.incomeId = income.id;
        this.income = income;
        this.incomeAssignmentFormIsActive = true;
        this.e1 = 2
      },
    }
  }
</script>

<style scoped>

</style>
