import Vue from "vue";
import VueRouter from "vue-router";
import Dashboard from "../views/Dashboard";
import Order from '../views/Order';
import Proforma from "../views/proforma/Proforma";
import Income from "../views/Income";
import Income2 from "../views/Income2";
import Customer from "../views/Customer"

Vue.use(VueRouter);

export default new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: [
    { path:'', name:'Dashboard', component: Dashboard },
    { path: '/income', name: 'Income', component: Income },
    { path: '/order', name:'Order', component: Order},
    { path: '/profoma', name: 'Proforma', component: Proforma},
    { path: '/income2', name: 'Income2', component: Income2 },
    { path: '/customer/:id', name: 'Customer', component: Customer },
  ]
})
