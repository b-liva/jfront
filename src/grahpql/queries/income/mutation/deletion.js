import gql from "graphql-tag"

export const  deleteIncome = gql`
    mutation deleteIncome($income_id:ID){
        deleteIncome(input:{
            incomeId:$income_id
        }) {
            msg
            number
            clientMutationId
        }
    }
`
