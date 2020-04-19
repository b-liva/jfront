<template>
  <div>
    <v-card>
      <v-card-title>
        اختصاص واریزی به {{incomeAssignmentRowId}}
      </v-card-title>
      <v-card-text>
        <v-form>
          <v-text-field label="شماره" v-model="incomeAssignmentForm.number"></v-text-field>
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

  export default {
    data(){
      return {
        name: "IncomeAssignmentForm",
        incomeAssignmentForm: '',
      }
    },
    props: [
      "incomeAssignmentRowId"
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
    created() {
      this.incomeAssignmentForm = this.getRelatedIncomeAssignmentRow();
    },
    components: {
      PersianDatePicker: VuePersianDatetimePicker
    },
  }
</script>

<style scoped>

</style>
