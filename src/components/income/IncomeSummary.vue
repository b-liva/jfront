<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="12" md="12">
          <v-card>
            <v-card-text>
              <v-text-field v-model="search"></v-text-field>
              <v-data-table
                :headers="incomeHeaders"
                :items="getIncomes()"
                :expanded="incomeRowExpanded"
                :loading="$apollo.queries.allIncomes.loading"
                show-expand
                single-expand
                :search="search"
                @item-expanded="incomeExpanded">
                <template v-slot:top>
                  <v-toolbar>
                    <v-toolbar-title>واریزی</v-toolbar-title>
                    <v-divider vertical inset class="mr-4"></v-divider>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" dark @click="openIncomeForm()">واریز جدید</v-btn>
                  </v-toolbar>
                </template>
                <template v-slot:item.number="{item}">
                  <router-link :to="{name: 'Income', params: {id: item.id, number: item.number}}">{{item.number}}</router-link>
                </template>
                <template v-slot:item.customer="{item}">
                  {{item.customer.name}}
                </template>
                <template v-slot:item.type="{item}">
                  {{item.type.title}}
                </template>
                <template v-slot:item.action="{item}">
                  <v-icon @click="editIncome(item)" small class="mr-2">mdi-pencil</v-icon>
                  <v-icon @click="deleteIncome(item)" small class="mr-2">mdi-delete</v-icon>
                  <v-icon @click="assignIncomeToPermit(item)" small class="mr-2">mdi-arrow-left-bold</v-icon>
                </template>
                <template v-slot:expanded-item="{headers}">
                  <td :colspan="headers.length">
                    <v-data-table
                      dense
                      :headers="assignmentHeaders"
                      :items="getAssignments()"
                      :loading="$apollo.queries.income.loading">
<!--                      @click:row="showPermitIncomes"-->

                      <template v-slot:item.proforma="{item}">
                        {{checkMe(item.proforma)}}
                      </template>
                      <template v-slot:item.perm="{item}">
                        {{checkMe(item.perm)}}
                      </template>
                      <template v-slot:item.action="{item}">
                        <v-icon @click="editIncomeAssignment(item)" small class="mr-2">mdi-pencil</v-icon>
                        <v-icon @click="deleteIncomeAssignment(item)" small class="mr-2">mdi-delete</v-icon>
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
      <permit-incomes :permit-id-to-find-incomes="permitIdToFindIncomes" :proforma-id-to-find-incomes="proformaIdToFindIncomes"/>
    </v-dialog>
    <v-dialog v-model="incomeFormDialog" max-width="800px">
      <income-form v-if="incomeFormDialog" :income-id="selectedIncomeId"/>
    </v-dialog>
    <v-dialog v-model="incomeAssignmentDialog" max-width="800px">
      <income-assignment-form v-if="incomeAssignmentDialog" :income-id="selectedIncomeId" :income-assignment-row-id="selectedIncomeAssignmentId"/>
    </v-dialog>
  </div>
</template>

<script>
  import {baseFunctions} from "../../mixins/graphql/baseFunctions";
  import PermitIncomes from "./PermitIncomes";
  import IncomeForm from "./IncomeForm";
  import IncomeAssignmentForm from "./assignment/IncomeAssignmentForm";
  import {allIncomes, income} from "../../grahpql/queries/income/income";

  export default {
    data(){
      return {
        name: "IncomeSummary",
        search: '',
        selectedIncomeId: null,
        selectedIncomeAssignmentId: null,
        proformaIdToFindIncomes: null,
        permitIdToFindIncomes: null,
        incomeFormDialog: false,
        incomeAssignmentDialog: false,
        incomeRowExpanded: [],
        incomeHeaders: [
          {value: "number", text: "شماره واریزی"},
          {value: "customer", text: "مشتری"},
          {value: "type", text: "نوع پرداخت"},
          {value: "amount", text: "مبلغ"},
          {value: "date", text: "تاریخ"},
          {value: "action", text: ""},
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
          {value: "action", text: ""},
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
      editIncomeAssignment(incomeRow){
        this.selectedIncomeAssignmentId = incomeRow.id;
        this.incomeAssignmentDialog = true;
      },
      deleteIncomeAssignment(incomeRow){
        this.selectedIncomeAssignmentId = incomeRow.id;
        this.incomeAssignmentDialog = true;
      },
      openIncomeForm(){
        this.selectedIncomeId = null;
        this.incomeFormDialog = true;
      },
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
        console.log('assing: ', permit)
        const is_proforma = permit.proforma !== null;
        const is_permit = permit.perm !== null;
        if (is_proforma){
          this.proformaIdToFindIncomes = permit.proforma.id;
          this.permitIdToFindIncomes = null
        }
        if (is_permit){
          this.permitIdToFindIncomes = permit.perm.id;
          this.proformaIdToFindIncomes = null;
        }
        this.permitIncomeDialog = true;
      },
      editIncome(income){
        this.selectedIncomeId = income.id;
        this.incomeFormDialog = true;
      },
      deleteIncome(income){
        console.log('action', income)
      },
      assignIncomeToPermit(income){
        this.selectedIncomeAssignmentId = null;
        this.incomeAssignmentDialog = true;
        this.selectedIncomeId = income.id;
      },
    },
    components: {
      PermitIncomes,
      IncomeForm,
      IncomeAssignmentForm
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
      },
    }
  }
</script>

<style scoped>
  .v-data-table__expanded.v-data-table__expanded__content tr{
    color: blue;
  }
</style>
