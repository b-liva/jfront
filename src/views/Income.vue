<template>
  <div>
    <v-snackbar
      v-model="snackbar"
      :timeout=3000
      top
      color="success">
      واریزی با موفقیت ثبت شد.
    </v-snackbar>
    <income-summary/>
    <v-dialog v-model="assignDialog" width="800px">
      <v-card>
        <v-card-title>اختصاص واریزی</v-card-title>
        <v-card-text>
          <v-container>
            <v-layout row wrap justify-space-around>
              <v-flex xs5 md3>
                <v-text-field
                  required
                  v-model="assignForm.proforma"
                  label="شماره پیش فاکتور">

                </v-text-field>
              </v-flex>
              <v-flex xs5 md3>
                <v-text-field label="مبلغ" v-model="assignForm.amount"></v-text-field>
              </v-flex>
              <v-flex xs12 md3 class="py-md-6">
                <PersianDatePicker
                  v-model="assignForm.date"
                  format="jYYYY-jMM-jDD"
                  :auto-submit="true"/>
              </v-flex>
            </v-layout>
            <v-layout row wrap>
              <v-flex
                xs12
                md8>
                <v-textarea label="توضیحات" v-model="assignForm.summary" auto-grow></v-textarea>
              </v-flex>
              <v-flex xs12>
                <p>
                  شما در حال اختصاص مبلغ <span class="red--text">{{assignForm.amount}}</span>
                  از واریزی شماره <span class="red--text">{{toBeAssignedRowInfo.number}}</span>
                  به پیش فاکتور شماره <span class="red--text">{{assignForm.proforma}}</span>
                  مربوط به شرکت <span class="red--text">{{toBeAssignedRowInfo.customer.name}}</span> هستید.
                </p>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-btn color="success" @click="submitAssignment">ثبت</v-btn>
          <v-btn color="error" @click="cancelAssignment">انصراف</v-btn>
          <v-icon @click="clear()">mdi-close-circle</v-icon>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  import {validationMixin} from 'vuelidate'
  import {required} from 'vuelidate/lib/validators'
  import VuePersianDatetimePicker from 'vue-persian-datetime-picker'
  import IncomeSummary from "../components/income/IncomeSummary";

  export default {
    mixins: [validationMixin],
    validations: {
      select: { required },
      income_form: {
        number: {required},
        amount: {required},
        customer: {required},
        date: {required},
      }
    },
    data() {
      return {
        name: "Income",
        select: null,
        listOfItems: [1,2,3,4,45],
        isLoading: false,
        valid: true,
        numberTest: '',
        requiredRules: [
          v => !!v || 'فیلد اجباری',
        ],
        editedIndex: -1,
        defaultItems: {
          owner: '',
          customer: {
            id: '',
            name: '',
          },
          number: '',
          type: 1,
          amount: '',
          date: '',
          dueDate: '',
          summary: ''
        },
        income_form: {
          owner: '',
          customer: null,
          number: '',
          type: 1,
          amount: '',
          date: '',
          dueDate: '',
          summary: ''
        },
        selectedIncome: null,
        defaultAssign: {
          incomeId: '',
          date: '',
          amount: '',
          proforma: '',
          summary: ''
        },
        assignForm: {
          incomeId: '',
          date: '',
          amount: '',
          proforma: '',
          summary: ''
        },
        toBeAssignedRowInfoDefaults: {
          customer: {
            id: '',
            name: ''
          },
          number: ''
        },
        toBeAssignedRowInfo: {
          customer: {
            id: '',
            name: ''
          },
          number: ''
        },
        types: [
          {id: 1, title: 'حواله'},
          {id: 2, title: 'اصل چک'},
          {id: 3, title: 'کپی چک'},
        ],
        incomeDialog: false,
        assignDialog: false,
        snackbar: false,
        // headers: ['مشتری', 'شماره', 'مبلغ', 'تاریخ', 'نوع'],
        headers: [
          {text: 'مشتری', value: 'customer'},
          {text: 'شماره', value: 'number'},
          {text: 'مبلغ', value: 'amount'},
          {text: 'تایخ', value: 'date'},
          {text: 'نوع', value: 'type_title'},
          {text: '', value: 'action'},
        ],
        incomeRowsHeaders: [
          {value: 'amount', text: 'مبلغ'},
          {value: 'proforma', text: 'پیش فاکتور'},
          {value: 'date', text: 'تاریخ'},
        ],
        incomes: [
          {
            id: 1,
            customer: {id: 1, name: 'پارس تهران'},
            number: 1235,
            amount: 3500000,
            date: "1398-12-12",
            type: 1,
            type_title: 'حواله'
          },
          {
            id: 2,
            customer: {id: 2, name: 'پتروشیمی مارون'},
            number: 569802,
            amount: 325900000,
            date: "1398-12-13",
            type: 1,
            type_title: 'حواله'
          },
          {
            id: 3,
            customer: {id: 5, name: 'هوایار'},
            number: 946254,
            amount: 565900000,
            date: "1398-10-25",
            dueDate: "1398-12-05",
            type: 2,
            type_title: 'اصل چک'
          },
          {
            id: 4,
            customer: {id: 6, name: 'تهران بوستون'},
            number: 486254,
            amount: 67800000,
            date: "1398-11-15",
            dueDate: "1398-10-01",
            type: 2,
            type_title: 'اصل چک'
          },
        ],
        incomeRows: [
          {id: 1, incomeId: 3, amount: 1250000, date: "1398-12-05", proforma: 9820580, summary: 'some summary'},
          {id: 2, incomeId: 1, amount: 2250000, date: "1398-12-01", proforma: 9835280, summary: 'some summary'},
          {id: 3, incomeId: 2, amount: 5250000, date: "1398-12-12", proforma: 9721240, summary: 'some summary'},
          {id: 4, incomeId: 2, amount: 1350000, date: "1398-12-10", proforma: 9835130, summary: 'some summary'},
          {id: 5, incomeId: 1, amount: 1500000, date: "1398-12-09", proforma: 9829870, summary: 'some summary'},
        ],
        editedIncomeRowIndex: -1,
        expanded: [],
        relatedIncomeRows: [],
        customers: [
          {id: 1, name: 'پارس تهران...'},
          {id: 2, name: 'سازش'},
          {id: 3, name: 'مارون'},
          {id: 4, name: 'خاور توس'},
          {id: 5, name: 'هوایار'},
        ],
      }
    },
    methods: {
      validate() {
        this.$refs.form.validate();
      },
      reset() {
        this.$refs.form.reset();
      },
      resetValidation() {
        this.$refs.form.resetValidation();
      },
      clear() {
        this.income_form = Object.assign({}, this.defaultItems);
        this.resetValidation();
        this.editedIndex = -1;
      },
      cancel() {
        this.clear()
        this.incomeDialog = false
      },
      submit() {
        // this.validate(); // for vue only??
        this.$v.$touch()
        if (this.$v.$invalid){
          console.log('error')
        }else {
          alert('form is: ' + this.valid)
          if (this.editedIndex > -1) {
            Object.assign(this.incomes[this.editedIndex], this.income_form)
          } else {
            this.incomes.push(this.income_form);
          }
          this.close()
        }

      },
      close() {
        this.snackbar = true;
        this.incomeDialog = false;
        this.clear()
      },
      editItem(item) {
        this.editedIndex = this.incomes.indexOf(item);
        this.income_form = Object.assign({}, item);
        this.incomeDialog = true;
      },
      deleteItem(item) {
        const index = this.incomes.indexOf(item);
        confirm('از حذف این ردیف اطمینان دارید؟') && this.incomes.splice(index, 1)
      },
      assignToMe(item) {
        this.assignDialog = true;
        this.toBeAssignedRowInfo.customer = item.customer;
        this.toBeAssignedRowInfo.number = item.number
      },
      submitAssignment() {
        if (this.editedIncomeRowIndex > -1) {
          Object.assign(this.incomeRows[this.editedIncomeRowIndex], this.assignForm)
        } else {
          this.incomeRows.push(this.assignForm);
          this.assignForm.incomeId = 1
        }
        //Todo: should be implemented later.
        // this.close()
        this.assignDialog = false
      },
      cancelAssignment() {
        this.assignDialog = false
      },
      incomeClicked(value) {
        if (this.expanded.includes(value.item)) {
          this.expanded.pop(value.item)
        } else {
          this.expanded = []
          this.expanded.push(value.item)
          this.incomeRowByIncomeId(value.item.id)
        }
      },
      incomeRowByIncomeId(incomeId) {
        this.relatedIncomeRows = this.incomeRows
          .map((row, i) => row.incomeId === incomeId ? i : -1)
          .filter(index => index !== -1);
      },
      editIncomeRow(rowItem) {
        this.editedIncomeRowIndex = this.incomeRows.indexOf(rowItem)
        this.assignForm = Object.assign({}, rowItem)
        this.assignDialog = true;
      },
      deleteIncomerow(rowItem) {
        const index = this.incomeRows.indexOf(rowItem);
        confirm('از حذف این ردیف اطمینان دارید؟') && this.incomeRows.splice(index, 1)
        this.incomeRowByIncomeId(rowItem.id)
      },
      incomeTypeTitleById(id) {
        let title = null;
        this.types.forEach(function (e) {
          if (e.id === id) {
            title = e.title;
          }
        })
        return title;
      }
    },
    computed: {
      numberErrors() {
        const errors = []
        if (!this.$v.income_form.number.$dirty) return errors
        !this.$v.income_form.number.maxLength && errors.push('شماره واریزی اجباری است')
        !this.$v.income_form.number.required && errors.push('Name is required.')
        return errors
      },
      amountErrors(){
        const errors = []
        if (!this.$v.income_form.amount.$dirty) return errors
        !this.$v.income_form.amount.required && errors.push('مبلغ اجباری است')
        return errors
      },
      customerErrors(){
        const errors = []
        if (!this.$v.income_form.customer.$dirty) return errors
        !this.$v.income_form.customer && errors.push('مشتری اجباری است.')
        return errors
      },
      dateErrors(){
        let error = null
        if (!this.income_form.date){
          error = 'تاریخ اجباری است.'
        }
        return error
      },
      selectErrors () {
        const errors = []
        if (!this.$v.select.$dirty) return errors
        !this.$v.select.required && errors.push('Item is required')
        return errors
      },
    },
    components: {
      PersianDatePicker: VuePersianDatetimePicker,
      IncomeSummary
    },
    created() {
      let today = new Date()
      let dd = String(today.getDate()).padStart(2, '0');
      let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
      let yyyy = today.getFullYear();
      this.income_form.date = yyyy + '-' + mm + '-' + dd
    }
  }
</script>

<style scoped>
  .preview-title {
    font-weight: bold;
    margin-left: 5px;
  }

  .expanded-table {
    font-size: 12px;
    font-weight: bold;
  }
</style>
