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
