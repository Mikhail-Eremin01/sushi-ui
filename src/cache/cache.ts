import { InMemoryCache, makeVar } from '@apollo/client'
import { User } from '../types/graphql'

export interface successErrorType {
    place?: string
    message: string
}

export const successVar = makeVar<successErrorType | null>(null)
export const errorsVar = makeVar<successErrorType[]>([])
export const userVar = makeVar<User | undefined | null>(undefined)
export const transferMoneyVar = makeVar<string | null>(null)
export const changesMessageVar = makeVar<'success' | 'error' | 'requiredField' | null>(null)

export const cache: InMemoryCache = new InMemoryCache({
    /*typePolicies: {
        Event: {
            keyFields: ['date', 'time']
        }
    }*/
})