<template>
  <div>
    <v-card>
      <v-card-title>اختصاص واریزی</v-card-title>
      <v-card-text>
        <v-form>
          <v-autocomplete
            v-model="incomeForm.customer"
            :items="customers"
            item-text="name"
            label="مشتری">
          </v-autocomplete>
          <v-text-field v-model="incomeForm.number" label="شماره"></v-text-field>
          <v-text-field v-model="incomeForm.amount" label="مبلغ"></v-text-field>
          <v-radio-group v-model="incomeForm.type">
            <v-radio v-for="type in types" :key="type.id" :label="type.title" :value="type.id">
            </v-radio>
          </v-radio-group>
          <PersianDatePicker
            v-model="incomeForm.date"
            format="jYYYY-jMM-jDD"
            display-format="dddd jDD jMMMM jYYYY"
            label="دریافت"
            :auto-submit="true"/>
          <PersianDatePicker
            v-if="incomeForm.type === 2"
            v-model="incomeForm.dueDate"
            format="jYYYY-jMM-jDD"
            display-format="dddd jDD jMMMM jYYYY"
            label="سررسید"
            :auto-submit="true"/>
          <v-textarea v-model="incomeForm.summary">
          </v-textarea>
        </v-form>
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
  import VuePersianDatetimePicker from 'vue-persian-datetime-picker';

  export default {
    data() {
      return {
        name: "IncomeForm",
        incomeForm: '',
        types: [
          {id: 1, title: "حواله"},
          {id: 2, title: "چک"},
        ],
        customers: [
          {id: 1, name: "هوایار"},
          {id: 2, name: "پتروشیمی مارون"},
          {id: 3, name: "تهران بوستون"},
          {id: 4, name: "سازش"},
        ],
      }
    },
    methods: {
      submitIncome() {
        console.log('method.');
      },
      cancelIncome() {
        console.log('method.');
      },
      getRelatedIncome() {
        return {
          id: this.incomeId,
          customer: {
            id: 2,
            name: "پتروشیمی مارون"
          },
          number: 95616,
          date: "1398-01-20",
          dueDate: "1398-04-20",
          amount: 654200000,
          summary: "توضیحات در مورد این واریزی",
          type: 2
        };
      }
    },
    props: [
      'incomeId'
    ],
    beforeCreate() {
      console.log('before create: ', this.incomeForm, this.types)
    },
    created() {
      this.incomeForm = this.getRelatedIncome();
    },
    components: {
      PersianDatePicker: VuePersianDatetimePicker
    },
  }
</script>

<style scoped>

</style>
