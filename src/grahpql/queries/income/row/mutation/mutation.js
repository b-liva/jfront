import gql from "graphql-tag"

export const assingIncomeRowMutation = gql`
    mutation assingIncomeRowMutation($incomeRowInput:IncomeRowModelFormMutationInput!){
        assingIncomeRowMutation:incomeRowMutation(input:$incomeRowInput) {
            clientMutationId
            incomeRow{
                id
                amount
                summary
                income{
                    id
                    customer{
                        id
                        name
                    }
                }
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
