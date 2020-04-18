import Vue from "vue";
import VueRouter from "vue-router";
import Dashboard from "../views/Dashboard";
import Order from '../views/Order';
import Income from "../views/Income";
import Income2 from "../views/Income2";
import Customer from "../views/Customer"
import Customers from "../views/customer/customers";
import OrderDetails from "../views/order/OrderDetails";
import ProformaDetail from "../views/proforma/ProformaDetail";

Vue.use(VueRouter);

export default new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: [
    { path:'', name:'Dashboard', component: Dashboard },
    { path: '/income', name: 'Income', component: Income },
    { path: '/orders', name:'Orders', component: Order},
    {path: '/order/:id', name: 'Order', component: OrderDetails},
    {path: '/proforma/:id', name: "Proforma", component: ProformaDetail},
    { path: '/income2', name: 'Income2', component: Income2 },
    { path: '/customers', name: 'Customers', component: Customers },
    { path: '/customer/:id', name: 'Customer', component: Customer },
  ]
})
