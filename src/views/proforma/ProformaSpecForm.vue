<template>
  <div>
    <v-card>
      <v-card-title v-if="order">ثبت پیش فاکتور برای درخواست شماره: {{order.number}} مربوط به مشتری:
        {{order.customer.name}}
        <v-spacer/>
        <span><span>شماره پیش فاکتور: </span><span class="green--text">{{proforma.number}}</span></span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="4">
              <v-row>
                <v-col cols="4">
                  <v-text-field v-model="order.number" label="شماره درخواست" disabled></v-text-field>
                </v-col>
                <v-col cols="4">
                  <v-text-field v-model="proformaForm.numberTd" label="شماره تدوین" :disabled="!proformaSubmitIsActive"></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="6">
                  <PersianDatePicker
                    :disabled="!proformaSubmitIsActive"
                    v-model="proformaForm.date"
                    format="jYYYY-jMM-jDD"
                    label="تاریخ صدور"
                    :auto-submit="true"/>
                  <PersianDatePicker
                    :disabled="!proformaSubmitIsActive"
                    v-model="proformaForm.expiry_date"
                    format="jYYYY-jMM-jDD"
                    label="تاریخ انقضا"
                    :auto-submit="true"/>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="4">
              <v-row>
                <v-col>
                  <v-textarea v-model="proformaForm.summary" label="توضیحات" :disabled="!proformaSubmitIsActive"></v-textarea>
                  <v-btn class="primary" @click="submitProforma" v-if="proformaSubmitIsActive">ثبت</v-btn>
                  <v-btn class="warning" @click="proformaSubmitIsActive = !proformaSubmitIsActive" v-if="!proformaSubmitIsActive">ویرایش</v-btn>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="4">
              <v-btn @click="showPermPart = !showPermPart" :disabled="!proformaSubmitIsActive">مجوز</v-btn>
              <div v-if="showPermPart">
                <v-text-field
                  label="شماره مجوز"
                  :disabled="!proformaSubmitIsActive"
                  v-model="proformaForm.permNumber"/>
                <v-checkbox
                  label="مجوز"
                  v-model="proformaForm.perm"
                  :disabled="!proformaSubmitIsActive"/>
                <PersianDatePicker
                  :disabled="!proformaSubmitIsActive"
                  v-model="proformaForm.permDate"
                  format="jYYYY-jMM-jDD"
                  label="تاریخ صدور"
                  :auto-submit="true"/>
                <PersianDatePicker
                  :disabled="!proformaSubmitIsActive"
                  v-model="proformaForm.dueDate"
                  format="jYYYY-jMM-jDD"
                  label="تاریخ صدور"
                  :auto-submit="true"/>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
    </v-card>
    <v-card :disabled="!pSpecFormIsActive">
      <v-card-title>ردیف های پیش فاکتور</v-card-title>
      <v-card-text>
        <v-layout row wrap>
          <v-flex xs4>
            <p>
              <v-icon @click="addAllToProformaSpecs">mdi-check-all</v-icon>
            </p>
            <ul>
              <template v-for="spec in specs">
                <li v-if="!spec.staged" :key="spec.id">
                  <p class="mx-4">
                    <span>{{spec.qty}}</span>
                    <span>دستگاه</span>
                    <span>{{spec.kw}}</span>
                    <span>کیلووات</span>
                    <span>{{spec.rpm}}</span>
                    <span>دور</span>
                    <span>{{spec.voltage}}</span>
                    <span>ولت</span>
                    <span><v-icon @click="addToProformaSpecs(spec)"> mdi-plus</v-icon></span>
                  </p>
                </li>
              </template>
            </ul>
          </v-flex>
          <v-flex xs8>
            <v-data-table
              dense
              :headers="headers"
              :items="proformaSpecs"
              hide-default-footer>
              <template v-slot:item.qty="{item}">
                <v-text-field dense v-model="item.qty" class="qty"></v-text-field>
              </template>
              <template v-slot:item.price="{item}">
                <v-text-field dense v-model="item.price"></v-text-field>
              </template>
              <template v-slot:item.action="{item}">
                <v-icon @click="removeFromProformaSpecs(item)">mdi-delete</v-icon>
              </template>
            </v-data-table>
          </v-flex>
        </v-layout>

      </v-card-text>
      <v-card-actions>
        <v-btn @click="submit">ثبت</v-btn>
        <v-btn @click="cancel">انصراف</v-btn>
      </v-card-actions>

    </v-card>
  </div>
</template>

<script>
  import {baseFunctions} from "../../mixins/graphql/baseFunctions";
  import {order} from "../../grahpql/queries/order/order";
  import {createProforma} from "../../grahpql/queries/proforma/mutation/mutation";
  import VuePersianDatetimePicker from 'vue-persian-datetime-picker';

  export default {
    data() {
      return {
        name: "ProformaSpecForm",
        proforma: {},
        proformaSubmitIsActive: true,
        pSpecFormIsActive: false,
        showPermPart: false,
        proformaSpecs: [],
        specs: [],
        proformaForm: {
          reqNumber: '',
          numberTd: '',
          date: '',
          expiry_date: '',
          perm: false,
          permNumber: '',
          permDate: '',
          dueDate: '',
          summary: '',
        },
        headers: [
          {value: 'qty', text: 'تعداد', align: 'center', class: 'qty-header'},
          {value: 'kw', text: 'کیلووات',},
          {value: 'rpm', text: 'سرعت',},
          {value: 'voltage', text: 'ولتاژ',},
          {value: 'price', text: 'قیمت',},
          {value: 'action', text: '',},
        ]
      }
    },
    props: ['orderId'],
    mixins: [
      baseFunctions
    ],
    components: {
      PersianDatePicker: VuePersianDatetimePicker
    },
    methods: {
      addToProformaSpecs(spec) {
        this.proformaSpecs.push(spec)
        spec.staged = true;
      },
      removeFromProformaSpecs(spec) {
        const index = this.proformaSpecs.indexOf(spec)
        this.proformaSpecs.splice(index, 1)
        spec.staged = false
      },
      addAllToProformaSpecs() {
        this.specs.map((row) => {
          console.log(row.price > 0 && !row.staged)
          if (!row.staged) {
            this.proformaSpecs.push(row)
            row.staged = true
          }
        })
      },
      submit() {
        alert('sending to server')
        this.close()
      },
      cancel() {
        this.close()
      },
      close() {
        this.$emit('close-event')
      },
      submitProforma(){
        console.log('submit proforma')
        this.$apollo.mutate({
          mutation: createProforma,
          variables: {
            req_id: this.orderId,
            owner_id: "",
            number: 0,
            // "pub_date": "2009-06-15T13:45:30",
            date_fa: this.proformaForm.date,
            number_td: this.proformaForm.numberTd,
            expiry_date: this.proformaForm.expiry_date,
            perm_number: this.proformaForm.permNumber,
            perm_date: this.proformaForm.permDate,
            due_date: this.proformaForm.dueDate,
            summary: this.proformaForm.summary,
            perm: true
          }
        }).then(response => {
          let data = response.data.proformaMutation
          console.log(data)
          if (data.xpref !== null && data.xpref.id !== null){
            this.proformaSubmitIsActive = false;
            this.pSpecFormIsActive = true;
            this.$set(this.proforma, 'id', data.xpref.id)
            this.$set(this.proforma, 'number', data.xpref.number)
          }
        }, error => {
          console.log(error)
        })
      }
    },
    watch: {
      order: function () {
        this.specs = this.noNode(this.order.reqspecSet)
        this.specs.forEach(e => e.staged = false)
        console.log('specs: ', this.specs)
      }
    },
    apollo: {
      order: {
        query: order,
        variables() {
          return {
            order_id: this.orderId
          }
        }
      }
    }
  }
</script>

<style scoped>
  th.text-center.qty-header.sortable {
    width: 82px;
  }

  .qty {
    align-items: center;
  }
</style>
