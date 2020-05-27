import gql from "graphql-tag"

export const deleteOrder = gql`
    mutation deleteOrder($order_id:ID){
        deleteOrder(input:{
            orderId:$order_id
        }) {
            msg
            number
            clientMutationId
        }
    }
`
