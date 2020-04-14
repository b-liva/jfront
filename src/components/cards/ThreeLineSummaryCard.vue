<template>
    <div class="tile_stats_count">
      <span class="count_top">{{top}}</span>
      <div class="count">{{mainContent}}</div>
      <span class="count_top">{{footer}}</span>
    </div>
</template>

<script>
  export default {
    data() {
      return {
        name: "ThreeLineSummaryCard",
      }
    },
    props: [
      "icon",
      "top",
      "mainContent",
      "footer"
    ]
  }
</script>

<style scoped>
  .tile_count .tile_stats_count {
    border-bottom: 1px solid #d9dee4;
    padding: 0 20px 0 10px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    position: relative;
  }
  .tile_count .tile_stats_count span{
    font-size: 13px;
  }
  .tile_count .tile_stats_count .count {
    font-size: 22px;
  }
</style>
