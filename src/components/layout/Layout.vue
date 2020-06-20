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
  import {AUTH_TOKEN} from "../../vue-apollo";

  export default {
    data(){
      return{
        name: "Layout"
      }
    },
    beforeRouteEnter(to, from, next){
      let token = localStorage.getItem(AUTH_TOKEN)
      if (token) next()
      else next({name: "Login"})
    },
    components: {
      Navbar
    }
  }
</script>

<style scoped>

</style>
