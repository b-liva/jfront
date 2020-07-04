// IMPORT
import {store} from "../../../store/store";
import {apolloClient} from "../../../index";
import * as types from '../../types/income'
import * as incomeGql from '../../gql/income/income.graphql'
import {MUTATE_FILTERED_INCOMES} from "../../types/income";
import {MUTATE_INCOME_ROWS} from "../../types/income";
import {baseFunctions} from "../../../mixins/graphql/baseFunctions";
import {MUTATE_LOADING_FILTERED_INCOME} from "../../types/income";

// STATE
let state = {
  expandedIncomeId: '',
  incomeFilterForm: {
    customerName: '',
    number: '',
  },
  filteredIncomes: [],
  loadingFilteredIncome: false,
  incomeRows: [],
  loadingIncomeRows: false,
  assignmentFormIsActive: false,
};
// GETTERS
let getters = {
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
  [types.ASSIGNMENT_FORM_IS_ACTIVE]: state => {
    return state.assignmentFormIsActive;
  }
};
// MUTATIONS
let mutations = {
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
  [types.MUTATE_ASSIGNMENT_FORM_IS_ACTIVE]: (state, isActive) => {
    state.assignmentFormIsActive = isActive;
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
      //  update incomes(filtered).
      //  MUTATE INSERTED INCOME
      console.log(commit)
    }, error => {
      console.log(error)
    })
  },
  [types.ACTION_UPSERT_INCOME_ROW]: ({commit}, payload) => {
  //  insert new row
    apolloClient.mutate({
      mutation: incomeGql.assingIncomeRowMutation,
      variables: payload
    }).then(({data}) => {
      //  update income rows
      console.log(data)
      console.log(commit)
    }, error => {
      console.log(error)
    })
  },
  [types.ACTION_UPDATE_FILTERED_INCOMES]: ({commit}) => {
  //  update filtered incomes
    commit(MUTATE_LOADING_FILTERED_INCOME, true);
    let form = store.getters[types.INCOME_FILTER_FORM];
    let variables = {
      'customer_name': form.customerName !== "" ? form.customerName : null,
      'number': form.number !== "" ? form.number : null,
    }
    apolloClient.query({
      query: incomeGql.incomesFiltered,
      variables: variables
    }).then(({data}) => {
      console.log(data)
      let incomes = baseFunctions.methods.noNode(data.incomesFiltered)
      //  commit filtered incomes
      commit(MUTATE_LOADING_FILTERED_INCOME, false)
      commit(MUTATE_FILTERED_INCOMES, incomes)
    }, error => {
      console.log(error)
    })
  },
  [types.ACTION_UPDATE_INCOME_ROWS]: ({commit}, incomeId) => {
  //  update income rows
    let variable = {
      'income_id': incomeId,
    };
    apolloClient.query({
      query: incomeGql.incomeRowByIncomeId,
      variables: variable
    }).then(({data}) => {
      console.log(data)

      let incomeRows = baseFunctions.methods.noNode(data.incomeRowByIncomeId)
      console.log('store rows: ', incomeRows)
      //  commit updated rows.
      commit(MUTATE_INCOME_ROWS, incomeRows)
    }, error => {
      console.log(error)
    })
  }
};

export default {
  state,
  getters,
  mutations,
  actions
}
