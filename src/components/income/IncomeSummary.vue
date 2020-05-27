<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="4">
          <v-text-field
          label="مشتری"
          v-model="customerName"></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-text-field
            label="شماره واریزی"
            v-model="incomeNumber"
            type="number"
          ></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-btn @click="resetFilters" class="primary" small>ریست</v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="12">
          <v-card>
            <v-card-text>
              <v-data-table
                :headers="incomeHeaders"
                :items="incomes"
                :expanded="incomeRowExpanded"
                :loading="$apollo.queries.incomesFiltered.loading"
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
  import {incomesFiltered, incomeRowByIncomeId} from "../../grahpql/queries/income/income";
  import {deleteIncome} from "../../grahpql/queries/income/mutation/deletion";
  import IncomeCreationHolderFrom from "./IncomeCreationHolderFrom";

  export default {
    data(){
      return {
        name: "IncomeSummary",
        incomeToFindRows: "",
        incomeNumber: null,
        customerName: '',
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
      resetFilters(){
        this.customerName = "";
        this.incomeNumber = null;
      },
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
      incomeAssignmentDone(incomeId){
        this.incomeToFindRows = this.incomes.filter(e => e.id===incomeId)[0];
        if(this.incomeRowExpanded.includes(this.incomeToFindRows)){
          this.$apollo.queries.incomeRowByIncomeId.refetch()
        }else {
          this.incomeRowExpanded = [];
          this.incomeRowExpanded.push(this.incomeToFindRows);
        }
        this.incomeAssignmentDialog = false;
      },
      incomeExpanded(value){
        this.incomeToFindRows = value.item;
        if(this.incomeRowExpanded.includes(value.item)){
          this.incomeRowExpanded.pop(value.item);
        }else {
          this.incomeRowExpanded = [];
          this.incomeRowExpanded.push(value.item);
        }
      },
      editIncome(income){
        this.incomeInstance = income;
        this.incomeFormDialog = true;
      },
      deleteIncome(income){
        let confirmed = confirm("مورد تأیید است؟ ");
        if (confirmed) {
          this.$apollo.mutate({
            mutation: deleteIncome,
            variables: {
              "income_id": income.id
            }
          }).then(() => {
            this.$apollo.queries.incomesFiltered.refetch()
          }, error => {
            console.error(error)
          })
        }
      },
      assignIncomeToPermit(income){
        this.selectedIncomeAssignmentId = null;
        this.incomeAssignmentDialog = true;
        this.incomeInstance= income;
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
    computed: {
      assignments(){
        if (typeof  this.incomeRowByIncomeId !== "undefined"){
          return this.noNode(this.incomeRowByIncomeId);
        }else { return  []}
      }
    },
    apollo: {
      incomesFiltered: {
        query: incomesFiltered,
        debounce: 1000,
        variables(){
          return {
            "customer_name": this.customerName,
            "number": this.incomeNumber
          }
        },
        result(result){
          this.incomes = this.noNode(result.data.incomesFiltered)
        }
      },
      incomeRowByIncomeId: {
        query: incomeRowByIncomeId,
        skip(){
          let x = typeof this.incomeToFindRows.number !== "undefined";
          return !x
        },
        variables(){
          return {
            "income_id": this.incomeToFindRows.id
          }
        },
        fetchPolicy:"cache-and-network"
      }
    }
  }
</script>

<style scoped>
  .v-data-table__expanded.v-data-table__expanded__content tr{
    color: blue;
  }
</style>
