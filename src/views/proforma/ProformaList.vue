<template>
  <div>
    <v-snackbar
      v-model="snackbar"
      color="success"
      timeout="3000"
      top>
      پیش فاکتور با موفقیت ثبت شد.
    </v-snackbar>
    <v-data-table
      :headers="headers"
      :items="getRelatedProformas()"
      :expand="expanded"
      show-expand
      single-expand
      @item-expanded="proformaClicked">
      <template v-slot:item.orderNumber="{item}">
        {{item.reqId.number}}
      </template>
      <template v-slot:top>
        <v-toolbar>
          <v-toolbar-title>پیش فاکتور</v-toolbar-title>
          <v-divider
            vertical
            inset
            class="mx-4"></v-divider>
          <v-spacer></v-spacer>
          <v-btn dark color="primary" @click="addProforma">پیش فاکتور جدید</v-btn>
        </v-toolbar>
      </template>
      <template v-slot:item.action="{item}">
        <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
        <v-icon small class="mr-2" @click="deleteItem(item)">mdi-delete</v-icon>
        <v-icon small class="mr-2 red--text text--darken-3">mdi-file-pdf</v-icon>
      </template>
      <template v-slot:expanded-item="{headers, item}">
        <td :colspan="headers.length">
          <v-data-table dense class="elevation-24" :headers="pSpecHeader" :items="getProformaSpecs(item)">
            <template v-slot:item.qty="props">
              <v-edit-dialog
                :return-value.sync="props.item.qty"
                save-text="ذخیره"
                cancelText="بیخیال"
                large
                eager
                persistent
                @save="save"
                @cancel="cancel"
                @open="open"
                @close="close">
                <div>{{props.item.qty}} دستگاه</div>
                <template v-slot:input>
                  <v-text-field
                    v-model="props.item.qty"
                    label="Edit"
                    single-line>
                  </v-text-field>
                </template>
              </v-edit-dialog>
            </template>
            <template v-slot:item.price="props">
              <v-edit-dialog
                :return-value.sync="props.item.price"
                save-text="ذخیره"
                cancel-text="انصراف"
                large
                persistent
                @save="save"
                @cancel="cancel"
                @open="open"
                @close="close">{{props.item.price}}
                <template v-slot:input>
                  <v-text-field
                    v-model="props.item.price"
                    label="Edit"
                    single-line>
                  </v-text-field>
                </template>
              </v-edit-dialog>
            </template>
          </v-data-table>
        </td>
      </template>
    </v-data-table>
    <v-dialog v-model="proformaFormDialog">
      <proforma-spec-form v-if="proformaFormDialog" :order="order" v-on:close-event="proformaFormDialog = false"/>
    </v-dialog>

  </div>
</template>

<script>
  import ProformaSpecForm from "../../components/proforma/ProformaSpecForm";
  import {baseFunctions} from "../../mixins/graphql/baseFunctions";
  import {proformasByOrderId} from "../../grahpql/queries/proforma/proforma";
  import {proformaSpecs} from "../../grahpql/queries/proforma/specs/proformaSpecs";

  export default {
    data() {
      return {
        name: "ProformaList",
        expanded: false,
        snackbar: false,
        editingPSpec: false,
        proformaFormDialog: false,
        selectedProformaId: null,
        headers: [
          {value: 'number', text: 'شماره پیش فاکتور'},
          {value: 'orderNumber', text: 'شماره درخواست'},
          {value: 'date', text: 'تاریخ'},
          {value: 'action', text: ''},
        ],
        pSpecHeader: [
          {value: 'qty', text: 'تعداد'},
          {value: 'kw', text: 'کیلووات'},
          {value: 'rpm', text: 'دور'},
          {value: 'voltage', text: 'ولتاژ'},
          {value: 'price', text: 'قیمت'},
        ]
      }
    },
    props: [
      "order",
      "order_id"
    ],
    methods: {
      getRelatedProformas(){
        // console.log('getting proformas for: ', this.order);
        if (typeof this.proformasByOrderId != "undefined" && this.proformasByOrderId != null){
          return this.noNode(this.proformasByOrderId.xprefSet)
        }
        // return [
        //   {
        //     id: 1, number: 9820365, orderNumber: 980204, customer: {id: 5, name: 'تهران بوستون'}, date: "1398-12-26",
        //     pspecs: [{qty: 2, kw: 132, rpm: 1500, voltage: 380, price: 25000000, editingPSpec: false}, {
        //       qty: 3,
        //       kw: 160,
        //       rpm: 1500,
        //       voltage: 380,
        //       price: 25000000,
        //       editingPSpec: false
        //     }]
        //   },
        //   {
        //     id: 2, number: 9830562, orderNumber: 981235, customer: {id: 1, name: 'پارس تهران'}, date: "1398-12-26",
        //     pspecs: [{qty: 2, kw: 315, rpm: 3000, voltage: 380, price: 25000000, editingPSpec: false}, {
        //       qty: 3,
        //       kw: 160,
        //       rpm: 1500,
        //       voltage: 380,
        //       price: 25000000,
        //       editingPSpec: false
        //     }]
        //   },
        // ]
      },
      proformaClicked(proforma) {
        console.log('proforma clicked.', proforma)
      },
      getProformaSpecs(item){
        console.log(item)
        this.selectedProformaId = item.id;
        if (typeof this.proformaSpecs !== "undefined" && this.proformaSpecs !== null){
          return this.noNode(this.proformaSpecs.prefspecSet);
        }
      },
      editItem(item) {
        console.log('editing Item: ', item);
      },
      deleteItem(item) {
        console.log('deleting Item: ', item);
      },
      editPspec: function (item) {
        item.editingPSpec = true;
        console.log('editing Item: ', item);

      },
      savingChanes: function (row) {
        row.editingPSpec = false;
        console.log('saving', row)
      },
      cancelChanges: function (row) {
        row.editingPSpec = false;
        console.log('canceling', row)
      },
      addProforma(){
        this.proformaFormDialog = true
      },
      save() {
        console.log('implementing soon.')
      },
      cancel() {
        console.log('implementing soon.')
      },
      open() {
        console.log('implementing soon.')
      },
      close() {
        console.log('implementing soon.')
      },
    },
    mixins: [
      baseFunctions
    ],
    components: {
      ProformaSpecForm: ProformaSpecForm,
    },
    created() {
      this.proformas = this.getRelatedProformas();
    },
    apollo: {
      proformasByOrderId: {
        query: proformasByOrderId,
        skip(){
          return !this.order_id
        },
        variables(){
          return {
            order_id: this.order_id
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
      }
    }
  }
</script>

<style scoped>

</style>
