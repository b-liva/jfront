<template>
  <div>
    <v-container>
      <v-card>
      <v-row>
        <v-col>

            <v-card-title>
              <span>سود و زیان</span>
            </v-card-title>
            <v-card-text>
              <div><span class="label">فروش:</span> {{sale}}</div>
              <div><span class="label">تمام شده:</span> {{cost}}</div>
              <div>
                <span class="label">سود:</span>
                <span>{{profit(sale, cost)}}</span>
                <span>({{profitPercent(sale, cost)}}%)</span>
              </div>
            </v-card-text>

        </v-col>
        <v-col>
          <v-btn x-small class="my-2" @click="setCost(0)">بدترین</v-btn>
          <v-btn x-small class="my-2" @click="setCost(1)">متوسط</v-btn>
          <v-btn x-small class="my-2" @click="setCost(2)">بهترین</v-btn>
        </v-col>
      </v-row>
      </v-card>
    </v-container>
  </div>
</template>

<script>
  import {financialFunctions} from "../../mixins/financialFunctions";

  export default {
    data(){
      return {
        name: "ProfitCard",
        costDefault: '',
      }
    },
    mixins: [
      financialFunctions
    ],
    created() {
      this.costDefault = this.cost;
    },
    methods: {
      setCost(costLevel){
        const cf = [1, 0.9, 0.8];
        this.cost = cf[costLevel] * this.costDefault;
      }
    },
    props: [
      "sale",
      "cost"
    ]
  }
</script>

<style scoped>
  span.label{
    font-style: italic;
    font-weight: bold;
    color: black;
    padding: 0 5px;
  }
</style>
