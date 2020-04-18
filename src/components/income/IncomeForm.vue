<template>
  <div>
    <v-card>
      <v-card-title>اختصاص واریزی</v-card-title>
      <v-card-text>
        <v-container>
          <v-row row wrap justify-space-around>
            <v-col cols="5" md="3">
              <v-text-field
                required
                v-model="incomeForm.number"
                label="شماره پیش فاکتور">

              </v-text-field>
            </v-col>
            <v-col cols="5" md="3">
              <v-text-field label="مبلغ" v-model="incomeForm.amount"></v-text-field>
            </v-col>
            <v-col cols="12" md="3" class="py-md-6">
              <PersianDatePicker
                v-model="incomeForm.date"
                format="jYYYY-jMM-jDD"
                :auto-submit="true"/>
            </v-col>
          </v-row>
          <v-row>
            <v-col
              cols="12"
              md="8">
              <v-textarea label="توضیحات" v-model="incomeForm.summary" auto-grow></v-textarea>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-btn color="success" @click="submitIncome">ثبت</v-btn>
        <v-btn color="error" @click="cancelIncome">انصراف</v-btn>
        <v-icon @click="clear()">mdi-close-circle</v-icon>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
  export default {
    data(){
      return {
        name: "IncomeForm",
        incomeForm: ''
      }
    },
    methods: {
      submitIncome(){
        console.log('method.');
      },
      cancelIncome(){
        console.log('method.');
      },
      getRelatedIncome(){
        return  {
          id: this.incomeId,
          number: 95616,
          date: "1398-01-20",
          amount: 654200000,
          summary: "something goes here."
        };
      }
    },
    props: [
      'incomeId'
    ],
    created() {
      this.incomeForm = this.getRelatedIncome();
    }
  }
</script>

<style scoped>

</style>
