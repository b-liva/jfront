<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-card
            class="mx-auto customer-card"
            outlined>
            <v-card-title>
              <router-link :to="{name: 'CustomerDetails', params: {id: customerId}}">{{customer.name}}</router-link>
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="6">
                  <div class="rightDetails">{{customer.addr}}</div>
                </v-col>
                <v-col cols="6">
                  <div class="leftDetails bordered">
                    <div><v-icon small class="mr-2">mdi-phone</v-icon>{{customer.phone}}</div>
                    <div><v-icon small class="mr-2">mdi-fax</v-icon>{{customer.fax}}</div>
                    <div><v-icon small class="mr-2">mdi-email</v-icon>{{customer.email}}</div>
                    <div><a :href="customer.website" target="_blank">{{customer.website}}</a></div>
                  </div>
                </v-col>
                <v-col>

                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>

</template>

<script>
  import * as customerGql from '../../grahpql/queries/customer/customer.graphql'

  export default {
    data() {
      return {
        name: "card",
        customer: {},
      }
    },
    props: [
      'customerId',
    ],
    apollo: {
      customerById: {
        query: customerGql.customerById,
        skip(){
          return !this.customerId
        },
        variables(){
          return {
            'customer_id': this.customerId
          }
        },
        result({data}){
          this.customer = data.customerById;
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  .customer-card {
    .leftDetails, .rightDetails{
      font-size: 0.9em;
    }
    .leftDetails{
      direction: ltr;
      border-right: 1px solid gray;
    }
  }

</style>
