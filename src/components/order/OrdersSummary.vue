<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="6">
          <v-text-field
            label="مشتری"
            v-model="filterForm.customerName"></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-text-field
            v-model="filterForm.number"
            label="number">
          </v-text-field>
        </v-col>
        <v-col cols="2">
          <v-checkbox
            v-model="filterForm.no_proforma"
            label="بدون پیش فاکتور"></v-checkbox>
        </v-col>
      </v-row>
    </v-container>
    <v-container>
      <v-row>
        <v-col cols="12" md="12">
          <v-card>
            <v-card-title>درخواست</v-card-title>
            <v-card-text>
              <v-data-table
                :loading="$apollo.queries.filteredOrders.loading"
                :headers="ordersHeader"
                :items="getOrders()"
                :expanded="orderRowExpanded"
                show-expand
                single-expand
                @item-expanded="orderExpanded"
              >
                <template v-slot:top>
                  <v-toolbar>
                    <v-toolbar-title>درخواست خرید</v-toolbar-title>
                    <v-divider vertical inset class="mx-4"/>
                    <v-spacer></v-spacer>
                    <v-btn class="primary" @click="newOrder">درخواست جدید</v-btn>
                  </v-toolbar>
                </template>
                <template v-slot:item.number="{item}">
                  <router-link :to="{name: 'Order', params: {id: item.id, number: item.number}}">
                    {{item.number}}
                  </router-link>
                </template>
                <template v-slot:item.customer="{item}">
                  {{item.customer.name}}
                </template>
                <template v-slot:item.owner="{item}">
                  {{item.owner.lastName}}
                </template>
                <template v-slot:item.action="{ item }">
                  <v-icon @click="editItem(item)" small class="mr-2">mdi-pencil</v-icon>
                  <v-icon @click="deleteItem(item)" small class="mr-2">mdi-delete</v-icon>
                  <v-tooltip top>
                    <template v-slot:activator="{on}">
                      <v-icon
                        @click="assignSpecToOrder(item)"
                        small
                        class="mr-2"
                        v-on="on">mdi-arrow-left-bold
                      </v-icon>
                    </template>
                    <span>افزودن ردیف به درخواست</span>
                  </v-tooltip>
                  <v-tooltip top>
                    <template v-slot:activator="{on}">
                      <v-icon @click="listRelatedProformas(item)" v-on="on" small class="mr-2">mdi-format-list-bulleted</v-icon>
                    </template>
                    <span>مشاهده پیش فاکتور های مرتبط</span>
                  </v-tooltip>
                  <v-tooltip top>
                    <template v-slot:activator="{on}">
                      <v-icon @click="addProforma(item)" v-on="on" small class="mr-2">mdi-playlist-plus</v-icon>
                    </template>
                    <span>افزودن پیش فاکتور جدید به درخواست</span>
                  </v-tooltip>
                </template>
                <template v-slot:expanded-item="{headers}">
                  <td :colspan="headers.length">
                    <v-data-table
                      v-if="expandedOrderId"
                      :loading="$apollo.queries.order.loading"
                      :headers="specHeaders"
                      :items="getOrderSpecs()"
                      @click:row="findProformas">
                      <template v-slot:no-data>
                        {{error}}
                      </template>
                    </v-data-table>
                  </td>
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <v-dialog v-model="specProformasDialog" width="900px">
      <spec-proformas :spec_id="selectedSpecId" />
    </v-dialog>
    <v-dialog v-model="assignDialog" fullscreen hide-overlay>
      <order-spec-form v-if="assignDialog" :order-id="selectedOrderId" v-on:closeAssignDialog="assignDialog = false"/>
    </v-dialog>
    <v-dialog v-model="proformaListDialog">
      <proforma-list v-if="proformaListDialog" :order_id="selectedOrderId"/>
    </v-dialog>
    <v-dialog persistent v-model="proformaFormDialog">
      <proforma-spec-form v-if="proformaFormDialog" :order-id="selectedOrderId" v-on:close-event="proformaFormDialog = false"/>
    </v-dialog>
    <v-dialog v-model="orderFormDialog" max-width="800px">
      <order-form v-if="orderFormDialog" :order-id="selectedOrderId"/>
    </v-dialog>
  </div>
</template>

<script>
  import {baseFunctions} from "../../mixins/graphql/baseFunctions";
  import {allRequests, order, filteredOrders} from "../../grahpql/queries/order/order";
  import OrderSpecForm from "./spec/OrderSpecForm";
  import ProformaList from "../../views/proforma/ProformaList";
  import ProformaSpecForm from "../../views/proforma/ProformaSpecForm";
  import OrderForm from "./OrderForm";

  import SpecProformas from "../proforma/SpecProformas";

  export default {
    data() {
      return {
        name: "OrdersSummary",
        error: null,
        allRequests: {edges: []},
        order: null,
        assignDialog: false,
        proformaListDialog: false,
        proformaFormDialog: false,
        orderFormDialog: false,
        selectedOrderId: '',
        orderRowExpanded: [],
        specProformasDialog: false,
        expandedOrderId: '',
        selectedSpecId: null,
        filterForm: {
          customerName: null,
          number: null,
          no_proforma: null,
          count: null
        },
        ordersHeader: [
          {value: "number", text: "شماره"},
          {value: "customer", text: "مشتری"},
          {value: "date", text: "تاریخ"},
          {value: "totalKw", text: "کیلووات"},
          {value: "totalQty", text: "دستگاه"},
          {value: "owner", text: "کارشناس"},
          {value: "action", text: ""},
        ],
        orders: [
          {
            id: 1,
            number: 990041,
            customer: "شرکت زرین ذرت شاهرود",
            date: "1399-01-23",
            totalKw: 5.5,
            totalQty: 1,
            owner: "ظریف"
          },
          {
            id: 2,
            number: 990042,
            customer: "آرمان گسترنوین کنارک",
            date: "1399-01-23",
            totalKw: 75,
            totalQty: 1,
            owner: "علوی"
          },
          {
            id: 3,
            number: 990043,
            customer: "صنایع بسته بندی فرآورده های شیری پگاه",
            date: "1399-01-23",
            totalKw: 4028,
            totalQty: 32,
            owner: "علوی"
          },
          {
            id: 4,
            number: 990045,
            customer: "پویاموتور سپاهان",
            date: "1399-01-23",
            totalKw: 160,
            totalQty: 1,
            owner: "ظریف"
          },
        ],
        specHeaders: [
          {value: "qty", text: "تعداد"},
          {value: "kw", text: "کیلووات"},
          {value: "voltage", text: "ولتاژ"},
          {value: "rpm", text: "سرعت"},
        ],
        specs: [
          {qty: 5, kw: 132, voltage: 380, rpm: 1500},
          {qty: 2, kw: 160, voltage: 380, rpm: 1500},
          {qty: 3, kw: 75, voltage: 380, rpm: 1000},
          {qty: 1, kw: 90, voltage: 380, rpm: 300},
        ],
        specProformas: [
          {
            number: 981351,
            customer: "پتروشیمی پردیس",
            qty: 10,
            cost: 25600000,
            price: 27500000,
            percentage: 12,
            date: "1399-01-12"
          },
          {
            number: 985241,
            customer: "پتروشیمی مارون",
            qty: 5,
            cost: 25600000,
            price: 27700000,
            percentage: 12.5,
            date: "1399-01-13"
          },
          {
            number: 986548,
            customer: "پتروشیمی تخت جمشید",
            qty: 1,
            cost: 25600000,
            price: 28500000,
            percentage: 13,
            date: "1399-01-18"
          },
          {
            number: 982564,
            customer: "هوایار",
            qty: 3,
            cost: 25600000,
            price: 29800000,
            percentage: 15,
            date: "1399-01-20"
          },
          {
            number: 983548,
            customer: "پتروشیمی پردیس",
            qty: 9,
            cost: 25600000,
            price: 27500000,
            percentage: 16,
            date: "1399-01-23"
          },
        ]
      }
    }, // todo: show percentage with css or d3 progress bars.
    methods: {
      newOrder(){
        this.orderFormDialog = true;
        this.selectedOrderId = null;
      },
      getOrders(){
        if (typeof this.filteredOrders !== "undefined" && this.filteredOrders !== null){
          return this.noNode(this.filteredOrders)
        }
      },
      getOrderSpecs(){
        if (typeof this.order !== "undefined" && this.order !== null){
          return this.noNode(this.order.reqspecSet)
        }
      },
      orderExpanded(value) {
        this.error = null
        this.order = {
          reqspecSet: {edges: []}
        }
        if (this.orderRowExpanded.includes(value.item)) {
          this.expandedOrderId = '';
          this.orderRowExpanded.pop(value.item);
        } else {
          this.expandedOrderId = value.item.id;
          this.orderRowExpanded = [];
          this.orderRowExpanded.push(value.item);
        }
      },
      findProformas(spec) {
        this.selectedSpecId = spec.id;
        console.log('id: ', this.selectedSpecId);
        this.specProformasDialog = true;
      },
      editItem(item){
        this.selectedOrderId = item.id;
        this.orderFormDialog = true;
        console.log('fn', item)
      },
      deleteItem(item){
        this.selectedOrderId = item.id;
        console.log('fn', item)
      },
      assignSpecToOrder(item){
        this.selectedOrderId = item.id;
        this.assignDialog = true;
        console.log('fn', item)
      },
      listRelatedProformas(item){
        this.selectedOrderId = item.id;
        this.proformaListDialog = true;
        console.log('fn', item)
      },
      addProforma(item){
        this.selectedOrderId = item.id;
        this.proformaFormDialog = true;
        console.log('fn', item)
      },
    },
    components: {
      SpecProformas,
      OrderSpecForm,
      ProformaList,
      ProformaSpecForm,
      OrderForm
    },
    apollo: {
      allRequests: allRequests,
      order: {
        query: order,
        error(error){
          this.error = JSON.stringify(error.message)
        },
        variables() {
          return {
            order_id: this.expandedOrderId
          }
        }
      },
      filteredOrders: {
        query: filteredOrders,
        variables(){
          return {
            "count": this.filterForm.count !== "" ? this.filterForm.count : null,
            "number": this.filterForm.number !== "" ? this.filterForm.number : null,
            "customer_name": this.filterForm.customerName !== "" ? this.filterForm.customerName : null,
            "no_proforma": this.filterForm.no_proforma !== "" ? this.filterForm.no_proforma : null
          }
        }
      }
    },
    mixins: [
      baseFunctions
    ],
  }
</script>

<style scoped>

</style>
