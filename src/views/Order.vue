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
        <v-tooltip top>
          <template v-slot:activator="{on}">
            <v-icon @click="listRelatedProformas(item)" v-on="on" small class="mr-2">mdi-format-list-bulleted</v-icon>
          </template>
          <span>مشاهده پیش فاکتور های مرتبط</span>
        </v-tooltip>
        <v-tooltip top>
          <template v-slot:activator="{on}">
            <v-icon @click="addProforma(item)" v-on="on" small class="mr-2">mdi-playlist-plus</v-icon>
          </template>
          <span>افزودن پیش فاکتور جدید به درخواست</span>
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
            <tr v-for="row in relatedSpecRows" :key="row.id">
              <td>{{spec[row].qty}}</td>
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
    <v-dialog v-model="assignDialog" fullscreen hide-overlay>
      <v-card>
        <v-card-title>افزودن ردیف{{toBeAssignedRowInfo.id}}</v-card-title>
        <v-card-text>
          <v-container>
            <v-layout row wrap>
              <v-flex class="purple lighten-4" xs4 md3>
                <v-layout row wrap justify-space-around>
                  <v-flex xs5 md6>
                    <v-text-field
                      class="box"
                      type="number"
                      v-model="assignForm.qty"
                      label="تعداد">
                    </v-text-field>
                    <v-text-field class="box" label="کیلووات" v-model="assignForm.kw"></v-text-field>
                  </v-flex>
                  <v-flex xs5 md6>
                    <v-text-field class="box" label="سرعت" v-model="assignForm.rpm"></v-text-field>
                    <v-text-field class="box" label="ولتاژ" v-model="assignForm.voltage"></v-text-field>
                  </v-flex>
                  <v-layout>
                    <v-flex xs5 md3>
                      <v-radio-group dense class="d-flex col-md-6 mb-6" v-model="assignForm.IPID">
                        <v-radio
                          v-for="n in IPList"
                          :key="n.id"
                          :label="n.title"
                          :value="n.id"
                        ></v-radio>
                      </v-radio-group>
                    </v-flex>
                    <v-flex xs5 md3>
                      <v-radio-group dense class="d-flex col-md-6 mb-6" v-model="assignForm.ICID">
                        <v-radio
                          v-for="n in ICList"
                          :key="n.id"
                          :label="n.title"
                          :value="n.id"
                        ></v-radio>
                      </v-radio-group>
                    </v-flex>
                    <v-flex xs5 md3>
                      <v-radio-group dense class="d-flex col-md-6 mb-6" v-model="assignForm.IMID">
                        <v-radio
                          v-for="n in IMList"
                          :key="n.id"
                          :label="n.title"
                          :value="n.id"
                        ></v-radio>
                      </v-radio-group>
                    </v-flex>
                  </v-layout>
                  <v-flex xs12 md6 class="">
                    <PersianDatePicker
                      v-model="assignForm.date"
                      format="jYYYY-jMM-jDD"
                      :auto-submit="true"/>
                  </v-flex>
                  <v-flex
                    xs12
                    md12>
                    <v-textarea label="توضیحات" v-model="assignForm.summary" auto-grow></v-textarea>
                  </v-flex>
                </v-layout>
                <v-layout row wrap>
                  <v-flex xs12>
                    <v-icon
                      @click="addSpecToList"
                      small
                      class="mr-2"
                      v-on="on">mdi-arrow-left-bold
                    </v-icon>
                  </v-flex>
                </v-layout>
              </v-flex>
              <v-flex xs8 md9 class="pink lighten-4"
              >
                <ul>
                  <li v-for="row in relatedSpecRows" :key="row.id">
                    <span>{{spec[row].qty}} دستگاه </span>
                    <span>{{spec[row].kw}} کیلووات</span>
                    <span>{{spec[row].rpm}} دور </span>
                    <span>{{spec[row].voltage}} ولت</span>
                    <v-icon @click="editSpec(spec[row])" small class="mr-2">mdi-pencil</v-icon>
                    <v-icon @click="deleteSpec(spec[row])" small class="mr-2">mdi-delete</v-icon>
                  </li>
                </ul>
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
    <v-dialog v-model="proformaListDialog">
      <proforma-list :proformas="relatedProformas"/>
    </v-dialog>
    <v-dialog v-model="proformaFormDialog">
      <proforma-form :order="proformaOrder" :specs="orderSpecs"/>
    </v-dialog>
  </div>
</template>

<script>
  import VuePersianDatetimePicker from 'vue-persian-datetime-picker'
  import ProformaList from "./proforma/ProformaList";
  import ProformaForm from "./proforma/ProformaForm";

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
          orderId: '',
          qty: '',
          kw: '',
          rpm: '',
          voltage: '',
          date: '',
          summary: '',
          IPID: 1,
          ICID: 1,
          IMID: 1,
        },
        assignForm: {
          orderId: '',
          qty: '',
          kw: '',
          rpm: '',
          voltage: '',
          date: '',
          summary: '',
          IPID: 1,
          ICID: 1,
          IMID: 1,
        },
        toBeAssignedRowInfoDefaults: {
          customer: {
            id: '',
            name: ''
          },
          number: '',
          id: '',
        },
        toBeAssignedRowInfo: {
          customer: {
            id: '',
            name: ''
          },
          number: '',
          id: '',
        },
        orderDialog: false,
        proformaFormDialog: false,
        proformaListDialog: false,
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
          {value: 'qty', text: 'دستگاه'},
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
          {
            id: 1,
            orderId: 3,
            qty: 2,
            kw: 1250,
            rpm: 1000,
            voltage: 380,
            IPID: 1,
            ICID: 1,
            IMID: 1,
            date: "1398-12-05",
            summary: 'some summary'
          },
          {
            id: 2,
            orderId: 1,
            qty: 6,
            kw: 132,
            rpm: 3000,
            voltage: 380,
            IPID: 1,
            ICID: 1,
            IMID: 1,
            date: "1398-12-01",
            summary: 'some summary'
          },
          {
            id: 3,
            orderId: 2,
            qty: 9,
            kw: 160,
            rpm: 1500,
            voltage: 380,
            IPID: 1,
            ICID: 1,
            IMID: 1,
            date: "1398-12-12",
            summary: 'some summary'
          },
          {
            id: 4,
            orderId: 2,
            qty: 1,
            kw: 75,
            rpm: 1000,
            voltage: 690,
            IPID: 1,
            ICID: 1,
            IMID: 1,
            date: "1398-12-10",
            summary: 'some summary'
          },
          {
            id: 5,
            orderId: 4,
            qty: 2,
            kw: 4800,
            rpm: 1500,
            voltage: 3300,
            IPID: 1,
            ICID: 1,
            IMID: 1,
            date: "1398-12-09",
            summary: 'some summary'
          },
        ],
        ICList: [
          {id: 1, title: 'IC411'},
          {id: 2, title: 'IC511'},
          {id: 3, title: 'IC611'},
          {id: 4, title: 'IC666'},
        ],
        IPList: [
          {id: 1, title: 'IP55'},
          {id: 2, title: 'IP66'},
        ],
        IMList: [
          {id: 1, title: 'IMB3'},
          {id: 2, title: 'IMB35'},
        ],
        editedSpecIndex: -1,
        expanded: [],
        relatedSpecRows: [],
        proformas: [
          {
            id: 1, number: 9820365, orderNumber: 980204, customer: {id: 5, name: 'تهران بوستون'}, date: "1398-12-26",
            pspecs: [{qty: 2, kw: 132, rpm: 1500, voltage: 380, price: 25000000, editingPSpec: false}, {qty: 3, kw: 160, rpm: 1500, voltage: 380, price: 25000000, editingPSpec: false}]
          },
          {
            id: 2, number: 9830562, orderNumber: 981235, customer: {id: 1, name: 'پارس تهران'}, date: "1398-12-26",
            pspecs: [{qty: 2, kw: 315, rpm: 3000, voltage: 380, price: 25000000, editingPSpec: false}, {qty: 3, kw: 160, rpm: 1500, voltage: 380, price: 25000000, editingPSpec: false}]
          },
          {
            id: 3, number: 9820985, orderNumber: 982254, customer: {id: 2, name: 'هوایار'}, date: "1398-12-26",
            pspecs: [{qty: 2, kw: 450, rpm: 1500, voltage: 380, price: 25000000, editingPSpec: false}, {qty: 3, kw: 160, rpm: 1500, voltage: 380, price: 25000000, editingPSpec: false}]
          },
          {
            id: 4, number: 9820678, orderNumber: 983500, customer: {id: 3, name: 'مارون'}, date: "1398-12-26",
            pspecs: [{qty: 2, kw: 75, rpm: 1500, voltage: 380, price: 25000000, editingPSpec: false}, {qty: 3, kw: 160, rpm: 1500, voltage: 380, price: 25000000, editingPSpec: false}]
          },
          {
            id: 5, number: 9820678, orderNumber: 983500, customer: {id: 3, name: 'مارون'}, date: "1398-12-26",
            pspecs: [{qty: 2, kw: 75, rpm: 1500, voltage: 380, price: 25000000, editingPSpec: false}, {qty: 3, kw: 160, rpm: 1500, voltage: 380, price: 4500000, editingPSpec: false}]
          },
        ],
        relatedProformas: [],
        proformaOrder: null,
        orderSpecs: null,
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
        this.specByOrderId(item.id)
        console.log(item.id, item.number, item.customer.name)
        this.assignDialog = true;
        this.toBeAssignedRowInfo.customer = item.customer;
        this.toBeAssignedRowInfo.number = item.number;
        this.toBeAssignedRowInfo.id = item.id;
      },
      addSpecToList() {
        console.log('submitting assignment')
        if (this.editedSpecIndex > -1) {
          Object.assign(this.spec[this.editedSpecIndex], this.assignForm)
        } else {
          this.assignForm.orderId = this.toBeAssignedRowInfo.id;
          this.assignForm.id = this.spec.length + 1;
          this.spec.push(this.assignForm);
          // this.assignForm.orderId = '';
        }
        //Todo: should be implemented later.
        this.specByOrderId(this.toBeAssignedRowInfo.id)
        this.assignClose()
        // this.assignDialog = false
      },
      submitAssignment() {
        alert('sending data to the server.')
        this.assignClose();
        this.assignDialog = false;
      },
      assignClose() {
        // this.assignDialog = false;
        this.assignClear()
      },
      assignClear() {
        this.assignForm = Object.assign({}, this.defaultAssign);
        this.editedSpecIndex = -1;
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
      specByOrderId(orderId) {
        this.relatedSpecRows = this.spec
          .map((row, i) => row.orderId === orderId ? i : -1)
          .filter(index => index !== -1);
        console.log(this.relatedSpecRows)
      },
      editSpec(rowItem) {
        console.log(rowItem);
        this.editedSpecIndex = this.spec.indexOf(rowItem)
        this.assignForm = Object.assign({}, rowItem)
        this.toBeAssignedRowInfo.id = rowItem.orderId
        this.assignDialog = true;
      },
      deleteSpec(rowItem) {
        const index = this.spec.indexOf(rowItem);
        confirm('از حذف این ردیف اطمینان دارید؟') && this.spec.splice(index, 1)
        this.specByOrderId(rowItem.orderId)
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
      },
      listRelatedProformas(order){
        console.log('listing related order for: ', order);
        this.relatedProformas = this.proformas.map((row, i) => row.orderNumber === order.number ? this.proformas[i] : -1).filter(index => index !== -1)
        this.proformaListDialog = true;
      },
      addProforma(order){
        console.log('adding proforma to order: ', order)
        this.proformaFormDialog = true;
        this.proformaOrder = order;
      }
    },
    computed: {},
    components: {
      PersianDatePicker: VuePersianDatetimePicker,
      ProformaList: ProformaList,
      ProformaForm: ProformaForm,
    },
  }
</script>

<style scoped lang="scss">
  .v-input.box {
    width: 50%;
    height: 35px;

    .v-label {
      font-size: 12px;
      color: red;
    }
  }
</style>
