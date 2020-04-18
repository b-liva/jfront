<template>
  <div>
    <v-card>
      <v-card-title>{{specId}}ویرایش ردیف</v-card-title>
      <div>{{assignForm}}</div>
      <div>{{editingIndex}}</div>
      <v-card-text>
        <v-container>
          <v-layout row wrap>
            <v-flex class="purple lighten-4" xs4 md3>
              <v-layout row wrap justify-space-around>
                <v-flex xs5 md6>
                  <v-text-field
                    class="box"
                    type="number"
                    v-model="assignForm.qty"
                    label="تعداد">
                  </v-text-field>
                  <v-text-field class="box" label="کیلووات" v-model="assignForm.kw"></v-text-field>
                </v-flex>
                <v-flex xs5 md6>
                  <v-text-field class="box" label="سرعت" v-model="assignForm.rpm"></v-text-field>
                  <v-text-field class="box" label="ولتاژ" v-model="assignForm.voltage"></v-text-field>
                </v-flex>
                <v-layout>
                  <v-flex xs5 md3>
                    <v-radio-group dense class="d-flex col-md-6 mb-6" v-model="assignForm.IPID">
                      <v-radio
                        v-for="n in IPList"
                        :key="n.id"
                        :label="n.title"
                        :value="n.id"
                      ></v-radio>
                    </v-radio-group>
                  </v-flex>
                  <v-flex xs5 md3>
                    <v-radio-group dense class="d-flex col-md-6 mb-6" v-model="assignForm.ICID">
                      <v-radio
                        v-for="n in ICList"
                        :key="n.id"
                        :label="n.title"
                        :value="n.id"
                      ></v-radio>
                    </v-radio-group>
                  </v-flex>
                  <v-flex xs5 md3>
                    <v-radio-group dense class="d-flex col-md-6 mb-6" v-model="assignForm.IMID">
                      <v-radio
                        v-for="n in IMList"
                        :key="n.id"
                        :label="n.title"
                        :value="n.id"
                      ></v-radio>
                    </v-radio-group>
                  </v-flex>
                </v-layout>
                <v-flex xs12 md6 class="">
                  <PersianDatePicker
                    v-model="assignForm.date"
                    format="jYYYY-jMM-jDD"
                    :auto-submit="true"/>
                </v-flex>
                <v-flex
                  xs12
                  md12>
                  <v-textarea label="توضیحات" v-model="assignForm.summary" auto-grow></v-textarea>
                </v-flex>
              </v-layout>
              <v-layout row wrap>
                <v-flex xs12>
                  <v-icon
                    @click="addSpecToList"
                    small
                    class="mr-2">mdi-arrow-left-bold
                  </v-icon>
                </v-flex>
              </v-layout>
            </v-flex>
            <v-flex xs8 md9 class="pink lighten-4"
            >
              <v-data-table
                :headers="specHeaders"
                :items="specs">
                <template v-slot:item.action="{item}">
                  <v-icon @click="editSpec(item)" small class="mr-2">mdi-pencil</v-icon>
                  <v-icon @click="deleteSpec(item)" small class="mr-2">mdi-delete</v-icon>
                </template>
              </v-data-table>

            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-btn color="success" @click="submitAssignment">ثبت</v-btn>
        <v-btn color="error" @click="cancelAssignment">انصراف</v-btn>
        <v-icon @click="clear()">mdi-close-circle</v-icon>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
  import VuePersianDatetimePicker from 'vue-persian-datetime-picker'
  import cloneDeep from 'lodash/cloneDeep'

  export default {
    data(){
      return {
        name: "OrderSpecForm",
        assignFormDefault: {
          id: '',
          orderId: '',
          qty: '',
          kw: '',
          rpm: '',
          voltage: '',
          IPID: 1,
          ICID: 1,
          IMID: 1,
          date: '',
          summary: '',
        },
        assignForm: '',
        editingIndex: -1,
        specHeaders: [
          {value: 'qty', text: 'دستگاه'},
          {value: 'kw', text: 'کیلووات'},
          {value: 'rpm', text: 'سرعت'},
          {value: 'voltage', text: 'ولتاژ'},
          {value: 'action', text: ''},
        ],
        specs: [
          {
            id: 2,
            orderId: 1,
            qty: 6,
            kw: 132,
            rpm: 3000,
            voltage: 380,
            IPID: 1,
            ICID: 1,
            IMID: 1,
            date: "1398-12-01",
            summary: 'some summary'
          },
          {
            id: 3,
            orderId: 2,
            qty: 9,
            kw: 160,
            rpm: 1500,
            voltage: 380,
            IPID: 1,
            ICID: 1,
            IMID: 1,
            date: "1398-12-12",
            summary: 'some summary'
          },
          {
            id: 4,
            orderId: 2,
            qty: 1,
            kw: 75,
            rpm: 1000,
            voltage: 690,
            IPID: 1,
            ICID: 1,
            IMID: 1,
            date: "1398-12-10",
            summary: 'some summary'
          },
        ],
        ICList: [
          {id: 1, title: 'IC411'},
          {id: 2, title: 'IC511'},
          {id: 3, title: 'IC611'},
          {id: 4, title: 'IC666'},
        ],
        IPList: [
          {id: 1, title: 'IP55'},
          {id: 2, title: 'IP66'},
        ],
        IMList: [
          {id: 1, title: 'IMB3'},
          {id: 2, title: 'IMB35'},
        ],
      }
    },
    methods: {
      editSpec: function(item){
        this.editingIndex = this.specs.indexOf(item)
        this.assignForm = cloneDeep(this.specs[this.editingIndex])
      },
      deleteSpec(){
        console.log('method.');
      },
      submitAssignment(){
        console.log('assignment');
      },
      cancelAssignment(){
        console.log('assignment');
      },
      addSpecToList(){
        if (this.editingIndex !== -1){
          console.log(this.editingIndex, this.specs[this.editingIndex])
          // this.specs[this.editingIndex] = this.assignForm;
          Object.assign(this.specs[this.editingIndex], this.assignForm);
          this.editingIndex = -1;
        }else {
          this.specs.push(this.assignForm)
        }
        this.assignForm = cloneDeep(this.assignFormDefault)
      },
      setAssignForm(){
        let filteredItems = this.specs.filter(e => {
          return e.id === this.specId;
        });
        this.editingIndex = this.specs.indexOf(filteredItems[0])
        this.assignForm = cloneDeep(this.specs[this.editingIndex])
      }
    },
    props: [
      "specId"
    ],
    components: {
      PersianDatePicker: VuePersianDatetimePicker,
    },
    created(){
      this.setAssignForm();
      console.log('created', this.assignForm)
    },
    beforeUpdate() {
      // this.setAssignForm();
      console.log('before updated', this.assignForm)
    },
  }
</script>

<style scoped>

</style>
