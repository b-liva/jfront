<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="4">
          <v-text-field
          label="مشتری"
          v-model="incomeFilterForm.customerName"></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-text-field
            label="شماره واریزی"
            v-model="incomeFilterForm.number"
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
                :items="filteredIncomes"
                :expanded="incomeRowExpanded"
                :loading="loadingFilteredIncomes"
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
                  <router-link :to="{name: 'IncomeDetails', params: {id: item.id, number: item.number}}">{{item.number}}</router-link>
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
                      :loading="loadingIncomeRows"
                      :items="incomeRows">
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
  import {deleteIncome} from "../../grahpql/queries/income/mutation/deletion";
  import IncomeCreationHolderFrom from "./IncomeCreationHolderFrom";
  import {mapGetters, mapActions} from 'vuex'
  import {
    ACTION_UPDATE_FILTERED_INCOMES, ACTION_UPDATE_INCOME_ROWS,
    FILTERED_INCOMES, INCOME_FILTER_FORM, INCOME_ROWS,
    LOADING_FILTERED_INCOMES, LOADING_INCOME_ROWS
  } from "../../store/types/income";
  import debounce from 'debounce'

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
        assignments: "",
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
      ...mapActions({
        updateFilteredIncomes: ACTION_UPDATE_FILTERED_INCOMES,
        updateIncomeRows: ACTION_UPDATE_INCOME_ROWS,
      }),
      resetFilters(){
        this.customerName = "";
        this.incomeNumber = null;
      },
      editIncomeAssignment(incomeRow){
        console.log('irr: ', incomeRow)
        this.selectedIncomeAssignmentId = incomeRow.id;
        this.incomeInstance = incomeRow.income
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
          this.updateIncomeRows(this.incomeToFindRows.id)
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
    created() {
      this.updateFilteredIncomes = debounce(this.updateFilteredIncomes, 1000)
    },
    mounted() {
      this.updateFilteredIncomes()
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
      ...mapGetters({
        filteredIncomes: FILTERED_INCOMES,
        loadingFilteredIncomes: LOADING_FILTERED_INCOMES,
        incomeFilterForm: INCOME_FILTER_FORM,
        incomeRows: INCOME_ROWS,
        loadingIncomeRows: LOADING_INCOME_ROWS
      })
    },
    watch: {
      incomeFilterForm: {
        handler(){
          this.updateFilteredIncomes()
        },
        deep: true
      }
    },
  }
</script>

<style scoped>
  .v-data-table__expanded.v-data-table__expanded__content tr{
    color: blue;
  }
</style>
