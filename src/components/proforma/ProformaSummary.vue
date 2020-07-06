<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="4">
          <v-text-field
            label="مشتری"
            v-model="findSpecProformasCom.customerName"></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-text-field
            label="شماره پیش فاکتور"
            v-model="findSpecProformasCom.number"
            type="number"
          ></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-btn @click="resetFilters" class="error pa-2" x-small><v-icon>mdi-close</v-icon></v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="12">
          <v-card>
            <v-card-text>
              <v-data-table
                :headers="proformasHeader"
                :items="proformas"
                :expanded="proformaRowExpanded"
                show-expand
                single-expand
                :loading="loadingProformas"
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
                  <router-link :to="{name: 'ProformaDetails', params: {id: item.id, number: item.number}}">
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
  // import {proformaFiltered} from "../../grahpql/queries/proforma/proforma";
  import {proformaSpecs} from "../../grahpql/queries/proforma/specs/proformaSpecs";
  import {deleteProforma} from "../../grahpql/queries/proforma/mutation/deletion";
  import {mapGetters, mapActions} from "vuex"
  import {
    MUTATE_PROFORMA_FORM_SPECS,
    MUTATE_RESET_PROFORMA_FORMS,
    ACTION_UPDATE_PROFORMA_ORDER_SPECS,
    ACTION_UPDATE_PROFORMA_SPECS,
    MUTATE_PROFORMA_SPEC_FORM_IS_ACTIVE,
    FILTER_PROFORMA_FORM,
    ACTION_FILTER_PROFORMAS,
    FILTERED_PROFORMAS, PROFORMA_FILTER_LOADING, MUTATE_FILTER_PROFORMA_FORM, ACTION_UPDATE_PROFORMA
  } from "../../store/types/proforma";
  import debounce from 'debounce'

  export default {
    data(){
      return {
        name: "ProformaSummary",
        proformaRowExpanded: [],
        proformaFormDialog: false,
        specProformasDialog: false,
        selectedProformaId: null,
        selectedSpecIdEq: '',
        proformasHeader: [
          {value: "number", text: "پیش فاکتور"},
          {value: "customerName", text: "مشتری"},
          {value: "date", text: "تاریخ"},
          {value: "owner", text: "کارشناس"},
          {value: "action", text: ""},
        ],
        specHeaders: [
          {value: "qty", text: "تعداد"},
          {value: "kw", text: "کیلووات"},
          {value: "voltage", text: "ولتاژ"},
          {value: "rpm", text: "سرعت"},
          {value: "price", text: "قیمت واحد"},
        ],
      }
    },
    created() {
      this.filterProformas = debounce(this.filterProformas, 1000)
    },
    mounted() {
      this.filterProformas()
    },
    methods: {
      ...mapActions({
        fillProformaForm: ACTION_UPDATE_PROFORMA,
        updateProformaOrderSpecs: ACTION_UPDATE_PROFORMA_ORDER_SPECS,
        updateProformaSpecs: ACTION_UPDATE_PROFORMA_SPECS,
        filterProformas: ACTION_FILTER_PROFORMAS
      }),
      resetFilters(){
        this.$store.commit(MUTATE_FILTER_PROFORMA_FORM, {})
      },
      newProforma(){
        this.proformaFormDialog = true;
        this.selectedProformaId = null;
        this.$store.commit(MUTATE_RESET_PROFORMA_FORMS)
        this.$store.commit(MUTATE_PROFORMA_FORM_SPECS, true)
      },
      getSpecs(){
        if (typeof this.proformaSpecs !== "undefined" && this.proformaSpecs != null){
          return this.noNode(this.proformaSpecs.prefspecSet)
        }
      },
      proformaExpanded(value){
        // this.proformaSpecs = {
        //   prefspecSet: {edges: []}
        // };
        this.selectedProformaId = value.item.id;
        if(this.proformaRowExpanded.includes(value.item)){
          this.proformaRowExpanded.pop(value.item);
        }else {
          this.proformaRowExpanded = [];
          this.proformaRowExpanded.push(value.item);
        }
      },
      findProformas(spec){
        this.selectedSpecIdEq = spec.reqspecEq.id;
        this.specProformasDialog = true;
      },
      // getProformas(){
      //   if (typeof this.proformaFiltered !== 'undefined' && this.proformaFiltered !== null){
      //     return this.noNode(this.proformaFiltered)
      //   }
      // },
      editProforma(item){
        this.proformaFormDialog = true;
        this.fillProformaForm(item.id)
        this.$store.commit(MUTATE_PROFORMA_SPEC_FORM_IS_ACTIVE, true)
        this.updateProformaOrderSpecs(item.id)
        this.updateProformaSpecs(item.id)
        this.selectedProformaId = item.id;
      },
      deleteProforma(item){
        let confirmed = confirm("مورد تأیید است؟")
        if (confirmed){
          this.$apollo.mutate({
            mutation: deleteProforma,
            variables: {
              "input": {
                "id": item.id
              }
            }
          }).then(() => {
            this.filterProformas()
          }, error => {
            console.error(error)
          });
        }
      },
    },
    components: {
      SpecProformas,
      ProformaCreationHolderForm,
    },
    computed: {
      ...mapGetters({
        findSpecProformasCom: FILTER_PROFORMA_FORM,
        proformas: FILTERED_PROFORMAS,
        loadingProformas: PROFORMA_FILTER_LOADING
      })
    },
    mixins: [
      baseFunctions
    ],
    watch: {
      findSpecProformasCom: {
        handler(){
          this.filterProformas()
        },
        deep: true,
      }
    },
    apollo: {
      proformaSpecs: {
        query: proformaSpecs,
        skip(){
          return !this.selectedProformaId
        },
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
