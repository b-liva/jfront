<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="6" md="4">
          <customer-card :customer-id="order.customer.id"/>
        </v-col>
        <v-col cols="6" md="4">
          <v-container>
            <v-row>
              <v-col>
                <v-card>
                  <v-card-title>درخواست شماره {{order.number}}</v-card-title>
                  <v-card-text>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-container>

        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col cols="10" md="8">
          <v-icon @click="editOrder(order.id)" small class="mr-2">mdi-pencil</v-icon>
          <v-icon @click="deleteOrder(order.id)" small class="mr-2">mdi-delete</v-icon>
          <v-icon @click="findRelatedProformas" small class="mr-2">mdi-format-list-bulleted</v-icon>
          <v-icon @click="findRelatedIncomes" small class="mr-2">mdi-format-list-bulleted</v-icon>
          <v-data-table
            dense
            :items="specs"
            :headers="specHeaders">
            <template v-slot:item.action="{item}">
              <v-icon small class="mr-2" @click="editSpec(item.id)">mdi-pencil</v-icon>
              <v-icon small class="mr-2" @click="deleteSpec(item.id)">mdi-delete</v-icon>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col
        cols="12" md="8">
          <div  @click="orderTreeDialog = true">
            <order-tree :order-id="order.id"/>
          </div>
        </v-col>
      </v-row>
    </v-container>
    <v-dialog v-model="orderDialog" max-width="800px">
      <order-form :order="order" @close="orderDialog = false"/>
    </v-dialog>
    <v-dialog v-model="proformaListDialog" max-width="900px">
      <proforma-list :proformas="relatedProformas" :order="order"/>
    </v-dialog>
    <v-dialog v-model="incomeListDialog" max-width="900">
      <income-summary/>
    </v-dialog>
    <v-dialog v-model="orderSpecDialog">
      <order-spec-form :spec-id="specId"/>
    </v-dialog>
    <v-dialog v-model="orderTreeDialog" max-width="900px">
      <order-tree :order-id="order.id"/>
    </v-dialog>
  </div>
</template>

<script>
  import OrderForm from "../../components/order/OrderForm";
  import ProformaList from "../proforma/ProformaList";
  import IncomeSummary from "../../components/income/IncomeSummary";
  import OrderSpecForm from "../../components/order/spec/OrderSpecForm";
  import OrderTree from "../../components/charts/timeline/OrderTree";
  import CustomerCard from "../../components/customer/CustomerCard";
  import * as orderGql from '../../grahpql/queries/order/order.graphql'
  import {baseFunctions} from "../../mixins/graphql/baseFunctions";

  export default {
    data(){
      return {
        name: "OrderDetails",
        order: null,
        specId: '',
        specHeaders: [
          {value: "qty", text: "تعداد"},
          {value: "kw", text: "کیلووات"},
          {value: "rpm", text: "سرعت"},
          {value: "voltage", text: "ولتاژ"},
          {value: "action", text: ""},
        ],
        specs: [],
        orderDialog: false,
        orderSpecDialog: false,
        proformaListDialog: false,
        incomeListDialog: false,
        orderTreeDialog: false,
        relatedProformas: [
          {
            id: 1, number: 9820365, orderNumber: 980204, customer: {id: 5, name: 'تهران بوستون'}, date: "1398-12-26",
            pspecs: [{qty: 2, kw: 132, rpm: 1500, voltage: 380, price: 25000000, editingPSpec: false}, {
              qty: 3,
              kw: 160,
              rpm: 1500,
              voltage: 380,
              price: 25000000,
              editingPSpec: false
            }]
          },
          {
            id: 2, number: 9830562, orderNumber: 981235, customer: {id: 1, name: 'پارس تهران'}, date: "1398-12-26",
            pspecs: [{qty: 2, kw: 315, rpm: 3000, voltage: 380, price: 25000000, editingPSpec: false}, {
              qty: 3,
              kw: 160,
              rpm: 1500,
              voltage: 380,
              price: 25000000,
              editingPSpec: false
            }]
          },
        ]
      }
    },
    mixins: [
      baseFunctions
    ],
    methods: {
      editOrder(orderId){
        console.log(orderId)
        this.orderDialog = true;
      },
      deleteOrder(orderId){
        console.log(orderId)
      },
      editSpec(item){
        this.specId = item;
        this.orderSpecDialog = true;
      },
      deleteSpec(item){
        //Send delete request to the server and rerun the return the specs again to show.
        console.log('deleting', item)
      },
      findRelatedProformas(){
      //  find related proformas
        this.proformaListDialog = true;
      },
      findRelatedIncomes(){
        this.incomeListDialog = true;
      }
    },
    components: {
      OrderForm,
      ProformaList,
      IncomeSummary,
      OrderSpecForm,
      OrderTree,
      CustomerCard
    },
    apollo: {
      order: {
        query: orderGql.order,
        skip(){
          return !this.$route.params.id
        },
        variables(){
          return {
            'order_id': this.$route.params.id
          }
        },
        result({data}) {
          console.log(data)
          this.order = data.order;
          this.specs = this.noNode(data.order.reqspecSet);
        }
      }
    }
  }
</script>

<style scoped>

</style>
