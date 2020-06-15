<template>
  <v-app>
    <router-view></router-view>
  </v-app>
</template>

<script>
  export default {
    name: 'App',

    data: () => ({
      //
    }),
    mounted() {
      this.$vuetify.rtl = true;
    },
  };
</script>
<style lang="scss">
  @import 'assets/index';
</style>
