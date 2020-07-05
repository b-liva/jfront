<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="6" md="4">
          <customer-card :customer-id="income.customer.id"/>
        </v-col>
        <v-col>
          <v-card>
            <v-card-title>واریزی شماره {{income.number}}</v-card-title>
            <v-card-text>
              {{income.type.title}}
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col cols="10" md="8">
          <v-icon @click="editIncome(income.id)" small class="mr-2">mdi-pencil</v-icon>
          <v-icon @click="deleteIncome(income.id)" small class="mr-2">mdi-delete</v-icon>
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col cols="6">
          <v-data-table
            dense
          :items="incomeAssignments"
          :headers="incomeAssignmentHeader">
            <template v-slot:item.proforma="{item}">
              <router-link :to="{name: 'ProformaDetails', params: {id: item.proforma.id}}">{{item.proforma.number}}</router-link>
            </template>
            <template v-slot:item.action="{item}">
              <v-icon @click="editIncomeAssignment(item)" small class="mr-2">mdi-pencil</v-icon>
              <v-icon @click="deleteIncomeAssignment(item.id)" small class="mr-2">mdi-delete</v-icon>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
      <v-dialog v-model="incomeFormDialog" max-width="800px">
        <income-form :income-id="income.id"/>
      </v-dialog>
      <v-dialog v-model="incomeAssignmentFormDialog" max-width="800px">
        <income-assignment-form :income-assignment-row-id="incomeAssignment"/>
      </v-dialog>
      <v-dialog persistent v-model="incomeCreationHolder" max-width="1000px">
        <income-creation-holder-from
          v-on:closeIncomeCreationHolder="incomeCreationHolder = false"
          v-if="incomeCreationHolder"
        />
      </v-dialog>
    </v-container>
  </div>
</template>

<script>
  import IncomeForm from "../../components/income/IncomeForm";
  import IncomeAssignmentForm from "../../components/income/assignment/IncomeAssignmentForm";
  import CustomerCard from "../../components/customer/CustomerCard";
  import IncomeCreationHolderFrom from "../../components/income/IncomeCreationHolderFrom";
  import {mapGetters, mapActions} from 'vuex';
  import * as incomeStoreTypes from '../../store/types/income';
  import * as incomeGql from '../../grahpql/queries/income/queries/income.graphql';

  // import {
  //   MUTATE_INCOME_ID,
  //   MUTATE_INCOME_ROW_FORM_IS_ACTIVE,
  //   MUTATE_UPSERTED_INCOME_ROW
  // } from "../../store/types/income";

  export default {
    data(){
      return {
        name: "IncomeDetails",
        income: {
          id: '',
          customer: {
            id: '',
            name: '',
          },
          type: {
            id: '',
            title: ''
          }
        },
        incomeAssignment: '',
        incomeFormDialog: false,
        incomeAssignmentFormDialog: false,
        incomeCreationHolder: false,
        incomeAssignmentHeader: [
          {value: "proforma", text: "شماره"},
          {value: "date", text: "تاریخ"},
          {value: "amount", text: "مبلغ"},
          {value: "action", text: ""},
        ],
      }
    },
    mounted() {
      this.updateIncomeRows(this.$route.params.id)
    },
    updated() {
      console.log(this.incomeAssignments)
    },
    methods: {
      ...mapActions({
        updateIncomeRows: incomeStoreTypes.ACTION_UPDATE_INCOME_ROWS
      }),
      editIncome(){
        console.log('method.')
        this.incomeFormDialog = true;
      },
      deleteIncome(){
        console.log('method.')
      },
      editIncomeAssignment(item){
        // this.incomeAssignment = item;
        // this.incomeAssignmentFormDialog = true;
        console.log('edit', item)
        // this.$store.commit(MUTATE_UPSERTED_INCOME_ROW, item)
        // this.$store.commit(MUTATE_INCOME_ID, item.income.id)
        // this.$store.commit(MUTATE_INCOME_ROW_FORM_IS_ACTIVE, true)
        // this.updateUnpaidProformas(item.income.customer.id)
        this.incomeCreationHolder = true;
      },
      deleteIncomeAssignment(item){
        console.log('delete', item)
      },
    },
    computed: {
      ...mapGetters({
        incomeAssignments: incomeStoreTypes.INCOME_ROWS
      })
    },
    components: {
      IncomeForm,
      IncomeAssignmentForm,
      CustomerCard,
      IncomeCreationHolderFrom
    },
    apollo: {
      incomeById: {
        query: incomeGql.incomeById,
        skip(){
          return !this.$route.params.id;
        },
        variables(){
          return {
            'income_id': this.$route.params.id,
          }
        },
        result({data}){
          this.income = data.incomeById;
        }
      }
    }
  }
</script>

<style scoped>

</style>
