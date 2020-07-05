<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="6">
          <v-text-field
            label="مشتری"
            v-model="orderFilterFormCom.customerName"></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-text-field
            v-model="orderFilterFormCom.number"
            label="شماره درخواست">
          </v-text-field>
        </v-col>
        <v-col cols="2">
          <v-checkbox
            v-model="orderFilterFormCom.no_proforma"
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
                :loading="loadingFilteredOrders"
                :headers="ordersHeader"
                :items="orders"
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
                      v-if="selectedOrderId"
                      :headers="specHeaders"
                      :items="orderSpecs"
                      :loading="$apollo.queries.order.loading"
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
  import {order} from "../../grahpql/queries/order/order";
  import OrderSpecForm from "./spec/OrderSpecForm";
  import ProformaList from "../../views/proforma/ProformaList";
  import OrderCreationHolderForm from "./OrderCreationHolderForm";
  import SpecProformas from "../proforma/SpecProformas";
  import {mapGetters, mapMutations, mapActions} from 'vuex'
  import {
    ACTION_DELETE_ORDER,
    ACTION_FILTER_ORDERS, MUTATE_ORDER_SPECS,
    FILTERED_ORDERS, LOADING_FILTERED_ORDERS, MUTATE_SELECTED_ORDER_ID, MUTATE_SPEC_FORM_IS_ACTIVE,
    ORDER_FILTER_FORM, SELECTED_ORDER_ID, LOADING_ORDER_SPECS
  } from "../../store/types/order";
  import debounce from 'debounce'

  export default {
    data() {
      return {
        name: "OrdersSummary",
        error: null,
        order: null,
        orderSpecs: [],
        assignDialog: false,
        proformaListDialog: false,
        proformaFormDialog: false,
        orderFormDialog: false,
        orderFormHolderDialog: false,
        // selectedOrderId: '',
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
    created() {
      this.updateFilteredOrders = debounce(this.updateFilteredOrders, 1000)
    },
    mounted() {
      this.updateFilteredOrders()
    },
    methods: {
      ...mapMutations([
        MUTATE_SELECTED_ORDER_ID,
        MUTATE_ORDER_SPECS
      ]),
      ...mapActions({
        deleteOrder: ACTION_DELETE_ORDER,
        updateFilteredOrders: ACTION_FILTER_ORDERS,
        // updateOrderSpecs: ACTION_ORDER_SPECS,
      }),
      newOrder(){
        this.orderFormHolderDialog = true;
        // this.selectedOrderId = null;
        this.$store.commit(MUTATE_SELECTED_ORDER_ID, null)
        this.$store.commit(MUTATE_SPEC_FORM_IS_ACTIVE, false)
        this.orderRowExpanded = [];
      },
      orderExpanded(value) {
        // this.orderSpecs = []
        this.error = null
        this.order = {
          reqspecSet: {edges: []}
        }
        if (this.orderRowExpanded.includes(value.item)) {
          console.log('to pop')
          // this.expandedOrderId = '';
          this.$store.commit(MUTATE_SELECTED_ORDER_ID, '')
          this.orderRowExpanded.pop(value.item);
        } else {
          // this.expandedOrderId = value.item.id;
          console.log('to add')
          this.orderRowExpanded = [];
          // this.$store.dispatch(MUTATE_SELECTED_ORDER_ID, value.item.id)
          this.$store.commit(MUTATE_SELECTED_ORDER_ID, value.item.id)
          // this.updateOrderSpecs(value.item.id)
          this.$apollo.queries.order.refetch()
          if (!this.orderSpecs.length){
            console.log('we should find specs.')
          }
          this.orderRowExpanded.push(value.item);
        }
      },
      findProformas(spec) {
        this.selectedSpecId = spec.id;
        this.specProformasDialog = true;
      },
      editItem(item){
        // this.selectedOrderId = item.id;
        this.$store.commit(MUTATE_SELECTED_ORDER_ID, item.id)
        this.orderFormHolderDialog = true;
        // this.orderFormDialog = true;
        this.orderRowExpanded = [];
        // this.updateOrderSpecs(item.id)
        this.$apollo.queries.order.refetch()
      },
      deleteItem(item){
        // this.selectedOrderId = item.id;
        this.$store.commit(MUTATE_SELECTED_ORDER_ID, item.id)
        let a = confirm("مورد تأیید است؟")
        if (a){
          this.deleteOrder(item.id)
        }
      },
      assignSpecToOrder(item){
        // this.selectedOrderId = item.id;
        this.$store.commit(MUTATE_SELECTED_ORDER_ID, item.id)
        this.$store.commit(MUTATE_ORDER_SPECS, [])
        // this.updateOrderSpecs(item.id)
        this.$apollo.queries.order.refetch()
        this.assignDialog = true;
      },
      listRelatedProformas(item){
        // this.selectedOrderId = item.id;
        this.$store.commit(MUTATE_SELECTED_ORDER_ID, item.id)
        this.proformaListDialog = true;
      },
      addProforma(item){
        // this.selectedOrderId = item.id;
        this.$store.commit(MUTATE_SELECTED_ORDER_ID, item.id)
        this.proformaFormDialog = true;
      },
      updateOrders(){
        this.$apollo.queries.filteredOrders.refetch()
      }
    },
    computed: {
      ...mapGetters({
        orderFilterFormCom: ORDER_FILTER_FORM,
        orders: FILTERED_ORDERS,
        loadingFilteredOrders: LOADING_FILTERED_ORDERS,
        selectedOrderId: SELECTED_ORDER_ID,
        // orderSpecs: ORDER_SPECS,
        loadingOrderSpecs: LOADING_ORDER_SPECS,
      })
    },
    components: {
      SpecProformas,
      OrderSpecForm,
      ProformaList,
      OrderCreationHolderForm
    },
    watch: {
      orderFilterFormCom: {
       handler(){
         this.updateFilteredOrders()
       },
        deep: true,
      }
    },
    apollo: {
      order: {
        query: order,
        error(error){
          this.error = JSON.stringify(error.message)
        },
        variables() {
          return {
            order_id: this.selectedOrderId
          }
        },
        skip(){
          return !this.selectedOrderId;
        },
        result(result){
          if (typeof result.data.order !== "undefined"){
            this.orderSpecs = this.noNode(result.data.order.reqspecSet)
          }else {
            this.orderSpecs = []
          }
        },
      },
    },
    mixins: [
      baseFunctions
    ],
  }
</script>

<style scoped>

</style>
