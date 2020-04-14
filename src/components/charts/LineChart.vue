<template>
  <div></div>
</template>

<script>
  import * as d3 from "d3"

  export default {
    data() {
      return {
        name: "lineChart",
        componentId: null,
        outerWidth: 500,
        outerHeight: 250,
        margin: {
          left: 10,
          top: 30,
          right: 10,
          bottom: 30,
        },
        innerWidth: null,
        innerHeight: null,
        color: 'steelblue'
      }
    },
    props: [
      'chartData',
      'chartConfig',
    ],
    created() {
    },
    beforeMount() {

    },
    mounted() {

      this.svg = d3.select(this.$el)
        .append("svg")
        .attr("width", this.outerWidth)
        .attr("height", this.outerHeight);

      console.log('this is svg: ', this.svg)

      this.x = d3.scaleUtc()
        .domain(d3.extent(this.chartData, (d) => d.Date))
        .range([this.margin.left, this.outerWidth - this.margin.right]);

      this.y = d3.scaleLinear()
        .domain(d3.extent(this.chartData, (d) => d.Close))
        .range([this.outerHeight - this.margin.bottom, this.margin.top]);

      this.line = d3.line()
        .x(d => this.x(d.Date))
        .y(d => this.y(d.Close));

      this.svg
        .append("path")
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", "1.5")
        .attr("d", this.line(this.chartData))
      console.log(this.$el)
    }
  }
</script>

<style scoped>

</style>
