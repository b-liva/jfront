import gql from 'graphql-tag'

export const incomeRowById = gql`
    query incomeRowById($incomeRowId:ID!){
        incomeRowById:incomeRow(id:$incomeRowId){
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
    }
`
