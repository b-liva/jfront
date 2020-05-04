<template>
  <div>
    <v-card>
      <v-card-title>
        اختصاص واریزی به {{incomeAssignmentRowId}}
      </v-card-title>
      <v-card-text>
        {{incomeAssignmentForm}}
        <v-form>
          <v-text-field label="شماره" v-model="incomeAssignmentForm.income.number"></v-text-field>
          <v-text-field label="مبلغ" v-model="incomeAssignmentForm.amount"></v-text-field>
          <PersianDatePicker
            v-model="incomeAssignmentForm.date"
            format="jYYYY-jMM-jDD"
            display-format="dddd jDD jMMMM jYYYY"
            label="دریافت"
            :auto-submit="true"/>
          <v-textarea v-model="incomeAssignmentForm.summary" label="توضیحات"></v-textarea>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn color="success" @click="submitIncomeAssignment">ثبت</v-btn>
        <v-btn color="error" @click="cancelIncomeAssignment">انصراف</v-btn>
        <v-icon @click="clear()">mdi-close-circle</v-icon>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
  import VuePersianDatetimePicker from 'vue-persian-datetime-picker';
  import {baseFunctions} from "../../../mixins/graphql/baseFunctions";
  import {incomeRowById} from "../../../grahpql/queries/income/incomeAssignment";

  export default {
    data(){
      return {
        name: "IncomeAssignmentForm",
        incomeAssignmentFormDefault: {
          income: {
            id: '',
            number: ''
          },
          amount: '',
          summary: ''
        },
        incomeAssignmentForm: {
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
        console.log(this.incomeRowById)
        this.incomeAssignmentForm = this.incomeRowById;
      }
    },
    apollo: {
      incomeRowById: {
        query: incomeRowById,
        variables(){
          return {
            income_row_id: this.incomeAssignmentRowId
          }
        }
      }
    }
  }
</script>

<style scoped>

</style>
