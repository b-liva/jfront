import gql from 'graphql-tag'

export const dashboardStatistics = gql`
    query{
        dashboardStatistics{
            total {
                title
                kw
                count
            }
            routine {
                title
                kw
                count
            }
            services{
                title
                kw
                count
            }
            ex {
                title
                kw
                count
            }
            project{
                title
                kw
                count
            }
        }
    }
`

export const automationOrders = gql`
    query{
        automationOrders {
            numberAutomation
            dateTxt
            customer
            title
            ownerText
        }
    }
`
