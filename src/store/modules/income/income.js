// IMPORT
import {store} from "../../../store/store";
import {apolloClient} from "../../../index";
import * as types from '../../types/income'
import * as incomeGql from '../../gql/income/income.graphql'
import {baseFunctions} from "../../../mixins/graphql/baseFunctions";

// STATE
let state = {
  expandedIncomeId: '',
  incomeId: '',
  insertedIncome: {},
  upsertedIncomeRow: {},
  incomeFilterForm: {
    customerName: '',
    number: '',
  },
  filteredIncomes: [],
  loadingFilteredIncome: false,
  incomeRows: [],
  loadingIncomeRows: false,
  assignmentFormIsActive: false,
  incomeHolderFormStep: 1,
  customerUnpaidProformas: [],
};

// GETTERS
let getters = {
  [types.INCOME_ID]: state => {
    return state.incomeId;
  },
  [types.INSERTED_INCOME]: state => {
    return state.insertedIncome;
  },
  [types.EXPANDED_INCOME_ID]: state => {
    return state.expandedIncomeId;
  },
  [types.INCOME_FILTER_FORM]: state => {
    return state.incomeFilterForm;
  },
  [types.FILTERED_INCOMES]: state => {
    return state.filteredIncomes;
  },
  [types.INCOME_ROWS]: state => {
    return state.incomeRows;
  },
  [types.LOADING_FILTERED_INCOMES]: state => {
    return state.loadingFilteredIncome;
  },
  [types.LOADING_INCOME_ROWS]: state => {
    return state.loadingIncomeRows;
  },
  [types.INCOME_ROW_FORM_IS_ACTIVE]: state => {
    return state.assignmentFormIsActive;
  },
  [types.INCOME_HOLDER_FORM_STEP]: state => {
    return state.incomeHolderFormStep;
  },
  [types.CUSTOMER_UNPAID_PROFORMAS]: state => {
    return state.customerUnpaidProformas;
  },
  [types.UPSERTED_INCOME_ROW]: state => {
    return state.upsertedIncomeRow;
  }
};

// MUTATIONS
let mutations = {
  [types.MUTATE_INCOME_ID]: (state, incomeId) => {
    state.incomeId = incomeId
  },
  [types.MUTATE_INSERTED_INCOME]: (state, income) => {
    state.insertedIncome = income
  },
  [types.MUTATE_EXPANDED_INCOME_ID]: (state, incomeId) => {
    state.expandedIncomeId = incomeId;
  },
  [types.MUTATE_INCOME_FILTER_FORM]: (state, form) => {
    state.incomeFilterForm = form;
  },
  [types.MUTATE_FILTERED_INCOMES]: (state, incomes) => {
    state.filteredIncomes = incomes;
  },
  [types.MUTATE_INCOME_ROWS]: (state, incomeRows) => {
    state.incomeRows = incomeRows;
  },
  [types.MUTATE_LOADING_FILTERED_INCOME]: (state, loadingStatus) => {
    state.loadingFilteredIncome = loadingStatus;
  },
  [types.MUTATE_LOADING_INCOME_ROWS]: (state, loadingStatus) => {
    state.loadingIncomeRows = loadingStatus;
  },
  [types.MUTATE_INCOME_ROW_FORM_IS_ACTIVE]: (state, isActive) => {
    state.assignmentFormIsActive = isActive;
  },
  [types.MUTATE_INCOME_HOLDER_FORM_STEP]: (state, step) => {
    state.incomeHolderFormStep = step;
  },
  [types.MUTATE_CUSTOMER_UNPAID_PROFORMAS]: (state, proformas) => {
    state.customerUnpaidProformas = proformas
  },
  [types.MUTATE_UPSERTED_INCOME_ROW]: (state, incomeRow) => {
    state.upsertedIncomeRow = incomeRow
  }
};
// ACTIONS
let actions = {
  [types.ACTION_UPSERT_INCOME]: ({commit}, payload) => {
  //  do async stuff
    apolloClient.mutate({
      mutation: incomeGql.createIncome,
      variables: payload
    }).then(({data}) => {
      console.log(data)
      let income = data.createIncome.income;
      commit(types.MUTATE_INSERTED_INCOME, income);
      commit(types.MUTATE_INCOME_ROW_FORM_IS_ACTIVE, true);
      commit(types.MUTATE_INCOME_HOLDER_FORM_STEP, 2)
      store._actions[types.ACTION_UPDATE_FILTERED_INCOMES][0]();
      store._actions[types.ACTION_UPDATE_CUSTOMER_UNPAID_PROFORMAS][0](income.customer.id);
      //  MUTATE INSERTED INCOME
    }, error => {
      console.log(error)
    })
  },
  [types.ACTION_UPSERT_INCOME_ROW]: ({commit}, payload) => {
    console.log('payload: ', payload)
    apolloClient.mutate({
      mutation: incomeGql.assingIncomeRowMutation,
      variables: payload
    }).then(({data}) => {
      let incomeRow = data.assingIncomeRowMutation.incomeRow;
      commit(types.MUTATE_UPSERTED_INCOME_ROW, incomeRow);
      store._actions[types.ACTION_UPDATE_INCOME_ROWS][0](incomeRow.income.id);
      store._actions[types.ACTION_UPDATE_CUSTOMER_UNPAID_PROFORMAS][0](incomeRow.income.customer.id);
    }, error => {
      console.log(error)
    })
  },
  [types.ACTION_UPDATE_FILTERED_INCOMES]: ({commit}) => {
    commit(types.MUTATE_LOADING_FILTERED_INCOME, true);
    let form = store.getters[types.INCOME_FILTER_FORM];
    let variables = {
      'customer_name': form.customerName !== "" ? form.customerName : null,
      'number': form.number !== "" ? form.number : null,
    }
    apolloClient.query({
      query: incomeGql.incomesFiltered,
      variables: variables,
      fetchPolicy: "network-only"
    }).then(({data}) => {
      let incomes = baseFunctions.methods.noNode(data.incomesFiltered);
      commit(types.MUTATE_LOADING_FILTERED_INCOME, false);
      commit(types.MUTATE_FILTERED_INCOMES, incomes)
    }, error => {
      console.log(error)
    })
  },
  [types.ACTION_UPDATE_INCOME_ROWS]: ({commit}, incomeId) => {
    let variable = {
      'income_id': incomeId,
    };
    apolloClient.query({
      query: incomeGql.incomeRowByIncomeId,
      variables: variable,
      fetchPolicy: "network-only"
    }).then(({data}) => {
      let incomeRows = baseFunctions.methods.noNode(data.incomeRowByIncomeId)
      commit(types.MUTATE_INCOME_ROWS, incomeRows)
    }, error => {
      console.log(error)
    })
  },
  [types.ACTION_UPDATE_CUSTOMER_UNPAID_PROFORMAS]: ({commit}, customerId) => {
    let variables = {
      'customer_id': customerId
    };
    apolloClient.query({
      query: incomeGql.customerUnpaidProformas,
      variables: variables,
      fetchPolicy: "network-only",
    }).then(({data}) => {
      commit(types.MUTATE_CUSTOMER_UNPAID_PROFORMAS, data.customerUnpaidProformas)
    }, error => {
      console.log(error);
    })
  },
  [types.ACTION_DELETE_INCOME]: ({commit}, income) => {
  //  delete income
    let variables = {
      'input': {
        'id': income.id
      }
    };
    apolloClient.mutate({
      mutation: incomeGql.deleteIncome,
      variables: variables
    }).then(() => {
      //  update filtered incomes.
      console.log(commit)
      store._actions[types.ACTION_UPDATE_FILTERED_INCOMES][0]()
    })
  },
  [types.ACTION_DELETE_INCOME_ROW]: ({commit}, incomeRow) => {
  //  delete income row
    let variables = {
      'input': {
        'id': incomeRow.id,
      }
    };
    apolloClient.mutate({
      mutation: incomeGql.deleteIncomeRow,
      variables: variables,
    }).then(() => {
      console.log(commit)
      store._actions[types.ACTION_UPDATE_INCOME_ROWS][0](incomeRow.income.id)
      //  update income rows.
    })
  }
};

export default {
  state,
  getters,
  mutations,
  actions
}
