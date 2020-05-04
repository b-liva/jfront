import gql from 'graphql-tag'

export const incomeRowById = gql`
    query incomeRowById($income_row_id:ID!){
        incomeRowById:incomeRow(id:$income_row_id) {
            id
            amount
            income{
                number
            }
            summary
        }
    }
`
