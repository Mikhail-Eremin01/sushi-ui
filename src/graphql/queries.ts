import { gql } from '@apollo/client'

export const REQUEST_AUTH = gql`
    query requestAuth($email: String!) {
        requestAuth(email: $email) {
            message
        }
    }
`

export const AUTH = gql`
    query auth($email: String!, $tempPassword: String!) {
        auth(email: $email, tempPassword: $tempPassword) {
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
            acceptNewFeature
        }
    }
`

export const USERS = gql`
    query users {
        users {
            id
            companyId
            name
            email
            phone
            isAdmin
        }
    }
`

export const SEND_OPERATION_EMAIL_INFO = gql`
    query sendOperationEmailInfo($operationId: ID!) {
        sendOperationEmailInfo(operationId: $operationId) {
            id
            userEmails
            suggestFunds
        }
    }
`

export const STATISTICS = gql`
    query statistics($offset: Int, $limit: Int, $startDate: String, $endDate: String, $status: String) {
        statistics(offset: $offset, limit: $limit, startDate: $startDate, endDate: $endDate, status: $status) {
            operations {
                id
                date
                companyId
                companyName
                status
                total
                amount
                payout
                amountPaid
                amountKept
                timeSpent
                distanceDriven
                funds {
                    id
                    name
                }
                files {
                    name
                    size
                    type
                    typeProof
                    fileId
                    urlPut
                    urlGet
                }
                letterSent
                companyFunds
                paymentStatus
                paymentDate
            }
            total
            amount
        }
    }
`
export const STATISTICSDOWNLOAD = gql`
    query statisticsDownload($startDate: String!, $endDate: String!) {
        statisticsDownload(startDate: $startDate, endDate: $endDate) {            
            id
            date
            companyId
            companyName
            companyAddress
            status
            total
            amount
            payout
            amountPaid
            amountKept
            timeSpent
            distanceDriven
            funds {
                id
                name
            }
            files {
                name
                size
                type
                typeProof
                fileId
                urlPut
                urlGet
            }
        }
    }
`

export const COMPANY = gql`
    query company($companyId: ID!) {
        company(companyId: $companyId) {
            id
            name
            funds {
                id
                name
            }
            addresses {
                address
                instruction
            }
            isDevShop
        }
    }
`

export const COMPANIES = gql`
    query companies($offset: Int, $limit: Int) {
        companies(offset: $offset, limit: $limit) {
            companies {
                id
                name
                addresses {
                    address
                    instruction
                }
                funds {
                    id
                    name
                }
                users {
                    id
                    name
                    email
                    phone
                }
                registerDate
            }
            total
        }
    }
`

export const ROUTES = gql`
    query route($date: String!) {
        route(date: $date) {
            points {
                num
                date
                companyName
                companyAddress
                person
                instruction
                eventComment
                amount
            }
            map
        }
    }
`

export const SCHEDULE = gql`
    query schedule($date: String!) {
        schedule(date: $date) {
            date
            events {
                eventId
                time
                info {
                    id
                    type
                    startDate
                    startTime
                    endTime
                    period
                    comment
                    companyInfo {
                        id
                        name
                    }
                    address
                    isBox
                    amount
                }
            }
            available
        }
    }
`

export const STATISTICS_COMPANY = gql`
    query companyStatistic($companyId: ID!) {
        companyStatistic(companyId: $companyId) {
            companyId
            companyName
            companyAddress
            funds {
                amount
                lastDate
                name
            }
            totalAmount
            lastMonthAmount
        }
    }
`

export const FUNDS = gql`
    query userFunds {
        userFunds {
            id
            name
            selected
        }
    }
`

export const PERMISSIONS = gql`
    query permissions {
        permissions {
            emailNotifications
            mentionCompany
        }
    }
`

export const CHARITIES = gql`
    query charityFunds {
        charityFunds {
            id
            name
            iban
            message
            reference
            country
            address
            createdAt
        }
    }
`

export const TRANSACTION_DETAILS = gql`
    query transactionDetails($operationId: ID!) {
        transactionDetails(operationId: $operationId) {
            operationId
            amount
            hasCheck
            paymentStatus
            fund {
                id
                name
                iban
                message
                reference
                country
                address
            }
        }
    }
`