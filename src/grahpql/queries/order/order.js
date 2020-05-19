import gql from 'graphql-tag'

export const  orderOnly = gql`
    query orderOnly($order_id:ID!){
        orderOnly:request(id:$order_id) {
            id
            number
            customer{
                id
                name
            }
        }
    }
`

export const orderByNumber = gql`
    query orderByNumber($number:Int){
        orderByNumber:allRequests(number:$number){
            edges{
                node{
                    id
                    number
                }
            }
        }
    }
`
export const orderIdAndNumber = gql`
    query orderIdAndNumber($order_id:ID!){
        orderIdAndNumber:request(id:$order_id) {
            id
            number
            customer{
                id
                name
            }
        }
    }
`

export const order = gql`
    query order($order_id:ID!){
        order: request(id: $order_id) {
            id
            customer {
                id
                name
            }
            number
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
                        im {
                            id
                            title
                        }
                        ic {
                            id
                            title
                        }
                        ip {
                            id
                            title
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

export const filteredOrders = gql`
    query filteredOrders(
        $count:Int,
        $number:Int,
        $customer_name:String,
        $no_proforma: Boolean
    ){
        filteredOrders:allRequests(
            first: $count,
            number:$number,
            customer_Name_Icontains:$customer_name,
            xpref_Isnull:$no_proforma
        ) {
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
                    totalKw
                    totalQty
                }
            }
        }
    }
`

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
