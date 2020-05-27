import gql from 'graphql-tag'

export const createIncome = gql`
    mutation createIncome(
        $owner_id:ID!,
        $customer_id:ID!,
        $number:Int!,
        $type_id:ID,
        $amount:Float!,
        $date_fa:String!,
        $due_date:String,
        $summary:String,
    ){
        createIncome:incomeMutation(input:{
            owner:$owner_id,
            customer:$customer_id,
            type:$type_id,
            amount:$amount,
            number:$number,
            dateFa:$date_fa,
            dueDate:$due_date,
            summary:$summary,
        }) {
            clientMutationId
            income{
                id
                number
                customer{
                    id
                    name
                }
            }
            errors{
                field
                messages
            }
        }
    }
`
