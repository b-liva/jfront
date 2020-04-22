<template>
  <div>
    <v-card>
      <v-card-title>قیمت تمام شده مواد اولیه</v-card-title>
      <v-card-subtitle>
        <v-btn class="mx-2" small @click="setCost(0)">بدترین</v-btn>
        <v-btn class="mx-2" small @click="setCost(1)">متوسط</v-btn>
        <v-btn class="mx-2" small @click="setCost(2)">بهترین</v-btn>
      </v-card-subtitle>
      <v-card-text>
        <v-form>
          <v-text-field v-model="cost.siliconSteelSheet" label="ورق سیلیکون استیل"></v-text-field>
          <v-text-field v-model="cost.alIngot" label="شمش الومینیوم"></v-text-field>
          <v-text-field v-model="cost.lacqueredWire" label="سیم لاکی"></v-text-field>
          <v-text-field v-model="cost.castIronParts" label="قطعات چدنی"></v-text-field>
          <v-text-field v-model="cost.steelReBar" label="میلگرد فولادی"></v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn class="success" @click="submit">ثبت</v-btn>
        <v-btn class="" @click="cost = costDefault">ریست</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
  export default {
    data(){
      return {
        name: "SetCostForm",
        costDefault: {
          siliconSteelSheet: 190000,
          alIngot: 300000,
          lacqueredWire: 920000,
          castIronParts: 120000,
          steelReBar: 100000,
        },
        cost: {
          siliconSteelSheet: 190000,
          alIngot: 300000,
          lacqueredWire: 920000,
          castIronParts: 120000,
          steelReBar: 100000,
        }
      }
    },
    methods: {
      setCost(status){
        const cf = [1, 0.9, 0.8];
        const keys = Object.keys(this.cost);
        for (const key of keys){
          this.cost[key] = cf[status] * this.costDefault[key];
        }
      },
      submit(){
        console.log('submit')
        this.$emit('closeSetExpense')
      }
    }
  }
</script>

<style scoped>

</style>
