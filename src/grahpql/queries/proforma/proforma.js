import gql from 'graphql-tag'

export const proformaById = gql`
    query proformaById($proforma_id:ID!){
        proformaById:proforma(id:$proforma_id) {
            id
            number
            reqId {
                id
                number
            }
            perm
            permNumber
            numberTd
            summary
        }
    }
`

export const proformaFiltered = gql`
    query proformaFiltered($customer_name:String, $proforma_number:Int){
        proformaFiltered:allProformas(
            reqId_Customer_Name_Icontains:$customer_name,
            number:$proforma_number
        ) {
            edges {
                node {
                    id
                    customerName
                    number
                    owner{
                        lastName
                    }
                }
            }
        }
    }
`

export const proformasBySpec = gql`
    query proformasBySpec($kw:Float, $rpm:Int, $voltage:Int){
        proformasBySpec: allPrefSpecs(kw: $kw, rpm: $rpm, voltage:$voltage) {
            edges {
                node {
                    id
                    qty
                    price
                    xprefId {
                        id
                        number
                        reqId {
                            id
                            customer {
                                id
                                name
                            }
                        }
                    }
                }
            }
        }
    }
`

export const proformasByOrderId = gql`
    query proformasByOrderId($order_id:ID!){
        proformasByOrderId:request(id:$order_id) {
            id
            number
            xprefSet {
                edges {
                    node {
                        id
                        number
                        reqId {
                            id
                            number
                        }
                    }
                }
            }
        }
    }
`

export const proformaIdByNumber = gql`
    query proformaIdByNumber($number:Int){
        proformaIdByNumber:allProformas(number:$number) {
            edges {
                node {
                    id
                    number
                }
            }
        }
    }
`
