<template>
  <div>
    <v-data-table
      dense
      :items-per-page="50"
      :items="getCustomers()"
      :headers="customersHeader"
      :loading="$apollo.queries.allCustomers.loading">
      <template v-slot:top>
        <v-toolbar>
          <v-toolbar-title>مشتری</v-toolbar-title>
          <v-divider vertical inset class="mx-4"/>
          <v-spacer/>
          <v-btn class="primary" @click="newCustomer">مشتری جدید</v-btn>
        </v-toolbar>
      </template>
      <template v-slot:item.name="{item}">
        <router-link :to="{name: 'CustomerDetails', params: {id: item.id}}">{{item.name}}</router-link>
      </template>
      <template v-slot:item.agent="{item}">
        <v-icon v-if="item.agent">mdi-checkbox-marked</v-icon>
        <v-icon v-else>mdi-checkbox-blank-outline</v-icon>
      </template>
      <template v-slot:item.action="{item}">
        <v-icon small class="mr-4" @click="editCustomer(item)">mdi-pencil</v-icon>
      </template>
      <template>

      </template>
    </v-data-table>
    <v-dialog v-model="customerFormDialog" max-width="800px">
      <customer-form :customer_id="selectedCustomerId" v-on:cuRefetch="customerRefech"/>
    </v-dialog>
    <v-snackbar
      v-model="snackbar"
      :timeout="timeout"
      color="success"
    >
      {{snackbarText}}
    </v-snackbar>
  </div>
</template>

<script>
  import {baseFunctions} from "../../mixins/graphql/baseFunctions";
  import {allCustomers} from "../../grahpql/queries/customer/customer";
  import CustomerForm from "../../components/customer/CustomerForm";

  export default {
    data() {
      return {
        name: "Customers",
        customerFormDialog: false,
        selectedCustomerId: '',
        snackbar: false,
        timeout: 3000,
        snackbarText: "",
        customersHeader: [
          {value: "name", text: "مشتری"},
          {value: "salesKw", text: "کیلووات"},
          {value: "salesQty", text: "تعداد"},
          {value: "salesAmount", text: "فروش(ریال)"},
          {value: "amountReceived", text: "دریافتی(ریال)"},
          {value: "amountReceivable", text: "مانده(ریال)"},
          {value: "agent", text: "نماینده"},
          {value: "action", text: ""},
        ]
      }
    },
    methods: {
      editCustomer(item){
        this.selectedCustomerId = item.id;
        this.customerFormDialog = true;
      },
      getCustomers() {
        if (typeof this.allCustomers !== "undefined" && this.allCustomers !== null){
          return this.noNode(this.allCustomers)
        }
      },
      newCustomer() {
        this.customerFormDialog = true;
      },
      customerRefech(){
        this.$apollo.queries.allCustomers.refetch();
        this.customerFormDialog = false;
        this.snackbarText = "مشتری جدید با موفقیت ثبت شد.";
        this.snackbar = true
      }
    },
    components: {
      CustomerForm
    },
    mixins: [
      baseFunctions
    ],
    apollo: {
      allCustomers: allCustomers
    }
  }
</script>

<style scoped>

</style>
