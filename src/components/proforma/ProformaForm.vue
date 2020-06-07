<template>
  <div>
    <v-card>{{proformaID}}
      <v-card-title v-if="orderID"> پیش فاکتور
        <v-spacer/>
        <div>
          <v-card-subtitle v-if="proformaFormIsVisible">
            <div>شماره درخواست:  <span class="green--text">{{orderData.number}}</span></div>
            <div>مشتری:  <span class="green--text">{{orderData.customerName}}</span></div>
            <div>شماره پیش فاکتور:  <span class="green--text">{{proforma.number}}</span></div>
          </v-card-subtitle>
        </div>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="6">
              <v-text-field
                dense
                v-model="orderData.number"
                label="شماره درخواست"
                v-if="reqNumActive"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row v-if="proformaFormIsVisible">
            <v-col cols="6">
              <template>
                <v-row>
                <v-col cols="12">
                  <v-text-field
                    dense
                    type="number"
                    v-model="proformaForm.numberTd"
                    label="شماره تدوین"
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-btn
                    small
                    class="primary"
                    @click="date.issue = true"
                  >
                    تاریخ صدور
                  </v-btn>
                </v-col>
                <v-col cols="6">
                  <span v-if="proformaForm.date">{{proformaForm.date}}</span>
                  <span v-else>انتخاب کنید</span>
                  <PersianDatePicker
                    v-model="proformaForm.date"
                    format="jYYYY-jMM-jDD"
                    element="proforma-date"
                    :show="date.issue"
                    @close="date.issue=false"
                    :auto-submit="true"/>
                </v-col>
                <v-col cols="6">
                  <v-btn
                    small
                    class="primary"
                    @click="date.expiry = true"
                  >
                    تاریخ انقضا
                  </v-btn>
                </v-col>
                <v-col cols="6">
                  <span v-if="proformaForm.expiry_date">{{proformaForm.expiry_date}}</span>
                  <span v-else>انتخاب کنید</span>
                  <PersianDatePicker
                    v-model="proformaForm.expiry_date"
                    element="proforma-exp-date"
                    format="jYYYY-jMM-jDD"
                    :show="date.expiry"
                    @close="date.expiry=false"
                    :auto-submit="true"/>
                </v-col>
                </v-row>
              </template>
            </v-col>
            <v-col cols="6">
              <v-row>
                <v-col cols="4">
                  <v-checkbox
                    label="مجوز"
                    v-model="proformaForm.perm"/>
                </v-col>
                <template v-if="proformaForm.perm">
                  <v-col cols="8">
                    <v-text-field
                      label="شماره مجوز"
                      v-model="proformaForm.permNumber"/>
                  </v-col>
                  <v-col cols="6">
                    <v-btn
                      small
                      class="primary"
                      @click="date.perm = true"
                    >
                      تاریخ مجوز
                    </v-btn>
                  </v-col>
                  <v-col cols="6">
                    <span v-if="proformaForm.permDate">{{proformaForm.permDate}}</span>
                    <span v-else>انتخاب کنید</span>
                    <PersianDatePicker
                      v-model="proformaForm.permDate"
                      format="jYYYY-jMM-jDD"
                      element="perm-date"
                      :show="date.perm"
                      @close="date.perm=false"
                      :auto-submit="true"/>
                  </v-col>
                  <v-col cols="6">
                    <v-btn
                      small
                      class="primary"
                      @click="date.dueDate = true"
                    >
                      تاریخ تحویل
                    </v-btn>
                  </v-col>
                  <v-col cols="6">
                    <span v-if="proformaForm.dueDate">{{proformaForm.dueDate}}</span>
                    <span v-else>انتخاب کنید</span>
                    <PersianDatePicker
                      v-model="proformaForm.dueDate"
                      element="due-date"
                      format="jYYYY-jMM-jDD"
                      :show="date.dueDate"
                      @close="date.dueDate=false"
                      :auto-submit="true"/>
                  </v-col>
                </template>
              </v-row>
            </v-col>
          </v-row>
          <v-row v-if="proformaFormIsVisible">
            <v-col cols="12">
              <v-textarea
                v-model="proformaForm.summary"
                label="توضیحات"
              ></v-textarea>
            </v-col>
            <v-col cols="12">
              <v-btn small class="primary" @click="submitProforma" >ثبت</v-btn>
              <v-btn class="error" small @click="cancel">انصراف</v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
  import {baseFunctions} from "../../mixins/graphql/baseFunctions";
  import VuePersianDatetimePicker from 'vue-persian-datetime-picker';
  import {orderIdAndNumber, orderByNumber} from "../../grahpql/queries/order/order";
  import {proformaById} from "../../grahpql/queries/proforma/proforma";
  import cloneDeep from 'lodash/cloneDeep'
  import {createProforma} from "../../grahpql/queries/proforma/mutation/mutation";

  export default {
    data() {
      return {
        name: "ProformaForm",
        show: false,
        orderID: '',
        proformaID: '',
        date: {
          issue: false,
          expiry: false,
          perm: false,
          dueDate: false,
        },
        reqNumActive: true,
        showPermPart: false,
        orderNumberIsActive: false,
        proformaFormIsVisible: false,
        orderData: {
          id: "",
          number: "",
          customerName: "",
        },
        proformaFormDefault: {
          id: '',
          number: '',
          date: '',
        },
        proformaForm: {
          reqNumber: '',
          numberTd: null,
          date: '',
          expiry_date: '',
          perm: false,
          permNumber: '',
          permDate: '',
          dueDate: '',
          summary: '',
        },
        proforma: '',
        createProformaVariables: {},
      }
    },
    props: [
      "proformaId",
      "orderId"
    ],
    mixins: [
      baseFunctions
    ],
    created() {
      if(this.orderId){
        this.orderID = this.orderId;
      }
      if (!this.proformaId) {
        this.proforma = cloneDeep(this.proformaFormDefault);
      }else {
        this.proformaID = this.proformaId;
      }
      this.orderNumberIsActive = !(this.proformaID || this.orderID)
      this.proformaFormIsVisible = !this.orderNumberIsActive
    },
    methods: {
      submitProforma() {
        console.log('submit proforma')
        this.createProformaVariables = {
          proforma_input: {
            reqId: this.orderID,
            owner: "",
            number: 0,
            // "pub_date": "2009-06-15T13:45:30",
            dateFa: this.proformaForm.date,
            numberTd: this.proformaForm.numberTd,
            expDateFa: this.proformaForm.expiry_date,
            permNumber: this.proformaForm.permNumber,
            permDate: this.proformaForm.permDate,
            dueDate: this.proformaForm.dueDate,
            summary: this.proformaForm.summary,
            perm: true
          }
        }
        if (this.proformaId){
          this.createProformaVariables.proforma_input.id = this.proformaID
        }
        console.log('vars: ', this.createProformaVariables, this.proformaId)
        this.$apollo.mutate({
          mutation: createProforma,
          variables: this.createProformaVariables
        }).then(response => {
          let data = response.data.proformaMutation;
          if (data.xpref !== null && data.xpref.id !== null) {
            this.reqNumActive = false;
            this.$set(this.proforma, 'id', data.xpref.id);
            this.$set(this.proforma, 'number', data.xpref.number);
            this.orderID = data.xpref.reqId.id;
            this.$emit("success", this.orderID, this.proforma);
          }
        }, error => {
          console.log(error)
        })
      },
      cancel() {
        this.close()
      },
      close() {
        this.$emit('close-event')
      },
    },
    components: {
      PersianDatePicker: VuePersianDatetimePicker
    },
    // watch: {
    //   proformaById: function () {
    //     this.proforma = this.proformaById;
    //   }
    // },
    apollo: {
      proformaById: {
        query: proformaById,
        variables() {
          return {
            proforma_id: this.proformaID
          }
        },
        skip() {
          return !this.proformaID
        },
        result(result) {
          this.proforma = result.data.proformaById;
          this.proformaForm.perm = this.proforma.perm;
          this.proformaForm.reqNumber = this.proforma.reqId.number;
          this.proformaForm.id = this.proformaID;
          this.proformaForm.perm = this.proforma.perm;
          this.proformaForm.numberTd = this.proforma.numberTd;
          this.proformaForm.permNumber = this.proforma.permNumber;
          this.proformaForm.summary = this.proforma.summary;
          this.orderData.number = this.proforma.reqId.number;
          this.reqNumActive = false
        }
      },
      orderIdAndNumber: {
        query: orderIdAndNumber,
        variables() {
          return {
            "order_id": this.orderID
          }
        },
        skip() {
          return !this.orderID;
        },
        result(result) {
          let order = result.data.orderIdAndNumber;
          if (typeof order !== "undefined") {
            this.orderData.id = order.id;
            this.orderData.number = order.number;
            this.orderData.customerName = order.customer.name;
          }
        }
      },
      orderByNumber: {
        query: orderByNumber,
        debounce: 700,
        skip(){
          return !this.orderData.number;
        },
        variables(){
          return {
            'number': this.orderData.number
          }
        },
        result(result){
          let data = result.data.orderByNumber;
          if (data.edges.length > 0){
            this.proformaFormIsVisible = true;
            this.orderID = this.noNode(data)[0].id;
          }else {
            this.proformaFormIsVisible = false;
          }
        }
      }
    }
  }
</script>

<style scoped>

</style>
