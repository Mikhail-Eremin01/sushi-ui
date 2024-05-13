import { InMemoryCache, makeVar } from '@apollo/client'
import { User, EditUserMutationVariables, EditOperationMutationVariables, EditEventMutationVariables, DeleteEventMutationVariables, EditFundMutationVariables } from '../types/graphql'

export interface successErrorType {
    place?: string
    message: string
}

export const successVar = makeVar<successErrorType | null>(null)
export const errorsVar = makeVar<successErrorType[]>([])
export const userVar = makeVar<User | undefined | null>(undefined)
export const userEditVar = makeVar<EditUserMutationVariables | null>(null)
export const operationEditVar = makeVar<EditOperationMutationVariables | null>(null)
export const fundEditVar = makeVar<EditFundMutationVariables | null>(null)
export const transferMoneyVar = makeVar<string | null>(null)
export const eventEditVar = makeVar<EditEventMutationVariables | null>(null)
export const eventDeleteVar = makeVar<DeleteEventMutationVariables | null>(null)
export const changesMessageVar = makeVar<'success' | 'error' | 'requiredField' | null>(null)

export const cache: InMemoryCache = new InMemoryCache({
    /*typePolicies: {
        Event: {
            keyFields: ['date', 'time']
        }
    }*/
})