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
              <td>{{row.qty}}</td>
              <td>{{row.kw}}</td>
              <td>{{row.rpm}}</td>
              <td>{{row.voltage}}</td>
              <td>{{row.price}}</td>
            </tr>
            </tbody>
          </table>
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
    data(){
      return {
        name: "ProformaList",
        expanded: false,
        snackbar: false,
        proformaFormDialog: false,
        headers: [
          {value: 'number', text: 'شماره پیش فاکتور'},
          {value: 'orderNumber', text: 'شماره درخواست'},
          {value: 'customer', text: 'مشتری'},
          {value:'date', text: 'تاریخ'},
          {value:'action', text: ''},
        ],
        pSpecHeader: [
          {value: 'qty', text: 'تعداد'},
          {value: 'kw', text: 'کیلووات'},
          {value: 'rpm', text: 'دور'},
          {value: 'voltage', text: 'ولتاز'},
          {value: 'price', text: 'قیمت'},
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
      editItem(item){
        console.log('editing Item: ', item);
      },
      deleteItem(item){
        console.log('deleting Item: ', item);
      },
    },
    components: {
      ProformaForm: ProformaForm,
    }
  }
</script>

<style scoped>

</style>
