<template>
  <div>
    <v-card>{{orderId}}
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
          {{stepOneMsg}}
        </v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step
          :complete="e1 > 2"
          :editable="editable"
          :key="`2-step`"
          step="2">
          {{stepTwoMsg}}
        </v-stepper-step>
        <v-divider/>
        <v-stepper-step
        :editable="editable"
        :complete="e1 > 3"
        :key="`3-step`"
        step=3>
          {{stepThreeMsg}}
        </v-stepper-step>
      </v-stepper-header>
      <v-stepper-items>
        <v-stepper-content step="1">
          <order-form :order-id="selectedOrderId" v-on:orderCreated="orderCreated"/>
        </v-stepper-content>
        <v-stepper-content step="2">
          <order-spec-form v-if="orderSpecFormIsActive"/>
          <p v-else>هنوز درخواستی ثبت نشده است. (مرحله 1)</p>
        </v-stepper-content>
        <v-stepper-content step="3">
          <order-preview v-if="specs.length > 0"/>
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
  import {baseFunctions} from "../../mixins/graphql/baseFunctions";
  import {mapGetters, mapMutations} from 'vuex'
  import {ORDER_SPECS, MUTATE_SPEC_FORM_IS_ACTIVE, ORDER_SPEC_FORM_IS_ACTIVE} from "../../store/types/order";

  export default {
    data(){
      return {
        name: "OrderCreationHolderForm",
        stepOneMsg: 'ثبت در خواست خرید',
        stepTwoMsg: "ثبت ردیف",
        stepThreeMsg: "مشاهده جزئیات",
        e1: 1,
        editable: true,
        // orderSpecFormIsActive: false,
        selectedOrderId: null,
      }
    },
    props: [
      'orderId'
    ],
    computed: {
      ...mapGetters({
        orderSpecFormIsActive: ORDER_SPEC_FORM_IS_ACTIVE,
        specs: ORDER_SPECS,
      })
    },
    components: {
      OrderSpecForm,
      OrderForm,
      OrderPreview
    },
    created() {
      if (this.orderId){
        this.stepOneMsg = "ویرایش درخواست خرید"
        this.stepTwoMsg = "ویرایش ردیف"
        // this.orderSpecFormIsActive = true
        this.selectedOrderId = this.orderId
        this.$store.commit(MUTATE_SPEC_FORM_IS_ACTIVE, true)
      }
    },
    mixins: [
      baseFunctions
    ],
    methods: {
      ...mapMutations([
        MUTATE_SPEC_FORM_IS_ACTIVE
      ]),
      orderCreated(orderId){
        this.selectedOrderId = orderId;
        // this.orderSpecFormIsActive = true;
        this.e1 = 2;
        this.$emit('updateOrders')
      },
    },
  }
</script>

<style scoped>

</style>
