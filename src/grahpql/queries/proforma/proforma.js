import gql from 'graphql-tag'

export const allProformas = gql`
    query{
        allProformas(first:20) {
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
