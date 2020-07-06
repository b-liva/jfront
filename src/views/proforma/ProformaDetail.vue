<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="4">
          <customer-card v-if="typeof proforma.order !== 'undefined'" :customer-id="proforma.order.customer.id"/>
        </v-col>
        <v-col cols="4">
          <v-card>
            <v-card-title>پیش فاکتور شماره {{proforma.number}}</v-card-title>
            <v-card-text>
              <div><span>درخواست: </span><span>
                <router-link :to="{name: 'OrderDetails', params: {id: proforma.order.id}}">{{proforma.order.number}}</router-link>
              </span></div>
              <div><span>مجوز: </span><span>{{proforma.permNumber}}</span></div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="4">
          <profit-card :sale="totalPrice" :cost="totalCost"/>
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col cols="12" md="8">
          <v-icon @click="editProforma(proforma.id)" small class="mr-2">mdi-pencil</v-icon>
          <v-icon @click="delProforma(proforma.id)" small class="mr-2">mdi-delete</v-icon>
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
            <template v-slot:item.im="{item}">
              <template v-if="item.im">{{item.im.title}}</template>
            </template>
            <template v-slot:item.ip="{item}">
              <template v-if="item.ip">{{item.ip.title}}</template>
            </template>
            <template v-slot:item.ic="{item}">
              <template v-if="item.ic">{{item.ic.title}}</template>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
      <v-dialog v-model="incomeListDialog" max-width="900px">
        <income-summary/>
      </v-dialog>
      <v-dialog v-model="setCostDialog" max-width="900px">
        <set-cost-form/>
      </v-dialog>
      <v-dialog v-model="proformaEditDialog" max-width="800px">
        <proforma-creation-holder-form/>
      </v-dialog>
    </v-container>
  </div>
</template>

<script>
  import {financialFunctions} from "../../mixins/financialFunctions";
  import IncomeSummary from "../../components/income/IncomeSummary";
  import ProfitCard from "../../components/cards/ProfitCard";
  import SetCostForm from "../../components/SetCostForm";
  import CustomerCard from "../../components/customer/CustomerCard";
  import ProformaCreationHolderForm from "../../components/proforma/ProformaCreationHolderForm";
  import {mapGetters, mapActions} from 'vuex'
  import {
    ACTION_DELETE_PROFORMA,
    ACTION_UPDATE_PROFORMA,
    MUTATE_PROFORMA_SPEC_FORM_IS_ACTIVE,
    PROFORMA,
    PROFORMA_SPECS
  } from "../../store/types/proforma";

  export default {
    data(){
      return {
        name: "ProformaDetail",
        proformaEditDialog: false,
        incomeListDialog: false,
        setCostDialog: false,
        pSpecHeaders: [
          {value: 'qty', text: 'تعداد'},
          {value: 'kw', text: 'کیلووات'},
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
      }
    },
    methods: {
      ...mapActions({
        getProformaDetails: ACTION_UPDATE_PROFORMA,
        deleteProforma: ACTION_DELETE_PROFORMA
      }),
      editProforma(){
        this.proformaEditDialog = true;
        this.$store.commit(MUTATE_PROFORMA_SPEC_FORM_IS_ACTIVE, true)
      },
      delProforma(){
        let confirmed = confirm(`حذف پیش فاکتور شماره ${this.proforma.number} مورد تأیید است؟`)
        if (confirmed){
          this.deleteProforma(this.proforma.id)
        }
      },
      findRelatedIncomes(){
        this.incomeListDialog = true;
      },
      editSpec(){
      },
      deleteSpec(){
      },
      setCost(){
        this.setCostDialog = true;
      }
    },
    mixins: [
      financialFunctions,
    ],
    created() {
      this.getProformaDetails(this.$route.params.id);
      this.totalPrice = 1321510000;
      this.totalCost = 1149139130;
    },
    computed: {
      ...mapGetters({
        proforma: PROFORMA,
        pSpecs: PROFORMA_SPECS,
      })
    },
    components: {
      IncomeSummary,
      ProfitCard,
      SetCostForm,
      CustomerCard,
      ProformaCreationHolderForm
    },
  }
</script>

<style scoped>

</style>
