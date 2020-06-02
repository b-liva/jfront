<template>
  <div>
    <v-card>
      <v-card-text>
        <div v-if="errors.length > 0">
          <ol>
            <li v-for="error in errors" :key="error.field">
              {{error.field}}:
              <ul>
                <li v-for="(errorMsg, index) in error.messages" :key="index">{{errorMsg}}</li>
              </ul>
            </li>
          </ol>
        </div>
        <v-container>{{orderId}}
          <div>{{colleagues}}</div>
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
  import {order, orderOnly} from "../../grahpql/queries/order/order";
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
        errors: [],
        OrderMutationVariables: {},
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
      submit(){
        this.OrderMutationVariables = {
          request_input: {
            customer: this.order_form.customerId,
            number: this.order_form.number,
            dateFa: this.order_form.date,
            colleagues: this.colleagues,
            summary: this.order_form.summary,
            finished: this.order_form.finished,
            owner: 0
          }
        };
        if (this.orderId){
          this.OrderMutationVariables.request_input.id = this.orderId;
          console.log('editing else...........', this.OrderMutationVariables)
        }
        this.$apollo.mutate({
          mutation: OrderMutation,
          variables: this.OrderMutationVariables,
        }).then((response) => {
          console.log(response)
          let results = response.data.OrderMutation;
          if (results.requests !== null){
            let orderId = results.requests.id;
            this.$emit('orderCreated', orderId)
          }else  if(results.errors.length > 0){
            console.log('hava some errors.')
            this.errors = results.errors;
          }
        }).catch(error => {
          console.log('[error]', error.response);
        });
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
    },
    apollo: {
      orderOnly: {
        query: orderOnly,
        variables(){
          return {
            order_id: this.orderId
          }
        },
        skip(){
          return !this.orderId
        },
        result({data}){
          this.colleagues = []
          console.log("order only: ", data.orderOnly.colleagues.edges)
          this.order_form = data.orderOnly
          this.order_form.customerId = data.orderOnly.customer.id;
          let colleagues = this.noNode(data.orderOnly.colleagues)
          colleagues.forEach(c => this.colleagues.push(c.id))
        }
      },
      order: {
        query: order,
        skip(){
          return !this.orderId
        },
        variables(){
          return {
            order_id: this.orderId
          }
        },
        result({data}){
          console.log("order: ", data)
          this.orderSpecs = this.noNode(data.order.reqspecSet)
        }
      },
      customerIdAndName: {
        query: customerIdAndName,
        result(result){
          this.customers = this.noNode(result.data.customerIdAndName)
        }
      },
      salesExperts: {
        query: salesExperts,
        result(result){
          this.salesExpertUsers = this.noNode(result.data.salesExperts)
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
