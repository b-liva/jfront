<template>
<div>
  <v-container>
    <v-layout>
      <v-flex xs12>
        <v-tabs v-model="selectedTab">
          <v-tab key="home">
            نخست
          </v-tab>
          <v-tab-item>
            <dashboard-statistics/>
          </v-tab-item>
          <v-tab key="users">
            کاربر
          </v-tab>
          <v-tab-item>
            <user-statistics/>
          </v-tab-item>
          <v-tab key="orders">
            درخواست
          </v-tab>
          <v-tab-item>
            <orders-summary/>
          </v-tab-item>
          <v-tab key="proformas">
            پیش فاکتور
          </v-tab>
          <v-tab-item>
            <proforma-summary/>
          </v-tab-item>
          <v-tab key="perms">
            مجوز
          </v-tab>
          <v-tab-item>
            <v-btn @click="byExpertState">{{permitsByExpert ? "لیست مجوز ها": "به تفکیک "}}</v-btn>
            <permit-summary-by-expert v-if="permitsByExpert"/>
            <dashboard-permits v-else/>
          </v-tab-item>
          <v-tab key="incomes">
            واریزی
          </v-tab>
          <v-tab-item>
            <income-summary/>
          </v-tab-item>
          <v-tab key="test">
            test
          </v-tab>
          <v-tab-item>
            <order-state/>
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
  import OrderState from "../components/order/OrderState";

  export default {
    data(){
      return {
        name: "Dashboard",
        selectedTab: '',
        tabs: [
          {id: 1, name: 'users'},
          {id: 2, name: 'orders'},
          {id: 3, name: 'proformas'},
          {id: 4, name: 'perms'},
          {id: 5, name: 'incomes'},
          {id: 6, name: 'test'},
        ],
        permitsByExpert: false,
      }
    },
    created() {
      let item = this.tabs.find(e => e.name === this.$route.params.tabName);
      this.selectedTab = item ? item.id : 0;
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
      PermitSummaryByExpert,
      OrderState
    }
  }
</script>

<style scoped>

</style>
