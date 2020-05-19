<template>
  <div>
    <v-data-table
    :items="proformaSpecs"
    :headers="proformaHeader">
      <template v-slot:item.im="{item}">
        {{item.im.title}}
      </template>
      <template v-slot:item.ip="{item}">
        {{item.ip.title}}
      </template>
      <template v-slot:item.ic="{item}">
        {{item.ic.title}}
      </template>
      <template v-slot:item.totalPrice="{item}">
        {{item.qty * item.price}}
      </template>
    </v-data-table>
  </div>
</template>

<script>
  export default {
    data(){
      return {
        name: "ProformaPreview",
        proformaHeader: [
          {value: 'code', text: 'کد'},
          {value: 'qty', text: 'تعداد'},
          {value: 'kw', text: 'کیلووات'},
          {value: 'rpm', text: 'سرعت'},
          {value: 'voltage', text: 'ولتاژ'},
          {value: 'im', text: 'IM'},
          {value: 'ip', text: 'IP'},
          {value: 'ic', text: 'IC'},
          {value: 'price', text: 'قیمت'},
          {value: 'totalPrice', text: 'قیمت کل'},
        ]
      }
    },
    props: ["proformaSpecs"]
  }
</script>

<style scoped>

</style>
