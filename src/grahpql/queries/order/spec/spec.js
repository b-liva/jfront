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
