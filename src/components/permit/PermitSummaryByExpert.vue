<template>
  <div>
    <v-card class="my-5">
      <v-card-title>مجوز به تفکیک کارشناس</v-card-title>
      <v-card-text>
        <v-data-table
          :items="permitsByExperts"
          :headers="permitsByExpertHeaders"
          :expanded="ownerExpanded"
          show-expand
          @item-expanded="ownerRowExpanded">
          <template v-slot:expanded-item="{headers}">
            <td :colspan="headers.length">
              <v-data-table
                dense
                :items="permitsOfExperts"
                :headers="permitsOfExpertHeaders">
              </v-data-table>
            </td>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
    <permit-summary-by-order-type/>
  </div>
</template>

<script>
  import PermitSummaryByOrderType from "./PermitSummaryByOrderType";

  export default {
    data(){
      return {
        name: "PermitSummaryByExpert",
        ownerExpanded: [],
        permitsByExpertHeaders: [
          {value: "name", text: "نام"},
          {value: "count", text: "تعداد مجوز"},
          {value: "totalQty", text: "دستگاه"},
          {value: "totalKw", text: "کیلووات"},
          {value: "amount", text: "مبلغ"},
          {value: "received", text: "دریافت شده"},
          {value: "remaining", text: "مانده"},
        ],
        permitsByExperts: [
          {id: 1, name: "ظریف", count: 23, totalQty: 453, totalKw: "36,723", amount: "189,543,114,210", received: "2,633,600,080", remaining: "186,909,514,130"},
          {id: 2, name: "علوی", count: 3, totalQty: 8, totalKw: "936", amount: "15,556,480,000", received: "621,000,000", remaining: "14,935,480,000"},
          {id: 3, name: "فروغی", count: 3, totalQty: 6, totalKw: "3,810", amount: "17,905,430,000", received: "9,331,090,000", remaining: "8,574,340,000"},
        ],
        permitsOfExpertHeaders: [
          {value: "number", text: "شماره"},
          {value: "customerName", text: "مشتری"},
          {value: "permitAmount", text: "مبلغ"},
          {value: "received", text: "دریافت شده"},
          {value: "remaining", text: "مانده"},
        ],
        permitsOfExperts: [
          {number: 9820914, customerName: "زغال سنگ پرورده طبس", permitAmount: "356,430,000", received: "356,430,000", remaining: "0"},
          {number: 9820927, customerName: "تامین و انتقال آب خلیج فارس", permitAmount: "15,587,000,000", received: "7,150,000,000", remaining: "8,437,000,000"},
        ]
      }
    },
    methods: {
      ownerRowExpanded(value){
        if(this.ownerExpanded.includes(value.item)){
          this.ownerExpanded.pop(value.item);
        }else {
          this.ownerExpanded = [];
          this.ownerExpanded.push(value.item);
        }
      },
    },
    components: {
      PermitSummaryByOrderType
    }
  }
</script>

<style scoped>

</style>
