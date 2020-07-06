<template>
  <div>
    <v-card>
      <v-card-title>
        <div>
          <v-card-subtitle v-if="proformaFormIsVisible || true">
            <div>شماره درخواست:  <span class="green--text">{{proformaOrder.number}}</span></div>
            <div>مشتری:  <span class="green--text">{{proformaOrder.customer.name}}</span></div>
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
                v-model="proformaOrder.number"
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
                    v-model="proformaInstance.numberTd"
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
                  <span v-if="proformaInstance.date">{{proformaInstance.date}}</span>
                  <span v-else>انتخاب کنید</span>
                  <PersianDatePicker
                    v-model="proformaInstance.date"
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
                  <span v-if="proformaInstance.expiry_date">{{proformaInstance.expiry_date}}</span>
                  <span v-else>انتخاب کنید</span>
                  <PersianDatePicker
                    v-model="proformaInstance.expiry_date"
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
                    v-model="proformaInstance.perm"/>
                </v-col>
                <template v-if="proformaInstance.perm">
                  <v-col cols="8">
                    <v-text-field
                      label="شماره مجوز"
                      v-model="proformaInstance.permNumber"/>
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
                    <span v-if="proformaInstance.permDate">{{proformaInstance.permDate}}</span>
                    <span v-else>انتخاب کنید</span>
                    <PersianDatePicker
                      v-model="proformaInstance.permDate"
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
                    <span v-if="proformaInstance.dueDate">{{proformaInstance.dueDate}}</span>
                    <span v-else>انتخاب کنید</span>
                    <PersianDatePicker
                      v-model="proformaInstance.dueDate"
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
                v-model="proformaInstance.summary"
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
    ACTION_UPSERT_PROFORMA,
    ACTION_UPDATE_PROFORMA_ORDER_SPECS,
    ACTION_UPDATE_PROFORMA,
    PROFORMA,
    PROFORMA_ORDER, MUTATE_PROFORMA_ORDER
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
      if (!this.proformaInstance.id){
        this.proforma = cloneDeep(this.proformaFormDefault);
      }
      // if (this.proformaId){
      //   this.updateProforma(this.proformaId)
      // }
    },
    watch: {
      // proformaInstance: function () {
      //   // let s = true
      //   console.log(this.proformaInstance)
      //   console.log(this.proformaInstance.id !== "")
      //   if (this.proformaInstance.id !== ""){
      //     this.orderData.id = this.proformaOrder.id;
      //     this.orderData.number = this.proformaOrder.number;
      //     this.orderData.customerName = this.proformaInstance.customerName;
      //
      //     this.proformaForm.numberTd = this.proformaInstance.numberTd;
      //     this.proformaForm.perm = this.proformaInstance.perm;
      //     this.proformaForm.permNumber = this.proformaInstance.permNumber;
      //     this.proformaForm.summary = this.proformaInstance.summary;
      //     this.reqNumActive = false
      //   }
      // }
    },
    methods: {
      ...mapActions({
        updateProformaOrderSpecs: ACTION_UPDATE_PROFORMA_ORDER_SPECS,
        upsertProforma: ACTION_UPSERT_PROFORMA,
        updateProforma: ACTION_UPDATE_PROFORMA
      }),
      submitProforma() {
        this.createProformaVariables = {
          proforma_input: {
            reqId: this.proformaInstance.id || this.proformaOrder.id,
            owner: "",
            number: 0,
            dateFa: this.proformaInstance.date,
            numberTd: this.proformaInstance.numberTd,
            expDateFa: this.proformaInstance.expiry_date,
            permNumber: this.proformaInstance.permNumber,
            permDate: this.proformaInstance.permDate,
            dueDate: this.proformaInstance.dueDate,
            summary: this.proformaInstance.summary,
            perm: true
          }
        }
        if (this.proformaInstance.id){
          this.createProformaVariables.proforma_input.id = this.proformaInstance.id
        }
        this.upsertProforma(this.createProformaVariables)
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
        proformaOrder: PROFORMA_ORDER,
        // proformaId: PROFORMA_ID,
        proformaInstance: PROFORMA,
      })
    },
    components: {
      PersianDatePicker: VuePersianDatetimePicker
    },
    apollo: {
      orderByNumber: {
        query: orderByNumber,
        debounce: 700,
        skip(){
          return !this.proformaOrder.number;
        },
        variables(){
          return {
            'number': this.proformaOrder.number
          }
        },
        result(result){
          let data = result.data.orderByNumber;
          if (data.edges.length > 0){
            this.proformaFormIsVisible = true;
            this.$store.commit(MUTATE_PROFORMA_ORDER, this.noNode(data)[0])
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
