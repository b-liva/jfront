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
      :items="proformas"
      :expand="expanded"
      show-expand
      single-expand
      @item-expanded="proformaClicked">
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
      <template v-slot:item.customer="{item}">
        {{item.customer.name}}
      </template>
      <template v-slot:item.action="{item}">
        <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
        <v-icon small class="mr-2" @click="deleteItem(item)">mdi-delete</v-icon>
        <v-icon small class="mr-2 red--text text--darken-3">mdi-file-pdf</v-icon>
      </template>
      <template v-slot:expanded-item="{headers, item}">
        <td :colspan="headers.length">
          <v-data-table dense class="elevation-24" :headers="pSpecHeader" :items="item.pspecs">
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
      <proforma-form v-if="proformaFormDialog" :order="order" v-on:close-event="proformaFormDialog = false"/>
    </v-dialog>

  </div>
</template>

<script>
  import ProformaForm from "./ProformaForm";

  export default {
    data() {
      return {
        name: "ProformaList",
        expanded: false,
        snackbar: false,
        editingPSpec: false,
        proformaFormDialog: false,
        headers: [
          {value: 'number', text: 'شماره پیش فاکتور'},
          {value: 'orderNumber', text: 'شماره درخواست'},
          {value: 'customer', text: 'مشتری'},
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
      "proformas",
      "order"
    ],
    methods: {
      proformaClicked() {
        console.log('proforma clicked.')
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
    components: {
      ProformaForm: ProformaForm,
    }
  }
</script>

<style scoped>

</style>
