<template>
  <div>
    <v-card>
      <v-toolbar
        flat
        color="transparent">
        <v-toolbar-title>درخواست خرید</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn
          icon
          @click="$emit('closeOrderFormHolder')"
        >
          <v-icon class="red--text">mdi-close-circle</v-icon>
        </v-btn>
      </v-toolbar>
    </v-card>
    <v-stepper
    v-model="e1">
      <v-stepper-header>
        <v-stepper-step
          :complete="e1 > 1"
          :editable="editable"
          :key="`1-step`"
          step="1"
        >
          ثبت درخواست خرید
        </v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step
          :complete="e1 > 2"
          :editable="editable"
          :key="`2-step`"
          step="2">
          ثبت ردیف
        </v-stepper-step>
        <v-divider/>
        <v-stepper-step
        :editable="editable"
        :complete="e1 > 3"
        :key="`3-step`"
        step=3>
          مشاهده جزئیات
        </v-stepper-step>
      </v-stepper-header>
      <v-stepper-items>
        <v-stepper-content step="1">
          <order-form v-on:orderCreated="orderCreated"/>
        </v-stepper-content>
        <v-stepper-content step="2">
          <order-spec-form v-if="orderSpecFormIsActive" :order-id="selectedOrderId" v-on:updateSpecs="updateSpecs"/>
          <p v-else>هنوز درخواستی ثبت نشده است. (مرحله 1)</p>
        </v-stepper-content>
        <v-stepper-content step="3">
          <order-preview v-if="specs.length > 0" :specs="specs"/>
          <p v-else>مشاهده جزئیات درخواست و ردیف ها</p>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
  </div>
</template>

<script>
  import OrderForm from "./OrderForm";
  import OrderSpecForm from "./spec/OrderSpecForm";
  import OrderPreview from "./OrderPreview";

  export default {
    data(){
      return {
        name: "OrderCreationHolderForm",
        e1: 1,
        editable: true,
        orderSpecFormIsActive: false,
        selectedOrderId: null,
        specs: []
      }
    },
    props: [
      'orderId'
    ],
    components: {
      OrderSpecForm,
      OrderForm,
      OrderPreview
    },
    methods: {
      orderCreated(orderId){
        this.selectedOrderId = orderId;
        this.orderSpecFormIsActive = true;
        this.e1 = 2;
        this.$emit('updateOrders')
      },
      updateSpecs(specs){
        this.specs = specs;
      }
    }
  }
</script>

<style scoped>

</style>
