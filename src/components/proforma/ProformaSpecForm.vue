<template>
  <div>
    <v-card>{{proformaInstance.id}} <span v-if="loading">loading </span>
      <v-card-title>ردیف های پیش فاکتور</v-card-title>
<!--      <div style="direction: ltr">-->
<!--        <div>specs</div>-->
<!--        <div>-->
<!--          <p v-for="i in specs" :key="i.id">{{i.id}}</p>-->
<!--        </div>-->
<!--        <div>profSpec: </div>-->
<!--        <div>-->
<!--          <p v-for="i in profSpecs" :key="i.id">{{i.id}} - {{i.reqspecEq.id}}</p>-->
<!--        </div>-->
<!--      </div>-->
      <v-card-text>
        <v-layout row wrap>
          <v-flex xs4>
            <p>
              <v-icon @click="addAllToProformaSpecs">mdi-check-all</v-icon>
            </p>
            <ol>
              <template v-for="spec in onStagedSpecs(false)">
                <li v-if="!spec.staged" :key="spec.eqId">
                  <p class="mx-4">
                    <span>{{spec.eqId}}</span>
                    <span>{{spec.qty}}</span>
                    <span>دستگاه</span>
                    <span>{{spec.kw}}</span>
                    <span>کیلووات</span>
                    <span>{{spec.rpm}}</span>
                    <span>دور</span>
                    <span>{{spec.voltage}}</span>
                    <span>ولت</span>
                    <span>{{spec.price}}</span>
                    <span><v-icon @click="addToProformaSpecs(spec)"> mdi-plus</v-icon></span>
                  </p>
                </li>
              </template>
            </ol>
          </v-flex>
          <v-flex xs8>
            <v-data-table
              dense
              item-key="eqId"
              :headers="headers"
              :items="onStagedSpecs(true)"
              hide-default-footer>
              <template v-slot:item.qty="{item}">
                <v-text-field dense v-model="item.qty" class="qty"></v-text-field>
              </template>
              <template v-slot:item.price="{item}">
                <v-text-field dense v-model="item.price"></v-text-field>
              </template>
              <template v-slot:item.action="{item}">
                <v-icon @click="removeFromProformaSpecs(item)">mdi-delete</v-icon>
              </template>
            </v-data-table>
          </v-flex>
        </v-layout>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="submit">ثبت</v-btn>
        <v-btn @click="cancel">انصراف</v-btn>
      </v-card-actions>

    </v-card>
  </div>
</template>

<script>
  import {baseFunctions} from "../../mixins/graphql/baseFunctions";
  // import {specsNoProforma} from "../../grahpql/queries/order/spec/spec";
  // import {createPrefSpecsBulk} from "../../grahpql/queries/order/spec/mutation/mutation";
  // import {proformaSpecs} from "../../grahpql/queries/proforma/specs/proformaSpecs";
  import {mapGetters, mapActions} from 'vuex'
  import {
    ACTION_INSERT_PROFORMA_SPEC_BULK,
    ACTION_UPDATE_PROFORMA_SPECS, PROFORMA,
    PROFORMA_FORMS_SPECS,
    PROFORMA_ORDER_SPECS
  } from "../../store/types/proforma";


  export default {
    data() {
      return {
        name: "ProformaSpecForm",
        proforma: {},
        pSpecFormIsActive: false,
        loading: false,
        template: {
          kw:'',
          rpm: '',
          voltage: '',
          im: '',
        },
        customSpecs: [],
        // profSpecs: [],
        // specs: [],
        orderData: {
          id: "",
          number: "",
          customerName: "",
        },
        headers: [
          {value: 'eqId', text: 'eq', align: 'center', class: 'qty-header'},
          {value: 'qty', text: 'تعداد', align: 'center', class: 'qty-header'},
          {value: 'kw', text: 'کیلووات',},
          {value: 'rpm', text: 'سرعت',},
          {value: 'voltage', text: 'ولتاژ',},
          {value: 'price', text: 'قیمت',},
          {value: 'action', text: '',},
        ]
      }
    },
    computed: {
      ...mapGetters({
        proformaInstance: PROFORMA,
        specs: PROFORMA_ORDER_SPECS,
        profSpecs: PROFORMA_FORMS_SPECS,
      })
    },
    props: ['orderId', 'proformaId'],
    mixins: [
      baseFunctions
    ],
    // created() {
    //   this.proformaID = this.proformaId
    // },
    methods: {
      ...mapActions({
        updateProformaSpecs: ACTION_UPDATE_PROFORMA_SPECS,
        insertProformaSpecsBulk: ACTION_INSERT_PROFORMA_SPEC_BULK
      }),
      onStagedSpecs(status){
        let specs = []
        specs = this.profSpecs.filter(e => e.staged === status)
        return specs
      },
      addToProformaSpecs(spec) {
        spec.staged = true;
      },
      removeFromProformaSpecs(spec) {
        spec.staged = false;
      },
      addAllToProformaSpecs() {
        this.specs.map((row) => {
          row.staged = true
        })
      },
      submit() {
        let specPayLoad = this.profSpecs.filter(e => e.staged === true)

        specPayLoad = specPayLoad.map(e => {
          return {
            id: e.id,
            eqId: e.eqId,
            price: e.price,
            qty: e.qty
          }
        });
        console.log('specpaylaod: *: ', specPayLoad)
        let variables = {
          "proforma_id": this.proformaInstance.id,
            "spec_list": specPayLoad
        }
        console.log(variables)
        this.insertProformaSpecsBulk(variables)
      },
      cancel() {
        this.close()
      },
      close() {
        this.$emit('close-event')
      },
    },
    apollo: {
      // specsNoProforma: {
      //   query: specsNoProforma,
      //   skip(){
      //     return !this.proformaID
      //   },
      //   variables(){
      //     return {
      //       "proforma_id": this.proformaID
      //     }
      //   },
      //   result(result){
      //     console.log('why is this called again?')
      //     let data = result.data.specsNoProforma;
      //     this.specs = data.specsNoProforma;
      //     this.specs.forEach(e => {
      //       e.staged = typeof e.staged === "undefined" ? false : e.staged;
      //     });
      //     // this.orderData.id = data.reqId.id;
      //     // this.orderData.number = data.reqId.number;
      //     // this.orderData.customerName = data.customerName;
      //   }
      // },
      // proformaSpecs: {
      //   query: proformaSpecs,
      //   skip(){
      //     // Should check if there is specs or not.
      //     return !(this.proformaID && this.specs.length > 0)
      //   },
      //   variables(){
      //     return {
      //       proforma_id: this.proformaID
      //     }
      //   },
      //   result({data, loading}){
      //     this.loading = loading;
      //     if (this.profSpecs.length > 0){
      //       this.profSpecs = this.noNode(data.proformaSpecs.prefspecSet)
      //       this.profSpecs.forEach(e => {
      //         this.specs.forEach(s => {
      //           if (e.reqspecEq.id === s.id){
      //             s.staged = true
      //           }
      //         })
      //       })
      //     }
      //   }
      // }
    }
  }
</script>

<style scoped>
  th.text-center.qty-header.sortable {
    width: 82px;
  }

  .qty {
    align-items: center;
  }
</style>
