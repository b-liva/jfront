import gql from "graphql-tag"

export const createProforma = gql`
    mutation createProforma(
        $owner_id:ID!,
        $req_id:ID!,
        $number:Int!,
        $number_td:Int,
        $date_fa:String!,
        $expiry_date:String!,
        $perm_number:Int,
        $perm_date:String,
        $due_date:String,
        $summary:String,
        $perm:Boolean,
    ){
        proformaMutation(input:{
            owner:$owner_id,
            reqId:$req_id,
            number:$number,
            dateFa:$date_fa,
            numberTd:$number_td,
            expDateFa:$expiry_date,
            permNumber:$perm_number,
            permDate:$perm_date,
            dueDate:$due_date,
            summary:$summary,
            perm:$perm
        }) {
            clientMutationId
            xpref{
                id
                number
            }
            errors{
                field
                messages
            }
        }
    }
`
