import gql from 'graphql-tag'

export const allIncomes = gql`
    query{
        allIncomes {
            edges {
                node {
                    id
                    number
                    amount
                    owner{
                        lastName
                    }
                    customer{
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

export const income = gql`
    query income($income_id:ID!){
        income(id:$income_id) {
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
