import gql from 'graphql-tag'

export const order = gql`
    query order($order_id:ID!){
        order: request(id: $order_id) {
            id
            reqspecSet(isActive: true) {
                edges {
                    node {
                        id
                        qty
                        kw
                        voltage
                        rpm
                        rpmNew {
                            id
                            rpm
                        }
                    }
                }
            }
        }
    },
`

export const allRequests = gql`
    query{
        allRequests(first: 99) {
            edges {
                node {
                    id
                    number
                    totalKw
                    totalQty
                    customer{
                        id
                        name
                    }
                    owner{
                        id
                        lastName
                    }
                }
            }
        }
    }`

export const ordersNoProforma = gql`
    query{
        ordersNoProforma(isActive:true, xpref_Isnull:true){
            edges{
                node {
                    id
                    number
                    customer{
                        id
                        name
                    }
                    owner{
                        id
                        lastName
                    }
                }
            }
        }
    }
`
