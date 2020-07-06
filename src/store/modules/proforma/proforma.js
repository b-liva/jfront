import * as types from '../../types/proforma'
import * as proformaGql from '../../gql/proforma/proforma.graphql'
import {apolloClient} from "../../../index";
import {store} from "../../store";
import {createPrefSpecsBulk} from "../../../grahpql/queries/order/spec/mutation/mutation";
import {MUTATE_PROFORMA} from "../../types/proforma";
import {baseFunctions} from "../../../mixins/graphql/baseFunctions";

// STATE
let state = {
  proformaOrderId: null,
  proforma: {
    id: '',
    customerName: '',
    number: '',
    reqNumber: '',
    numberTd: null,
    date: '',
    expiry_date: '',
    perm: false,
    permNumber: '',
    permDate: '',
    dueDate: '',
    summary: '',
  },
  proformaOrder: {
    id: '',
    number: '',
    customer: {
      id: '',
      name: ''
    }
  },
  proformaOrderSpecs: [],
  proformaSpecs: [],
  proformaFormSpecs: [],
  proformaSpecFormIsActive: false,
  proformaSpecPreviewFormIsActive: false,
  snackbar: false,
  snackbarMsg: '',
  filteredProformas: [],
  filterProformaForm: {
    customerName: '',
    number: '',
  },
  filterLoading: false
}

// GETTERS
let getters = {
  [types.PROFORMA_ORDER]: state => {
    return state.proformaOrder;
  },
  [types.PROFORMA_SPECS]: state => {
    return state.proformaSpecs;
  },
  [types.PROFORMA_ORDER_SPECS]: state => {
    return state.proformaOrderSpecs;
  },
  [types.PROFORMA_FORMS_SPECS]: state => {
    return state.proformaFormSpecs;
  },
  [types.PROFORMA_SPEC_FORM_IS_ACTIVE]: state => {
    return state.proformaSpecFormIsActive;
  },
  [types.PROFORMA_SPEC_PREVIEW_IS_ACTIVE]: state => {
    return state.proformaSpecPreviewFormIsActive;
  },
  [types.PROFORMA]: state => {
    return state.proforma;
  },
  [types.SNACKBAR]: state => {
    return state.snackbar;
  },
  [types.SNACKBAR_MSG]: state => {
    return state.snackbarMsg;
  },
  [types.FILTERED_PROFORMAS]: state => {
    return state.filteredProformas;
  },
  [types.FILTER_PROFORMA_FORM]: state => {
    return state.filterProformaForm;
  },
  [types.PROFORMA_FILTER_LOADING]: state => {
    return state.filterLoading;
  },
}

// MUTATIONS
let mutations = {
  [types.MUTATE_PROFORMA_ORDER]: (state, order) => {
    state.proformaOrder = order;
  },
  [types.MUTATE_PROFORMA_SPECS]: (state, proformaSpecs) => {
    state.proformaSpecs = proformaSpecs;
  },
  [types.MUTATE_PROFORMA_ORDER_SPECS]: (state, proformaOrderSpecs) => {
    state.proformaOrderSpecs = proformaOrderSpecs;
  },
  [types.MUTATE_PROFORMA_FORM_SPECS]: (state, reset) => {
    if (reset) {
      state.proformaFormSpecs = []
      return
    }
    let pOSpecs = store.getters[types.PROFORMA_ORDER_SPECS];
    let pSpecs = store.getters[types.PROFORMA_SPECS];
    let specs = [];
    pSpecs.forEach(e => {
      specs.push({
        id: e.id,
        qty: e.qty,
        eqId: e.reqspecEq.id,
        kw: e.kw,
        rpm: e.rpm,
        voltage: e.voltage,
        price: e.price,
        staged: true
      })
    });
    pOSpecs.forEach(e => {
      specs.push({
        eqId: e.id,
        id: '',
        qty: e.qty,
        kw: e.kw,
        rpm: e.rpmNew.rpm,
        voltage: e.voltage,
        price: null,
        staged: false
      })
    });
    state.proformaFormSpecs = specs
  },
  [types.MUTATE_PROFORMA_SPEC_FORM_IS_ACTIVE]: (state, status) => {
    state.proformaSpecFormIsActive = status
  },
  [types.MUTATE_PROFORMA_SPEC_PREVIEW_FORM_IS_ACTIVE]: (state, status) => {
    state.proformaSpecPreviewFormIsActive = status
  },
  [types.MUTATE_PROFORMA]: (state, proforma) => {
    state.proforma = proforma
  },
  [types.MUTATE_RESET_PROFORMA_FORMS]: (state) => {
    state.proforma = {
      id: '',
      customerName: '',
      number: ''
    };
    state.proformaOrder = {
      id: '',
      number: '',
      customer: {
        id: '',
        name: ''
      }
    };
    state.proformaSpecs = [];
    state.proformaOrderSpecs = [];
    state.proformaSpecFormIsActive = false;
  },
  [types.MUTATE_SNACKBAR]: (state, status) => {
    state.snackbar = status
  },
  [types.MUTATE_SNACKBAR_MSG]: (state, msg) => {
    state.snackbarMsg = msg
  },
  [types.MUTATE_FILTERED_PROFORMAS]: (state, filteredProformas) => {
    state.filteredProformas = filteredProformas
  },
  [types.MUTATE_FILTER_PROFORMA_FORM]: (state, form) => {
    state.filterProformaForm = form
  },
  [types.MUTATE_PROFORMA_FILTER_LOADING]: (state, status) => {
    state.filterLoading = status
  },
  [types.MUTATE_INSERTED_ROFORMA_NUMBER]: (state, proforma) => {
    state.proforma.id = proforma.id;
    state.proforma.number = proforma.number;
  },

};

// ACTIONS
let actions = {
  [types.ACTION_UPSERT_PROFORMA]: ({commit}, payload) => {
    // do async insertion
    apolloClient.mutate({
      mutation: proformaGql.createProforma,
      variables: payload
    }).then(({data}) => {
      let proforma = data.proformaMutation.xpref
      // commit(types.MUTATE_PROFORMA_ID, proforma.id)
      // commit(types.MUTATE_PROFORMA, proforma)
      commit(types.MUTATE_INSERTED_ROFORMA_NUMBER, proforma)
      store._actions[types.ACTION_UPDATE_PROFORMA_SPECS][0](proforma.id)
      store._actions[types.ACTION_UPDATE_PROFORMA_ORDER_SPECS][0](proforma.id)

      commit(types.MUTATE_PROFORMA_SPEC_FORM_IS_ACTIVE, true)
      commit(types.MUTATE_SNACKBAR_MSG, 'all Done')
      commit(types.MUTATE_SNACKBAR, true)
    }, error => {
      console.log(error)
    })

  },
  [types.ACTION_UPDATE_PROFORMA]: ({commit}, proformaId) => {
    apolloClient.query({
      query: proformaGql.proformaDetails,
      variables: {
        'proforma_id': proformaId
      },
      fetchPolicy: "network-only",
    }).then(({data}) => {
      let proforma = {};
      proforma.id = data.proforma.id;
      proforma.number = data.proforma.number;
      proforma.customerName = data.proforma.customerName;
      proforma.order = data.proforma.reqId;
      proforma.numberTd = data.proforma.numberTd;
      proforma.perm = data.proforma.perm;
      proforma.permNumber = data.proforma.permNumber;
      proforma.summary = data.proforma.summary;

      let order = {
        id: data.proforma.reqId.id,
        number: data.proforma.reqId.number,
        customer: {
          id: data.proforma.reqId.customer.id,
          name: data.proforma.reqId.customer.name,
        }
      };
      commit(MUTATE_PROFORMA, proforma)
      commit(types.MUTATE_PROFORMA_ORDER, order)
    }, error => {
      console.log(error)
    })
  },
  [types.ACTION_UPDATE_PROFORMA_SPECS]: ({commit}, proformaId) => {
    // do async tasks
    let variable = {
      'proforma_id': proformaId
    }
    apolloClient.query({
      query: proformaGql.proformaSpecs,
      variables: variable,
      fetchPolicy: "network-only"
    }).then(({data}) => {
      let specs = data.proformaSpecs.edges.map(e => e = e.node)
      commit(types.MUTATE_PROFORMA_SPECS, specs)
      commit(types.MUTATE_PROFORMA_FORM_SPECS)
    }, (error) => {
      console.log(error)
    })
  },
  [types.ACTION_UPDATE_PROFORMA_ORDER_SPECS]: ({commit}, proformaId) => {
    // find proforma order specs
    let variable = {
      'proforma_id': proformaId
    }
    apolloClient.query({
      query: proformaGql.specsNoProforma,
      variables: variable,
      fetchPolicy: "network-only"
    }).then(({data}) => {
      let response = data.specsNoProforma;
      let specs = response.specsNoProforma;
      specs.forEach(e => {
        e.staged = typeof e.staged === "undefined" ? false : e.staged;
      });
      commit(types.MUTATE_PROFORMA_ORDER_SPECS, specs)
      commit(types.MUTATE_PROFORMA_FORM_SPECS)
    }, error => {
      console.log(error)
    })
  },
  [types.ACTION_INSERT_PROFORMA_SPEC_BULK]: (context, payload) => {
    // do async
    apolloClient.mutate({
      mutation: createPrefSpecsBulk,
      variables: payload,
    }).then(() => {
      //update pforoma specs
      store._actions[types.ACTION_UPDATE_PROFORMA_SPECS][0](payload.proforma_id)
      store._actions[types.ACTION_UPDATE_PROFORMA_ORDER_SPECS][0](payload.proforma_id)
    }, error => {
      console.error('error occurred.', error)
    })
  },
  [types.ACTION_FILTER_PROFORMAS]: ({commit}) => {
    commit(types.MUTATE_PROFORMA_FILTER_LOADING, true)
    let form = store.getters[types.FILTER_PROFORMA_FORM]
    let variabels = {
      "proforma_number": form.number !== "" ? form.number : null,
      "customer_name": form.customerName !== "" ? form.customerName : null,
    }
    // do async
    apolloClient.mutate({
      mutation: proformaGql.proformaFiltered,
      variables: variabels,
    }).then(({data}) => {
      //update pforoma specs
      commit(types.MUTATE_FILTERED_PROFORMAS, baseFunctions.methods.noNode(data.proformaFiltered))
      commit(types.MUTATE_PROFORMA_FILTER_LOADING, false)
    }, error => {
      console.error('error occurred.', error)
      commit(types.MUTATE_PROFORMA_FILTER_LOADING, false)
    })
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
