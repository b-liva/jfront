import gql from "graphql-tag"

export const deleteProforma = gql`
    mutation deleteProforma($input:DeleteProformaInput!){
        deleteProforma(input:$input) {
            msg
            number
        }
    }
`
