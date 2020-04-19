<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-card
            class="mx-auto customer-card"
            outlined>
            <v-card-title>
              {{customer.name}}
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="6">
                  <div class="rightDetails">{{customer.address}}</div>
                </v-col>
                <v-col cols="6">
                  <div class="leftDetails bordered">
                    <div><v-icon small class="mr-2">mdi-phone</v-icon>{{customer.tel}}</div>
                    <div><v-icon small class="mr-2">mdi-fax</v-icon>{{customer.fax}}</div>
                    <div><v-icon small class="mr-2">mdi-email</v-icon>{{customer.email}}</div>
                    <div><a :href="customer.website" target="_blank">Website</a></div>
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
  export default {
    data() {
      return {
        name: "card",
        customer: '',
      }
    },
    props: [
      'customerId',
    ],
    methods: {
      getCustomerById() {
        return {
          name: 'پتروشیمی مارون',
          address: 'ماهشهر - خوزستان - ماهشهر - منطقه ویژه اقتصادی - سایت ',
          tel: '52295000-061',
          fax: '52295027-061',
          website: 'https://www.mpc.ir/',
          email: 'CEO@MPC.IR',
        }
      }
    },
    created() {
      this.customer = this.getCustomerById();
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
