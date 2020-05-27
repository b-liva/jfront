import gql from "graphql-tag"

export const deleteProforma = gql`
    mutation deleteProforma($proforma_id:ID){
        deleteProforma(input:{
            proformaId:$proforma_id
        }) {
            msg
            number
        }
    }
`
