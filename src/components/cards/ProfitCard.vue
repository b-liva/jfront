<template>
  <div>
    <v-container>
      <v-row>
        <v-col>
          <v-card>
            <v-card-title>
              <span>سود و زیان</span>
            </v-card-title>
            <v-card-text>
              <div><span class="label">فروش:</span> {{sale}}</div>
              <div><span class="label">تمام شده:</span> {{expense}}</div>
              <div>
                <span class="label">سود:</span>
                <span>{{profit(sale, expense)}}</span>
                <span>({{profitPercent(sale, expense)}}%)</span>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

    </v-container>
  </div>
</template>

<script>
  import {financialFunctions} from "../../mixins/financialFunctions";

  export default {
    data(){
      return {
        name: "ProfitCard",
      }
    },
    mixins: [
      financialFunctions
    ],
    props: [
      "sale",
      "expense"
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
