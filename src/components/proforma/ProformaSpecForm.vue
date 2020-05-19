<template>
  <div>
    <v-card>
      <v-card-title>ردیف های پیش فاکتور</v-card-title>
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
              :items="proformaSpecs"
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

  export default {
    data() {
      return {
        name: "ProformaSpecForm",
        proforma: {},
        pSpecFormIsActive: false,
        proformaSpecs: [],
        specs: [],
        orderData: {
          id: "",
          number: "",
          customerName: "",
        },
        headers: [
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
    methods: {
      addToProformaSpecs(spec) {
        this.proformaSpecs.push(spec)
        spec.staged = true;
      },
      removeFromProformaSpecs(spec) {
        const index = this.proformaSpecs.indexOf(spec)
        console.log('spec: ', spec, 'index: ', index)
        this.proformaSpecs.splice(index, 1)
        spec.staged = false
      },
      addAllToProformaSpecs() {
        this.specs.map((row) => {
          console.log(row.price > 0 && !row.staged)
          if (!row.staged) {
            this.proformaSpecs.push(row)
            row.staged = true
          }
        })
      },
      submit() {
        let specPayLoad = this.proformaSpecs.map(e => {
          return {
            id: e.id,
            price: e.price,
            qty: e.qty
          }
        });
        this.$apollo.mutate({
          mutation: createPrefSpecsBulk,
          variables: {
            "proforma_id":this.proformaIdComputed,
            "spec_list": specPayLoad
          },
        }).then(response => {
          console.log(response);
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
    computed: {
      proformaIdComputed: function () {
        return this.proformaId
      }
    },
    apollo: {
      specsNoProforma: {
        query: specsNoProforma,
        skip(){
          return !this.proformaIdComputed
        },
        variables(){
          return {
            "proforma_id": this.proformaIdComputed
          }
        },
        result(result){
          console.log('why is this called again?')
          console.log('from: ', result)
          let data = result.data.specsNoProforma;
          this.specs = data.specsNoProforma;
          this.specs.forEach(e => {
            e.staged = typeof e.staged === "undefined" ? false : e.staged;
          });
          this.orderData.id = data.reqId.id;
          this.orderData.number = data.reqId.number;
          this.orderData.customerName = data.customerName;
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
