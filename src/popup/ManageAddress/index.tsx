import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useLocation } from 'react-router-dom'
import { useReactiveVar } from '@apollo/client'
import { cache, userVar, userEditVar, errorsVar, successErrorType } from '../../cache/cache'
import { Query, EditUserMutationVariables, useAddUserMutation, useEditUserMutation, useAddAddressMutation } from '../../types/graphql'
import { COMPANY } from '../../graphql/queries'
import { setError, validateEmail } from '../../misc/common'

import './styles.css'

const Input = React.lazy(() => import('../../components/common/Input'))
const Button = React.lazy(() => import('../../components/common/Button'))
const ErrorMessage = React.lazy(() => import('../../components/common/ErrorMessage'))

const ManageAddress: React.FC = () => {
    const [fields, setFields] = React.useState<{address: string, instruction: string}>({address: '', instruction: ''})

    const { t } = useTranslation()
    const navigate = useNavigate()
    const location = useLocation()
    const user = useReactiveVar(userVar)
    let errors = useReactiveVar(errorsVar)

    const [updateUser] = useEditUserMutation({
        onCompleted: () => {
            navigate(location.pathname+location.search)
            userEditVar(null)
        }
    })
    
    const [addAddress] = useAddAddressMutation({
        onCompleted: data => {
            if(data?.addAddress) {
                navigate(location.pathname+location.search)
            }
        },
        onError: err => {
            console.log('ADD USER ERROR', err)
        },
        refetchQueries: [
            {query: COMPANY, variables: {companyId: user?.companyId as string}}
        ]
    })

    //Redirect to auth
    React.useEffect(() => {
        if (user === null) {
            navigate('/', { replace: true })
        }
    }, [ user, navigate ])

    const title = t('Popup.AddAddress.title')
    const button = t('Popup.AddAddress.add-button')

    const submit = () => {
        errors = errorsVar([])
        const newErrors: successErrorType[] = []

        if ((fields?.address || '').trim().length === 0) newErrors.push({ place: 'manage-address.address', message: t('errors.address-required') })

        if (newErrors.length === 0) {
            addAddress({ variables: {  address: fields?.address, instruction: fields?.instruction || '' } }) 
        } else {
            errorsVar(setError(errors, newErrors))
        }
    }

    const allErrors = errors.filter(el => ['manage-address.address', 'manage-address.instruction'].includes(el?.place || '') )
    const addressError = errors.find(el => el?.place === 'manage-address.address' )
    const instructionError = errors.find(el => el?.place === 'manage-address.instruction' )

    return (
        <div className="manage-address">
            <div className="manage-address__title">{title}</div>
            
            <Input
                className="manage-address__input"
                title={t('Popup.AddAddress.address-placeholder')}
                placeholder={t('Popup.AddAddress.address-placeholder')}
                value={fields?.address || ''}
                onChange={ val => setFields({ ...fields, address: val }) } 
                error={addressError !== undefined}
            />
            { addressError && <ErrorMessage className="manage-address__error" errors={addressError} /> }

            <Input
                className="manage-address__input"
                title={t('Popup.AddAddress.instruction-placeholder')}
                placeholder={t('Popup.AddAddress.instruction-placeholder')}
                value={fields?.instruction || ''}
                onChange={ val => setFields({ ...fields, instruction: val }) }
                error={instructionError !== undefined}
            />
            <Button text={button} onClick={ () => submit() } />
        </div>
    )
}

export default ManageAddress