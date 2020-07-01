<template>
  <div>
    <v-card>
      <v-toolbar
        flat
        color="transparent">
        <v-toolbar-title>پیش فاکتور</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn
          icon
          @click="$emit('close-event')"
        >
          <v-icon class="red--text">mdi-close-circle</v-icon>
        </v-btn>
      </v-toolbar>
    </v-card>
    <v-stepper
      v-model="e1"
      :vertical="vertical"
      :alt-labels="altLabels"
    >
      <template>
        <v-stepper-header>
          <v-stepper-step
            :key="`1-step`"
            :complete="e1 > 1"
            step="1"
            :editable="editable"
          >
            ثبت پیش فاکتور
          </v-stepper-step>
          <v-divider/>

          <v-stepper-step
            :key="`2-step`"
            :complete="e1 > 2"
            :step="2"
            :editable="editable"
          >
            ثبت قیمت
          </v-stepper-step>
          <v-divider/>
          <v-stepper-step
          key="3-step"
          step="3"
          editable
          :complete="e1 > 3">
            مشاهده جزئیات
          </v-stepper-step>
        </v-stepper-header>

        <v-stepper-items>
          <v-stepper-content
            step="1"
          >
            <proforma-form
              :order-id="orderID"
              :proforma-id="proformaID"
              v-on:close-event="$emit('close-event')"
              v-on:success="proformaCreated"
            />
          </v-stepper-content>

          <v-stepper-content
            step="2"
          >
            <proforma-spec-form
              v-if="pSpecFormIsActive"
              :order-id="orderID"
              :proforma-id="proformaID"
              v-on:proformaSpecSuccess="pSpecSuccess"
            />
            <p v-else>برای ثبت قیمت باید پیش فاکتور ثبت شده باشد. (مرحله 1)</p>
          </v-stepper-content>
          <v-stepper-content
          step="3">
            <proforma-preview v-if="proformaSpecs.length > 0" :proforma-specs="proformaSpecs"/>
            <p v-else>مشاهده جزئیات و دریافت فایل</p>
          </v-stepper-content>
        </v-stepper-items>
      </template>
    </v-stepper>
    <v-snackbar
    :timeout=3000
    top
    v-model="snackbar"
    > {{snackbarMsg}} </v-snackbar>
  </div>
</template>

<script>
  import ProformaForm from "./ProformaForm";
  import ProformaSpecForm from "./ProformaSpecForm";
  import ProformaPreview from "./ProformaPreview";
  import {mapGetters} from 'vuex'
  import {PROFORMA_SPEC_FORM_IS_ACTIVE, PROFORMA_SPECS} from "../../store/types/proforma";

  export default {
    data(){
      return {
        name: "ProformaCreationHolderForm",
        e1: 1,
        steps: 3,
        vertical: false,
        altLabels: false,
        editable: true,
        // pSpecFormIsActive: false,
        proforma: null,
        orderID: '',
        proformaID: '',
        snackbar: false,
        snackbarMsg: '',
      }
    },
    created() {
      if (this.orderId){
        this.orderID = this.orderId;
      }
      if (this.proformaId){
        this.proformaID = this.proformaId
        // this.pSpecFormIsActive = true
      }
    },
    props: ['orderId', 'proformaId'],
    methods: {
      proformaCreated(orderId, proforma){
        this.proforma = proforma;
        this.orderID = orderId;
        this.proformaID = proforma.id;
        // this.pSpecFormIsActive = true;
        this.e1 = 2;
        this.snackbarMsg = 'پیش فاکتور به درستی ثبت شد'
        this.snackbar = true;
      },
      pSpecSuccess(proformaSpecs){
        this.proformaSpecs = proformaSpecs
        this.e1 = 3;
        this.snackbarMsg = 'قیمت با موفقیت ثبت شد.'
        this.snackbar = true;
      }
    },
    computed: {
      ...mapGetters({
        pSpecFormIsActive: PROFORMA_SPEC_FORM_IS_ACTIVE,
        proformaSpecs: PROFORMA_SPECS
      })
    },
    components: {
      ProformaForm,
      ProformaSpecForm,
      ProformaPreview
    },
  }
</script>

<style scoped>

</style>
