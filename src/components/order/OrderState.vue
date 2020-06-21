<template>
  <div>
    <v-container>
      <v-row> <p>isn: {{insOrders}}</p>
        <v-col>
          <ul v-if="typeof LastOrders !== 'undefined'">
            <li v-for="order in ords" :key="order.id"> {{order.number}} - {{order.customer.name}} </li>
          </ul>
        </v-col>
        <v-col>
          <order-form v-if="addOrder"/>
        </v-col>
      </v-row>
    </v-container>
    <v-btn @click="addOrder = true">add new order</v-btn>
    <v-btn @click="updateL">
      update last orders.
    </v-btn>

    <hr/>
    <p>this is from store:</p>
    {{lastOrders}}
  </div>
</template>

<script>

  import * as orderGql from '../../store/gql/order/order.graphql';
  import {ACTION_LAST_ORDERS, INSERTED_ORDER, LAST_ORDERS} from "../../store/types";
  import {baseFunctions} from "../../mixins/graphql/baseFunctions";
  import {mapActions, mapGetters} from 'vuex';
  import OrderForm from "./OrderForm";

  console.log(ACTION_LAST_ORDERS)
  export default {
    data(){
      return {
        name: "OrderState",
        ords: [],
        addOrder: false,
      }
    },
    methods: {
      updateL(){
        console.log('updateL')
        this.updateOrdersAsync()
      },
      ...mapActions({
         updateOrdersAsync: ACTION_LAST_ORDERS,
       })
    },
    computed: {
      ...mapGetters({
        insOrders: INSERTED_ORDER,
        lastOrders: LAST_ORDERS,
      })
    },
    components: {
      OrderForm
    },
    mixins: [baseFunctions],
    apollo:{
      LastOrders: {
        query: orderGql.LastOrders,
        result({data}){
          console.log(data)
          this.ords = this.noNode(data.LastOrders)
          console.log(this.ords)
        }
      }
    }
  }
</script>

<style scoped>

</style>
