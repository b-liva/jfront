import gql from 'graphql-tag'

export const specMutation = gql`
    mutation specMutation(
        $code:Int!,
        $order_id:ID!,
        $owner_id:ID!,
        $type_id:ID!,
        $qty:Int!,
        $kw:Float!,
        $rpm:Int,
        $rpm_new_id:ID!,
        $voltage:Int!,
        $ip_id:ID!,
        $ic_id:ID,
        $im_id:ID,
        $ie_id:ID,
        $summary:String,
    ){
        specMutation:reqSpecMutation(input: {
            code:$code,
            reqId:$order_id,
            owner:$owner_id,
            type:$type_id,
            qty:$qty,
            kw:$kw,
            rpmNew:$rpm_new_id,
            rpm:$rpm,
            voltage:$voltage,
            ip:$ip_id,
            ic:$ic_id,
            im:$im_id,
            ie:$ie_id,
            summary:$summary

        }) {
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
