<template>
  <div>
    <v-container>
      <v-layout justify-space-around row>
        <v-flex xs12 md10>
          <v-card>
            <v-card-title>پیش فاکتور</v-card-title>
            <v-card-text>
              <v-data-table
                :headers="proformasHeader"
                :items="proformas"
                :expanded="proformaRowExpanded"
                show-expand
                single-expand
                @item-expanded="proformaExpanded">
                <template v-slot:item.proformaNumber="{item}">
                  <router-link :to="{name: 'Proforma', params: {id: item.id, number: item.proformaNumber}}">
                    {{item.proformaNumber}}
                  </router-link>
                </template>
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
  import SpecProformas from "./SpecProformas";

  export default {
    data(){
      return {
        name: "ProformaSummary",
        proformaRowExpanded: [],
        specProformasDialog: false,
        proformasHeader: [
          {value: "proformaNumber", text: "پیش فاکتور"},
          {value: "customerName", text: "مشتری"},
          {value: "date", text: "تاریخ"},
          {value: "expert", text: "کارشناس"},
        ],
        proformas: [
          {id: 1, proformaNumber: 980025, customerName: "شرکت زرین ذرت شاهرود", date: "1399-01-23", expert: "ظریف"},
          {id: 2, proformaNumber: 980026, customerName: "آرمان گسترنوین کنارک", date: "1399-01-23", expert: "علوی"},
          {id: 3, proformaNumber: 980027, customerName: "صنایع بسته بندی فرآورده های شیری پگاه", date: "1399-01-23", expert: "علوی"},
          {id: 4, proformaNumber: 980060, customerName: "پویاموتور سپاهان", date: "1399-01-23", expert: "ظریف"},
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
        specProformas: [
          {number: 981351, customer: "پتروشیمی پردیس", qty: 10, cost: 25600000, price: 27500000, percentage: 12, date: "1399-01-12"},
          {number: 985241, customer: "پتروشیمی مارون", qty: 5, cost: 25600000, price: 27700000, percentage: 12.5, date: "1399-01-13"},
          {number: 986548, customer: "پتروشیمی تخت جمشید", qty: 1, cost: 25600000, price: 28500000, percentage: 13, date: "1399-01-18"},
          {number: 982564, customer: "هوایار", qty: 3, cost: 25600000, price: 29800000, percentage: 15, date: "1399-01-20"},
          {number: 983548, customer: "پتروشیمی پردیس", qty: 9, cost: 25600000, price: 27500000, percentage: 16, date: "1399-01-23"},
        ]
      }
    },
    methods: {
      proformaExpanded(value){
        console.log(value.item, this.proformaRowExpanded)
        if(this.proformaRowExpanded.includes(value.item)){
          this.proformaRowExpanded.pop(value.item);
        }else {
          this.proformaRowExpanded = [];
          this.proformaRowExpanded.push(value.item);
        }
      },
      findProformas(spec){
        console.log(spec)
        this.specProformasDialog = true;
      },
    },
    components: {
      SpecProformas
    },

  }
</script>

<style scoped>

</style>
