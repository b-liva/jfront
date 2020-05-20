<template>
  <div>
    <v-data-table
    :items="specs"
    :headers="orderHeaders">
      <template v-slot:item.im="{item}">
        {{item.im.title}}
      </template>
      <template v-slot:item.ip="{item}">
        {{item.ip.title}}
      </template>
      <template v-slot:item.ic="{item}">
        {{item.ic.title}}
      </template>
    </v-data-table>
  </div>
</template>

<script>
  export default {
    data(){
      return {
        name: "OrderPreview",
        orderHeaders: [
          {value: 'qty', text: "تعداد"},
          {value: 'kw', text: "کیلووات"},
          {value: 'rpm', text: "سرعت"},
          {value: 'voltage', text: "ولتاژ"},
          {value: 'im', text: "IM"},
          {value: 'ip', text: "IP"},
          {value: 'ic', text: "IC"},
        ]
      }
    },
    props: ["specs"]
  }
</script>

<style scoped>

</style>
