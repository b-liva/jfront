<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-card>
            <v-card-title>مجوز</v-card-title>
            <v-card-text>
              <v-data-table
                :headers="permitHeaders"
                :items="permits"
                :expanded="permitRowExpanded"
                show-expand
                single-expand
                @item-expanded="permitExpanded">
                <template v-slot:item.permitNumber="{item}">
                  <router-link :to="{name: 'Permit', params: {id: item.id, number: item.permitNumber}}">
                    {{item.permitNumber}}
                  </router-link>
                </template>
                <template v-slot:expanded-item="{headers}">
                  <td :colspan="headers.length">
                    <v-data-table
                      :headers="specHeaders"
                      :items="specs"
                      @click:row="findPermits">
                    </v-data-table>
                  </td>
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <v-dialog v-model="specPermitDialog" width="900px">
      <spec-proformas :specProformas="specPermits" :config="{type: 'مجوز'}"/>
    </v-dialog>
  </div>
</template>

<script>
  import SpecProformas from "../proforma/SpecProformas";

  export default {
    data(){
      return {
        name: "DashboardPermits",
        specPermitDialog: false,
        permitRowExpanded: [],
        permitHeaders: [
          {value: "permitNumber", text: "مجوز"},
          {value: "proformaNumber", text: "پیش فاکتور"},
          {value: "number", text: "درخواست"},
          {value: "customerName", text: "مشتری"},
          {value: "date", text: "تاریخ"},
          {value: "expert", text: "کارشناس"},
        ],
        permits: [
          {id: 1, permitNumber: 12, proformaNumber: 980025, number: 990041, customerName: "شرکت زرین ذرت شاهرود", date: "1399-01-23", expert: "ظریف"},
          {id: 2, permitNumber: 13, proformaNumber: 980026, number: 990042, customerName: "آرمان گسترنوین کنارک", date: "1399-01-23", expert: "علوی"},
          {id: 3, permitNumber: 14, proformaNumber: 980027, number: 990043, customerName: "صنایع بسته بندی فرآورده های شیری پگاه", date: "1399-01-23", expert: "علوی"},
          {id: 4, permitNumber: 18, proformaNumber: 980060, number: 990045, customerName: "پویاموتور سپاهان", date: "1399-01-23", expert: "ظریف"},
        ],
        specHeaders: [
          {value: "qty", text: "تعداد"},
          {value: "kw", text: "کیلووات"},
          {value: "voltage", text: "ولتاژ"},
          {value: "rpm", text: "سرعت"},
          {value: "price", text: "قیمت واحد"},
        ],
        specs: [
          {qty: 5, kw: 132, voltage: 380, rpm: 1500, price: 45500000},
          {qty: 2, kw: 160, voltage: 380, rpm: 1500, price: 49800000},
          {qty: 3, kw: 75, voltage: 380, rpm: 1000, price: 58500000},
          {qty: 1, kw: 90, voltage: 380, rpm: 3000, price: 987500000},
        ],
        specPermits: [
          {number: 45, customer: "پتروشیمی پردیس", qty: 10, cost: 25600000, price: 27500000, percentage: 12, date: "1399-01-12"},
          {number: 35, customer: "پتروشیمی مارون", qty: 5, cost: 25600000, price: 27700000, percentage: 12.5, date: "1399-01-13"},
          {number: 153, customer: "پتروشیمی تخت جمشید", qty: 1, cost: 25600000, price: 28500000, percentage: 13, date: "1399-01-18"},
          {number: 1352, customer: "هوایار", qty: 3, cost: 25600000, price: 29800000, percentage: 15, date: "1399-01-20"},
          {number: 51, customer: "پتروشیمی پردیس", qty: 9, cost: 25600000, price: 27500000, percentage: 16, date: "1399-01-23"},
        ]
      }
    },
    methods: {
      permitExpanded(value){
        if(this.permitRowExpanded.includes(value.item)){
          this.permitRowExpanded.pop(value.item);
        }else {
          this.permitRowExpanded = [];
          this.permitRowExpanded.push(value.item);
        }
      },
      findPermits(spec){
        console.log(spec)
        this.specPermitDialog = true;
      }
    },
    components: {
      SpecProformas,
    }
  }
</script>

<style scoped>

</style>
