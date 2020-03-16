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
      class="elevation-1"
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
          <v-btn dark color="primary" @click="proformaFormDialog = true">پیش فاکتور جدید</v-btn>
        </v-toolbar>
      </template>
      <template v-slot:item.customer="{item}">
        {{item.customer.name}}
      </template>
      <template v-slot:item.action="{item}">
        <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
        <v-icon small class="mr-2" @click="deleteItem(item)">mdi-delete</v-icon>
      </template>
      <template v-slot:expanded-item="{headers, item}">
        <td :colspan="headers.length">
          <table class="expanded-table">
            <thead>
            <th v-for="head in pSpecHeader" :key="head.value">{{head.text}}</th>
            <th></th>
            </thead>
            <tbody>

            <tr v-for="row in item.pspecs" :key="row.id">
              <v-text-field
                v-model="row.qty"
                :disabled="!row.editingPSpec">
              </v-text-field>
              <td>{{row.kw}}</td>
              <td>{{row.rpm}}</td>
              <td>{{row.voltage}}</td>
              <td>
                <v-text-field
                  v-model="row.price"
                  :disabled="!row.editingPSpec">

                </v-text-field>
              </td>
              <td>
                <template v-if="!row.editingPSpec">
                  <v-icon small class="mr-2 green--text text--darken2" @click="editPspec(row)">mdi-pencil</v-icon>
                  <v-icon small class="mr-2 red--text text--darken-2">mdi-delete</v-icon>
                </template>
                <template v-else>
                  <v-icon small class="mr-2 green--text text--darken-2" @click="savingChanes(row)">mdi-check</v-icon>
                  <v-icon small class="mr-2 red--text text--darken-3" @click="cancelChanges(row)">mdi-cancel</v-icon>
                </template>

              </td>
            </tr>
            </tbody>
          </table>
          <v-data-table dense :headers="pSpecHeader" :items="item.pspecs">
            <template v-slot:item.qty="{item}">
              <v-text-field v-model="item.qty" :disabled="!item.editingPSpec"></v-text-field>
            </template>
            <template v-slot:item.price="{item}">
              <v-text-field :disabled="!item.editingPSpec" v-model="item.price"></v-text-field>
            </template>
            <template v-slot:item.action="{item}">
              <template v-if="!item.editingPSpec">
                <v-icon small class="mr-2 green--text text--darken2" @click="editPspec(item)">mdi-pencil</v-icon>
                <v-icon small class="mr-2 red--text text--darken-2">mdi-delete</v-icon>
              </template>
              <template v-else>
                <v-icon small class="mr-2 green--text text--darken-2" @click="savingChanes(item)">mdi-check</v-icon>
                <v-icon small class="mr-2 red--text text--darken-3" @click="cancelChanges(item)">mdi-cancel</v-icon>
              </template>
            </template>

          </v-data-table>
        </td>
      </template>
    </v-data-table>
    <v-dialog v-model="proformaFormDialog">
      <proforma-form/>
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
          {value: 'voltage', text: 'ولتاز'},
          {value: 'price', text: 'قیمت'},
          {value: 'action', text: ''},
        ]
      }
    },
    props: [
      "proformas",
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
    },
    components: {
      ProformaForm: ProformaForm,
    }
  }
</script>

<style scoped>

</style>
