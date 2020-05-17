<template>
  <div>
    <v-container>
      <v-layout row justify-space-between>
        <v-flex xs6 md3>
          address card
        </v-flex>
        <v-flex xs12 md9>
          <v-layout justify-space-around>
            <v-flex v-for="item in cardDetails" :key="item.title" xs6 md2>
              <base-card :value="item.value" :title="item.title"/>
            </v-flex>
          </v-layout>
        </v-flex>

      </v-layout>
      <v-layout>
        <v-flex xs12 md4>
          <v-tabs>
            <v-tab>
              مبالغ دریافتی
            </v-tab>
            <v-tab-item>
              <v-list>
                <v-list-item v-for="rec in receivable" :key="rec.id">
                  <span>{{rec.amount}} </span> - <span>{{rec.date}}</span>
                </v-list-item>
              </v-list>
            </v-tab-item>
            <v-tab>
              مانده
            </v-tab>
            <v-tab-item>
              <v-list>
                <v-list-item v-for="rec in received" :key="rec.id">
                  <span>{{rec.amount}} </span> - <span>{{rec.date}}</span>
                </v-list-item>
              </v-list>
            </v-tab-item>
            <v-tab>
              چک
            </v-tab>
            <v-tab-item>
              <v-list>
                <v-list-item v-for="rec in cheque" :key="rec.id">
                  <span>{{rec.amount}} </span> - <span>{{rec.date}}</span>
                </v-list-item>
              </v-list>
            </v-tab-item>
          </v-tabs>
        </v-flex>
      </v-layout>
    </v-container>
    <v-list>
      <v-list-item v-for="customer in customers" :key="customer.id">
        <v-list-item-content>
          <v-list-item-title>{{customer.name}}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <v-layout row>
      <v-flex xs12 md6><line-chart v-if="lineChartData" :chart-data="lineChartData"/></v-flex>
      <v-flex xs12 md6><line-chart v-if="lineChartData" :chart-data="lineChartData"/></v-flex>
      <v-flex xs12 md4>
        <bar-chart v-if="chartData" :chart-data="chartData" :chart-config="{color: 'black'}"/>
      </v-flex>
      <v-flex xs12 md4>
        <bar-chart v-if="chartData" :chart-data="chartData" :chart-config="{color: 'green'}"/>
      </v-flex>
      <v-flex xs12 md4>
        <bar-chart v-if="chartData" :chart-data="chartData"/>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
  // import db from '@/firebase/init'
  import * as d3 from "d3";
  import BaseCard from "../../components/cards/BaseCard";
  import BarChart from "../../components/charts/BarChart";
  import LineChart from "../../components/charts/LineChart";

  export default {
    data() {
      return {
        name: "Customer",
        id: this.$route.params.id,
        customerName: this.$route.params.name,
        customers: [],
        cardDetails: [
          {title: 'درخواست', value: 12},
          {title: 'کیلووات', value: 2650},
          {title: 'مجوز', value: 4},
          {title: 'دریافتی', value: 1324526320},
          {title: 'مانده', value: 254562560},
        ],
        received: [
          {id: 1, amount: 452345000, date: '1398-11-12'},
          {id: 2, amount: 2522345000, date: '1398-10-16'},
          {id: 3, amount: 3623654000, date: '1398-11-17'},
          {id: 4, amount: 129845000, date: '1398-12-18'},
        ],
        receivable: [
          {id: 1, amount: 2345000, date: '1398-12-12'},
          {id: 2, amount: 22345000, date: '1398-12-16'},
          {id: 3, amount: 23654000, date: '1398-12-17'},
          {id: 4, amount: 9845000, date: '1398-12-18'},
        ],
        cheque: [
          {id: 1, amount: 2345000, date: '1398-12-12'},
          {id: 2, amount: 22345000, date: '1398-12-16'},
          {id: 3, amount: 23654000, date: '1398-12-17'},
          {id: 4, amount: 9845000, date: '1398-12-18'},
        ],
        chartData: null,
        lineChartData: null,
      }
    },
    components: {
      BaseCard,
      BarChart,
      LineChart
    },
    created() {
      // db.collection('customer').get()
      //   .then(snapshot => {
      //     snapshot.forEach(doc => {
      //       let customer = doc.data()
      //       customer.id = doc.id
      //       this.customers.push(customer)
      //     })
      //   });

      d3.csv('/data/data.csv', this.type)
        .then((data) => {
          this.chartData = data;
        }).catch(function (e) {
        console.log(e)
      });

      d3.csv('/data/line.csv', d3.autoType)
        .then((data) => {
          this.lineChartData = data;
        }).catch(function (e) {
        console.log(e)
      });
    },
    methods: {
      type(d) {
        d.population = +d.population;
        return d;
      },
    },
    mounted() {
      console.log(this)
    }
  }
</script>

<style scoped>
</style>
