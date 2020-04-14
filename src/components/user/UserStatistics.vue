<template>
  <div>
    <v-container>
      <v-row justify="center" row>
        <v-col cols="12" md="5">
          <v-card>
            <v-card-title>
              وضعیت درخواست های ورودی
            </v-card-title>
            <v-card-text>
              <v-data-table
                height="200px"
              :items="exStatus"
              :headers="exStatusHeaders">
              </v-data-table>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="6">
          <v-card>
            <v-card-title>
              بدون پیش فاکتور
            </v-card-title>
            <v-card-text>
              <v-data-table
                dense
                height="200px"
              :items="reqNoProforma"
              :headers="reqNoProformaHeaders">
              </v-data-table>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-row class="my-10" justify="center">
        <v-col cols="12" md="10">
            <v-card>
              <v-card-title>
                درخواست های وارد نشده
              </v-card-title>
              <v-card-text>
                <v-data-table
                  dense
                  :items="reqNotEntered"
                  :headers="reqNotEnteredHeaders">
                </v-data-table>
              </v-card-text>
            </v-card>

          </v-col>
      </v-row>
    </v-container>

  </div>
</template>

<script>
  export default {
    data(){
      return {
        name: "Personal",
        exStatusHeaders: [
          {value: "name", text: "کارشناس"},
          {value: "remaining", text: "مانده"},
          {value: "entered", text: "وارد شده"},
          {value: "enteredPercent", text: "درصد وارد شده"},
          {value: "noProforma", text: "بدون پیش فاکتور"},
        ],
        exStatus: [ // todo: send this to computed
          {id: 1, name: 'ظریف', remaining: 11, entered: 1193, enteredPercent: 52, noProforma: 78},
          {id: 1, name: 'علوی', remaining: 26, entered: 542, enteredPercent: 23, noProforma: 97},
          {id: 1, name: 'فروغی', remaining: 3, entered: 77, enteredPercent: 3, noProforma: 4},
        ],
        reqNoProformaHeaders: [
          {value: "number", text: "شماره"},
          {value: "customerName", text: "مشتری"},
          {value: "reqDate", text: "تاریخ"},
        ],
        reqNoProforma: [
          {number: 990041, customerName: "شرکت مهندسی پیشگامان رفیع ایرانیان(مپرا)", reqDate: "1399-01-23"},
          {number: 990043, customerName: "صنایع بسته بندی فرآورده های شیری پگاه", reqDate: "1399-01-23"},
          {number: 990052, customerName: "نوین سازه", reqDate: "1399-01-18"},
          {number: 990034, customerName: "صنایع مس سرچشمه ایران", reqDate: "1399-01-23"},
          {number: 990029, customerName: "سایبر صنعت", reqDate: "1398-12-19"},
          {number: 990015, customerName: "توسعه آهن و فولاد گل گهر", reqDate: "1399-01-23"},
        ],
        reqNotEnteredHeaders: [
          {value: "automation", text: "شماره"},
          {value: "date", text: "تاریخ"},
          {value: "customerName", text: "مشتری"},
          {value: "title", text: "عنوان"},
          {value: "expert", text: "کارشناس"},
        ],
        reqNotEntered: [
          {automation: 980560, date: "98/03/05", customerName: "صنایع برق و الکترونیک", title: "درخواست اظهار نظر در خصوص ساخت الکتروموتور 15 کیلووات - 720 دور -IP55 ( طبق مشخصات پیوست ) ", expert: "ظریف"},
          {automation: 980609, date: "98/03/11", customerName: "شیمبار", title: "درخواست 4 دستگاه الکتروموتور 90 کیلووات - 1500 دور ", expert: "ظریف"},
          {automation: 981032, date: "98/04/16", customerName: "پویندان", title: "مناقصه 100 عدد الکتروموتور 1 کیلووات - 720 دور - 380 ولت ", expert: "علوی"},
          {automation: 980560, date: "98/03/05", customerName: "صنایع", title: "درخواست ", expert: "ظریف"},
          {automation: 980560, date: "98/03/05", customerName: "صنایع", title: "درخواست ", expert: "ظریف"},
          {automation: 980560, date: "98/03/05", customerName: "صنایع", title: "درخواست ", expert: "ظریف"},
          {automation: 980560, date: "98/03/05", customerName: "صنایع", title: "درخواست ", expert: "ظریف"},
        ]
      }
    },
    computed:{

    }
  }
</script>

<style scoped>

</style>
