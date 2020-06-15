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
            label="شماره درخواست">
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
            <v-card-text>
              <v-data-table
                :loading="$apollo.queries.filteredOrders.loading"
                :headers="ordersHeader"
                :items="this.orders"
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
                  <router-link :to="{name: 'OrderDetails', params: {id: item.id, number: item.number}}">
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
                      :items="orderSpecs"
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
    <v-dialog v-model="orderFormHolderDialog" max-width="1000px" persistent>
      <order-creation-holder-form
        v-if="orderFormHolderDialog"
        :order-id="selectedOrderId"
        v-on:updateOrders="updateOrders"
        v-on:closeOrderFormHolder="orderFormHolderDialog = false"
      />
    </v-dialog>
  </div>
</template>

<script>
  import {baseFunctions} from "../../mixins/graphql/baseFunctions";
  import {order, filteredOrders} from "../../grahpql/queries/order/order";
  import {deleteOrder} from "../../grahpql/queries/order/mutation/deletion";
  import OrderSpecForm from "./spec/OrderSpecForm";
  import ProformaList from "../../views/proforma/ProformaList";
  import OrderCreationHolderForm from "./OrderCreationHolderForm";

  import SpecProformas from "../proforma/SpecProformas";

  export default {
    data() {
      return {
        name: "OrdersSummary",
        error: null,
        order: null,
        orders: [],
        orderSpecs: [],
        assignDialog: false,
        proformaListDialog: false,
        proformaFormDialog: false,
        orderFormDialog: false,
        orderFormHolderDialog: false,
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
        specHeaders: [
          {value: "qty", text: "تعداد"},
          {value: "kw", text: "کیلووات"},
          {value: "voltage", text: "ولتاژ"},
          {value: "rpm", text: "سرعت"},
        ],
      }
    }, // todo: show percentage with css or d3 progress bars.
    methods: {
      newOrder(){
        this.orderFormHolderDialog = true;
        this.selectedOrderId = null;
      },
      orderExpanded(value) {
        this.orderSpecs = []
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
        this.specProformasDialog = true;
      },
      editItem(item){
        this.selectedOrderId = item.id;
        this.orderFormHolderDialog = true;
        // this.orderFormDialog = true;
      },
      deleteItem(item){
        this.selectedOrderId = item.id;
        let a = confirm("مورد تأیید است؟")
        if (a){
          this.$apollo.mutate({
            mutation: deleteOrder,
            variables: {
              "order_id": item.id
            }
          }).then(() => {
            this.$apollo.queries.filteredOrders.refetch()
          }, error => {
            console.error(error)
          })
        }
      },
      assignSpecToOrder(item){
        this.selectedOrderId = item.id;
        this.assignDialog = true;
      },
      listRelatedProformas(item){
        this.selectedOrderId = item.id;
        this.proformaListDialog = true;
      },
      addProforma(item){
        this.selectedOrderId = item.id;
        this.proformaFormDialog = true;
      },
      updateOrders(){
        this.$apollo.queries.filteredOrders.refetch()
      }
    },
    components: {
      SpecProformas,
      OrderSpecForm,
      ProformaList,
      OrderCreationHolderForm
    },
    apollo: {
      order: {
        query: order,
        error(error){
          this.error = JSON.stringify(error.message)
        },
        variables() {
          return {
            order_id: this.expandedOrderId
          }
        },
        skip(){
          return !this.expandedOrderId;
        },
        result(result){
          if (typeof result.data.order !== "undefined"){
            this.orderSpecs = this.noNode(result.data.order.reqspecSet)
          }else {
            this.orderSpecs = []
          }
        },
      },
      filteredOrders: {
        query: filteredOrders,
        debounce: 1000,
        variables(){
          return {
            "count": this.filterForm.count !== "" ? this.filterForm.count : null,
            "number": this.filterForm.number !== "" ? this.filterForm.number : null,
            "customer_name": this.filterForm.customerName !== "" ? this.filterForm.customerName : null,
            "no_proforma": this.filterForm.no_proforma !== "" ? this.filterForm.no_proforma : null
          }
        },
        result(result){
          this.orders = this.noNode(result.data.filteredOrders)
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
