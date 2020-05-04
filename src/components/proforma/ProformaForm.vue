<template>
  <div>
    <v-card>
      <v-card-title>
        ویرایش پیش فاکتور شماره {{proforma.number}}
      </v-card-title>
      <v-card-text>
        <v-text-field v-model="proforma.number" label="شماره"></v-text-field>
        <PersianDatePicker
          v-model="proforma.date"
          format="jYYYY-jMM-jDD"
          :auto-submit="true"/>
      </v-card-text>
      <v-card-actions>
        <v-btn>ثبت</v-btn>
        <v-btn>انصراف</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
  import VuePersianDatetimePicker from 'vue-persian-datetime-picker';
  import {proformaById} from "../../grahpql/queries/proforma/proforma";
  import cloneDeep from 'lodash/cloneDeep'

  export default {
    data(){
      return {
        name: "ProformaForm",
        proformaFormDefault: {
          id: '',
          number: '',
          date: '',
        },
        proforma: '',
      }
    },
    props: [
      "proformaId"
    ],
    created() {
      this.proforma = cloneDeep(this.proformaFormDefault);
    },
    components: {
      PersianDatePicker: VuePersianDatetimePicker
    },
    watch: {
      proformaById: function () {
        this.proforma = this.proformaById;
      }
    },
    apollo: {
      proformaById: {
        query: proformaById,
        variables(){
          return {
            proforma_id: this.proformaId
          }
        }
      }
    }
  }
</script>

<style scoped>

</style>
