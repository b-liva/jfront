import gql from "graphql-tag"

export const assingIncomeRowMutation = gql`
    mutation assingIncomeRowMutation(
        $owner_id:ID!,
        $income_id:ID!
        $proforma_id:ID!,
        $amount:Float!,
        $date_fa:String!,
        $summary:String,
    ){
        assingIncomeRowMutation:incomeRowMutation(input:{
            owner:$owner_id,
            income:$income_id,
            proforma:$proforma_id,
            amount:$amount,
            dateFa:$date_fa,
            summary:$summary
        }) {
            clientMutationId
            incomeRow{
                id
                proforma{
                    id
                    number
                }
            }
            errors{
                field
                messages
            }
        }
    }
`
