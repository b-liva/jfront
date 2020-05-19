import gql from "graphql-tag"

export const specById = gql`
    query specById($spec_id:ID!){
        specById: reqSpec(id: $spec_id) {
            id
            kw
            rpm
            voltage
        }
    }
`

export const allIps = gql`
    query{
        allIps {
            edges {
                node {
                    id
                    title
                }
            }
        }
    }
`

export const allIcs = gql`
    query{
        allIcs {
            edges {
                node {
                    id
                    title
                }
            }
        }
    }
`

export const allIms = gql`
    query{
        allIms {
            edges {
                node {
                    id
                    title
                }
            }
        }
    }
`

export const specsNoProforma = gql`
    query specsNoProforma($proforma_id:ID!) {
        specsNoProforma: proforma(id: $proforma_id) {
            id
            specsNoProforma {
                id
                qty
                kw
                rpm
                rpmNew {
                    id
                    rpm
                }
                voltage
            }
            reqId{
                id
                number
            }
            customerName
        }
    }
`
