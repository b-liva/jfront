<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="6" md="4">
          <customer-card :customer-id="1"/>
        </v-col>
        <v-col cols="6" md="4">
          <profit-card :sale="permit.sale" :expense="permit.expense"/>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-data-table
            dense
          :items="specs"
          :headers="specHeaders">
            <template v-slot:item.profit="{item}">
              {{profit(item.price, item.expense)}}
            </template>
            <template v-slot:item.profitPercent="{item}">
              {{profitPercent(item.price, item.expense)}}
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
  import {financialFunctions} from "../../mixins/financialFunctions";
  import CustomerCard from "../../components/customer/CustomerCard";
  import ProfitCard from "../../components/cards/ProfitCard";

  export default {
    data(){
      return {
        name: "PermitDetails",
        permit: '',
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
          {value: 'price', text: 'فروش'},
          {value: 'expense', text: 'تمام شده'},
          {value: 'profit', text: 'سود'},
          {value: 'profitPercent', text: 'درصد'},
        ],
        specs: [
          {qty: 5, kw: 132, voltage: 380, rpm: 1500, price: 45500000, expense: 98540000},
          {qty: 2, kw: 160, voltage: 380, rpm: 1500, price: 49800000, expense: 45540000},
          {qty: 3, kw: 75, voltage: 380, rpm: 1000, price: 58500000, expense: 65140000},
          {qty: 1, kw: 90, voltage: 380, rpm: 3000, price: 987500000, expense: 15840000},
        ],
      }
    },
    mixins: [financialFunctions],
    created() {
      this.permit = {
        id: this.$route.params.id,
        number: this.$route.params.number,
        date: "1399-01-10",
        sale: 69851000,
        expense: 15610000,
        proformaNumber: 9810254,
        orderNumber: 981500,
      }
    },
    components: {
      CustomerCard,
      ProfitCard
    }
  }
</script>

<style scoped>

</style>
