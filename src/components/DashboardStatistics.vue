<template>
  <div class="tile_count">
    <v-container>
      <v-row no-gutters>
        <v-col
          cols="3"
          md=""
          v-for="(card, index) in cardsData"
          :key="index">
          <three-line-summary-card
            :top="card.top"
            :main-content="card.main"
            :footer="card.footer"/>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
  import ThreeLineSummaryCard from "./cards/ThreeLineSummaryCard";

  export default {
    data() {
      return {
        name: "DashboardStatistics",
        cardsData: [
          {top: "تعداد درخواست ها", main: "2,271", footer: "2,786,227.2 کیلووات"},
          {top: "روتین (KW)", main: "928,549.0", footer: "14,635 دستگاه"},
          {top: "پروژه (KW)", main: "1,249,395.0", footer: "2,065 دستگاه"},
          {top: " ضدانفجار (KW)", main: "276,976.0", footer: "1,218 دستگاه"},
          {top: "تعمیرات (KW)", main: "331,307.2", footer: "470 دستگاه"},
          {top: " مجموع (KW)", main: "2,786,227.2", footer: "18,388 دستگاه"},
          {top: "  مجموع پرداخت", main: "632,168,256,681", footer: ""},
        ]
      }
    },
    components: {
      ThreeLineSummaryCard
    }
  }
</script>

<style scoped>

</style>
