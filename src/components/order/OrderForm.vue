<template>
  <div>
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
  </div>
</template>

<script>
  import {orderOnly} from "../../grahpql/queries/order/order";
  import VuePersianDatetimePicker from 'vue-persian-datetime-picker';
  import cloneDeep from 'lodash/cloneDeep'

  export default {
    data(){
      return {
        name: "OrderForm",
        orderFormDefault: {
          id: '',
          customer: {
            id: '',
            name: '',
          },
          number: '',
          summary: '',
        },
        order_form: {
          id: '',
          customer: {
            id: '',
            name: '',
          },
          number: '',
          summary: '',
        },
      }
    },
    props: [
      "orderId",
      "order"
    ],
    methods: {
      submit(){
        Object.assign(this.order, this.order_form)
        this.$emit('close')
      },
      cancel(){
        this.order_form = cloneDeep(this.order);
        this.$emit('close')
      },
    },
    components: {
      PersianDatePicker: VuePersianDatetimePicker
    },
    created() {
      this.order_form = cloneDeep(this.orderFormDefault);
      // this.$set(this.order_form, this.orderFormDefault)
    },
    watch: {
      orderOnly: function () {
        this.order_form = this.orderOnly;
      }
    },
    apollo: {
      orderOnly: {
        query: orderOnly,
        variables(){
          return {
            order_id: this.orderId
          }
        }
      }
    }
  }
</script>

<style scoped>
.lll{
  direction: ltr;
}
</style>
