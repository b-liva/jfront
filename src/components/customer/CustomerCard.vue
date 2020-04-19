<template>
  <v-card
    class="mx-auto"
    outlined>
    <v-card-title>
      {{title}}
    </v-card-title>
    <v-card-text>
      {{value}}
    </v-card-text>
  </v-card>
</template>

<script>
  export default {
    data(){
      return{
        name: "card",
      }
    },
    props:[
      'value',
      'title',
    ]
  }
</script>

<style scoped>

</style>
