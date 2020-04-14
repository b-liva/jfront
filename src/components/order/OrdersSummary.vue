<template>
  <div>
    <v-container>
      <v-layout justify-space-around row>
        <v-flex xs12 md10>
          <v-card>
            <v-card-title>درخواست</v-card-title>
            <v-card-text>
              <v-data-table
              :headers="ordersHeader"
              :items="orders"
              :expanded="orderRowExpanded"
              show-expand
              single-expand
              @item-expanded="orderExpanded">
                <template v-slot:expanded-item="{headers}">
                  <td :colspan="headers.length">
                    <v-data-table
                      :headers="specHeaders"
                      :items="specs"
                    @click:row="findProformas">
                    </v-data-table>
                  </td>
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
    <v-dialog v-model="specProformasDialog" width="900px">
      <spec-proformas :specProformas="specProformas"/>
    </v-dialog>
  </div>
</template>

<script>
  import SpecProformas from "../proforma/SpecProformas";

  export default {
    data(){
      return {
        name: "OrdersSummary",
        orderRowExpanded: [],
        specProformasDialog: false,
        ordersHeader: [
          {value: "number", text: "شماره"},
          {value: "customerName", text: "مشتری"},
          {value: "date", text: "تاریخ"},
          {value: "totalKw", text: "کیلووات"},
          {value: "totalQty", text: "دستگاه"},
          {value: "expert", text: "کارشناس"},
        ],
        orders: [
          {id: 1, number: 990041, customerName: "شرکت زرین ذرت شاهرود", date: "1399-01-23", totalKw: 5.5, totalQty: 1, expert: "ظریف"},
          {id: 2, number: 990042, customerName: "آرمان گسترنوین کنارک", date: "1399-01-23", totalKw: 75, totalQty: 1, expert: "علوی"},
          {id: 3, number: 990043, customerName: "صنایع بسته بندی فرآورده های شیری پگاه", date: "1399-01-23", totalKw: 4028, totalQty: 32, expert: "علوی"},
          {id: 4, number: 990045, customerName: "پویاموتور سپاهان", date: "1399-01-23", totalKw: 160, totalQty: 1, expert: "ظریف"},
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
          {number: 981351, customer: "پتروشیمی پردیس", qty: 10, cost: 25600000, price: 27500000, percentage: 12, date: "1399-01-12"},
          {number: 985241, customer: "پتروشیمی مارون", qty: 5, cost: 25600000, price: 27700000, percentage: 12.5, date: "1399-01-13"},
          {number: 986548, customer: "پتروشیمی تخت جمشید", qty: 1, cost: 25600000, price: 28500000, percentage: 13, date: "1399-01-18"},
          {number: 982564, customer: "هوایار", qty: 3, cost: 25600000, price: 29800000, percentage: 15, date: "1399-01-20"},
          {number: 983548, customer: "پتروشیمی پردیس", qty: 9, cost: 25600000, price: 27500000, percentage: 16, date: "1399-01-23"},
        ]
      }
    }, // todo: show percentage with css or d3 progress bars.
    methods: {
      orderExpanded(value){
        console.log(value.item, this.orderRowExpanded)
        if(this.orderRowExpanded.includes(value.item)){
          console.log('is expanded')
          this.orderRowExpanded.pop(value.item);
        }else {
          console.log('is not expanded')
          this.orderRowExpanded = [];
          this.orderRowExpanded.push(value.item);
        }
      },
      findProformas(spec){
        console.log(spec)
        this.specProformasDialog = true;
      }
    },
    components: {
      SpecProformas
    }
  }
</script>

<style scoped>

</style>
