<template>
  <div>
    <v-card>
      <v-container>{{customerById}}
        <div>{{customer_id}}</div>
        <v-row>
          <v-col cols="10" md="6">
            <v-text-field label="نام" v-model="customerForm.name"></v-text-field>
            <v-checkbox label="نماینده" v-model="customerForm.agent"></v-checkbox>
            <v-text-field label="کارشناس" v-model="customerForm.owner_id"></v-text-field>
            <v-select label="نوع مشتری" :items="types" item-text="name" v-model="customerForm.type_id" item-value="id"></v-select>
            <v-text-field label="تاریخ" v-model="customerForm.date2"></v-text-field>
            <v-text-field label="تلفن" v-model="customerForm.phone"></v-text-field>
            <v-text-field label="فکس" v-model="customerForm.fax"></v-text-field>
            <v-text-field label="ایمیل" v-model="customerForm.email"></v-text-field>
            <v-text-field label="وبسایت" v-model="customerForm.website"></v-text-field>
            <v-text-field label="کد پستی" v-model="customerForm.postalCode"></v-text-field>
            <v-textarea label="آدرس" v-model="customerForm.addr"></v-textarea>
            <v-btn class="primary" @click="submit">ثبت</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </div>
</template>

<script>
  import {createCustomer, allCustomerTypes, customerById} from "../../grahpql/queries/customer/customer";
  import {baseFunctions} from "../../mixins/graphql/baseFunctions";

  export default {
    data() {
      return {
        name: "CustomerForm",
        selectedType: '',
        customerForm: {
          name: null,
          agent: false,
          owner_id: "VXNlck5vZGU6NA==",
          type_id: '',
          date2: "1399-02-11",
          pubDate: "2020-05-09T03:20:28Z",
          phone: '',
          fax: '',
          email: '',
          website: '',
          postalCode: '',
          addr: '',
        },
        types: [],
      }
    },
    props: [
      'customer_id'
    ],
    mixins: [
      baseFunctions
    ],
    methods: {
      clicked(){
        let types = this.noNode(this.allCustomerTypes)
        console.log(types)
        this.$set(this.customerForm, 'type', types)
      },
      submit() {
          this.$apollo.mutate(
            {
              mutation: createCustomer,
              variables: {
                name: this.customerForm.name,
                owner_id: this.customerForm.owner_id,
                type_id: this.customerForm.type_id,
                date2: this.customerForm.date2,
                pubDate: this.customerForm.pubDate,
                phone: this.customerForm.phone,
                fax: this.customerForm.fax,
                email: this.customerForm.email,
                website: this.customerForm.website,
                postalCode: this.customerForm.postalCode,
                addr: this.customerForm.addr,
                agent: this.customerForm.agent,
              }
            }).then((data) => {
            console.log(data)
            this.$emit('cuRefech')
          }).catch((error => {
            console.error(error)
          }));
        }
      },
    watch: {
      allCustomerTypes: function () {
        if (typeof this.allCustomerTypes !== "undefined" && this.allCustomerTypes !== null){
          this.types = this.noNode(this.allCustomerTypes);
        }
      },
      customerById: function () {
        if (typeof this.customerById !== "undefined" && this.customerById !== null){
          this.customerForm = this.customerById
          this.customerForm.type_id = this.customerById.type.id
          this.customerForm.owner_id = this.customerById.owner.id
        }
      }
    },
    created() {
      console.log(this.customer_id)
    },
    apollo: {
      allCustomerTypes: allCustomerTypes,
      customerById: {
        query: customerById,
        variables(){
          return {
            customer_id: this.customer_id
          }
        }
      }
    }
  }
</script>

<style scoped>

</style>
