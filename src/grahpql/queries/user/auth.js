import gql from 'graphql-tag'

export const login = gql`
    mutation login($username:String!, $password:String!){
        login:tokenAuth(username:$username, password:$password){
            token
        }
    }
`

export const me = gql`
    query{
        me{
            id
            lastName
            username
        }
    }
`
