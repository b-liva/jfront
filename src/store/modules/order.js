import * as types from '../types'
import {apolloClient} from "../../index";
import * as orderGql from '../gql/order/order.graphql'
import {store} from "../store";

const state = {
  lastOrders: [],
  filteredOrders: [],
  insertedOrder: null,
  customerId: null,
  hasProforma: null,
  orderSpecFormIsActive: false,
  insertedSpecs: [],
}

const getters = {
  [types.LAST_ORDERS]: state => {
    return state.lastOrders
  },
  [types.INSERTED_ORDER]: state => {
    return state.insertedOrder;
  },
  [types.FILTERED_ORDERS]: state => {
    return state.filteredOrders
  },
  [types.CUSTOMER_ID]: state => {
    return state.customerId
  },
  [types.HAS_PROFORMA]: state => {
    return state.hasProforma
  },
  [types.ORDER_SPEC_FORM_IS_ACTIVE]: state => {
    return state.orderSpecFormIsActive;
  },
  [types.INSERTED_SPECS]: state => {
    return state.insertedSpecs
  }
}
const mutations = {
  [types.MUTATE_LAST_ORDERS]: (state, payload) => {
    state.lastOrders = payload.edges.map(e => e = e.node)
    console.log('mutation')
  },
  [types.MUTATE_INSERTED_ORDER]: (state, payload) => {
    state.insertedOrder = payload
  },
  [types.MUTATE_FILTERED_ORDER]: (state, payload) => {
    state.filteredOrders = payload
  },
  [types.MUTATE_CUSTOMER_ID]: (state, payload) => {
    state.customerId = payload
  },
  [types.MUTATE_HAS_PROFORMA]: (state, payload) => {
    state.hasProforma = payload
  },
  [types.MUTATE_SPEC_FORM_IS_ACTIVE]: (state, payload) => {
    state.orderSpecFormIsActive = payload
  },
  [types.MUTATE_INSERTED_SPECS]: (state, payload) => {
    state.insertedSpecs.push(payload)
  }
}
const actions = {
  [types.ACTION_INSERT_ORDER]: ({commit}, payload) => {
    apolloClient.mutate({
      mutation: orderGql.OrderMutation,
      variables: payload,
    }).then((response) => {
      let results = response.data.OrderMutation;
      if (results.requests !== null){
        commit(types.MUTATE_INSERTED_ORDER, results.requests)
        commit(types.MUTATE_SPEC_FORM_IS_ACTIVE, true)
        // Update last orders.
        store._actions[types.ACTION_LAST_ORDERS][0]()
      }else  if(results.errors.length > 0){
        console.log('hava some errors.')
      }
    }).catch(error => {
      console.log('[error]', error.response);
    });
  },
  [types.ACTION_LAST_ORDERS]: ({commit}) => {
    //fetch new last ordes.
    apolloClient.query({
      query: orderGql.LastOrders,
      fetchPolicy:"network-only",
    }).then(res => {
      let response = res.data.LastOrders
      commit(types.MUTATE_LAST_ORDERS, response)
    }, error => {
      console.log(error)
    })
  },
  [types.ACTION_FILTERED_ORDERS]: ({commit}, payload) => {
  //  get filtered orders from server
    commit(types.MUTATE_FILTERED_ORDER, payload)
  },
  [types.ACTION_INSERT_SPEC]: ({commit}, payload) => {
    apolloClient.mutate({
      mutation: orderGql.specMutation,
      variables: payload
    }).then(({data}) => {
      console.log('new spec: ', data)
      commit(types.MUTATE_INSERTED_SPECS, data.specMutation.reqSpec)
    }, error => {
      console.log(error)
    });
  }
}
export default {
  state,
  getters,
  mutations,
  actions
}
