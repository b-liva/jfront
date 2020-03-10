<template>
  <div>
    <v-snackbar
      v-model="snackbar"
      timeout="3000"
      top
      color="success">
      سفارش با موفقیت ثبت شد.
    </v-snackbar>
    <v-data-table
      :headers="headers"
      :items="orders"
      :expanded="expanded"
      class="elevation-1"
      show-expand
      single-expand
      @item-expanded="orderClicked"
    >
      <template v-slot:top>
        <v-toolbar>
          <v-toolbar-title>سفارش</v-toolbar-title>
          <v-divider
            vertical
            inset
            class="mx-4"></v-divider>
          <v-spacer></v-spacer>
          <v-dialog v-model="orderDialog" max-width="800px">
            <template v-slot:activator="{ on }">
              <v-btn color="primary" dark v-on="on">سفارش جدید</v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span>ثبت سفارش</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-layout row wrap>
                    <v-flex xs12 md8>
                      <v-layout row wrap>
                        <v-flex xs12 md4>
                          <v-text-field
                            label="مشتری"
                            v-model="order_form.customer.name">
                          </v-text-field>
                        </v-flex>
                        <v-flex xs6 md4>
                          <v-text-field
                            label="شماره"
                            hint="شماره چارگون درخواست"
                            v-model="order_form.number"
                          ></v-text-field>
                        </v-flex>
                        <v-flex xs12 md6>
                          <PersianDatePicker
                            v-model="order_form.date"
                            format="jYYYY-jMM-jDD"
                            :auto-submit="true"/>
                        </v-flex>
                      </v-layout>
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
      <template v-slot:item.customer="{item}">
        <router-link :to="{name: 'Customer', params:{id: item.customer.id, name: item.customer.name}}">
          {{item.customer.name}}
        </router-link>
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
          <span>افزودن ردیف به درخواست</span>
        </v-tooltip>
      </template>
      <template v-slot:expanded-item="{headers}">
        <td :colspan="headers.length">
          <table class="expanded-table">
            <thead>
            <th v-for="head in specHeaders" :key="head.value">{{head.text}}</th>
            <th></th>
            </thead>
            <tbody>
            <tr v-for="row in relatedSpecRows" :key="row">
              <td>{{spec[row].kw}}</td>
              <td>{{spec[row].rpm}}</td>
              <td>{{spec[row].voltage}}</td>
              <td>
                <v-icon @click="editSpec(spec[row])" small class="mr-2">mdi-pencil</v-icon>
                <v-icon @click="deleteSpec(spec[row])" small class="mr-2">mdi-delete</v-icon>
              </td>
            </tr>
            </tbody>
          </table>
        </td>
      </template>
    </v-data-table>
    <v-dialog v-model="assignDialog" width="800px">
      <v-card>
        <v-card-title>افزودن ردیف</v-card-title>
        <v-card-text>
          <v-container>
            <v-layout row wrap justify-space-around>
              <v-flex xs5 md3>
                <v-text-field
                  v-model="assignForm.qty"
                  label="تعداد">

                </v-text-field>
              </v-flex>
              <v-flex xs5 md3>
                <v-text-field label="کیلووات" v-model="assignForm.kw"></v-text-field>
              </v-flex>
              <v-flex xs5 md3>
                <v-text-field label="سرعت" v-model="assignForm.rpm"></v-text-field>
              </v-flex>
              <v-flex xs5 md3>
                <v-text-field label="ولتاژ" v-model="assignForm.voltage"></v-text-field>
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

  export default {
    data() {
      return {
        name: "Order",
        editedIndex: -1,
        defaultItems: {
          owner: '',
          customer: {
            id: '',
            name: '',
          },
          number: '',
          date: '',
          summary: ''
        },
        order_form: {
          owner: '',
          customer: {
            id: '',
            name: '',
          },
          amount: '',
          date: '',
          summary: ''
        },
        selectedIncome: null,
        defaultAssign: {
          qty: '',
          kw: '',
          rpm: '',
          voltage: '',
          date: '',
          summary: ''
        },
        assignForm: {
          qty: '',
          kw: '',
          rpm: '',
          voltage: '',
          date: '',
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
        orderDialog: false,
        assignDialog: false,
        snackbar: false,
        // headers: ['مشتری', 'شماره', 'مبلغ', 'تاریخ', 'نوع'],
        headers: [
          {text: 'مشتری', value: 'customer'},
          {text: 'شماره', value: 'number'},
          {text: 'تایخ', value: 'date'},
          {text: 'اکشن', value: 'action'},
        ],
        specHeaders: [
          {value: 'kw', text: 'کیلووات'},
          {value: 'rpm', text: 'سرعت'},
          {value: 'voltage', text: 'ولتاژ'},
        ],
        orders: [
          {
            id: 1,
            customer: {id: 1, name: 'پارس تهران'},
            number: 981235,
            date: "1398-12-12",
          },
          {
            id: 2,
            customer: {id: 2, name: 'پتروشیمی مارون'},
            number: 983500,
            date: "1398-12-13",
          },
          {
            id: 3,
            customer: {id: 5, name: 'هوایار'},
            number: 982254,
            date: "1398-10-25",
          },
          {
            id: 4,
            customer: {id: 6, name: 'تهران بوستون'},
            number: 980204,
            date: "1398-11-15",
          },
        ],
        spec: [
          {id: 1, incomeId: 3, qty: 2, kw: 1250, rpm: 1000, voltage: 380, date: "1398-12-05", summary: 'some summary'},
          {id: 2, incomeId: 1, qty: 6, kw: 132, rpm: 3000, voltage: 380, date: "1398-12-01", summary: 'some summary'},
          {id: 3, incomeId: 2, qty: 9, kw: 160, rpm: 1500, voltage: 380, date: "1398-12-12", summary: 'some summary'},
          {id: 4, incomeId: 2, qty: 1, kw: 75, rpm: 1000, voltage: 690, date: "1398-12-10", summary: 'some summary'},
          {id: 5, incomeId: 1, qty: 2, kw: 4800, rpm: 1500, voltage: 3300, date: "1398-12-09", summary: 'some summary'},
        ],
        editedSpecIndex: -1,
        expanded: [],
        relatedSpecRows: [],
      }
    },
    methods: {
      clear() {
        this.order_form = Object.assign({}, this.defaultItems);
        this.editedIndex = -1;
      },
      cancel() {
        this.clear()
        this.orderDialog = false
      },
      submit() {
        if (this.editedIndex > -1) {
          Object.assign(this.orders[this.editedIndex], this.order_form)
        } else {
          this.orders.push(this.order_form);
        }
        this.close()
      },
      close() {
        this.snackbar = true;
        this.orderDialog = false;
        this.clear()
      },
      editItem(item) {
        console.log(item)
        this.editedIndex = this.orders.indexOf(item);
        this.order_form = Object.assign({}, item);
        this.orderDialog = true;
      },
      deleteItem(item) {
        const index = this.orders.indexOf(item);
        confirm('از حذف این ردیف اطمینان دارید؟') && this.orders.splice(index, 1)
      },
      assignToMe(item) {
        console.log(item.number, item.customer.name)
        this.assignDialog = true;
        this.toBeAssignedRowInfo.customer = item.customer;
        this.toBeAssignedRowInfo.number = item.number
      },
      submitAssignment() {
        console.log('submitting assignment')
        if (this.editedSpecIndex > -1) {
          Object.assign(this.spec[this.editedSpecIndex], this.assignForm)
        } else {
          this.spec.push(this.assignForm);
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
      orderClicked(value) {
        console.log(value.item.id, this.expanded)
        if (this.expanded.includes(value.item)) {
          this.expanded.pop(value.item)
        } else {
          this.expanded = []
          this.expanded.push(value.item)
          this.specByOrderId(value.item.id)
        }
      },
      specByOrderId(incomeId) {
        this.relatedSpecRows = this.spec
          .map((row, i) => row.incomeId === incomeId ? i : -1)
          .filter(index => index !== -1);
      },
      editSpec(rowItem) {
        console.log(rowItem);
        this.editedSpecIndex = this.spec.indexOf(rowItem)
        this.assignForm = Object.assign({}, rowItem)
        this.assignDialog = true;
      },
      deleteSpec(rowItem) {
        const index = this.spec.indexOf(rowItem);
        confirm('از حذف این ردیف اطمینان دارید؟') && this.spec.splice(index, 1)
        this.specByOrderId(rowItem.id)
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

</style>
