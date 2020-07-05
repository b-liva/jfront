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
  import {allPaymentTypes, incomeById} from "../../grahpql/queries/income/income";
  import {customersMinimal} from "../../grahpql/queries/customer/customer";
  import {mapGetters, mapActions} from 'vuex'
  import {ACTION_UPSERT_INCOME, INCOME_ID, MUTATE_INSERTED_INCOME} from "../../store/types/income";

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
      ...mapActions({
        upsertIncome: ACTION_UPSERT_INCOME
      }),
      showDueDatePicker(){
        let temp = this.types.filter(e => {
          return e.id === this.incomeForm.typeId
        });
        let index = this.types.indexOf(temp[0])
        return index !== 0
      },
      submitIncome() {
        let incomeVariables = {
          income_input: {
              "owner": "",
              "customer": this.incomeForm.customerId,
              "type": this.incomeForm.typeId,
              "amount": this.incomeForm.amount,
              "number": this.incomeForm.number,
              "dateFa": this.incomeForm.date,
              "dueDate": this.incomeForm.dueDate,
              "summary": this.incomeForm.summary,
            }}
        if (this.incomeId){
          incomeVariables.income_input.id = this.incomeId
        }
        this.upsertIncome(incomeVariables)
      },
      cancelIncome() {
        console.log('method.');
      },
    },
    computed: {
      ...mapGetters({
        incomeId: INCOME_ID
      })
    },
    mixins: [
      baseFunctions
    ],
    components: {
      PersianDatePicker: VuePersianDatetimePicker
    },
    apollo: {
      incomeById: {
        query: incomeById,
        skip(){
          return !this.incomeId
        },
        variables(){
          return{
            income_id: this.incomeId
          }
        },
        result({data}){
          let results = data.incomeById;
          this.incomeForm.number = results.number;
          this.incomeForm.amount = results.amount;
          this.incomeForm.summary = results.summary;
          this.incomeForm.customerId = results.customer.id;
          this.incomeForm.typeId = results.type.id;
          this.$store.commit(MUTATE_INSERTED_INCOME, results)
        }
      },
      allCustomers: {
        query: customersMinimal,
        result({data}){
          this.customers = this.noNode(data.allCustomers);
        }
      },
      allPaymentTypes: {
        query: allPaymentTypes,
        result({data}){
          this.types = this.noNode(data.allPaymentTypes);
        }
      },
    }
  }
</script>

<style scoped>

</style>
