import gql from 'graphql-tag'

export const specMutation = gql`
    mutation specMutation($reqspec_input:ReqSpecModelFormMutationInput!){
        specMutation:reqSpecMutation(input: $reqspec_input) {
            clientMutationId
            reqSpec{
                id
                qty
                kw
                isActive
                reqId{
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

export const createPrefSpecsBulk = gql`
    mutation createPrefSpecsBulk(
        $proforma_id:ID,
        $spec_list: [ProformaSpecInput]
    ){
        createPrefSpecsBulk(input: {
            proformaId:$proforma_id,
            specsList:$spec_list
        }) {
            clientMutationId
            proformaSpecs {
                xprefId{
                    id
                    number
                    customerName
                    reqId{
                        id
                        number
                    }
                }
                code
                id
                qty
                kw
                voltage
                rpm
                price
                ip{
                    title
                }
                im{
                    title
                }
                ic{
                    title
                }
                summary
            }
        }
    }
`
