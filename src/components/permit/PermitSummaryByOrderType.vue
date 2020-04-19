<template>
  <div>
    <v-card>
      <v-card-title>مجوز به تفکیک نوع پروژه</v-card-title>
      <v-card-text>
        <v-data-table
          dense
          :items="permitsByOrderType"
          :headers="permitsByOrderTypeHeader">
        </v-data-table>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        name: "PermitSummaryByOrderType",
        permitsByOrderTypeHeader: [
          {value: "type", text: "نوع پروژه"},
          {value: "totalQty", text: "دستگاه"},
          {value: "totalKw", text: "کیلووات"},
          {value: "totalAmount", text: "قیمت"},
          {value: "percentOfSale", text: "درصد از فروش"},
          {value: "pricePerKw", text: "قیمت هر کیلووات"},
        ],
        permitsByOrderType: [
          {
            type: "روتین",
            totalQty: "452",
            totalKw: "36,303",
            totalAmount: '184,300,214,210',
            percentOfSale: "82.64",
            pricePerKw: "5,076,791"
          },
          {
            type: "پروژه",
            totalQty: "3",
            totalKw: "3,435",
            totalAmount: '24,770,250,000',
            percentOfSale: "11.2",
            pricePerKw: "7,211,135"
          },
          {
            type: "تعمیرات",
            totalQty: "5",
            totalKw: "1,110",
            totalAmount: '2,318,430,000',
            percentOfSale: "1.5",
            pricePerKw: "2,088,676"
          },
          {
            type: "ضد انفجار",
            totalQty: "7",
            totalKw: "621",
            totalAmount: '11,616,130,000',
            percentOfSale: "5.21",
            pricePerKw: "18,705,523"
          },
          {
            type: "جمع",
            totalQty: "467",
            totalKw: "41,469",
            totalAmount: '223,005,024,210',
            percentOfSale: "100",
            pricePerKw: "12,705,523"
          },
        ]
      }
    }
  }
</script>

<style scoped>

</style>
