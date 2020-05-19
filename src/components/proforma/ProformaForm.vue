<template>
  <div>
    <v-card>
      <v-card-title v-if="orderID">ثبت پیش فاکتور برای درخواست شماره: {{orderData.number}} مربوط به مشتری:
        {{orderData.customerName}}
        <v-spacer/>
        <span><span>شماره پیش فاکتور: </span><span class="green--text">{{proforma.number}}</span></span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="6">
              <v-text-field
                dense
                v-model="orderData.number"
                label="شماره درخواست"
                :disabled="!orderNumberIsActive"
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
                    :disabled="!proformaSubmitIsActive"
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
                    :disabled="!proformaSubmitIsActive"
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
                    :disabled="!proformaSubmitIsActive"
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
                    v-model="proformaForm.perm"
                    :disabled="!proformaSubmitIsActive"/>
                </v-col>
                <template v-if="proformaForm.perm">
                  <v-col cols="8">
                    <v-text-field
                      label="شماره مجوز"
                      :disabled="!proformaSubmitIsActive"
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
                      :disabled="!proformaSubmitIsActive"
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
                      :disabled="!proformaSubmitIsActive"
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
                :disabled="!proformaSubmitIsActive"
              ></v-textarea>
            </v-col>
            <v-col cols="12">
              <v-btn small class="primary" @click="submitProforma" v-if="proformaSubmitIsActive">ثبت</v-btn>
              <v-btn small class="warning" @click="proformaSubmitIsActive = !proformaSubmitIsActive"
                     v-if="!proformaSubmitIsActive">ویرایش
              </v-btn>
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
  import {proformaById, proformasByOrderId} from "../../grahpql/queries/proforma/proforma";
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
        proformaSubmitIsActive: true,
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
      // if (!(this.proformaId || this.orderId)){}
      this.orderNumberIsActive = !(this.proformaID || this.orderID)
      this.proformaFormIsVisible = !this.orderNumberIsActive
      console.log(this.proformaFormIsVisible)
    },
    methods: {
      submitProforma() {
        console.log('submit proforma')
        this.$apollo.mutate({
          mutation: createProforma,
          variables: {
            req_id: this.orderID,
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
          let data = response.data.proformaMutation;
          console.log(data)
          if (data.xpref !== null && data.xpref.id !== null) {
            this.proformaSubmitIsActive = false;
            this.$set(this.proforma, 'id', data.xpref.id)
            this.$set(this.proforma, 'number', data.xpref.number)
            this.$emit("success", this.orderID, this.proforma)
            this.$apollo.queries.proformasByOrderId.refetch({
              "order_id": this.orderID
            })
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
          this.proforma = result.data;
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
      proformasByOrderId: {
        query: proformasByOrderId,
        skip() {
          return !this.orderID;
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
