<template>
  <div>
    <v-card>
      <v-card-title>واریزی</v-card-title>
      <v-card-text>
        <v-data-table
          :headers="incomeHeaders"
          :items="incomes"
          :expanded="incomeRowExpanded"
          show-expand
          single-expand
          @item-expanded="incomeExpanded">
          <template v-slot:item.incomeNumber="{item}">
            <router-link :to="{name: 'Income', params: {id: item.id, number: item.incomeNumber}}">{{item.incomeNumber}}</router-link>
          </template>
          <template v-slot:expanded-item="{headers}">
            <td :colspan="headers.length">
              <v-data-table
                dense
                :headers="assignmentHeaders"
                :items="assignments"
                @click:row="showPermitIncomes">
              </v-data-table>
            </td>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
    <v-dialog v-model="permitIncomeDialog" width="800px">
      <permit-incomes :permit="permitId"/>
    </v-dialog>
  </div>
</template>

<script>
  import PermitIncomes from "./PermitIncomes";

  export default {
    data(){
      return {
        name: "IncomeSummary",
        incomeRowExpanded: [],
        incomeHeaders: [
          {value: "incomeNumber", text: "شماره واریزی"},
          {value: "customerName", text: "مشتری"},
          {value: "incomeType", text: "نوع پرداخت"},
          {value: "amount", text: "مبلغ"},
          {value: "date", text: "تاریخ"},
        ],
        incomes: [
          {id: 1, incomeNumber: 651, date: "1399-01-23", customerName: "شرکت زرین ذرت شاهرود", amount: 165100000, incomeType: "حواله"},
          {id: 2, incomeNumber: 18491, date: "1399-01-23", customerName: "آرمان گسترنوین کنارک", amount: 255100000, incomeType: "چک"},
          {id: 3, incomeNumber: 1698, date: "1399-01-23", customerName: "صنایع بسته بندی فرآورده های شیری پگاه", amount: 365100000, incomeType: "حواله"},
          {id: 4, incomeNumber: 981215, date: "1399-01-23", customerName: "پویاموتور سپاهان", amount: 468500000, incomeType: "حواله"},
        ],
        assignmentHeaders: [
          {value: "number", text: "شماره"},
          {value: "type", text: "نوع"},
          {value: "date", text: "تاریخ"},
          {value: "amount", text: "مبلغ"},
        ],
        assignments: [
          {number: 98252, date: "1399-01-15", amount: 31805100, type: 'پیش فاکتور'},
          {number: 1002, date: "1399-01-23", amount: 8505100, type: 'مجوز'},
          {number: 365, date: "1399-01-1", amount: 6985100, type: 'مجوز'},
          {number: 98645, date: "1399-01-18", amount: 1458100, type: 'پیش فاکتور'},
        ],
        permitId: null,
        permitIncomeDialog: false,
      }
    },
    methods: {
      incomeExpanded(value){
        console.log(value.item, this.incomeRowExpanded)
        if(this.incomeRowExpanded.includes(value.item)){
          this.incomeRowExpanded.pop(value.item);
        }else {
          this.incomeRowExpanded = [];
          this.incomeRowExpanded.push(value.item);
        }
      },
      showPermitIncomes(permit){
        console.log(permit)
        this.permitIncomeDialog = true;
      }
    },
    components: {
      PermitIncomes
    }
  }
</script>

<style scoped>
  .v-data-table__expanded.v-data-table__expanded__content tr{
    color: blue;
  }
</style>
