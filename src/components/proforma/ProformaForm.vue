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

  export default {
    data(){
      return {
        name: "ProformaForm",
        proforma: '',
      }
    },
    props: [
      "proformaId"
    ],
    created() {
      this.proforma = {
        id: this.proformaId,
        number: "98-1025",
        date: "1398-12-02",
      }
    },
    components: {
      PersianDatePicker: VuePersianDatetimePicker
    },
  }
</script>

<style scoped>

</style>
