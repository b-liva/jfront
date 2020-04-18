<template>
  <div>
    <v-container>
      <v-row>
        <v-col>
          <v-card>
            <v-card-title>واریزی شماره {{income.number}}</v-card-title>
            <v-card-text>
              {{income.date}}
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col cols="10" md="8">
          <v-icon @click="editIncome(income.id)" small class="mr-2">mdi-pencil</v-icon>
          <v-icon @click="deleteIncome(income.id)" small class="mr-2">mdi-delete</v-icon>
        </v-col>
      </v-row>
      <v-dialog v-model="incomeformDialog" max-width="800px">
        <income-form :income-id="income.id"/>
      </v-dialog>
    </v-container>
  </div>
</template>

<script>
  import IncomeForm from "../../components/income/IncomeForm";

  export default {
    data(){
      return {
        name: "IncomeDetails",
        income: '',
        incomeformDialog: false,
      }
    },
    created(){
      this.income = {
        id: this.$route.params.id,
        number: this.$route.params.number,
        data: "1399-01-17",
        amount: 98520000,
      }
    },
    methods: {
      editIncome(){
        console.log('method.')
        this.incomeformDialog = true;
      },
      deleteIncome(){
        console.log('method.')
      },
    },
    components: {
      IncomeForm
    }
  }
</script>

<style scoped>

</style>
