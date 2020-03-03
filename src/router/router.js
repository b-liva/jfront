import Vue from "vue";
import VueRouter from "vue-router";
import Dashboard from "../views/Dashboard";
import Income from "../views/Income";

Vue.use(VueRouter);

export default new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: [
    { path:'', name:'Dashboard', component: Dashboard },
    { path: '/income', name: 'Income', component: Income }
  ]
})
