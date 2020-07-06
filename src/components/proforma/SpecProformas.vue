<template>
  <div>

    <v-card>
      <v-card-title>
        {{type}} های صادره برای
        <div>
          <span> الکتروموتور </span>
          <span> {{specById.kw}} کیلووات</span>
          <span> {{specById.rpm}} دور</span>
          <span> {{specById.voltage}} ولت</span>
        </div>
      </v-card-title>
      <v-card-text>
        <v-data-table
          dense
          :loading="$apollo.queries.proformasBySpec.loading"
          :items="getProformas()"
          :headers="specProformaHeaders">
          <template v-slot:item.number="{item}">
            {{item.xprefId.number}}
          </template>
          <template v-slot:item.customer="{item}">
            {{item.xprefId.reqId.customer.name}}
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
  import {baseFunctions} from "../../mixins/graphql/baseFunctions";
  import {proformasBySpec} from "../../grahpql/queries/proforma/proforma";
  import {specById} from "../../grahpql/queries/order/spec/spec";

  export default {
    data(){
      return {
        name: "SpecProformas",
        // specById: null,
        // proformasBySpec: null,
        type: "پیش فاکتور",
        specProformaHeaders: [
          {value: "number", text: "پیش فاکتور"},
          {value: "customer", text: "مشتری"},
          {value: "qty", text: "تعداد"},
          {value: "cost", text: "قیمت تمام شده"},
          {value: "price", text: "قیمت فروش"},
          {value: "percentage", text: "درصد سود"},
          {value: "date", text: "تاریخ"},
        ],
      }
    },
    methods: {
      getProformas(){
        if (typeof this.proformasBySpec !== 'undefined' && this.proformasBySpec !== null){
          return this.noNode(this.proformasBySpec)
        }
      }
    },
    created() {
      if (this.config && this.config.type){
        let type = this.specProformaHeaders.filter(e => e.value === "number");
        let index = this.specProformaHeaders.indexOf(type[0]);
        this.type = this.config.type;
        this.specProformaHeaders[index].text = this.config.type;
      }
    },
    props: [
      "spec_id",
      "config"
    ],
    mixins: [
      baseFunctions
    ],
    apollo: {
      specById: {
        query: specById,
        variables(){
          return {
            spec_id: this.spec_id
          }
        }
      },
      proformasBySpec: {
        query: proformasBySpec,
        variables(){
          return {
            kw: this.specById.kw,
            rpm: this.specById.rpm,
            voltage: this.specById.voltage
          }
        }
      }
    }
  }
</script>

<style scoped>

</style>
