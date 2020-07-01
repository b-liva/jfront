import * as types from '../../types/proforma'
import * as proformaGql from '../../gql/proforma/proforma.graphql'
import {apolloClient} from "../../../index";
import {store} from "../../store";
import {createPrefSpecsBulk} from "../../../grahpql/queries/order/spec/mutation/mutation";
import {MUTATE_PROFORMA} from "../../types/proforma";

// STATE
let state = {
  proformaOrderId: null,
  proforma: {
    id: '',
    customerName: '',
    number: '',
    order: {
      id: '',
      number: ''
    }
  },
  proformaId: null,
  proformaOrderSpecs: [],
  proformaSpecs: [],
  proformaFormSpecs: [],
  proformaSpecFormIsActive: false,
  proformaSpecPreviewFormIsActive: false,
  snackbar: false,
  snackbarMsg: '',
}

// GETTERS
let getters = {
  [types.PROFORMA_ORDER_ID]: state => {
    return state.proformaOrderId;
  },
  [types.PROFORMA_ID]: state => {
    return state.proforma.id;
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
  }
}

// MUTATIONS
let mutations = {
  [types.MUTATE_PROFORMA_ORDER_ID]: (state, proformaOrderId) => {
    state.proformaOrderId = proformaOrderId;
  },
  [types.MUTATE_PROFORMA_ID]: (state, proformaId) => {
    state.proforma.id = proformaId;
  },
  [types.MUTATE_PROFORMA_SPECS]: (state, proformaSpecs) => {
    state.proformaSpecs = proformaSpecs;
  },
  [types.MUTATE_PROFORMA_ORDER_SPECS]: (state, proformaOrderSpecs) => {
    state.proformaOrderSpecs = proformaOrderSpecs;
  },
  [types.MUTATE_PROFORMA_FORM_SPECS]: (state, reset) => {
    if (reset){
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
    state.proformaSpecs = [];
    state.proformaOrderSpecs = [];
  },
  [types.MUTATE_SNACKBAR]: (state, status) => {
    state.snackbar= status
  },
  [types.MUTATE_SNACKBAR_MSG]: (state, msg) => {
    state.snackbarMsg = msg
  },

};

// ACTIONS
let actions = {
  [types.ACTION_INSERT_PROFORMA]: ({commit}, payload) => {
    // do async insertion
    console.log(payload)
    apolloClient.mutate({
      mutation: proformaGql.createProforma,
      variables: payload
    }).then(({data}) => {
      let proforma = data.proformaMutation.xpref
      console.log('actual id: ', proforma.id)
      commit(types.MUTATE_PROFORMA_ID, proforma.id)
      commit(types.MUTATE_PROFORMA, proforma)
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
      }
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
      console.log('prof to update: ', proforma)
      commit(MUTATE_PROFORMA, proforma)
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
  [types.ACTION_INSERT_PROFORMA_SPEC_BULK]: ({commit}, payload) => {
    // do async
    console.log('this is payload: ', payload)
    apolloClient.mutate({
      mutation: createPrefSpecsBulk,
      variables: payload,
    }).then(response => {
      //update pforoma specs
      console.log('proforma added: ', response)
      store._actions[types.ACTION_UPDATE_PROFORMA_SPECS][0](payload.proforma_id)
      store._actions[types.ACTION_UPDATE_PROFORMA_ORDER_SPECS][0](payload.proforma_id)
      console.log(commit)
    }, error => {
      console.error('error occurred.', error)
    })
    console.log(payload)
}
}

export default {
  state,
  getters,
  mutations,
  actions
}
