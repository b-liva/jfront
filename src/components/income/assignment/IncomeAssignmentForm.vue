<template>
  <div>
    <v-card>
      <v-card-title>
        اختصاص واریزی از {{incomeId}} به پیش فاکتور شماره: <span>{{proforma.number}}</span>
      </v-card-title>
      <v-card-text>
        <v-form>
          <div v-if="loading">LOADING....</div>
          <v-text-field label="شماره پیش فاکتور" v-model="proforma.number"></v-text-field>
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
  import {assingIncomeRowMutation} from "../../../grahpql/queries/income/row/mutation/mutation";
  import {proformaIdByNumber} from "../../../grahpql/queries/proforma/proforma";

  export default {
    data(){
      return {
        name: "IncomeAssignmentForm",
        proforma: {
          id: '',
          number: ''
        },
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
      "incomeId"
    ],
    methods: {
      getRelatedIncomeAssignmentRow(){
        return {
          id: this.incomeAssignmentRowId,
          amount: 136510000,
          date: "1399-01-02",
          number: 13511,
          summary: "توضیحات مربوط به این هزینه"
        }
      },
      submitIncomeAssignment(item){
        console.log('method', item);
        this.$apollo.mutate({
          mutation: assingIncomeRowMutation,
          variables: {
            income_id: this.incomeId,
            date_fa: this.incomeAssignmentForm.date,
            summary: this.incomeAssignmentForm.summary,
            owner_id: "",
            proforma_id: this.incomeAssignmentForm.proformaId,
            amount: this.incomeAssignmentForm.amount
          }
        })
      },
      cancelIncomeAssignment(item){
        console.log('method', item);
      },
    },
    components: {
      PersianDatePicker: VuePersianDatetimePicker
    },
    mixins: [
      baseFunctions
    ],
    watch: {
      incomeRowById: function () {
        console.log(this.incomeRowById);
        this.incomeAssignmentForm = this.incomeRowById;
      },
      // proformaIdByNumber: function () {
      //   if (typeof this.proformaIdByNumber !== "undefined" && this.proformaIdByNumber !== null && this.proformaIdByNumber.edges.length > 0){
      //     console.log(this.proformaIdByNumber);
      //     this.incomeAssignmentForm.proformaId = this.noNode(this.proformaIdByNumber)[0].id
      //     this.proforma.number = this.noNode(this.proformaIdByNumber)[0].id
      //   }
      // },
    },
    apollo: {
      incomeRowById: {
        query: incomeRowById,
        variables(){
          return {
            income_row_id: this.incomeAssignmentRowId
          }
        }
      },
      proformaIdByNumber: {
        query: proformaIdByNumber,
        debounce: 500,
        variables(){
          return {
            number: this.proforma.number
          }
        },
        update(data){
          console.log('update: ', data)
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
        watchLoading (isLoading){
          this.loading = isLoading;
        }
      }
    }
  }
</script>

<style scoped>

</style>
