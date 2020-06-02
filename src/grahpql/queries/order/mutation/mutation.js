import gql from 'graphql-tag'

export const OrderMutation = gql`
    mutation OrderMutation(
        $customer_id:ID!,
        $number:Int!,
        $date_fa:String!,
        $colleagues:[ID],
        $summary:String,
        $finished:Boolean,
        $owner_id:ID!
    ){
        OrderMutation:requestMutation(input:{
            customer:$customer_id,
            number:$number,
            dateFa:$date_fa,
            colleagues:$colleagues
            summary:$summary,
            finished:$finished,
            owner:$owner_id
        }) {
            clientMutationId
            requests{
                id
                customer{
                    id
                    name
                }
                number
                owner{
                    id
                    lastName
                }
            }
            errors{
                field
                messages
            }
        }
    }
`

export const editOrderPayload = gql`
    query editOrderPayload($order_id:ID!){
        editOrderPayload: request(id: $order_id) {
            id
            customer {
                id
                name
            }
            number
            colleagues {
                edges {
                    node {
                        id
                        lastName
                    }
                }
            }
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
    }
`