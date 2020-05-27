<template>
  <div>
    <v-card>
      <v-card-text>
        <v-form>
          <v-autocomplete
            v-model="incomeForm.customerId"
            :items="customers"
            item-text="name"
            item-value="id"
            label="مشتری">
          </v-autocomplete>
          <v-text-field v-model="incomeForm.number" label="شماره"></v-text-field>
          <v-text-field v-model="incomeForm.amount" label="مبلغ"></v-text-field>
          <v-radio-group v-if="true" v-model="incomeForm.typeId">
            <v-radio v-for="type in types" :key="type.id" :label="type.title" :value="type.id"></v-radio>
          </v-radio-group>
          <PersianDatePicker
            v-model="incomeForm.date"
            format="jYYYY-jMM-jDD"
            display-format="dddd jDD jMMMM jYYYY"
            label="دریافت"
            :auto-submit="true"/>
          <PersianDatePicker
            v-if="showDueDatePicker"
            v-model="incomeForm.dueDate"
            format="jYYYY-jMM-jDD"
            display-format="dddd jDD jMMMM jYYYY"
            label="سررسید"
            :auto-submit="true"/>
          <v-textarea v-model="incomeForm.summary" label="توضیحات">
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
  import {baseFunctions} from "../../mixins/graphql/baseFunctions";
  import {allPaymentTypes} from "../../grahpql/queries/income/income";
  import {createIncome} from "../../grahpql/queries/income/mutation/mutation";
  import {allCustomers} from "../../grahpql/queries/customer/customer";

  export default {
    data() {
      return {
        name: "IncomeForm",
        incomeForm: {
          customerId: '',
          number: '',
          amount: '',
          typeId: '',
          date: '',
          dueDate: '',
          summary: '',
        },
        types: [],
        customers: [],
      }
    },
    methods: {
      showDueDatePicker(){
        let temp = this.types.filter(e => {
          console.log(e)
          return e.id === this.incomeForm.typeId
        });
        console.log(temp)
        let index = this.types.indexOf(temp[0])
        console.log(index !== 0)
        return index !== 0
      },
      submitIncome() {
        console.log('method.');
        this.$apollo.mutate({
          mutation: createIncome,
          variables: {
            "owner_id": "",
            "customer_id": this.incomeForm.customerId,
            "type_id": this.incomeForm.typeId,
            "amount": this.incomeForm.amount,
            "number": this.incomeForm.number,
            "date_fa": this.incomeForm.date,
            "due_date": this.incomeForm.dueDate,
            "summary": this.incomeForm.summary,
          }
        }).then( response => {
            console.log('created income: ', response.data)
            this.$emit('incomeCreated', response.data.createIncome.income)
          },error => {
            console.log(error)
          }
        )
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
    mixins: [
      baseFunctions
    ],
    // watch: {
    //   allCustomers: function () {
    //     this.customers = this.noNode(this.allCustomers)
    //   },
    //   allPaymentTypes: function () {
    //     this.types = this.noNode(this.allPaymentTypes);
    //   }
    // },
    components: {
      PersianDatePicker: VuePersianDatetimePicker
    },
    // updated() {
    //   console.log('income form updated.')
    //   this.incomeForm = this.income;
    // },
    // computed: {
    //   income(){
    //     if (typeof  this.incomeWithRows !== "undefined"){
    //       return this.incomeWithRows;
    //     }else {
    //       return []
    //     }
    //   }
    // },
    apollo: {
      // incomeWithRows: {
      //   query: incomeWithRows,
      //   skip(){
      //     return !this.incomeId
      //   },
      //   variables(){
      //     return {
      //       income_id: this.incomeId
      //     }
      //   }
      // },
      allCustomers: {
        query: allCustomers,
        result({data}){
          console.log(data)
          this.customers = this.noNode(data.allCustomers)
        }
      },
      allPaymentTypes: {
        query: allPaymentTypes,
        result({data}){
          console.log(data)
          this.types = this.noNode(data.allPaymentTypes);
        }
      },
    }
  }
</script>

<style scoped>

</style>
