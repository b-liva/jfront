<template>
  <div>
    <navbar/>
    <v-content>
      <router-view/>
    </v-content>
  </div>
</template>

<script>
  import Navbar from "../Navbar";

  export default {
    data(){
      return{
        name: "Layout"
      }
    },
    components: {
      Navbar
    }
  }
</script>

<style scoped>

</style>
