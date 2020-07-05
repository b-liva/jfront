import * as types from '../../types/order'
import {apolloClient} from "../../../index";
import * as orderGql from '../../gql/order/order.graphql'
import {store} from "../../store";

const state = {
  lastOrders: [],
  filteredOrders: [],
  loadingFilteredOrders: false,
  insertedOrder: null,
  orderFilterForm: {
    count: '',
    customerName: '',
    number: '',
    no_proforma: false,
  },
  customerId: null,
  orderSpecFormIsActive: false,
  orderSpecs: [],
  expandedOrderId: null,
  loadingOrderSpecs: false,
}

const getters = {
  [types.LAST_ORDERS]: state => {
    return state.lastOrders
  },
  [types.UPSERTED_ORDER]: state => {
    return state.insertedOrder;
  },
  [types.FILTERED_ORDERS]: state => {
    return state.filteredOrders
  },
  [types.CUSTOMER_ID]: state => {
    return state.customerId
  },
  [types.ORDER_SPEC_FORM_IS_ACTIVE]: state => {
    return state.orderSpecFormIsActive;
  },
  [types.ORDER_SPECS]: state => {
    return state.orderSpecs
  },
  [types.ORDER_FILTER_FORM]: state => {
    return state.orderFilterForm;
  },
  [types.LOADING_FILTERED_ORDERS]: state => {
    return state.loadingFilteredOrders;
  },
  [types.SELECTED_ORDER_ID]: state => {
    return state.expandedOrderId;
  },
  [types.LOADING_ORDER_SPECS]: state => {
    return state.loadingOrderSpecs
  }
}
const mutations = {
  [types.MUTATE_LAST_ORDERS]: (state, lastOrders) => {
    state.lastOrders = lastOrders.edges.map(e => e = e.node)
    console.log('mutation')
  },
  [types.MUTATE_UPSERTED_ORDER]: (state, insertedOrder) => {
    state.insertedOrder = insertedOrder
  },
  [types.MUTATE_FILTERED_ORDER]: (state, filteredOrders) => {
    state.filteredOrders = filteredOrders
  },
  [types.MUTATE_CUSTOMER_ID]: (state, customerId) => {
    state.customerId = customerId
  },
  [types.MUTATE_SPEC_FORM_IS_ACTIVE]: (state, formStatus) => {
    state.orderSpecFormIsActive = formStatus
  },
  [types.MUTATE_ORDER_SPECS]: (state, orderSpecs) => {
    console.log('specs: ', orderSpecs)
    state.orderSpecs = orderSpecs
    // state.orderSpecs.push(orderSpecs)
  },
  [types.MUTATE_DELETED_ORDER]: (state, deleteOrder) => {
    state.deleteOrder = deleteOrder
  },
  [types.MUTATE_ORDER_FILTER_FORM]: (state, filterForm) => {
    state.orderFilterForm = filterForm
  },
  [types.MUTATE_LOADING_FILTERED_ORDERS]: (state, status) => {
    state.loadingFilteredOrders = status
  },
  [types.MUTATE_SELECTED_ORDER_ID]: (state, orderId) => {
    state.expandedOrderId = orderId;
  },
  [types.MUTATE_LOADING_ORDER_SPECS]: (state, status) => {
    state.loadingOrderSpecs = status
  }
}
const actions = {
  [types.ACTION_UPSERT_ORDER]: ({commit}, payload) => {
    apolloClient.mutate({
      mutation: orderGql.OrderMutation,
      variables: payload,
    }).then((response) => {
      let results = response.data.OrderMutation;
      if (results.requests !== null){
        commit(types.MUTATE_UPSERTED_ORDER, results.requests)
        commit(types.MUTATE_SPEC_FORM_IS_ACTIVE, true)
        commit(types.MUTATE_SELECTED_ORDER_ID, results.requests.id)
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
  [types.ACTION_FILTER_ORDERS]: ({commit}) => {
  //  get filtered orders from server
    let form = store.getters[types.ORDER_FILTER_FORM]
    let variabels = {
      "count": form.count !== "" ? form.count : null,
      "number": form.number !== "" ? form.number : null,
      "customer_name": form.customerName !== "" ? form.customerName : null,
    }
    if (form.no_proforma){
      variabels.no_proforma = true
    }
    commit(types.MUTATE_LOADING_FILTERED_ORDERS, true)
    apolloClient.query({
      query: orderGql.filteredOrders,
      debounce: 1000,
      fetchPolicy: 'network-only',
      variables: variabels
    }).then(({data}) => {
      commit(types.MUTATE_LOADING_FILTERED_ORDERS, false)
      let filtOrders = data.filteredOrders.edges.map(e => e = e.node)
      commit(types.MUTATE_FILTERED_ORDER, filtOrders)
    })
  },
  [types.ACTION_UPSERT_SPEC]: (context, payload) => {
    apolloClient.mutate({
      mutation: orderGql.specMutation,
      variables: payload
    }).then(({data}) => {
      console.log('new spec: ', data)
      // commit(types.MUTATE_ORDER_SPECS, data.specMutation.reqSpec)
      store._actions[types.ACTION_ORDER_SPECS][0](data.specMutation.reqSpec.reqId.id)
    }, error => {
      console.log(error)
    });
  },
  [types.ACTION_DELETE_ORDER]: ({commit}, payload) => {
    console.log(payload)
    console.log(store.getters[types.ORDER_FILTER_FORM])

    let variabels = {
      "delete_input": {
        "id": payload
      }
    }
    apolloClient.mutate({
      mutation: orderGql.deleteOrder,
      variables: variabels
    }).then(() => {
      commit(types.MUTATE_DELETED_ORDER, payload)
      store._actions[types.ACTION_FILTER_ORDERS][0]()
    }, error => {
      console.error(error)
    })
  },
  [types.ACTION_ORDER_SPECS]: (context, payload) => {
    //find order specs
    context.commit(types.MUTATE_LOADING_ORDER_SPECS, true)
    apolloClient.query({
      query: orderGql.order,
      variables: {
        order_id: payload
      },
      fetchPolicy: 'network-only'
    }).then(({data}) => {
      console.log('updated: ', data.order.reqspecSet)
      let specs = data.order.reqspecSet.edges.map(e => e = e.node)
      context.commit(types.MUTATE_ORDER_SPECS, specs)
      context.commit(types.MUTATE_LOADING_ORDER_SPECS, false)
    }, (error) => {
      let error_msg = JSON.stringify(error.message)
      console.log(error_msg)
    })
  }
}
export default {
  state,
  getters,
  mutations,
  actions
}
