<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="12" md="10">
          <v-card>
            <v-card-title>واریزی</v-card-title>
            <v-card-text>
              <v-data-table
                :headers="incomeHeaders"
                :items="getIncomes()"
                :expanded="incomeRowExpanded"
                :loading="$apollo.queries.allIncomes.loading"
                show-expand
                single-expand
                @item-expanded="incomeExpanded">
                <template v-slot:item.number="{item}">
                  <router-link :to="{name: 'Income', params: {id: item.id, number: item.number}}">{{item.number}}</router-link>
                </template>
                <template v-slot:item.customer="{item}">
                  {{item.customer.name}}
                </template>
                <template v-slot:item.type="{item}">
                  {{item.type.title}}
                </template>
                <template v-slot:expanded-item="{headers}">
                  <td :colspan="headers.length">
                    <v-data-table
                      dense
                      :headers="assignmentHeaders"
                      :items="getAssignments()"
                      :loading="$apollo.queries.income.loading"
                      @click:row="showPermitIncomes">
                      <template v-slot:item.proforma="{item}">
                        {{checkMe(item.proforma)}}
                      </template>
                      <template v-slot:item.perm="{item}">
                        {{checkMe(item.perm)}}
                      </template>
                    </v-data-table>
                  </td>
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <v-dialog v-model="permitIncomeDialog" width="800px">
      <permit-incomes :permit="permitId"/>
    </v-dialog>
  </div>
</template>

<script>
  import {baseFunctions} from "../../mixins/graphql/baseFunctions";
  import PermitIncomes from "./PermitIncomes";
  import {allIncomes, income} from "../../grahpql/queries/income/income";

  export default {
    data(){
      return {
        name: "IncomeSummary",
        selectedIncomeId: null,
        incomeRowExpanded: [],
        incomeHeaders: [
          {value: "number", text: "شماره واریزی"},
          {value: "customer", text: "مشتری"},
          {value: "type", text: "نوع پرداخت"},
          {value: "amount", text: "مبلغ"},
          {value: "date", text: "تاریخ"},
        ],
        incomes: [
          {id: 1, number: 651, date: "1399-01-23", customer: "شرکت زرین ذرت شاهرود", amount: 165100000, type: "حواله"},
          {id: 2, number: 18491, date: "1399-01-23", customer: "آرمان گسترنوین کنارک", amount: 255100000, type: "چک"},
          {id: 3, number: 1698, date: "1399-01-23", customer: "صنایع بسته بندی فرآورده های شیری پگاه", amount: 365100000, type: "حواله"},
          {id: 4, number: 981215, date: "1399-01-23", customer: "پویاموتور سپاهان", amount: 468500000, type: "حواله"},
        ],
        assignmentHeaders: [
          {value: "proforma", text: "پیش فاکتور"},
          {value: "perm", text: "مجوز"},
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
      checkMe(data){
        if (data !== null){
          return data.number;
        }
      },
      getIncomes(){
        if (typeof this.allIncomes !== "undefined" && this.allIncomes !== null){
          return this.noNode(this.allIncomes);
        }
      },
      getAssignments(){
        console.log('income: ', this.income)
        console.log('status: ', typeof this.income !== "undefined" && this.income != null)
        if (typeof this.income !== "undefined" && this.income != null){
          return this.noNode(this.income.incomerowSet);
        }
      },
      incomeExpanded(value){
        this.selectedIncomeId = value.item.id;
        console.log('income id: ', this.selectedIncomeId)
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
      PermitIncomes,
    },
    mixins: [
      baseFunctions
    ],
    apollo: {
      allIncomes: allIncomes,
      income: {
        query: income,
        variables(){
          return {
            income_id: this.selectedIncomeId
          }
        }
      }
    }
  }
</script>

<style scoped>
  .v-data-table__expanded.v-data-table__expanded__content tr{
    color: blue;
  }
</style>
