<template>
<!--  <svg class="bar-chart" :width="outerWidth" :height="outerHeight"></svg>-->
  <div></div>
</template>

<script>
  import * as d3 from "d3";

  export default {
    data() {
      return {
        name: "BarChart",
        svg: null,
        outerWidth: 320,
        outerHeight: 250,
        margin: {
          left: 5,
          top: 30,
          right: 5,
          bottom: 30,
        },
        barPadding: 0.2,
        xColumn: "name",
        yColumn: "population",
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
      this.innerWidth = this.outerWidth - this.margin.left - this.margin.right;
      this.innerHeight = this.outerHeight - this.margin.top - this.margin.bottom;
      if (this.chartConfig){
        this.color = this.chartConfig.color;
      }
    },
    mounted() {

      this.svg = d3.select(this.$el)
        .append("svg")
        .attr("width", this.outerWidth)
        .attr("height", this.outerHeight);

      this.g = this.svg.append("g")
        .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`);
      this.xAxisG = this.g.append("g")
        .attr("class", "x axis")
        .attr("transform", `translate(0, ${this.innerHeight})`);

      this.yAxisG = this.g.append("g")
        .attr("class", "y axis");

      this.xScale = d3.scaleBand().range([0, this.innerWidth]).paddingInner(this.barPadding);
      this.yScale = d3.scaleLinear().range([this.innerHeight, 0]);

      this.xAxis = d3.axisBottom(this.xScale).tickSizeOuter(0);
      this.yAxis = d3.axisLeft(this.yScale)
        .ticks(5)
        .tickSizeOuter(0);
      this.render(this.chartData);

    },
    methods: {

      render(data) {
        //  enter
        this.xScale.domain(data.map((d) => {
          return d[this.xColumn]
        }));

        this.yScale.domain([0, d3.max(data,(d) => {
          return d[this.yColumn]
        })]);

        this.xAxisG.call(this.xAxis);
        this.yAxisG.call(this.yAxis);

        let bars = this.g.selectAll("rect").data(data)
        bars.enter().append("rect")
          .attr("x", (d) => {
            return this.xScale(d[this.xColumn])
          })
          .attr("y", (d) => {
            return this.yScale(d[this.yColumn])
          })
          .attr("fill", this.color)
          .attr("width", this.xScale.bandwidth())
          .attr("height", (d) => {
            return innerHeight - this.yScale(d[this.yColumn]);
          });
        //  update
        bars
          .attr("x", (d) => {
            return this.xScale(d[this.xColumn])
          })
          .attr("y", (d) => {
            return this.yScale(d[this.yColumn])
          })
          // .attr("height", function (d) { return innerHeight - yScale(d[yColumn]);  })
          .attr("height", 100)

        //  exit
        bars.exit().remove();
      }
    }
  }
</script>

<style scoped>

</style>
