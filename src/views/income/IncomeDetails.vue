<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="6" md="4">
          <customer-card :customer-id="income.customer.id"/>
        </v-col>
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
      <v-row>
        <v-col>
          <v-data-table
          :items="incomeAssignments"
          :headers="incomeAssignmentHeader">
            <template v-slot:item.action="{item}">
              <v-icon @click="editIncomeAssignment(item.id)" small class="mr-2">mdi-pencil</v-icon>
              <v-icon @click="deleteIncomeAssignment(item.id)" small class="mr-2">mdi-delete</v-icon>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
      <v-dialog v-model="incomeFormDialog" max-width="800px">
        <income-form :income-id="income.id"/>
      </v-dialog>
      <v-dialog v-model="incomeAssignmentFormDialog" max-width="800px">
        <income-assignment-form :income-assignment-row-id="incomeAssignment"/>
      </v-dialog>
    </v-container>
  </div>
</template>

<script>
  import IncomeForm from "../../components/income/IncomeForm";
  import IncomeAssignmentForm from "../../components/income/assignment/IncomeAssignmentForm";
  import CustomerCard from "../../components/customer/CustomerCard";

  export default {
    data(){
      return {
        name: "IncomeDetails",
        income: '',
        incomeAssignment: '',
        incomeFormDialog: false,
        incomeAssignmentFormDialog: false,
        incomeAssignmentHeader: [
          {value: "number", text: "شماره"},
          {value: "date", text: "تاریخ"},
          {value: "amount", text: "مبلغ"},
          {value: "action", text: ""},
        ],
        incomeAssignments: [
          {id: 1, number: 238, date: "1398-01-02", amount: 16510000},
          {id: 2, number: 1651, date: "1398-05-20", amount: 151315000},
        ]
      }
    },
    created(){
      this.income = {
        id: this.$route.params.id,
        number: this.$route.params.number,
        customer: {
          id: 1,
          name: "هوایار"
        },
        data: "1399-01-17",
        amount: 98520000,
      }
    },
    methods: {
      editIncome(){
        console.log('method.')
        this.incomeFormDialog = true;
      },
      deleteIncome(){
        console.log('method.')
      },
      editIncomeAssignment(item){
        console.log('edit', item)
        this.incomeAssignment = item;
        this.incomeAssignmentFormDialog = true;
      },
      deleteIncomeAssignment(item){
        console.log('delete', item)
      },
    },
    components: {
      IncomeForm,
      IncomeAssignmentForm,
      CustomerCard
    }
  }
</script>

<style scoped>

</style>
