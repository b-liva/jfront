<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="4">
          <v-card>
            <v-card-title>پیش فاکتور شماره {{proforma.number}}</v-card-title>
            <v-card-text>
              {{proforma.date}}
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="4">
          <profit-card :sale="proforma.totalPrice" :cost="proforma.totalCost"/>
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col cols="10" md="8">
          <v-icon @click="editProforma(proforma.id)" small class="mr-2">mdi-pencil</v-icon>
          <v-icon @click="deleteProforma(proforma.id)" small class="mr-2">mdi-delete</v-icon>
          <v-icon @click="findRelatedIncomes" small class="mr-2">mdi-format-list-bulleted</v-icon>
          <v-icon @click="setCost" small class="mr-2">mdi-stairs</v-icon>
        </v-col>
        <v-col cols="12">
          <v-data-table
            dense
            :items="pSpecs"
            :headers="pSpecHeaders">
            <template v-slot:item.profit="{item}">
              {{profit(item.price, item.cost)}}
            </template>
            <template v-slot:item.profitPercent="{item}">
              {{profitPercent(item.price, item.cost)}}
            </template>
            <template v-slot:item.action="{item}">
              <v-icon small class="mr-2" @click="editSpec(item.id)">mdi-pencil</v-icon>
              <v-icon small class="mr-2" @click="deleteSpec(item.id)">mdi-delete</v-icon>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
      <v-dialog v-model="proformaEditDialog" max-width="800px">
        <proforma-form :proforma-id="proforma.id"/>
      </v-dialog>
      <v-dialog v-model="incomeListDialog" max-width="900px">
        <income-summary/>
      </v-dialog>
      <v-dialog v-model="setCostDialog" max-width="900px">
        <set-cost-form/>
      </v-dialog>
    </v-container>
  </div>
</template>

<script>
  import {financialFunctions} from "../../mixins/financialFunctions";
  import ProformaForm from "../../components/proforma/ProformaForm";
  import IncomeSummary from "../../components/income/IncomeSummary";
  import ProfitCard from "../../components/cards/ProfitCard";
  import SetCostForm from "../../components/SetCostForm";

  export default {
    data(){
      return {
        name: "ProformaDetail",
        proforma: '',
        proformaEditDialog: false,
        incomeListDialog: false,
        setCostDialog: false,
        pSpecHeaders: [
          {value: 'qty', text: 'تعداد'},
          {value: 'kw', text: 'پیش فاکتور'},
          {value: 'voltage', text: 'ولتاژ'},
          {value: 'im', text: 'IM'},
          {value: 'ip', text: 'IP'},
          {value: 'ic', text: 'IC'},
          {value: 'price', text: 'فروش'},
          {value: 'cost', text: 'تمام شده'},
          {value: 'profit', text: 'سود'},
          {value: 'profitPercent', text: 'درصد'},
          {value: 'action', text: ''},
        ],
        pSpecs: [
          {qty: 3, kw: 132, rpm: 1500, voltage: 380, im: "IMB3", ip: "IP55", ic: '411', price: 152500000, cost: 122000000},
          {qty: 5, kw: 90, rpm: 3000, voltage: 380, im: "IMB3", ip: "IP55", ic: '611', price: 5652500000, cost: 3956750000},
          {qty: 3, kw: 450, rpm: 1500, voltage: 380, im: "IMB3", ip: "IP55", ic: '411', price: 45500000, cost: 40950000},
        ]
      }
    },
    methods: {
      getProformaDetails(){
        this.proforma = {
          id: this.$route.params.id,
          number: this.$route.params.number,
          date: "1398-12-02",
          customer: {
            id: 5,
            name: "پتروشیمی مارون"
          },
          totalPrice: 1321510000,
          totalCost: 1149139130
        }
      },
      editProforma(){
        this.proformaEditDialog = true;
      },
      deleteProforma(){
        console.log('method.')
      },
      findRelatedIncomes(){
        this.incomeListDialog = true;
      },
      editSpec(){
        console.log('method')
      },
      deleteSpec(){
        console.log('method')
      },
      setCost(){
        this.setCostDialog = true;
      }
    },
    mixins: [
      financialFunctions,
    ],
    created() {
      this.getProformaDetails();
    },
    components: {
      ProformaForm,
      IncomeSummary,
      ProfitCard,
      SetCostForm
    }
  }
</script>

<style scoped>

</style>
