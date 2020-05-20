<template>
  <div>
    <v-card>
      <v-card-title>ویرایش ردیف</v-card-title>
      <v-card-text>
        <v-container>
          <v-layout row wrap>
            <v-flex class="purple lighten-4" xs4 md3>
              <v-layout row wrap justify-space-around>
                <v-flex xs5 md6>
                  <v-text-field
                    class="box"
                    type="number"
                    v-model="assignForm.qty"
                    label="تعداد">
                  </v-text-field>
                  <v-text-field class="box" label="کیلووات" v-model="assignForm.kw"></v-text-field>
                </v-flex>
                <v-flex xs5 md6>
                  <v-text-field class="box" label="سرعت" v-model="assignForm.rpm"></v-text-field>
                  <v-text-field class="box" label="ولتاژ" v-model="assignForm.voltage"></v-text-field>
                </v-flex>
                <v-layout>
                  <v-flex xs5 md3>
                    <v-radio-group dense class="d-flex col-md-6 mb-6" v-model="assignForm.ip.id">
                      <v-radio
                        v-for="n in IPList"
                        :key="n.id"
                        :label="n.title"
                        :value="n.id"
                      ></v-radio>
                    </v-radio-group>
                  </v-flex>
                  <v-flex xs5 md3>
                    <v-radio-group dense class="d-flex col-md-6 mb-6" v-model="assignForm.ic.id">
                      <v-radio
                        v-for="n in ICList"
                        :key="n.id"
                        :label="n.title"
                        :value="n.id"
                      ></v-radio>
                    </v-radio-group>
                  </v-flex>
                  <v-flex xs5 md3>
                    <v-radio-group dense class="d-flex col-md-6 mb-6" v-model="assignForm.im.id">
                      <v-radio
                        v-for="n in IMList"
                        :key="n.id"
                        :label="n.title"
                        :value="n.id"
                      ></v-radio>
                    </v-radio-group>
                  </v-flex>
                </v-layout>
                <v-flex xs12 md6 class="">
                  <PersianDatePicker
                    v-model="assignForm.date"
                    format="jYYYY-jMM-jDD"
                    :auto-submit="true"/>
                </v-flex>
                <v-flex
                  xs12
                  md12>
                  <v-textarea label="توضیحات" v-model="assignForm.summary" auto-grow></v-textarea>
                </v-flex>
              </v-layout>
              <v-layout row wrap>
                <v-flex xs12>
                  <v-icon
                    @click="addSpecToList"
                    small
                    class="mr-2">mdi-arrow-left-bold
                  </v-icon>
                </v-flex>
              </v-layout>
            </v-flex>
            <v-flex xs8 md9 class="pink lighten-4"
            >
              <v-data-table
                item-key="id"
                :headers="specHeaders"
                :loading="$apollo.queries.order.loading"
                :items="orderSpecs">
                <template v-slot:item.ip="{item}"><template v-if="item.ip !== null">{{item.ip.title}}</template></template>
                <template v-slot:item.ic="{item}"><template v-if="item.ic !== null">{{item.ic.title}}</template></template>
                <template v-slot:item.im="{item}"><template v-if="item.im !== null">{{item.im.title}}</template></template>
                <template v-slot:item.action="{item}">
                  <v-icon @click="editSpec(item)" small class="mr-2">mdi-pencil</v-icon>
                  <v-icon @click="deleteSpec(item)" small class="mr-2">mdi-delete</v-icon>
                </template>
              </v-data-table>

            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-btn color="success" @click="submitAssignment">ثبت</v-btn>
        <v-btn color="error" @click="cancelAssignment">انصراف</v-btn>
        <v-icon @click="clear()">mdi-close-circle</v-icon>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
  import VuePersianDatetimePicker from 'vue-persian-datetime-picker'
  import {baseFunctions} from "../../../mixins/graphql/baseFunctions";
  import {order} from "../../../grahpql/queries/order/order";
  import {specMutation} from "../../../grahpql/queries/order/spec/mutation/mutation";
  import {allIps, allIcs, allIms} from "../../../grahpql/queries/order/spec/spec";
  import cloneDeep from 'lodash/cloneDeep'

  export default {
    data(){
      return {
        name: "OrderSpecForm",
        orderSpecs: [],
        allIps: null,
        allIcs: null,
        allIms: null,
        assignFormDefault: {
          id: '',
          orderId: '',
          qty: '',
          kw: '',
          rpm: '',
          voltage: '',
          ip: {id: ''},
          ic: {id: ''},
          im: {id: ''},
          date: '',
          summary: '',
        },
        assignForm: {
          id: '',
          orderId: '',
          qty: '',
          kw: '',
          rpm: '',
          voltage: '',
          ip: {id: ''},
          ic: {id: ''},
          im: {id: ''},
          date: '',
          summary: '',
        },
        editingIndex: -1,
        specHeaders: [
          {value: 'id', text: 'id', align: ' d-none'},
          {value: 'qty', text: 'دستگاه'},
          {value: 'kw', text: 'کیلووات'},
          {value: 'rpm', text: 'سرعت'},
          {value: 'voltage', text: 'ولتاژ'},
          {value: 'ip', text: 'IP'},
          {value: 'im', text: 'IM'},
          {value: 'ic', text: 'IC'},
          {value: 'action', text: ''},
        ],
        specs: [
          {
            id: 2,
            orderId: 1,
            qty: 6,
            kw: 132,
            rpm: 3000,
            voltage: 380,
            IPID: 1,
            ICID: 1,
            IMID: 1,
            date: "1398-12-01",
            summary: 'some summary'
          },
          {
            id: 3,
            orderId: 2,
            qty: 9,
            kw: 160,
            rpm: 1500,
            voltage: 380,
            IPID: 1,
            ICID: 1,
            IMID: 1,
            date: "1398-12-12",
            summary: 'some summary'
          },
          {
            id: 4,
            orderId: 2,
            qty: 1,
            kw: 75,
            rpm: 1000,
            voltage: 690,
            IPID: 1,
            ICID: 1,
            IMID: 1,
            date: "1398-12-10",
            summary: 'some summary'
          },
        ],
        ICList: [],
        IPList: [],
        IMList: [],
      }
    },
    methods: {
      editSpec: function(item){
        if (item.ic === null){
          item.ic = {id: ''}
        }
        if (item.im === null){
          item.im = {id: ''}
        }
        if (item.ip === null){
          item.ip = {id: ''}
        }
        this.assignForm = cloneDeep(item)
      },
      deleteSpec(){
        console.log('method.');
      },
      submitAssignment(){
        console.log('assignment');
      },
      cancelAssignment(){
        console.log('assignment');
        this.$emit('closeAssignDialog')
      },
      addSpecToList(){
        if (this.editingIndex !== -1){
          // this.specs[this.editingIndex] = this.assignForm;
          Object.assign(this.specs[this.editingIndex], this.assignForm);
          this.editingIndex = -1;
        }else {
          this.specs.push(this.assignForm)
        }
        // Probably saving the spec to db and fetching specs again.
        this.$apollo.mutate({
          mutation: specMutation,
          variables: {
            code: 99009900,
            order_id: this.orderId,
            type_id: "1",
            owner_id: "",
            qty: this.assignForm.qty,
            kw: this.assignForm.kw,
            voltage: this.assignForm.voltage,
            rpm: this.assignForm.rpm,
            rpm_new_id: "UnBtVHlwZU5vZGU6MQ==",
            ip_id: this.assignForm.ip.id,
            im_id: this.assignForm.im.id,
            ic_id: this.assignForm.ic.id,
            summary: this.assignForm.summary
          }
        }).then(() => {
          this.$apollo.queries.order.refetch().then(() => {
            this.$emit('updateSpecs', this.orderSpecs)
          }, error => {
            console.log(error)
          });

        }, error => {
          console.log(error)
        });
      },
    },
    props: [
      "specId",
      "orderId"
    ],
    mixins: [
      baseFunctions
    ],
    components: {
      PersianDatePicker: VuePersianDatetimePicker,
    },
    apollo: {
      order: {
        query: order,
        variables(){
          return {
            order_id: this.orderId
          }
        },
        result(result){
          this.orderSpecs = this.noNode(result.data.order.reqspecSet)
        }
      },
      allIps: {
        query: allIps,
        result(result){
          this.IPList = cloneDeep(this.noNode(result.data.allIps));
          this.$set(this.assignForm, 'ip', result.data.allIps.edges[0].node)
        }
      },
      allIcs: {
        query: allIcs,
        result(result){
          this.ICList = cloneDeep(this.noNode(result.data.allIcs));
          this.$set(this.assignForm, 'ic', result.data.allIcs.edges[0].node)
        }
      },
      allIms: {
        query: allIms,
        result(result){
          this.IMList = cloneDeep(this.noNode(result.data.allIms));
          this.$set(this.assignForm, 'im', result.data.allIms.edges[0].node)
        }
      }
    }
  }
</script>

<style scoped>

</style>
