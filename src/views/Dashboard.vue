<template>
<div>
  <v-container>
    <v-layout>
      <v-flex xs12>
        <v-tabs>
          <v-tab>
            نخست
          </v-tab>
          <v-tab-item>
            <dashboard-statistics/>
          </v-tab-item>
          <v-tab>
            کاربر
          </v-tab>
          <v-tab-item>
            <user-statistics/>
          </v-tab-item>
          <v-tab>
            درخواست
          </v-tab>
          <v-tab-item>
            <orders-summary/>
          </v-tab-item>
          <v-tab>
            پیش فاکتور
          </v-tab>
          <v-tab-item>
            <proforma-summary/>
          </v-tab-item>
          <v-tab>
            مجوز
          </v-tab>
          <v-tab-item>
            <v-btn @click="byExpertState">{{permitsByExpert ? "لیست مجوز ها": "به تفکیک "}}</v-btn>
            <permit-summary-by-expert v-if="permitsByExpert"/>
            <dashboard-permits v-else/>
          </v-tab-item>
          <v-tab>
            واریزی
          </v-tab>
          <v-tab-item>
            <income-summary/>
          </v-tab-item>
        </v-tabs>
      </v-flex>
    </v-layout>
  </v-container>
</div>
</template>

<script>
  import UserStatistics from "../components/user/UserStatistics";
  import OrdersSummary from "../components/order/OrdersSummary";
  import ProformaSummary from "../components/proforma/ProformaSummary";
  import DashboardPermits from "../components/permit/DashboardPermits";
  import IncomeSummary from "../components/income/IncomeSummary";
  import DashboardStatistics from "../components/DashboardStatistics";
  import PermitSummaryByExpert from "../components/permit/PermitSummaryByExpert";

  export default {
    data(){
      return {
        name: "Dashboard",
        permitsByExpert: false,
      }
    },
    methods: {
      byExpertState(){
        this.permitsByExpert = !this.permitsByExpert;
      }
    },
    components:{
      UserStatistics,
      OrdersSummary,
      ProformaSummary,
      DashboardPermits,
      IncomeSummary,
      DashboardStatistics,
      PermitSummaryByExpert
    }
  }
</script>

<style scoped>

</style>
