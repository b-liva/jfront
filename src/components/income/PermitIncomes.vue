<template>
  <div>
    <v-card>
      <v-card-title>
        دریافتی ها بابت این مجوز
      </v-card-title>
      <v-card-text>
        <v-data-table
          dense
          :items="getIncomesForId()"
          :headers="permitIncomeHeaders">
        </v-data-table>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
  import {incomesByPermitId, incomesByProformaId} from "../../grahpql/queries/income/income";

  export default {
    data(){
      return {
        name: "PermitIncomes",
        resultList: [],
        permitIncomeHeaders: [
          {value: "number", text: "شماره واریزی"},
          {value: "amount", text: "مبلغ"},
          {value: "type", text: "نوع واریز"},
          {value: "date", text: "تاریخ"},
          {value: "dueDate", text: "تسویه"},
        ],
        permitIncomes: [
          {id: 1, number: 15135, amount: 12150000, type: "حواله", date: "1399-01-5"},
          {id: 5, number: 651, amount: 12150000, type: "چک", date: "1399-01-5", dueDate: "1399-03-05"},
          {id: 25, number: 913521, amount: 12150000, type: "حواله", date: "1399-01-5"},
          {id: 36, number: 1651, amount: 12150000, type: "حواله", date: "1399-01-5"},
        ]
      }
    },
    props: [
      "proformaIdToFindIncomes",
      "permitIdToFindIncomes"
    ],
    methods: {
      getIncomesForId(){

        this.resultList = [];
        if (typeof this.incomesByProformaId !== "undefined" && this.incomesByProformaId != null){
          let incomes = this.incomesByProformaId.incomerowSet.edges;
          incomes.forEach(e => this.resultList.push(
            {
              'number': e.node.income.number,
              'amount': e.node.income.amount,
              'type': e.node.income.type.title,
            }
          ))
        }
        if (typeof this.incomesByPermitId !== "undefined" && this.incomesByPermitId != null){
          let permitIncomes = this.incomesByPermitId.incomerowSet.edges;
          permitIncomes.forEach(e => this.resultList.push(
            {
              'number': e.node.income.number,
              'amount': e.node.income.amount,
              'type': e.node.income.type.title,
            }
          ))
        }
        console.log(this.resultList)
        return this.resultList
      }
    },
    beforeCreate() {
    },
    created() {
      console.log(this.proformaIdToFindIncomes)
      console.log(this.permitIdToFindIncomes)
    },
    mounted(){
    },
    beforeMount() {
    },
    apollo: {
      incomesByProformaId: {
        query: incomesByProformaId,
        variables(){
          return {
            proforma_id: this.proformaIdToFindIncomes
          }
        }
      },
      incomesByPermitId: {
        query: incomesByPermitId,
        variables(){
          return {
            perm_id: this.permitIdToFindIncomes
          }
        }
      }
    }
  }
</script>

<style scoped>

</style>
