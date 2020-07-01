<template>
  <div>
    <v-card>
      <p>ORDER ID:{{orderId}}</p>
      <p>proforma id: {{proformaInstance}}</p>
      <v-card-title v-if="orderId"> پیش فاکتور
        <v-spacer/>
        <div>
          <v-card-subtitle v-if="proformaFormIsVisible">
            <div>شماره درخواست:  <span class="green--text">{{orderData.number}}</span></div>
            <div>مشتری:  <span class="green--text">{{proformaInstance.customerName}}</span></div>
            <div>شماره پیش فاکتور:  <span class="green--text">{{proformaInstance.number}}</span></div>
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
  import {
    // orderIdAndNumber,
    orderByNumber} from "../../grahpql/queries/order/order";
  // import {proformaById} from "../../grahpql/queries/proforma/proforma";
  import cloneDeep from 'lodash/cloneDeep'
  // import {createProforma} from "../../grahpql/queries/proforma/mutation/mutation";
  import {mapGetters, mapActions} from 'vuex'
  import {
    ACTION_INSERT_PROFORMA,
    ACTION_UPDATE_PROFORMA_ORDER_SPECS,
    // MUTATE_PROFORMA_ID,
    MUTATE_PROFORMA_ORDER_ID, PROFORMA,
    PROFORMA_ORDER_ID
  } from "../../store/types/proforma";

  export default {
    data() {
      return {
        name: "ProformaForm",
        show: false,
        // orderID: '',
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
    mixins: [
      baseFunctions
    ],
    created() {
      // if(this.orderId){
      //   this.orderID = this.orderId;
      // }
      if (!this.proformaInstance.id) {
        this.proforma = cloneDeep(this.proformaFormDefault);
      }
      // this.orderNumberIsActive = !(this.proformaID || this.orderID)
    },
    methods: {
      ...mapActions({
        updateProformaOrderSpecs: ACTION_UPDATE_PROFORMA_ORDER_SPECS,
        insertProforma: ACTION_INSERT_PROFORMA,
      }),
      submitProforma() {
        this.createProformaVariables = {
          proforma_input: {
            reqId: this.orderId,
            owner: "",
            number: 0,
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
          this.createProformaVariables.proforma_input.id = this.proformaInstance.id
        }
        this.insertProforma(this.createProformaVariables)
      },
      cancel() {
        this.close()
      },
      close() {
        this.$emit('close-event')
      },
    },
    computed: {
      ...mapGetters({
        orderId: PROFORMA_ORDER_ID,
        proformaInstance: PROFORMA,
      })
    },
    components: {
      PersianDatePicker: VuePersianDatetimePicker
    },
    apollo: {
      // proformaById: {
      //   query: proformaById,
      //   variables() {
      //     return {
      //       proforma_id: this.proformaID
      //     }
      //   },
      //   skip() {
      //     return !this.proformaID
      //   },
      //   result(result) {
      //     this.proforma = result.data.proformaById;
      //     this.proformaForm.perm = this.proforma.perm;
      //     this.proformaForm.reqNumber = this.proforma.reqId.number;
      //     this.proformaForm.id = this.proformaID;
      //     this.proformaForm.perm = this.proforma.perm;
      //     this.proformaForm.numberTd = this.proforma.numberTd;
      //     this.proformaForm.permNumber = this.proforma.permNumber;
      //     this.proformaForm.summary = this.proforma.summary;
      //     this.orderData.number = this.proforma.reqId.number;
      //     this.reqNumActive = false
      //   }
      // },
      // orderIdAndNumber: {
      //   query: orderIdAndNumber,
      //   variables() {
      //     return {
      //       "order_id": this.orderId
      //     }
      //   },
      //   skip() {
      //     return !this.orderId;
      //   },
      //   result(result) {
      //     let order = result.data.orderIdAndNumber;
      //     if (typeof order !== "undefined") {
      //       this.orderData.id = order.id;
      //       this.orderData.number = order.number;
      //       this.orderData.customerName = order.customer.name;
      //     }
      //   }
      // },
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
            this.$store.commit(MUTATE_PROFORMA_ORDER_ID, this.noNode(data)[0].id)
            // this.orderID = this.noNode(data)[0].id;
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
