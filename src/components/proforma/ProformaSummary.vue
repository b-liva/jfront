<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="4">
          <v-text-field
            label="مشتری"
            v-model="customerName"></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-text-field
            label="شماره پیش فاکتور"
            v-model="proformaNumber"
            type="number"
          ></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-btn @click="resetFilters" class="primary" small>ریست</v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="12">
          <v-card>
            <v-card-title>پیش فاکتور</v-card-title>
            <v-card-text>
              <v-data-table
                :headers="proformasHeader"
                :items="getProformas()"
                :expanded="proformaRowExpanded"
                :loading="$apollo.queries.proformaFiltered.loading"
                show-expand
                single-expand
                @item-expanded="proformaExpanded">
                <template v-slot:top>
                  <v-toolbar>
                    <v-toolbar-title>پیش فاکتور</v-toolbar-title>
                    <v-divider class="mx-4" inset vertical/>
                    <v-spacer/>
                    <v-btn @click="newProforma" class="primary">پیش فاکتور جدید</v-btn>
                  </v-toolbar>
                </template>
                <template v-slot:item.number="{item}">
                  <router-link :to="{name: 'Proforma', params: {id: item.id, number: item.number}}">
                    {{item.number}}
                  </router-link>
                </template>
                <template v-slot:item.owner="{item}">
                  {{item.owner.lastName}}
                </template>
                <template v-slot:item.action="{ item }">
                  <v-icon @click="editProforma(item)" small class="mr-2">mdi-pencil</v-icon>
                  <v-icon @click="deleteProforma(item)" small class="mr-2">mdi-delete</v-icon>
                </template>
                <template v-slot:expanded-item="{headers}">
                  <td :colspan="headers.length">
                    <v-data-table
                      :headers="specHeaders"
                      :items="getSpecs()"
                      :loading="$apollo.queries.proformaSpecs.loading"
                    @click:row="findProformas">
                    </v-data-table>
                  </td>
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <v-dialog v-model="specProformasDialog" width="900px">
      <spec-proformas :spec_id="selectedSpecIdEq"/>
    </v-dialog>
    <v-dialog v-model="proformaFormDialog" max-width="800px">
      <proforma-creation-holder-form
        v-if="proformaFormDialog"
        :proforma-id="selectedProformaId"
        v-on:close-event="proformaFormDialog = false"
      />
    </v-dialog>
  </div>
</template>

<script>
  import SpecProformas from "./SpecProformas";
  import ProformaCreationHolderForm from "./ProformaCreationHolderForm";
  import {baseFunctions} from "../../mixins/graphql/baseFunctions";
  import {proformaFiltered} from "../../grahpql/queries/proforma/proforma";
  import {proformaSpecs} from "../../grahpql/queries/proforma/specs/proformaSpecs";

  export default {
    data(){
      return {
        name: "ProformaSummary",
        proformaRowExpanded: [],
        customerName: "",
        proformaNumber: null,
        proformaFormDialog: false,
        specProformasDialog: false,
        selectedSpecIdEq: null,
        selectedProformaId: null,
        proformasHeader: [
          {value: "number", text: "پیش فاکتور"},
          {value: "customerName", text: "مشتری"},
          {value: "date", text: "تاریخ"},
          {value: "owner", text: "کارشناس"},
          {value: "action", text: ""},
        ],
        proformas: [
          {id: 1, number: 980025, customerName: "شرکت زرین ذرت شاهرود", date: "1399-01-23", owner: "ظریف"},
          {id: 2, number: 980026, customerName: "آرمان گسترنوین کنارک", date: "1399-01-23", owner: "علوی"},
          {id: 3, number: 980027, customerName: "صنایع بسته بندی فرآورده های شیری پگاه", date: "1399-01-23", owner: "علوی"},
          {id: 4, number: 980060, customerName: "پویاموتور سپاهان", date: "1399-01-23", owner: "ظریف"},
        ],
        specHeaders: [
          {value: "qty", text: "تعداد"},
          {value: "kw", text: "کیلووات"},
          {value: "voltage", text: "ولتاژ"},
          {value: "rpm", text: "سرعت"},
          {value: "price", text: "قیمت واحد"},
        ],
        specs: [
          {qty: 5, kw: 132, voltage: 380, rpm: 1500, price: 45500000},
          {qty: 2, kw: 160, voltage: 380, rpm: 1500, price: 49800000},
          {qty: 3, kw: 75, voltage: 380, rpm: 1000, price: 58500000},
          {qty: 1, kw: 90, voltage: 380, rpm: 3000, price: 987500000},
        ],
        specProformas: [
          {number: 981351, customer: "پتروشیمی پردیس", qty: 10, cost: 25600000, price: 27500000, percentage: 12, date: "1399-01-12"},
          {number: 985241, customer: "پتروشیمی مارون", qty: 5, cost: 25600000, price: 27700000, percentage: 12.5, date: "1399-01-13"},
          {number: 986548, customer: "پتروشیمی تخت جمشید", qty: 1, cost: 25600000, price: 28500000, percentage: 13, date: "1399-01-18"},
          {number: 982564, customer: "هوایار", qty: 3, cost: 25600000, price: 29800000, percentage: 15, date: "1399-01-20"},
          {number: 983548, customer: "پتروشیمی پردیس", qty: 9, cost: 25600000, price: 27500000, percentage: 16, date: "1399-01-23"},
        ]
      }
    },
    methods: {
      resetFilters(){
        this.proformaNumber = null;
        this.customerName = "";
      },
      newProforma(){
        this.proformaFormDialog = true;
        this.selectedProformaId = null;
      },
      getSpecs(){
        if (typeof this.proformaSpecs !== "undefined" && this.proformaSpecs != null){
          return this.noNode(this.proformaSpecs.prefspecSet)
        }
      },
      proformaExpanded(value){
        this.proformaSpecs = {
          prefspecSet: {edges: []}
        };
        this.selectedProformaId = value.item.id;
        console.log(value.item, this.proformaRowExpanded)
        if(this.proformaRowExpanded.includes(value.item)){
          this.proformaRowExpanded.pop(value.item);
        }else {
          this.proformaRowExpanded = [];
          this.proformaRowExpanded.push(value.item);
        }
      },
      findProformas(spec){
        console.log('the spec: ', spec);
        this.selectedSpecIdEq = spec.reqspecEq.id;
        console.log('selected id: ', this.selectedSpecIdEq)
        this.specProformasDialog = true;
      },
      getProformas(){
        if (typeof this.proformaFiltered !== 'undefined' && this.proformaFiltered !== null){
          return this.noNode(this.proformaFiltered)
        }
      },
      editProforma(item){
        this.proformaFormDialog = true;
        this.selectedProformaId = item.id;
      },
      deleteProforma(item){
        console.log('fn', item)
      },
    },
    components: {
      SpecProformas,
      ProformaCreationHolderForm
    },
    mixins: [
      baseFunctions
    ],
    apollo: {
      proformaFiltered: {
        query: proformaFiltered,
        debounce: 1000,
        variables(){
          return {
            "customer_name": this.customerName,
            "proforma_number": this.proformaNumber
          }
        }
      },
      proformaSpecs: {
        query: proformaSpecs,
        variables(){
          return {
            proforma_id: this.selectedProformaId
          }
        }
      },
    }
  }
</script>

<style scoped>

</style>
