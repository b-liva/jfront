<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="12" md="10">
          <v-card>
            <v-card-title>درخواست</v-card-title>
            <v-card-text>
              <v-data-table
                :loading="$apollo.queries.allRequests.loading"
                :headers="ordersHeader"
                :items="noNode(allRequests)"
                :expanded="orderRowExpanded"
                show-expand
                single-expand
                @item-expanded="orderExpanded"
              >
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
  </div>
</template>

<script>
  import {baseFunctions} from "../../mixins/graphql/baseFunctions";
  import {allRequests, order} from "../../grahpql/queries/order/order";

  import SpecProformas from "../proforma/SpecProformas";

  export default {
    data() {
      return {
        name: "OrdersSummary",
        error: null,
        allRequests: {edges: []},
        order: null,
        orderRowExpanded: [],
        specProformasDialog: false,
        expandedOrderId: '',
        selectedSpecId: null,
        ordersHeader: [
          {value: "number", text: "شماره"},
          {value: "customer", text: "مشتری"},
          {value: "date", text: "تاریخ"},
          {value: "totalKw", text: "کیلووات"},
          {value: "totalQty", text: "دستگاه"},
          {value: "owner", text: "کارشناس"},
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
        console.log('id: ', this.selectedSpecId)
        this.specProformasDialog = true;
      }
    },
    components: {
      SpecProformas,
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
    },
    mixins: [
      baseFunctions
    ],
  }
</script>

<style scoped>

</style>
