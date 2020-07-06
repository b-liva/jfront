export const financialFunctions = {
  methods: {
    profit(sale, expense) {
      return sale - expense
    },
    profitPercent(sale, expense) {
      let profitPercentage = 100 * (sale - expense) / expense;
      profitPercentage = profitPercentage.toFixed(2);
      return profitPercentage;
    }
  }
}
