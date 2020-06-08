import gql from 'graphql-tag'

export  const customerIdAndName  = gql`
    query{
        customerIdAndName:allCustomers {
            edges {
                node {
                    id
                    name
                }
            }
        }
    }
`

export const allCustomers = gql`
    query{
        allCustomers {
            edges {
                node {
                    id
                    name
                    salesQty
                    salesKw
                    amountReceived
                    amountReceivable
                    salesAmount
                    agent
                }
            }
        }
    }
`

export const customersMinimal = gql`
    query{
        allCustomers {
            edges {
                node {
                    id
                    name
                }
            }
        }
    }
`

export const customerById = gql`
    query customerById($customer_id:ID!){
        customerById:customer(id:$customer_id) {
            id
            name
            owner{
                id
                lastName
            }
            type{
                id
                name
            }
            agent
            phone
            fax
            email
            website
            postalCode
            addr
        }
    }
`

export const allCustomerTypes = gql`
    query{
        allCustomerTypes {
            edges {
                node {
                    id
                    name
                }
            }
        }
    }`

export const createCustomer = gql`
    mutation createCustomer(
        $name:String!,
        $owner_id:ID!,
        $type_id:ID!,
        $date2:String!,
        $pubDate:DateTime!,
        $isAgent:Boolean,
        $phone:String,
        $fax:String,
        $email:String,
        $website:String,
        $postalCode:String,
        $addr:String,
    ){
        createCustomer(
            input: {
                name: $name,
                owner: $owner_id,
                type: $type_id,
                date2: $date2,
                pubDate: $pubDate,
                agent:$isAgent,
                phone:$phone,
                fax:$fax,
                email:$email,
                website:$website,
                postalCode:$postalCode,
                addr:$addr
            }) {
            clientMutationId
            customer {
                id
                name
                owner {
                    id
                    lastName
                }
            }
        }
    }
`

export const customerMutation = gql`
    mutation customerMutation(
        $name:String!,
        $owner_id:ID!,
        $type_id:ID!,
        $date2:String!,
        $pubDate:DateTime!,
        $isAgent:Boolean,
        $phone:String,
        $fax:String,
        $email:String,
        $website:String,
        $postalCode:String,
        $addr:String,
    ){
        customerModelMutation(
            input: {
                name: $name,
                owner: $owner_id,
                type: $type_id,
                date2: $date2,
                pubDate: $pubDate,
                agent:$isAgent,
                phone:$phone,
                fax:$fax,
                email:$email,
                website:$website,
                postalCode:$postalCode,
                addr:$addr
            }) {
            clientMutationId
            customer {
                id
                name
                owner {
                    id
                    lastName
                }
            }
        }
    }

`

export const customerUnpaidProformas = gql`
    query customerUnpaidProformas($customer_id:ID!){
        customerUnpaidProformas:customer(id:$customer_id) {
            id
            name
            customerTotalKw
            unpaidProformas{
                id
                number
                amountTotal
                paidTotal
                unpaidTotal
            }
            saleTotal
            paidTotal
            unpaidTotal
        }
    }
`
