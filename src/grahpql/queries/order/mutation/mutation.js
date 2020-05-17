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
                messages
            }
        }
    }
`
