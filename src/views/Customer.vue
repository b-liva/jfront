<template>
  <div><h3>جزئیات مربوط به شرکت {{customerName}} </h3></div>
</template>

<script>
  export default {
    data() {
      return {
        name: "Customer",
        id: this.$route.params.id,
        customerName: this.$route.params.name,
      }
    }
  }
</script>

<style scoped>
</style>
