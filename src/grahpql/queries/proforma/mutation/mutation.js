import gql from "graphql-tag"

export const createProforma = gql`
    mutation createProforma($proforma_input:ProformaModelFormMutationInput!){
        proformaMutation(input:$proforma_input) {
            clientMutationId
            xpref{
                id
                number
                reqId{
                    id
                    number
                }
                customerName
            }
            errors{
                field
                messages
            }
        }
    }
`
