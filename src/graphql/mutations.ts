import { gql } from '@apollo/client'

export const REGISTER = gql`
    mutation register($email: String!, $phone: String!, $name: String!, $company: String!, $address: String) {
        register(email: $email, phone: $phone, name: $name, company: $company, address: $address) {
            message
        }
    }
`

export const ADD_USER = gql`
    mutation addUser($name: String!, $email: String!, $phone: String!) {
        addUser(name: $name, email: $email, phone: $phone) {
            id
            companyId
            name
            email
            phone
            isAdmin
        }
    }
`

export const EDIT_USER = gql`
    mutation editUser($userId: ID!, $name: String!, $email: String!, $phone: String!) {
        editUser(userId: $userId, name: $name, email: $email, phone: $phone) {
            id
            companyId
            name
            email
            phone
            isAdmin
        }
    }
`

export const DELETE_USER = gql`
    mutation deleteUser($userId: ID!) {
        deleteUser(userId: $userId) {
            id
        }
    }
`

export const ADD_OPERATION = gql`
    mutation addOperation($date: String!, $companyId: ID!, $status: String!, $total: Float!, $amount: Float!, $payout: Float!, $amountPaid: Float!, $amountKept: Float!, $timeSpent: Float!, $distanceDriven: Float!, $funds: [String], $files: [FileInput]) {
        addOperation(date: $date, companyId: $companyId, status: $status, total: $total, amount: $amount, payout: $payout, amountPaid: $amountPaid, amountKept: $amountKept, timeSpent: $timeSpent, distanceDriven: $distanceDriven, funds: $funds, files: $files) {
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
        }
    }
    input FileInput {
        name: String
        size: Number
        type: String
        typeProof: String # proofOfMoneyCollection | proofOfMoneyTransfer | ''        
        fileId: String
    }
`

export const EDIT_OPERATION = gql`
    mutation editOperation($operationId: ID!, $date: String!, $companyId: ID!, $status: String!, 
        $total: Float!, $amount: Float!, $payout: Float!, $amountPaid: Float!, $amountKept: Float!, $timeSpent: Float!, 
        $distanceDriven: Float!, $funds: [String], $files: [FileInput]) {
        editOperation(operationId: $operationId, date: $date, companyId: $companyId, status: $status, 
            total: $total, amount: $amount, payout: $payout, amountPaid: $amountPaid, amountKept: $amountKept, 
            timeSpent: $timeSpent, distanceDriven: $distanceDriven, funds: $funds, files: $files) {
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
        }
    }
    input FileInput {
        name: String
        size: Number
        type: String
        typeProof: String # proofOfMoneyCollection | proofOfMoneyTransfer | ''        
        fileId: String
    }
    
`

export const DELETE_OPERATION = gql`
    mutation deleteOperation($operationId: ID!) {
        deleteOperation(operationId: $operationId) {
            id
        }
    }
`

export const EDIT_COMPANY = gql`
    mutation editCompany($name: String!) {
        editCompany(name: $name) {
            id
        }
    }
`

export const SUGGEST_ORGANIZATION = gql`
    mutation suggestOrganization($name: String!, $url: String) {
        suggestOrganization(name: $name, url: $url) {
            id
            message
        }
    }
`

export const ADD_EVENT = gql`
    mutation addEvent($type: String!, $startDate: String!, $startTime: String!, $endTime: String!, $period: String, $comment: String, $companyId: ID, $address: String) {
        addEvent(type: $type, startDate: $startDate, startTime: $startTime, endTime: $endTime, period: $period, comment: $comment, companyId: $companyId, address: $address) {
            id
        }
    }
`

export const EDIT_EVENT = gql`
    mutation editEvent($editEventId: ID!, $startDate: String!, $startTime: String!, $endTime: String!, $type: String!, $period: String, $comment: String, $deleteDate: String, $address: String, $amount: String) {
        editEvent(id: $editEventId, startDate: $startDate, startTime: $startTime, endTime: $endTime, type: $type, period: $period, comment: $comment, deleteDate: $deleteDate, address: $address, amount: $amount) {
            id
        }
    }
`

export const DELETE_EVENT = gql`
    mutation deleteEvent($deleteEventId: ID!, $deleteDate: String) {
        deleteEvent(id: $deleteEventId, deleteDate: $deleteDate) {
            id
        }
    }
`

export const ADD_ADDRESS = gql`
    mutation addAddress($address: String!, $instruction: String!) {
        addAddress(address: $address, instruction: $instruction) {
            message
        }
    }
`

export const EDIT_ADDRESSES = gql`
    mutation editAddresses($addresses: [AddressInput]) {
        editAddresses(addresses: $addresses) {
            message
        }
    }
    input AddressInput {
        address: String
        instruction: String
    }
`

export const EDIT_FUNDS = gql`
    mutation editFunds($funds: [String]) {
        editFunds(funds: $funds) {
            message
        }
    }
`

export const EDIT_PERMISSIONS = gql`
    mutation editPermissions($emailNotifications: [String], $mentionCompany: [String]) {
        editPermissions(emailNotifications: $emailNotifications, mentionCompany: $mentionCompany) {
            message
        }
    }
`

export const ACCEPT_NEW_FEATURE = gql`
    mutation acceptNewFeature($message: String) {
        acceptNewFeature(message: $message) {
            message
        }
    }
`

export const ORDER_BOX = gql`
    mutation orderBox($amount: String!, $startDate: String!, $startTime: String!, $endTime: String!, $comment: String, $address: String!) {
        orderBox(
            amount: $amount,
            startDate: $startDate,
            startTime: $startTime,
            endTime: $endTime,
            comment: $comment
            address: $address
        ) {
            message
        }
    }
`

export const EDIT_BOX = gql`
    mutation editBox($id: ID!, $amount: String!, $startDate: String!, $startTime: String!, $endTime: String!, $comment: String, $address: String!) {
        editBox(
        id: $id,
            amount: $amount,
            startDate: $startDate,
            startTime: $startTime,
            endTime: $endTime,
            comment: $comment
            address: $address
        ) {
            id
        }
    }
`

export const SEND_LETTER_OPERATION_INFO = gql`
    mutation sendLetterOperationInfo($operationId: ID!, $userEmails: [String]) {
        sendLetterOperationInfo(
            operationId: $operationId,
            userEmails: $userEmails
        ) {
            message
        }
    }
`

export const ADD_FUND = gql`
    mutation addFund($name: String!, $iban: String!, $message: String, $reference: String, $address: String!, $country: String!) {
        addFund(name: $name, iban: $iban, message: $message, reference: $reference, address: $address, country: $country) {
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

export const EDIT_FUND = gql`
    mutation editFund($fundId: ID!, $name: String!, $iban: String!, $message: String, $reference: String, $address: String!, $country: String!) {
        editFund(fundId: $fundId, name: $name, iban: $iban, message: $message, reference: $reference, address: $address, country: $country) {
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

export const DELETE_FUND = gql`
    mutation deleteFund($fundId: ID!) {
        deleteFund(fundId: $fundId) {
            id
            message
        }
    }
`

export const SEND_MONEY = gql`
    mutation sendMoney($operationId: ID!) {
        sendMoney(operationId: $operationId) {
            operationId
            companyFromId
            archiveId
            amount
            bookingDate
            currency
            creditorName
            creditorIban
            debtorIban
            transactionId
            transactionDate
            paymentType
            status
            endToEndId
        }
    }
`