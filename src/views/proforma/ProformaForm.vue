<template>
<div>
    <v-card>
      <v-card-title>ثبت پیش فاکتور برای درخواست شماره: {{order.number}} مربوط به مشتری: {{order.customer.name}}</v-card-title>
      <v-card-text>{{specs}}</v-card-text>
      <v-card-actions>
        <v-btn>ثبت</v-btn>
        <v-btn>انصراف</v-btn>
      </v-card-actions>
    </v-card>
</div>
</template>

<script>
  export default {
    data(){
      return {
        name: "ProformaForm",
      }
    },
    props: ['order', 'specs']
  }
</script>

<style scoped>

</style>
