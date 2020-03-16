<template>
  <div>
<ProformaList/>
  </div>
</template>

<script>
  import ProformaList from "./ProformaList";

  export default {
    data() {
      return {
        name: "proformas",
      }
    },
  components: {
      ProformaList: ProformaList
  }
  }
</script>

<style scoped>

</style>
