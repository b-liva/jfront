<template>
  <div>
    <v-snackbar
      v-model="snackbar"
      timeout="3000"
      top
      color="success">
      واریزی با موفقیت ثبت شد.
    </v-snackbar>
    <v-data-table
    :headers="headers"
    :items="incomes"
    class="elevation-1">
      <template v-slot:top>
        <v-toolbar>
          <v-toolbar-title>واریزی</v-toolbar-title>
          <v-divider
          vertical
          inset
          class="mx-4"></v-divider>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="800px">
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
                        <v-flex xs12 md4>
                          <v-text-field
                            label="مشتری"
                            v-model="income_form.customer">
                          </v-text-field>
                        </v-flex>
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
                            <v-radio v-for="type in types" :key="type.id" :label="type.title" :value="type.id"></v-radio>
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
                      <div v-if="income_form.customer"><span
                        class="preview-title">مشتری</span><span>{{income_form.customer}}</span></div>
                      <div v-if="income_form.number"><span
                        class="preview-title">شماره</span><span>{{income_form.number}}</span></div>
                      <div v-if="income_form.amount"><span
                        class="preview-title">مبلغ</span><span>{{income_form.amount}}</span></div>
                      <div v-if="income_form.type"><span class="preview-title">نوع واریز</span><span>{{incomeTypeTitleById(income_form.type)}}</span>
                      </div>
                      <div v-if="income_form.date"><span class="preview-title">تاریخ</span><span>{{income_form.date}}</span>
                      </div>
                      <div v-if="income_form.dueDate"><span class="preview-title">تاریخ وصل چک</span><span>{{income_form.dueDate}}</span>
                      </div>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-btn color="success" @click="submit">ثبت</v-btn>
                <v-btn color="error" @click="cancel()">انصراف</v-btn>
                <v-btn x-small class="warning" @click="clear()">clear</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.action="{ item }">
        <v-icon @click="editItem(item)" small class="mr-2">mdi-pencil</v-icon>
        <v-icon @click="deleteItem(item)" small class="mr-2">mdi-delete</v-icon>
      </template>
    </v-data-table>
  </div>
</template>

<script>
  import VuePersianDatetimePicker from 'vue-persian-datetime-picker'

  export default {
    data() {
      return {
        name: "Income",
        editedIndex: -1,
        defaultItems: {
          owner: '',
          customer: '',
          number: '',
          type: 1,
          amount: '',
          date: '',
          dueDate: '',
          summary: ''
        },
        income_form: {
          owner: '',
          customer: '',
          number: '',
          type: 1,
          amount: '',
          date: '',
          dueDate: '',
          summary: ''
        },
        types: [
          {id: 1, title: 'حواله'},
          {id: 2, title: 'اصل چک'},
          {id: 3, title: 'کپی چک'},
        ],
        dialog: false,
        snackbar: false,
        // headers: ['مشتری', 'شماره', 'مبلغ', 'تاریخ', 'نوع'],
        headers: [
          {text: 'مشتری', value:'customer'},
          {text: 'شماره', value:'number'},
          {text: 'مبلغ', value:'amount'},
          {text: 'تایخ', value:'date'},
          {text: 'نوع', value:'type_title'},
          {text: 'اکشن', value:'action'},
        ],
        incomes: [
          {customer: 'پارس تهران', number: 1235, amount: 3500000, date: "1398-12-12", type:1 ,type_title: 'حواله'},
          {customer: 'خاور توس', number: 569802, amount: 325900000, date: "1398-12-13", type:1 ,type_title: 'حواله'},
          {customer: 'پارس کمپرسور', number: 946254, amount: 565900000, date: "1398-10-25", dueDate: "1398-12-05", type:2 ,type_title: 'اصل چک'},
          {customer: 'هوایار', number: 486254, amount: 67800000, date: "1398-11-15", dueDate: "1398-10-01", type:2 ,type_title: 'اصل چک'},
        ]
      }
    },
    methods: {
      clear(){
        this.income_form = Object.assign({}, this.defaultItems);
        this.editedIndex = -1;
      },
      cancel() {
        this.clear()
        this.dialog = false
      },
      submit() {
        if (this.editedIndex > -1){
          Object.assign(this.incomes[this.editedIndex], this.income_form)
        }else {
          this.incomes.push(this.income_form);
        }
        this.close()
      },
      close(){
        this.snackbar = true;
        this.dialog = false;
        this.clear()
      },
      editItem(item){
        console.log(item)
        this.editedIndex = this.incomes.indexOf(item);
        this.income_form = Object.assign({}, item);
        this.dialog = true;
      },
      deleteItem(item){
        const index = this.incomes.indexOf(item);
        confirm('از حذف این ردیف اطمینان دارید؟') && this.incomes.splice(index, 1)
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
  }
</script>

<style scoped>
  .preview-title {
    font-weight: bold;
    margin-left: 5px;
  }
</style>
