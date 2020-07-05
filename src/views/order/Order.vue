<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="6">
          <v-text-field
            label="مشتری"
            v-model="orderFilterForm.customerName"></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-text-field
            v-model="orderFilterForm.number"
            label="شماره درخواست">
          </v-text-field>
        </v-col>
        <v-col cols="2">
          <v-checkbox
            v-model="orderFilterForm.no_proforma"
            label="بدون پیش فاکتور"></v-checkbox>
        </v-col>
      </v-row>
    </v-container>
    <v-snackbar
      v-model="snackbar"
      :timeout=3000
      top
      color="success">
      سفارش با موفقیت ثبت شد.
    </v-snackbar>
    <v-data-table
      :headers="headers"
      :items="orders"
      :expanded="expanded"
      :loading="loadingFilteredOrders"
      class="elevation-1"
      show-expand
      single-expand
      @item-expanded="orderClicked"
    >
      <template v-slot:top>
        <v-toolbar>
          <v-toolbar-title>سفارش</v-toolbar-title>
          <v-divider
            vertical
            inset
            class="mx-4"></v-divider>
          <v-spacer></v-spacer>
          <v-dialog v-model="orderDialog" max-width="800px">
            <template v-slot:activator="{ on }">
              <v-btn color="primary" dark v-on="on">سفارش جدید</v-btn>
            </template>
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
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.customer="{item}">
        <router-link :to="{name: 'CustomerDetails', params:{id: item.customer.id, name: item.customer.name}}">
          {{item.customer.name}}
        </router-link>
      </template>
      <template v-slot:item.owner="{item}">
        {{item.owner.lastName}}
      </template>
      <template v-slot:item.number="{item}">
        <router-link :to="{name: 'OrderDetails', params: {id: item.id, number: item.number}}">
          {{item.number}}
        </router-link>
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
          :items="getSpecs()"
          :headers="specHeaders"
          :loading="loadingFilteredOrders"
          >
            <template v-slot:no-data>
              {{error}}
            </template>
          </v-data-table>
        </td>
      </template>
    </v-data-table>
    <v-dialog v-model="assignDialog" fullscreen hide-overlay>
      <order-spec-form v-if="assignDialog" :order-id="selectedOrderId" v-on:closeAssignDialog="assignDialog = false"/>
    </v-dialog>
    <v-dialog v-model="proformaListDialog">
      <proforma-list v-if="proformaListDialog" :order_id="selectedOrderId"/>
    </v-dialog>
    <v-dialog persistent v-model="proformaFormDialog">
      <proforma-creation-holder-form v-if="proformaFormDialog" :order-id="selectedOrderId" v-on:close-event="proformaFormDialog = false"/>
    </v-dialog>
  </div>
</template>

<script>
  import {baseFunctions} from "../../mixins/graphql/baseFunctions";
  import VuePersianDatetimePicker from 'vue-persian-datetime-picker'
  import ProformaList from "../proforma/ProformaList";
  import ProformaCreationHolderForm from "../../components/proforma/ProformaCreationHolderForm";
  import OrderSpecForm from "../../components/order/spec/OrderSpecForm";
  // import {allRequests} from "../../grahpql/queries/order/order";
  // import {order} from "../../grahpql/queries/order/order";
  import {mapGetters, mapActions} from 'vuex'
  import {ACTION_FILTER_ORDERS, FILTERED_ORDERS, LOADING_FILTERED_ORDERS, ORDER_FILTER_FORM} from "../../store/types/order";
  import debounce from "debounce";

  export default {
    data() {
      return {
        name: "Order",
        error: null,
        selectedOrderId: null,
        filterForm: {
          customerName: null,
          number: null,
          no_proforma: null,
          count: null
        },
        defaultItems: {
          owner: '',
          customer: {
            id: '',
            name: '',
          },
          number: '',
          date: '',
          summary: ''
        },
        order_form: {
          owner: '',
          customer: {
            id: '',
            name: '',
          },
          amount: '',
          date: '',
          summary: ''
        },
        defaultAssign: {
          orderId: '',
          qty: '',
          kw: '',
          rpm: '',
          voltage: '',
          date: '',
          summary: '',
          IPID: 1,
          ICID: 1,
          IMID: 1,
        },
        assignForm: {
          orderId: '',
          qty: '',
          kw: '',
          rpm: '',
          voltage: '',
          date: '',
          summary: '',
          IPID: '',
          ICID: 1,
          IMID: 1,
        },
        orderDialog: false,
        proformaFormDialog: false,
        proformaListDialog: false,
        assignDialog: false,
        snackbar: false,
        headers: [
          {text: 'مشتری', value: 'customer'},
          {text: 'کارشناس', value: 'owner'},
          {text: 'شماره', value: 'number'},
          {text: 'تایخ', value: 'date'},
          {text: '', value: 'action'},
        ],
        specHeaders: [
          {value: 'qty', text: 'دستگاه'},
          {value: 'kw', text: 'کیلووات'},
          {value: 'rpm', text: 'سرعت'},
          {value: 'voltage', text: 'ولتاژ'},
          {value: 'action', text: ''},
        ],
        expanded: [],
        relatedProformas: [],
      }
    },
    created() {
      this.updateFilteredOrders = debounce(this.updateFilteredOrders, 1000)
    },
    mounted() {
      this.updateFilteredOrders()
    },
    methods: {
      ...mapActions({
        updateFilteredOrders: ACTION_FILTER_ORDERS
      }),
      getSpecs(){
        if (typeof this.order !== "undefined" && this.order !== null){
          return this.noNode(this.order.reqspecSet)
        }
      },
      clear() {
        this.order_form = Object.assign({}, this.defaultItems);
      },
      cancel() {
        this.clear()
        this.orderDialog = false
      },
      submit() {
        this.close()
      },
      close() {
        this.snackbar = true;
        this.orderDialog = false;
        this.clear()
      },
      editItem(item) {
        this.order_form = Object.assign({}, item);
        this.orderDialog = true;
      },
      deleteItem(item) {
        const index = this.orders.indexOf(item);
        confirm('از حذف این ردیف اطمینان دارید؟') && this.orders.splice(index, 1)
      },
      assignSpecToOrder(order) {
        this.selectedOrderId = order.id;
        this.assignDialog = true;
      },
      orderClicked(value) {
        this.selectedOrderId = value.item.id;
        if (this.expanded.includes(value.item)) {
          this.expanded.pop(value.item)
        } else {
          this.expanded = []
          this.expanded.push(value.item)
        }
      },
      listRelatedProformas(order) {
        this.selectedOrderId = order.id;
        this.proformaListDialog = true;
      },
      addProforma(order) {
        this.proformaFormDialog = true;
        this.selectedOrderId = order.id;
      }
    },
    computed: {
      ...mapGetters({
        orderFilterForm: ORDER_FILTER_FORM,
        orders: FILTERED_ORDERS,
        loadingFilteredOrders: LOADING_FILTERED_ORDERS
      }),
    },
    mixins: [
      baseFunctions
    ],
    components: {
      PersianDatePicker: VuePersianDatetimePicker,
      ProformaList: ProformaList,
      ProformaCreationHolderForm,
      OrderSpecForm
    },
    watch: {
      orderFilterForm: {
        handler(){
          this.updateFilteredOrders()
        },
        deep: true,
      }
    },
    apollo: {
      // allRequests: allRequests,
      // order: {
      //   query: order,
      //   error(error){
      //     this.error = JSON.stringify(error.message)
      //   },
      //   variables(){
      //     return {
      //       order_id: this.selectedOrderId
      //     }
      //   }
      // },
    }
  }
</script>

<style scoped lang="scss">
</style>
