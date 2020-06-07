<template>
  <div>
    <v-card>{{proformaID}} <span v-if="loading">loading </span>
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
            <ul>
              <template v-for="spec in specs">
                <li v-if="!spec.staged" :key="spec.id">
                  <p class="mx-4">
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
            </ul>
          </v-flex>
          <v-flex xs8>
            <v-data-table
              dense
              :headers="headers"
              :items="profSpecs"
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
  import {specsNoProforma} from "../../grahpql/queries/order/spec/spec";
  import {createPrefSpecsBulk} from "../../grahpql/queries/order/spec/mutation/mutation";
  import {proformaSpecs} from "../../grahpql/queries/proforma/specs/proformaSpecs";

  export default {
    data() {
      return {
        name: "ProformaSpecForm",
        proforma: {},
        pSpecFormIsActive: false,
        loading: false,
        proformaID: null,
        profSpecs: [],
        specs: [],
        orderData: {
          id: "",
          number: "",
          customerName: "",
        },
        headers: [
          {value: 'eq', text: 'eq', align: 'center', class: 'qty-header'},
          {value: 'qty', text: 'تعداد', align: 'center', class: 'qty-header'},
          {value: 'kw', text: 'کیلووات',},
          {value: 'rpm', text: 'سرعت',},
          {value: 'voltage', text: 'ولتاژ',},
          {value: 'price', text: 'قیمت',},
          {value: 'action', text: '',},
        ]
      }
    },
    props: ['orderId', 'proformaId'],
    mixins: [
      baseFunctions
    ],
    created() {
      this.proformaID = this.proformaId
    },
    methods: {
      addToProformaSpecs(spec) {
        this.profSpecs.push(spec);
        spec.staged = true;
      },
      removeFromProformaSpecs(spec) {
        const index = this.profSpecs.indexOf(spec);
        this.profSpecs.splice(index, 1);
        this.specs.forEach(e => {
          if (typeof spec.reqspecEq !== "undefined" && e.id===spec.reqspecEq.id){
            e.staged = false
          }else if(typeof spec.reqspecEq === "undefined"){
            spec.staged = false
          }
        })
      },
      addAllToProformaSpecs() {
        this.specs.map((row) => {
          if (!row.staged) {
            this.profSpecs.push(row);
            row.staged = true
          }
        })
      },
      submit() {
        let specPayLoad = this.profSpecs.map(e => {
          return {
            id: e.id,
            price: e.price,
            qty: e.qty
          }
        });
        this.$apollo.mutate({
          mutation: createPrefSpecsBulk,
          variables: {
            "proforma_id":this.proformaID,
            "spec_list": specPayLoad
          },
        }).then(response => {
          this.$emit('proformaSpecSuccess', response.data.createPrefSpecsBulk.proformaSpecs)
        }, error => {
          console.error('error occurred.', error)
        })
      },
      cancel() {
        this.close()
      },
      close() {
        this.$emit('close-event')
      },
    },
    apollo: {
      specsNoProforma: {
        query: specsNoProforma,
        skip(){
          return !this.proformaID
        },
        variables(){
          return {
            "proforma_id": this.proformaID
          }
        },
        result(result){
          console.log('why is this called again?')
          let data = result.data.specsNoProforma;
          this.specs = data.specsNoProforma;
          this.specs.forEach(e => {
            e.staged = typeof e.staged === "undefined" ? false : e.staged;
          });
          this.orderData.id = data.reqId.id;
          this.orderData.number = data.reqId.number;
          this.orderData.customerName = data.customerName;
        }
      },
      proformaSpecs: {
        query: proformaSpecs,
        skip(){
          // Should check if there is specs or not.
          return !(this.proformaID && this.specs.length > 0)
        },
        variables(){
          return {
            proforma_id: this.proformaID
          }
        },
        result({data, loading}){
          this.loading = loading;
          if (this.profSpecs.length > 0){
            this.profSpecs = this.noNode(data.proformaSpecs.prefspecSet)
            this.profSpecs.forEach(e => {
              this.specs.forEach(s => {
                if (e.reqspecEq.id === s.id){
                  s.staged = true
                }
              })
            })
          }
        }
      }
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
