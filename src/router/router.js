import Vue from "vue";
import VueRouter from "vue-router";
import Dashboard from "../views/Dashboard";
import Order from '../views/order/Order';
import Income from "../views/Income";
import Income2 from "../views/Income2";
import Customer from "../views/customer/Customer"
import Customers from "../views/customer/Customers";
import OrderDetails from "../views/order/OrderDetails";
import ProformaDetail from "../views/proforma/ProformaDetail";
import IncomeDetails from "../views/income/IncomeDetails";
import PermitDetails from "../views/permit/PermitDetails";
import Login from "../views/Login";
import Logout from "../views/Logout";
import Layout from "../components/layout/Layout";

Vue.use(VueRouter);

export default new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: [
    {path: '/', name: 'Login', component: Login},
    {path: '/logout', name: 'Logout', component: Logout},
    {
      path: '/dashboard', name: 'Dashboard', component: Layout,
      children: [{path: '', component: Dashboard}]
    },
    {
      path: '/orders', name: 'Orders', component: Layout,
      children: [{path: '', component: Order}]
    },
    {
      path: '/order', name: 'Order', component: Layout,
      children: [{path: ':id', name: 'OrderDetails', component: OrderDetails}]
    },
    {
      path: '/proforma', name: "Proforma", component: Layout,
      children: [{path: ':id', name:"ProformaDetails", component: ProformaDetail}]
    },
    {
      path: '/incomes', name: 'Incomes', component: Layout,
      children: [{path: '', component: Income}]
    },
    {
      path: '/income', name: "Income", component: Layout,
      children: [{path: ':id', name:'IncomeDetails', component: IncomeDetails}]
    },
    {
      path: '/income2', name: 'Income2', component: Layout,
      children: [{path: '', component: Income2}]
    },
    {
      path: '/permit', name: "Permit", component: Layout,
      children: [{path: ':id', name: 'PermitDetails', component: PermitDetails}]
    },
    {
      path: '/customers', name: 'Customers', component: Layout,
      children: [{path: '', component: Customers}]
    },
    {
      path: '/customer', name: 'Customer', component: Layout,
      children: [{path: ':id', name: "CustomerDetails", component: Customer}]
    },
  ]
})
