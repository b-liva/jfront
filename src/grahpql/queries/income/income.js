import gql from 'graphql-tag'

export const incomesFiltered = gql`
    query incomesFiltered($customer_name:String, $number:Int){
        incomesFiltered:allIncomes(
            customer_Name_Icontains:$customer_name,
            number:$number
        ) {
            edges {
                node {
                    id
                    number
                    amount
                    owner{
                        id
                        lastName
                    }
                    customer{
                        id
                        name
                    }
                    type{
                        id
                        title
                    }
                }
            }
        }
    }
`

export const incomeWithRows = gql`
    query incomeWithRows($income_id:ID!){
        incomeWithRows:income(id:$income_id) {
            id
            number
            amount
            type {
                id
                title
            }
            customer {
                id
                name
            }
            incomerowSet {
                edges {
                    node {
                        id
                        amount
                        proforma {
                            id
                            number
                        }
                        perm {
                            id
                            number
                        }
                    }
                }
            }
        }
    }
`

export const incomesByProformaId = gql`
    query incomesByProformaId($proforma_id:ID!){
        incomesByProformaId:proforma(id: $proforma_id) {
            id
            number
            incomerowSet {
                edges {
                    node {
                        id
                        income {
                            id
                            number
                            amount
                            type{
                                id
                                title
                            }
                        }
                    }
                }
            }
        }
    }
`

export const incomesByPermitId = gql`
    query incomesByPermitId($permit_id:ID!){
        incomesByPermitId: perm(id:$permit_id) {
            id
            incomerowSet {
                edges {
                    node {
                        id
                        income {
                            id
                            number
                            amount
                            type{
                                id
                                title
                            }
                        }
                    }
                }
            }
        }
    }
`

export const allPaymentTypes = gql`
    query{
        allPaymentTypes {
            edges {
                node {
                    id
                    title
                }
            }
        }
    }
`

export const incomeRowByIncomeId = gql`
    query incomeRowByIncomeId($income_id:ID){
        incomeRowByIncomeId:allIncomeRows(income: $income_id) {
            edges {
                node {
                    id
                    proforma{
                        id
                        number
                    }
                    amount
                }
            }
        }
    }
`
