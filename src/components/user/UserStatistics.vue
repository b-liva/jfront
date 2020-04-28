<template>
  <div>
    <v-container>
      <v-row justify="center" row>
        <v-col cols="12" md="5">
          <v-card>
            <v-card-title>
              وضعیت درخواست های ورودی
            </v-card-title>
            <v-card-text>
              <v-data-table
                height="200px"
                :loading="$apollo.queries.userStats.loading"
              :items="noNode(userStats)"
              :headers="exStatusHeaders">
                <template v-slot:item.percentEntered="{item}">
                  {{item.percentEntered.toFixed(1)}}%
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="6">
          <v-card>
            <v-card-title>
              بدون پیش فاکتور
            </v-card-title>
            <v-card-text>
              <v-data-table
                dense
                height="200px"
                :loading="$apollo.queries.ordersNoProforma.loading"
              :items="noNode(ordersNoProforma)"
              :headers="ordersNoProformaHeader">
                <template v-slot:item.customer="{item}">
                  {{item.customer.name}}
                </template>
                <template v-slot:item.owner="{item}">
                  {{item.owner.lastName}}
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-row class="my-10" justify="center">
        <v-col cols="12" md="10">
            <v-card>
              <v-card-title>
                درخواست های وارد نشده
              </v-card-title>
              <v-card-text>
                <v-data-table
                  dense
                  :loading="$apollo.queries.automationOrders.loading"
                  :items="automationOrders"
                  :headers="reqNotEnteredHeaders">
                </v-data-table>
              </v-card-text>
            </v-card>

          </v-col>
      </v-row>
    </v-container>

  </div>
</template>

<script>
  import {baseFunctions} from "../../mixins/graphql/baseFunctions";
  import {automationOrders} from "../../grahpql/queries/dashboard/dashboard";
  import {ordersNoProforma} from "../../grahpql/queries/order/order";
  import {userStats} from "../../grahpql/queries/user/user";

  export default {
    data(){
      return {
        name: "Personal",
        userStats: {edges: []},
        automationOrders: [],
        ordersNoProforma: {edges: []},
        exStatusHeaders: [
          {value: "lastName", text: "کارشناس"},
          {value: "orderNotEnteredCount", text: "مانده"},
          {value: "orderEnteredCount", text: "وارد شده"},
          {value: "percentEntered", text: "درصد وارد شده"},
          {value: "orderNoProformaCount", text: "بدون پیش فاکتور"},
        ],
        exStatus: [ // todo: send this to computed
          {id: 1, lastName: 'ظریف', orderNotEnteredCount: 11, orderEnteredCount: 1193, percentEntered: 52, orderNoProformaCount: 78},
          {id: 1, lastName: 'علوی', orderNotEnteredCount: 26, orderEnteredCount: 542, percentEntered: 23, orderNoProformaCount: 97},
          {id: 1, lastName: 'فروغی', orderNotEnteredCount: 3, orderEnteredCount: 77, percentEntered: 3, orderNoProformaCount: 4},
        ],
        reqNoProformaHeaders: [
          {value: "number", text: "شماره"},
          {value: "customerName", text: "مشتری"},
          {value: "reqDate", text: "تاریخ"},
        ],
        ordersNoProformaHeader: [
          {value: "number", text: "شماره"},
          {value: "customer", text: "مشتری"},
          {value: "reqDate", text: "تاریخ"},
          {value: "owner", text: "کارشناس"},
        ],
        reqNoProforma: [
          {number: 990041, customerName: "شرکت مهندسی پیشگامان رفیع ایرانیان(مپرا)", reqDate: "1399-01-23"},
          {number: 990043, customerName: "صنایع بسته بندی فرآورده های شیری پگاه", reqDate: "1399-01-23"},
          {number: 990052, customerName: "نوین سازه", reqDate: "1399-01-18"},
          {number: 990034, customerName: "صنایع مس سرچشمه ایران", reqDate: "1399-01-23"},
          {number: 990029, customerName: "سایبر صنعت", reqDate: "1398-12-19"},
          {number: 990015, customerName: "توسعه آهن و فولاد گل گهر", reqDate: "1399-01-23"},
        ],
        reqNotEnteredHeaders: [
          {value: "numberAutomation", text: "شماره"},
          {value: "dateTxt", text: "تاریخ"},
          {value: "customer", text: "مشتری"},
          {value: "title", text: "عنوان"},
          {value: "ownerText", text: "کارشناس"},
        ],
        reqNotEntered: [
          {numberAutomation: 980560, dateTxt: "98/03/05", customer: "صنایع برق و الکترونیک", title: "درخواست اظهار نظر در خصوص ساخت الکتروموتور 15 کیلووات - 720 دور -IP55 ( طبق مشخصات پیوست ) ", ownerText: "ظریف"},
          {numberAutomation: 980609, dateTxt: "98/03/11", customer: "شیمبار", title: "درخواست 4 دستگاه الکتروموتور 90 کیلووات - 1500 دور ", ownerText: "ظریف"},
          {numberAutomation: 981032, dateTxt: "98/04/16", customer: "پویندان", title: "مناقصه 100 عدد الکتروموتور 1 کیلووات - 720 دور - 380 ولت ", ownerText: "علوی"},
          {numberAutomation: 980560, dateTxt: "98/03/05", customer: "صنایع", title: "درخواست ", ownerText: "ظریف"},
          {numberAutomation: 980560, dateTxt: "98/03/05", customer: "صنایع", title: "درخواست ", ownerText: "ظریف"},
          {numberAutomation: 980560, dateTxt: "98/03/05", customer: "صنایع", title: "درخواست ", ownerText: "ظریف"},
          {numberAutomation: 980560, dateTxt: "98/03/05", customer: "صنایع", title: "درخواست ", ownerText: "ظریف"},
        ]
      }
    },
    computed:{

    },
    methods: {
      clicked(){
        console.log(this.ordersNoProforma);
        console.log(this.$apollo.queries.ordersNoProforma)
      },
    },
    apollo: {
      automationOrders: automationOrders,
      ordersNoProforma: ordersNoProforma,
      userStats: userStats,
    },
    mixins: [
      baseFunctions
    ]
  }
</script>

<style scoped>

</style>
