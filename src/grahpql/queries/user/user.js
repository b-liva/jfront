import gql from 'graphql-tag'

export const salesExperts = gql`
    query{
        salesExperts:allUsers(salesExp:true) {
            edges {
                node {
                    id
                    lastName
                    salesExp
                }
            }
        }
    }
`
export const userStats = gql`
    query{
        userStats: allUsers(salesExp: true) {
            edges {
                node {
                    id
                    lastName
                    orderEnteredCount
                    orderNotEnteredCount
                    orderNoProformaCount
                    percentEntered
                }
            }
        }
    }
`

export const userStatsTemp = gql`
    query{
        allUsers(salesExp: true) {
            edges {
                node {
                    id
                    lastName
                    orderEnteredCount
                    orderNotEnteredCount
                    orderNoProformaCount
                    noProforma: requestsSet(isActive:true, xpref_Isnull:true) {
                        edges {
                            node {
                                id
                                number
                                totalKw
                                totalQty
                            }
                        }
                    }
                    finished: requestsSet(isActive: true, finished:true) {
                        edges {
                            node {
                                id
                                number
                            }
                        }
                    }
                }
            }
        }
    }
`
