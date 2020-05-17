<template>
  <div>
    <v-card>
      <v-card-title>
        <span>ثبت سفارش</span>

      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12" md="8">
              <v-row>
                <v-col cols="6" md="4">
                  <v-autocomplete
                    v-model="order_form.customerId"
                    :items="customers"
                    item-text="name"
                    item-value="id"
                  label="مشتری">

                  </v-autocomplete>
                </v-col>
                <v-col cols="6" md="4">
                  <v-text-field
                    label="شماره"
                    hint="شماره چارگون درخواست"
                    v-model="order_form.number"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <PersianDatePicker
                    v-model="order_form.date"
                    format="jYYYY-jMM-jDD"
                    :auto-submit="true"/>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-checkbox
                    v-for="salesExpertUser in salesExpertUsers"
                    :key="salesExpertUser.id"
                    v-model="colleagues"
                    :value="salesExpertUser.id"
                    :label="salesExpertUser.lastName"
                  >{{salesExpertUser.lastName}}</v-checkbox>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" md="12">
                  <v-textarea v-model="order_form.summary" label="توضیحات"></v-textarea>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
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
  import {baseFunctions} from "../../mixins/graphql/baseFunctions";
  import {orderOnly} from "../../grahpql/queries/order/order";
  import {customerIdAndName} from "../../grahpql/queries/customer/customer";
  import {salesExperts} from "../../grahpql/queries/user/user";
  import {OrderMutation} from "../../grahpql/queries/order/mutation/mutation";
  import VuePersianDatetimePicker from 'vue-persian-datetime-picker';
  import cloneDeep from 'lodash/cloneDeep'

  export default {
    data(){
      return {
        name: "OrderForm",
        orderFormDefault: {
          id: '',
          customerId: '',
          number: '',
          summary: '',
          date: '',
          finished: false,
        },
        order_form: {
          id: '',
          customerId: '',
          number: '',
          summary: '',
          date: '',
          finished: false,
        },
        customers: [],
        salesExpertUsers: [],
        colleagues: [],
      }
    },
    props: [
      "orderId",
      "order"
    ],
    mixins: [
      baseFunctions
    ],
    methods: {
      getCustomers(){
        if (typeof this.customerIdAndName !== "undefined" && this.customerIdAndName !== null){
          this.customers = this.noNode(this.customerIdAndName)
        }
      },
      submit(){
        console.log(this.order_form, this.colleagues)
        this.$apollo.mutate({
          mutation: OrderMutation,
          variables: {
              customer_id: this.order_form.customerId,
              number: this.order_form.number,
              date_fa: this.order_form.date,
              colleagues: this.colleagues,
              summary: this.order_form.summary,
              finished: this.order_form.finished,
              owner_id: ""
          }
        })
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
      },
      customerIdAndName: function () {
        if (typeof this.customerIdAndName !== "undefined" && this.customerIdAndName !== null){
          this.customers = this.noNode(this.customerIdAndName)
        }
      },
      salesExperts: function () {
        if (typeof this.salesExperts !== "undefined" && this.salesExperts !== null){
          this.salesExpertUsers = this.noNode(this.salesExperts)
          console.log(this.salesExpertUsers)
        }
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
      },
      customerIdAndName: customerIdAndName,
      salesExperts: salesExperts
    }
  }
</script>

<style scoped>
.lll{
  direction: ltr;
}
</style>
