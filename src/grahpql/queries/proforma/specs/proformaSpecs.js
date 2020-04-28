import gql from "graphql-tag"

export const proformaSpecs = gql`
    query proformaSpecs($proforma_id:ID!){
        proformaSpecs:proforma(id:$proforma_id) {
            id
            prefspecSet {
                edges {
                    node {
                        id
                        qty
                        kw
                        rpm
                        voltage
                        price
                        reqspecEq {
                            id
                            kw
                            rpm
                            voltage
                        }
                    }
                }
            }
        }
    }
`
