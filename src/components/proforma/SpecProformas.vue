<template>
  <div>
    <v-card>
      <v-card-title>
        {{type}}های صادره برای این محصول
      </v-card-title>
      <v-card-text>
        <v-data-table
          dense
          :items="specProformas"
          :headers="specProformaHeaders">
        </v-data-table>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
  export default {
    data(){
      return {
        name: "SpecProformas",
        type: "پیش فاکتور",
        specProformaHeaders: [
          {value: "number", text: "پیش فاکتور"},
          {value: "customer", text: "مشتری"},
          {value: "qty", text: "تعداد"},
          {value: "cost", text: "قیمت تمام شده"},
          {value: "price", text: "قیمت فروش"},
          {value: "percentage", text: "درصد سود"},
          {value: "date", text: "تاریخ"},
        ],
      }
    },
    beforeCreate() {
    },
    created() {
      if (this.config && this.config.type){
        let type = this.specProformaHeaders.filter(e => e.value === "number");
        let index = this.specProformaHeaders.indexOf(type[0]);
        this.type = this.config.type;
        this.specProformaHeaders[index].text = this.config.type;
      }
    },
    mounted(){
    },
    beforeMount() {
    },
    props: [
      "specProformas",
      "config"
    ]
  }
</script>

<style scoped>

</style>
