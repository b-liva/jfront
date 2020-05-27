<template>
  <div>
    <div v-if="incomeToFindRows !== ''">income to find rows: {{incomeToFindRows.number}}</div>
    <div v-if="incomeRowExpanded.length > 0">income: {{incomeRowExpanded[0].number}}</div>
    <v-container>
      <v-row>
        <span v-if="incomeInstance">
          income instance :{{incomeInstance.number}}
        </span>
        <v-col cols="12" md="12">
          <v-card>
            <v-card-text>
              <v-data-table
                :headers="incomeHeaders"
                :items="incomes"
                :expanded="incomeRowExpanded"
                :loading="$apollo.queries.allIncomes.loading"
                show-expand
                single-expand
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
                  <template v-if="item.type !== null">{{item.type.title}}</template>
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
                      :loading="$apollo.queries.incomeRowByIncomeId.loading"
                      :items="assignments">
                      <!--                      @click:row="showPermitIncomes"-->

                      <template v-slot:item.proforma="{item}">
                        {{checkMe('prof', item.proforma)}}
                      </template>
                      <template v-slot:item.perm="{item}">
                        {{checkMe('perm', item.perm)}}
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
      <income-form v-if="incomeFormDialog" :income-id="incomeInstance.id"/>
    </v-dialog>
    <v-dialog v-model="incomeAssignmentDialog" max-width="800px" persistent>
      <income-assignment-form
        v-if="incomeAssignmentDialog"
        :income="incomeInstance"
        :income-assignment-row-id="selectedIncomeAssignmentId"
        :refetchAssignments="incomeAssignmentDone"
      />
    </v-dialog>
    <v-dialog persistent v-model="incomeCreationHolder" max-width="1000px">
      <income-creation-holder-from
        v-on:closeIncomeCreationHolder="incomeCreationHolder = false"
        v-if="incomeCreationHolder"
      />
    </v-dialog>
  </div>
</template>

<script>
  import {baseFunctions} from "../../mixins/graphql/baseFunctions";
  import PermitIncomes from "./PermitIncomes";
  import IncomeForm from "./IncomeForm";
  import IncomeAssignmentForm from "./assignment/IncomeAssignmentForm";
  import {allIncomes, incomeRowByIncomeId} from "../../grahpql/queries/income/income";
  import IncomeCreationHolderFrom from "./IncomeCreationHolderFrom";

  export default {
    data(){
      return {
        name: "IncomeSummary",
        incomeToFindRows: "",
        incomeInstance: {
          amount: '',
          customer: {
            id:'',
            name: ''
          },
          id:"",
          number: "",
          owner: {
            id: '',
            lastName: ''
          },
          type: {
            id: '',
            title: ''
          }
        },
        error: null,
        selectedIncomeAssignmentId: null,
        proformaIdToFindIncomes: null,
        permitIdToFindIncomes: null,
        incomeFormDialog: false,
        incomeAssignmentDialog: false,
        incomeCreationHolder: false,
        incomeRowExpanded: [],
        incomeHeaders: [
          {value: "number", text: "شماره واریزی"},
          {value: "customer", text: "مشتری"},
          {value: "type", text: "نوع پرداخت"},
          {value: "amount", text: "مبلغ"},
          {value: "date", text: "تاریخ"},
          {value: "action", text: ""},
        ],
        incomes: [],
        assignmentHeaders: [
          {value: "proforma", text: "پیش فاکتور"},
          {value: "perm", text: "مجوز"},
          {value: "date", text: "تاریخ"},
          {value: "amount", text: "مبلغ"},
          {value: "action", text: ""},
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
        this.incomeCreationHolder = true;
      },
      checkMe(type, data){
        if (typeof data !== "undefined" && typeof data.number !== "undefined"){
          return data.number;
        }
      },
      incomeAssignmentDone(){
        this.$apollo.queries.incomeRowByIncomeId.refetch()
        this.incomeAssignmentDialog = false;
      },
      incomeExpanded(value){
        this.incomeToFindRows = value.item;
        console.log('item expanded: ', this.incomeToFindRows);
        if(this.incomeRowExpanded.includes(value.item)){
          this.incomeRowExpanded.pop(value.item);
        }else {
          this.incomeRowExpanded = [];
          this.incomeRowExpanded.push(value.item);
        }
        console.log('last')
      },
      editIncome(income){
        this.incomeInstance = income;
        this.incomeFormDialog = true;
      },
      deleteIncome(income){
        console.log('action', income)
      },
      assignIncomeToPermit(income){
        console.log('assignIncomeToPermit: ', income.number)
        this.selectedIncomeAssignmentId = null;
        this.incomeAssignmentDialog = true;
        this.incomeInstance= income;
        console.log('*&*&: ', this.incomeInstance)
      },
    },
    components: {
      PermitIncomes,
      IncomeForm,
      IncomeAssignmentForm,
      IncomeCreationHolderFrom
    },
    mixins: [
      baseFunctions
    ],
    updated() {
      console.log('summary updated: ', this.incomeInstance)
    },
    computed: {
      assignments(){
        console.log('new *****: ', this.incomeRowByIncomeId)
        if (typeof  this.incomeRowByIncomeId !== "undefined"){
          return this.noNode(this.incomeRowByIncomeId);
        }else { return  []}
      }
    },
    apollo: {
      allIncomes: {
        query: allIncomes,
        result(result){
          this.incomes = this.noNode(result.data.allIncomes)
        }
      },
      incomeRowByIncomeId: {
        query: incomeRowByIncomeId,
        skip(){
          let x = typeof this.incomeToFindRows.number !== "undefined";
          return !x
        },
        variables(){
          console.log('set variable: ', this.incomeToFindRows.number);
          return {
            "income_id": this.incomeToFindRows.id
          }
        },
        // result({data}){
        //   console.log('new *****: ', data)
        //   if (typeof  data.incomeRowByIncomeId !== "undefined"){
        //     this.assignments = this.noNode(data.incomeRowByIncomeId);
        //   }else { return  []}
        // }
      }
    }
  }
</script>

<style scoped>
  .v-data-table__expanded.v-data-table__expanded__content tr{
    color: blue;
  }
</style>
