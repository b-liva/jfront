<template>
  <div>
    <v-container>
      <v-row>
        <v-col>
          <v-card>
            <v-card-title>درخواست شماره {{order.number}}</v-card-title>
            <v-card-text>
              {{order.customer.name}} - {{order.date}}
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col cols="10" md="8">
          <v-icon @click="editOrder(order.id)" small class="mr-2">mdi-pencil</v-icon>
          <v-icon @click="deleteOrder(order.id)" small class="mr-2">mdi-delete</v-icon>
          <v-icon @click="findRelatedProformas" v-on="on" small class="mr-2">mdi-format-list-bulleted</v-icon>
          <v-icon @click="findRelatedIncomes" v-on="on" small class="mr-2">mdi-format-list-bulleted</v-icon>
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
  </div>
</template>

<script>
  import OrderForm from "../../components/order/OrderForm";
  import ProformaList from "../proforma/ProformaList";
  import IncomeSummary from "../../components/income/IncomeSummary";

  export default {
    data(){
      return {
        name: "OrderDetails",
        order: null,
        specHeaders: [
          {value: "qty", text: "تعداد"},
          {value: "kw", text: "کیلووات"},
          {value: "rpm", text: "سرعت"},
          {value: "voltage", text: "ولتاژ"},
          {value: "action", text: ""},
        ],
        specs: [
          {id: 25, qty: 5, kw: 132, rpm: 1500, voltage: 380},
          {id: 36, qty: 4, kw: 75, rpm: 3000, voltage: 380},
          {id: 15, qty: 6, kw: 155, rpm: 1500, voltage: 380},
          {id: 65, qty: 2, kw: 160, rpm: 1000, voltage: 380},
        ],
        orderDialog: false,
        proformaListDialog: false,
        incomeListDialog: false,
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
    props: [
      "orderNumber"
    ],
    methods: {
      editOrder(orderId){
        console.log(orderId)
        this.orderDialog = true;
      },
      deleteOrder(orderId){
        console.log(orderId)
      },
      getOrderDetails(){
        this.order = {
          id: this.$route.params.id,
          number: this.$route.params.number,
          date: "1398-12-02",
          customer: {
            id: 5,
            name: "پتروشیمی مارون"
          }
        }
      },
      editSpec(item){
        console.log(item)
      },
      deleteSpec(item){
        console.log(item)
      },
      findRelatedProformas(){
      //  find related proformas
        this.proformaListDialog = true;
      },
      findRelatedIncomes(){
        this.incomeListDialog = true;
      }
    },
    created() {
      this.getOrderDetails()
    },
    components: {
      OrderForm,
      ProformaList,
      IncomeSummary
    }
  }
</script>

<style scoped>

</style>
