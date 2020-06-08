import gql from 'graphql-tag'

export const createIncome = gql`
    mutation createIncome($income_input:IncomeModelFormMutationInput!){
        createIncome:incomeMutation(input:$income_input) {
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
