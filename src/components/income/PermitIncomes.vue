<template>
  <div>
    <v-card>
      <v-card-title>
        دریافتی ها بابت این مجوز
      </v-card-title>
      <v-card-text>
        <v-data-table
          dense
          :items="permitIncomes"
          :headers="permitIncomeHeaders">
        </v-data-table>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
  export default {
    data(){
      return {
        name: "PermitIncomes",
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
    beforeCreate() {
    },
    created() {
    },
    mounted(){
    },
    beforeMount() {
    },
  }
</script>

<style scoped>

</style>
