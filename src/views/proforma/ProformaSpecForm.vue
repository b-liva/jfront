<template>
  <div>

    <v-card>
      <v-card-title>ثبت پیش فاکتور برای درخواست شماره: {{order.number}} مربوط به مشتری: {{order.customer.name}}
      </v-card-title>
      <v-card-text>
        <v-layout row wrap>
          <v-flex xs4>
            <p>
              <v-icon @click="addAllToProformaSpecs">mdi-check-all</v-icon>
            </p>
            <ul>
              <template v-for="spec in order.specs">
                <li v-if="!spec.staged" :key="spec.id">
                  <p class="mx-4">
                    <span>{{spec.qty}}</span>
                    <span>دستگاه</span>
                    <span>{{spec.kw}}</span>
                    <span>کیلووات</span>
                    <span>{{spec.rpm}}</span>
                    <span>دور</span>
                    <span>{{spec.voltage}}</span>
                    <span>ولت</span>
                    <span><v-icon @click="addToPorformaSpecs(spec)"> mdi-plus</v-icon></span>
                  </p>
                </li>
              </template>
            </ul>
          </v-flex>
          <v-flex xs8>
            <v-data-table
              dense
              :headers="headers"
              :items="proformaSpecs"
              hide-default-footer>
              <template v-slot:item.qty="{item}">
                <v-text-field dense v-model="item.qty" class="qty"></v-text-field>
              </template>
              <template v-slot:item.price="{item}">
                <v-text-field dense v-model="item.price"></v-text-field>
              </template>
              <template v-slot:item.action="{item}">
                <v-icon @click="removeFromProformaSpecs(item)">mdi-delete</v-icon>
              </template>
            </v-data-table>
          </v-flex>
        </v-layout>

      </v-card-text>
      <v-card-actions>
        <v-btn @click="submit">ثبت</v-btn>
        <v-btn @click="cancel">انصراف</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        name: "ProformaSpecForm",
        proformaSpecs: [],
        headers: [
          {value: 'qty', text: 'تعداد', align: 'center', class: 'qty-header'},
          {value: 'kw', text: 'کیلووات',},
          {value: 'rpm', text: 'سرعت',},
          {value: 'voltage', text: 'ولتاژ',},
          {value: 'price', text: 'قیمت',},
          {value: 'action', text: '',},
        ]
      }
    },
    props: ['order', 'proformaFormDialog'],
    created() {
      console.log('created')
      this.order.specs.map((spec) => {
        spec.price = 0;
        spec.staged = false;
      });
    },
    methods: {
      addToPorformaSpecs(spec) {
        this.proformaSpecs.push(spec)
        spec.staged = true;
      },
      removeFromProformaSpecs(spec) {
        const index = this.proformaSpecs.indexOf(spec)
        this.proformaSpecs.splice(index, 1)
        spec.staged = false
      },
      addAllToProformaSpecs() {
        this.order.specs.map((row) => {
          console.log(row.price > 0 && !row.staged)
          if (!row.staged) {
            this.proformaSpecs.push(row)
            row.staged = true
          }
        })
      },
      submit(){
        alert('sending to server')
        this.close()
      },
      cancel(){
        this.close()
      },
      close(){
        this.$emit('close-event')
      }
    }
  }
</script>

<style scoped>
  th.text-center.qty-header.sortable {
    width: 82px;
  }
  .qty {
    align-items: center;
  }
</style>
