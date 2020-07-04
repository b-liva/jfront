<template>
  <div>
    <v-card>
      <v-toolbar
        flat
        color="transparent">
        <v-toolbar-title>تخصیص واریزی</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>
    </v-card>
    <v-card>
      <v-card-title>
        اختصاص مبلغ از واریزی {{income.id}} به پیش فاکتور شماره: <span>{{proforma.number}}</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="6">
              <v-form>
                <div v-if="loading">LOADING....</div>
                <v-text-field
                  type="number"
                  label="شماره پیش فاکتور"
                  v-model="proforma.number"
                  disabled></v-text-field>
                <div v-if="statusOk">
                  <v-text-field label="مبلغ" v-model="incomeAssignmentForm.amount"></v-text-field>
                  <PersianDatePicker
                    v-model="incomeAssignmentForm.date"
                    format="jYYYY-jMM-jDD"
                    display-format="dddd jDD jMMMM jYYYY"
                    label="دریافت"
                    :auto-submit="true"/>
                  <v-textarea v-model="incomeAssignmentForm.summary" label="توضیحات"></v-textarea>
                </div>
              </v-form>
            </v-col>
            <v-col cols="6">
              <template v-if="typeof (customerStatus.unpaidProformas) !=='undefined' && customerStatus.unpaidProformas.length > 0">
                پیش فاکتور های دارای مانده
                <ol>
                  <li
                    v-for="proforma in customerStatus.unpaidProformas"
                    :key="proforma.key"
                    @click="setProforma(proforma)"
                  >{{proforma.number}} - {{proforma.unpaidTotal}}</li>
                </ol>
              </template>
              <p v-else>پیش فاکتور دارای مانده ندارد.</p>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <div v-if="statusOk">
          <v-btn color="success" @click="submitIncomeAssignment">ثبت</v-btn>
          <v-btn color="error" @click="cancelIncomeAssignment">انصراف</v-btn>
          <v-icon @click="clear()">mdi-close-circle</v-icon>
        </div>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
  import VuePersianDatetimePicker from 'vue-persian-datetime-picker';
  import {baseFunctions} from "../../../mixins/graphql/baseFunctions";
  import {incomeRowById} from "../../../grahpql/queries/income/incomeAssignment";
  import {proformaIdByNumber} from "../../../grahpql/queries/proforma/proforma";
  import {mapActions, mapGetters} from "vuex"
  import {
    ACTION_UPSERT_INCOME_ROW,
    CUSTOMER_UNPAID_PROFORMAS,
    INSERTED_INCOME,
  } from "../../../store/types/income";

  export default {
    data(){
      return {
        name: "IncomeAssignmentForm",
        proforma: {
          id: '',
          number: ''
        },
        incomeRow: null,
        customerId: null,
        loading: false,
        statusOk: false,
        incomeAssignmentFormDefault: {
          number: '',
          proformaId: '',
          income: {
            id: '',
            number: ''
          },
          amount: '',
          summary: ''
        },
        incomeAssignmentForm: {
          number: '',
          proformaId: '',
          income: {
            id: '',
            number: ''
          },
          amount: '',
          summary: ''
        },
      }
    },
    props: [
      "incomeAssignmentRowId",
      "refetchAssignments"
    ],
    methods: {
      ...mapActions({
        upsertIncomeRow: ACTION_UPSERT_INCOME_ROW
      }),
      setProforma(proforma){
        this.proforma = proforma
      },
      submitIncomeAssignment(){
        let incomeRowVariables = {
          incomeRowInput: {
            "owner": "",
            "income": this.income.id,
            "dateFa": this.incomeAssignmentForm.date,
            "summary": this.incomeAssignmentForm.summary,
            "proforma": this.incomeAssignmentForm.proformaId,
            "amount": this.incomeAssignmentForm.amount
          }
        }
        if (this.incomeRow){
          incomeRowVariables.incomeRowInput.id = this.incomeRow.id
        }
        this.upsertIncomeRow(incomeRowVariables)
      },
      cancelIncomeAssignment(item){
        console.log(item)
        this.refetchAssignments(this.income.id)
      },
    },
    computed: {
      ...mapGetters({
        income: INSERTED_INCOME,
        customerStatus: CUSTOMER_UNPAID_PROFORMAS
      })
    },
    components: {
      PersianDatePicker: VuePersianDatetimePicker
    },
    mixins: [
      baseFunctions
    ],
    apollo: {
      incomeRowById: {
        query: incomeRowById,
        skip(){
          return !this.incomeAssignmentRowId
        },
        variables(){
          return {
            "incomeRowId": this.incomeAssignmentRowId
          }
        },
        result({data}){
          let result = data.incomeRowById;
          this.statusOk = true;
          this.incomeRow = result;
          this.incomeAssignmentForm.amount = this.incomeRow.amount;
          this.proforma = this.incomeRow.proforma
        }
      },
      proformaIdByNumber: {
        query: proformaIdByNumber,
        debounce: 500,
        skip(){
          return !this.proforma.number
        },
        variables(){
          return {
            number: this.proforma.number
          }
        },
        result ({data}){
          if (data && typeof data.proformaIdByNumber !== "undefined"){
            let proforma = data.proformaIdByNumber.edges;
            if (proforma.length > 0){
              this.incomeAssignmentForm.proformaId = proforma[0].node.id;
              this.proforma.number = proforma[0].node.number;
              this.statusOk = true;
            }else {
              this.incomeAssignmentForm.proformaId = "";
              this.statusOk = false;
            }
          }else {
            this.statusOk = false
          }
        },
        error(){
          this.statusOk = false;
        },
      },
    }
  }
</script>

<style scoped>

</style>
