import Vue from 'vue'
import Vuex from 'vuex';

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    customers: [
      {id: 1, name: 'پارس تهران...'},
      {id: 2, name: 'سازش'},
      {id: 3, name: 'مارون'},
      {id: 4, name: 'خاور توس'},
      {id: 5, name: 'هوایار'},
    ],
  },
})
