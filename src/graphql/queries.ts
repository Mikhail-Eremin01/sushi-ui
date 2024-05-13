import { gql } from '@apollo/client'

export const AUTH = gql`
    query auth($email: String!) {
    auth(email: $email) {
            accessToken
        }
    }
`
export const USER_INFO = gql`
    query userInfo {
        userInfo {
                id
                companyId
                name
                email
                phone
                isAdmin
                testValue
                acceptNewFeature
        }
    }
`