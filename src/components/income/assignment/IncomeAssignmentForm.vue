<template>
  <div>
    <v-card>
      <v-toolbar
        flat
        color="transparent">
        <v-toolbar-title>تخصیص واریزی</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn
          icon
          @click="cancelIncomeAssignment(income)"
        >
          <v-icon class="red--text">mdi-close-circle</v-icon>
        </v-btn>
      </v-toolbar>
    </v-card>
    <v-card>
      <v-card-title>
        اختصاص مبلغ از واریزی {{income.id}} به پیش فاکتور شماره: <span>{{proforma.number}}</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="6">
              <v-form>
                <div v-if="loading">LOADING....</div>
                <v-text-field
                  type="number"
                  label="شماره پیش فاکتور"
                  v-model="proforma.number"
                  disabled></v-text-field>
                <div v-if="statusOk">
                  <v-text-field label="مبلغ" v-model="incomeAssignmentForm.amount"></v-text-field>
                  <PersianDatePicker
                    v-model="incomeAssignmentForm.date"
                    format="jYYYY-jMM-jDD"
                    display-format="dddd jDD jMMMM jYYYY"
                    label="دریافت"
                    :auto-submit="true"/>
                  <v-textarea v-model="incomeAssignmentForm.summary" label="توضیحات"></v-textarea>
                </div>
              </v-form>
            </v-col>
            <v-col cols="6">
              پیش فاکتور های دارای مانده
              <ol v-if="customerStatus">

                <li
                  v-for="proforma in customerStatus.unpaidProformas"
                  :key="proforma.key"
                  @click="setProforma(proforma)"
                >{{proforma.number}} - {{proforma.unpaidTotal}}</li>
              </ol>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <div v-if="statusOk">
          <v-btn color="success" @click="submitIncomeAssignment">ثبت</v-btn>
          <v-btn color="error" @click="cancelIncomeAssignment">انصراف</v-btn>
          <v-icon @click="clear()">mdi-close-circle</v-icon>
        </div>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
  import VuePersianDatetimePicker from 'vue-persian-datetime-picker';
  import {baseFunctions} from "../../../mixins/graphql/baseFunctions";
  import {incomeRowById} from "../../../grahpql/queries/income/incomeAssignment";
  import {assingIncomeRowMutation} from "../../../grahpql/queries/income/row/mutation/mutation";
  import {proformaIdByNumber} from "../../../grahpql/queries/proforma/proforma";
  import {customerUnpaidProformas} from "../../../grahpql/queries/customer/customer";

  export default {
    data(){
      return {
        name: "IncomeAssignmentForm",
        proforma: {
          id: '',
          number: ''
        },
        loading: false,
        statusOk: false,
        incomeAssignmentFormDefault: {
          number: '',
          proformaId: '',
          income: {
            id: '',
            number: ''
          },
          amount: '',
          summary: ''
        },
        incomeAssignmentForm: {
          number: '',
          proformaId: '',
          income: {
            id: '',
            number: ''
          },
          amount: '',
          summary: ''
        },
        customerStatus: {}
      }
    },
    props: [
      "incomeAssignmentRowId",
      "income",
      "refetchAssignments"
    ],
    created() {
      console.log('*****: ', this.income.id)
    },
    updated() {
      console.log('assg udpated: ', this.income)
    },
    methods: {
      setProforma(proforma){
        this.proforma = proforma
      },
      submitIncomeAssignment(item){
        console.log('method', item);
        this.$apollo.mutate({
          mutation: assingIncomeRowMutation,
          variables: {
            income_id: this.income.id,
            date_fa: this.incomeAssignmentForm.date,
            summary: this.incomeAssignmentForm.summary,
            owner_id: "",
            proforma_id: this.incomeAssignmentForm.proformaId,
            amount: this.incomeAssignmentForm.amount
          }
        }).then(() => {
          this.loading = true;
          console.log('this is customerid: ', this.income.customer.id)
          this.$apollo.queries.customerUnpaidProformas.refetch({
            "customer_id": this.income.customer.id
          });
          console.log('emitting from income assg form')
        }, error => {
          console.log(error)
        });
      },
      cancelIncomeAssignment(item){
        console.log('cancelIncomeAssignment: ', item, this.income.id);
        // this.$emit('incomeAssigned', this.income.id)
        this.refetchAssignments(this.income.id)
      },
    },
    components: {
      PersianDatePicker: VuePersianDatetimePicker
    },
    mixins: [
      baseFunctions
    ],
    apollo: {
      incomeRowById: {
        query: incomeRowById,
        skip(){
          return !this.incomeAssignmentRowId
        },
        variables(){
          return {
            income_row_id: this.incomeAssignmentRowId
          }
        },
        result(){
          console.log(this.incomeRowById);
          this.incomeAssignmentForm = this.incomeRowById;
        }
      },
      proformaIdByNumber: {
        query: proformaIdByNumber,
        debounce: 500,
        skip(){
          return !this.proforma.number
        },
        variables(){
          return {
            number: this.proforma.number
          }
        },
        update(data){
          console.log('update: ', data)
        },
        result ({data}){
          if (data && typeof data.proformaIdByNumber !== "undefined"){
            let proforma = data.proformaIdByNumber.edges;
            if (proforma.length > 0){
              this.incomeAssignmentForm.proformaId = proforma[0].node.id;
              this.proforma.number = proforma[0].node.number;
              this.statusOk = true;
            }else {
              this.incomeAssignmentForm.proformaId = "";
              this.statusOk = false;
            }
          }else {
            this.statusOk = false
          }
        },
        error(){
          this.statusOk = false;
        },
        watchLoading (isLoading){
          this.loading = isLoading;
        }
      },
      customerUnpaidProformas: {
        query: customerUnpaidProformas,
        variables(){
          return {
            "customer_id": this.income.customer.id
          }
        },
        skip(){
          return !this.income
        },
        result(result){
          this.customerStatus = result.data.customerUnpaidProformas
          this.loading = false;
        }
      }
    }
  }
</script>

<style scoped>

</style>
