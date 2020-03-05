<template>
  <div>
    <h3>جزئیات مربوط به شرکت {{customerName}} </h3>
    <v-list>
      <v-list-item v-for="customer in customers" :key="customer.id">
        <v-list-item-content >
          <v-list-item-title>{{customer.name}}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </div>
</template>

<script>
  import db from '@/firebase/init'

  export default {
    data() {
      return {
        name: "Customer",
        id: this.$route.params.id,
        customerName: this.$route.params.name,
        customers: [],
      }
    },
    created() {
      db.collection('customer').get()
        .then(snapshot => {
          snapshot.forEach(doc => {
            let customer = doc.data()
            customer.id = doc.id
            this.customers.push(customer)
          })
        })
    }
  }
</script>

<style scoped>
</style>
