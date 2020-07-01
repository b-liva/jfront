<template>
  <div>
    <v-snackbar
      v-model="snackbar"
      :timeout=3000
      top
      color="success">
      واریزی با موفقیت ثبت شد.
    </v-snackbar>
    <v-data-table
      :headers="headers"
      :items="incomes"
      :expanded="expanded"
      class="elevation-1"
      show-expand
      single-expand
      @item-expanded="incomeClicked"
    >
      <template v-slot:top>
        <v-toolbar>
          <v-toolbar-title>واریزی</v-toolbar-title>
          <v-divider
            vertical
            inset
            class="mx-4"></v-divider>
          <v-spacer></v-spacer>
          <v-dialog v-model="incomeDialog" max-width="800px">
            <template v-slot:activator="{ on }">
              <v-btn color="primary" dark v-on="on">واریز جدید</v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span>ثبت واریزی</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-layout row wrap>
                    <v-flex xs12 md8>
                      <v-layout row wrap>
                        <v-flex xs6 md4>
                          <v-text-field
                            label="شماره"
                            hint="شماره رسید اسناد مشتری"
                            v-model="income_form.number"
                          ></v-text-field>
                        </v-flex>
                        <v-flex xs6 md4>
                          <v-text-field label="مبلغ" v-model="income_form.amount"></v-text-field>
                        </v-flex>
                        <v-flex xs12>
                          <v-radio-group
                            v-model="income_form.type" row>
                            <v-radio v-for="type in types" :key="type.id" :label="type.title"
                                     :value="type.id"></v-radio>
                          </v-radio-group>
                        </v-flex>
                        <v-flex xs12 md6>
                          <PersianDatePicker
                            v-model="income_form.date"
                            format="jYYYY-jMM-jDD"
                            :auto-submit="true"/>
                        </v-flex>
                        <v-flex xs12 md6>
                          <persian-date-picker
                            v-if="income_form.type===2 || income_form.type===3"
                            v-model="income_form.dueDate"
                            :auto-submit="true"
                            format="jYYYY-jMM-jDD"/>
                        </v-flex>
                      </v-layout>
                    </v-flex>
                    <v-flex xs12 md4>پیش نمایش
                      <div v-if="income_form.number"><span
                        class="preview-title">شماره</span><span>{{income_form.number}}</span></div>
                      <div v-if="income_form.amount"><span
                        class="preview-title">مبلغ</span><span>{{income_form.amount}}</span></div>
                      <div v-if="income_form.type"><span class="preview-title">نوع واریز</span><span>{{incomeTypeTitleById(income_form.type)}}</span>
                      </div>
                      <div v-if="income_form.date"><span
                        class="preview-title">تاریخ</span><span>{{income_form.date}}</span>
                      </div>
                      <div v-if="income_form.dueDate"><span class="preview-title">تاریخ وصل چک</span><span>{{income_form.dueDate}}</span>
                      </div>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-btn color="success" @click="submit">ثبت</v-btn>
                <v-btn color="error" @click="cancel">انصراف</v-btn>
                <v-icon @click="clear()">mdi-close-circle</v-icon>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.action="{ item }">
        <v-icon @click="editItem(item)" small class="mr-2">mdi-pencil</v-icon>
        <v-icon @click="deleteItem(item)" small class="mr-2">mdi-delete</v-icon>
        <v-tooltip top>
          <template v-slot:activator="{on}">
            <v-icon
              @click="assignToMe(item)"
              small
              class="mr-2"
            v-on="on">mdi-arrow-left-bold
            </v-icon>
          </template>
          <span>اختصاص واریزی به پیش فاکتور</span>
        </v-tooltip>
      </template>
      <template v-slot:expanded-item="{headers}">
        <td :colspan="headers.length">
          <table class="expanded-table">
            <thead>
            <th v-for="head in incomeRowsHeaders" :key="head.value">{{head.text}}</th>
            <th></th>
            </thead>
            <tbody>
            <tr v-for="row in relatedIncomeRows" :key="row">
              <td>{{incomeRows[row].amount}}</td>
              <td>{{incomeRows[row].proforma}}</td>
              <td>{{incomeRows[row].date}}</td>
              <td>
                <v-icon @click="editIncomeRow(incomeRows[row])" small class="mr-2">mdi-pencil</v-icon>
                <v-icon @click="deleteIncomerow(incomeRows[row])" small class="mr-2">mdi-delete</v-icon>
              </td>
            </tr>
            </tbody>
          </table>
        </td>
      </template>
    </v-data-table>
    <v-dialog v-model="assignDialog" width="800px">
      <v-card>
        <v-card-title>اختصاص واریزی</v-card-title>
        <v-card-text>
          <v-container>
            <v-layout row wrap justify-space-around>
              <v-flex xs5 md3>
                <v-text-field
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
  import VuePersianDatetimePicker from 'vue-persian-datetime-picker'
  import db from '@/firebase/init'

  export default {
    data() {
      return {
        name: "Income",
        editedIndex: -1,
        defaultItems: {
          number: '',
          amount: '',
          date: '',
          dueDate: '',
          summary: ''
        },
        income_form: {
          number: '',
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
          customer:{
            id: '',
            name: ''
          },
          number: ''
        },
        toBeAssignedRowInfo: {
          customer:{
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
          {text: 'اکشن', value: 'action'},
        ],
        incomeRowsHeaders: [
          {value: 'amount', text: 'مبلغ'},
          {value: 'proforma', text: 'پیش فاکتور'},
          {value: 'date', text: 'تاریخ'},
        ],
        editedIncomeRowIndex: -1,
        expanded: [],
        relatedIncomeRows: [],
        incomes: [],
      }
    },
    methods: {
      clear() {
        this.income_form = Object.assign({}, this.defaultItems);
        this.editedIndex = -1;
      },
      cancel() {
        this.clear()
        this.incomeDialog = false
      },
      submit() {
        if (this.editedIndex > -1) {
          Object.assign(this.incomes[this.editedIndex], this.income_form)
        } else {
          this.incomes.push(this.income_form);
        }
        this.close()
      },
      close() {
        this.snackbar = true;
        this.incomeDialog = false;
        this.clear()
      },
      editItem(item) {
        console.log(item)
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
        console.log('submitting assignment')
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
        console.log('cancelling assignment')
        this.assignDialog = false
      },
      incomeClicked(value) {
        console.log(value.item.id, this.expanded)
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
        console.log(rowItem);
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
            console.log(e.title)
            title = e.title;
          }
        })
        return title;
      }
    },
    computed: {},
    components: {
      PersianDatePicker: VuePersianDatetimePicker
    },
    created() {
      db.collection('income').get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          console.log(doc, doc.id)
          let income = doc.data()
          income.id = doc.id
          let cus = db.collection('customer').doc(income.customer.id)
          console.log('customer', cus)
          income.customer = income.customer.id
          this.incomes.push(income)
        })
      })
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
