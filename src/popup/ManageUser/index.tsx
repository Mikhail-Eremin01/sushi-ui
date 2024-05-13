import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useLocation } from 'react-router-dom'
import { useReactiveVar } from '@apollo/client'
import { cache, userVar, userEditVar, errorsVar, successErrorType, changesMessageVar } from '../../cache/cache'
import { Query, EditUserMutationVariables, useAddUserMutation, useEditUserMutation } from '../../types/graphql'
import { USERS } from '../../graphql/queries'
import { setError, validateEmail } from '../../misc/common'

import './styles.css'

const Input = React.lazy(() => import('../../components/common/Input'))
const Button = React.lazy(() => import('../../components/common/Button'))
const ErrorMessage = React.lazy(() => import('../../components/common/ErrorMessage'))

const ManageUser: React.FC = () => {
    const [fields, setFields] = React.useState<EditUserMutationVariables>({ userId: '', name: '', email: '', phone: '' })

    const { t } = useTranslation()
    const navigate = useNavigate()
    const location = useLocation()
    const user = useReactiveVar(userVar)
    const editFields = useReactiveVar(userEditVar)
    let errors = useReactiveVar(errorsVar)

    const [updateUser] = useEditUserMutation({
        onCompleted: () => {
            showMessage('success')
            navigate(location.pathname+location.search)
            userEditVar(null)
            
        },
        onError: e => {
            let errMessage = e?.message
            if (e?.graphQLErrors?.length > 0) {
                if (e?.graphQLErrors[0]?.extensions?.code === 'INVALID_EMAIL') {
                    errMessage = t('errors.email-wrong-format')
                }
                if (e?.graphQLErrors[0]?.extensions?.code === 'EMAIL_ALREADY_IN_USE') {
                    errMessage = t('errors.user-exist')
                }
                if (e?.graphQLErrors[0]?.extensions?.code === 'USER_DOESNT_EXIST') {
                    errMessage = t('errors.user-not-exist')
                }
                
                const newErrors = setError(errors, [{ place: "manage-user.email", message: errMessage }])
                errorsVar(newErrors)
            }
        },
    })
    
    const showMessage = (status: 'success' | 'error' | 'requiredField') => {
        changesMessageVar(status)
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
            });
        setTimeout(() => {
            changesMessageVar(null)
        }, 3000)
    }
    
    const [addUser] = useAddUserMutation({
        onCompleted: data => {
            if (data?.addUser) {
                showMessage('success')
                const currentUsers = cache.readQuery<Query>({
                    query: USERS
                })

                if (currentUsers?.users) {
                    cache.writeQuery({
                        query: USERS,
                        data: {
                            users: [...currentUsers.users, data.addUser]
                        }
                    })
                }

                navigate(location.pathname+location.search)
                userEditVar(null)
            }
        },
        onError: e => {
            let errMessage = e?.message
            if (e?.graphQLErrors?.length > 0) {
                if (e?.graphQLErrors[0]?.extensions?.code === 'INVALID_EMAIL') {
                    errMessage = t('errors.email-wrong-format')
                }
                if (e?.graphQLErrors[0]?.extensions?.code === 'EMAIL_ALREADY_IN_USE') {
                    errMessage = t('errors.user-exist')
                }
                const newErrors = setError(errors, [{ place: "manage-user.email", message: errMessage }])
                errorsVar(newErrors)

            }
        },
    })

    //Redirect to auth
    React.useEffect(() => {
        if (user === null) {
            navigate('/', { replace: true })
        }
    }, [ user, navigate ])

    //Set edit fields
    React.useEffect(() => {
        if (editFields !== null) {
            setFields(editFields)
        }
    }, [editFields])

    const title = (editFields === null) ? t('Popup.ManageUser.add-title') : t('Popup.ManageUser.edit-title')
    const button = (editFields === null) ? t('Popup.ManageUser.add-button') : t('Popup.ManageUser.edit-button')

    const submit = () => {
        errors = errorsVar([])
        const newErrors: successErrorType[] = []

        if ((fields?.name || '').trim().length === 0) newErrors.push({ place: 'manage-user.name', message: t('errors.name-required') })
        if ((fields?.email || '').trim().length === 0) newErrors.push({ place: 'manage-user.email', message: t('errors.email-required') })
        if ((fields?.phone || '').trim().length === 0) newErrors.push({ place: 'manage-user.phone', message: t('errors.phone-required') })
        if (!validateEmail(fields?.email)) newErrors.push({ place: 'manage-user.email', message: t('errors.email-wrong-format') })

        if (newErrors.length === 0) {
            (editFields === null)
                ? addUser({ variables: {  name: fields?.name, email: fields?.email, phone: fields?.phone } }) 
                : updateUser({ variables: fields })
        } else {
            errorsVar(setError(errors, newErrors))
        }
    }

    const nameError = errors.find(el => el?.place === 'manage-user.name' )
    const emailError = errors.find(el => el?.place === 'manage-user.email' )
    const phoneError = errors.find(el => el?.place === 'manage-user.phone' )

    return (
        <div className="manage-user">
            <div className="manage-user__title">{title}</div>
            <Input
                className="manage-user__input"
                title={t('Popup.ManageUser.name')} 
                placeholder={t('Popup.ManageUser.name-placeholder')}
                value={fields?.name || ''}
                onChange={ val => setFields({ ...fields, name: val }) } 
                error={nameError !== undefined}
            />
            { nameError && <ErrorMessage className="manage-user__error" errors={nameError} /> }
            <Input
                className="manage-user__input"
                title={t('Popup.ManageUser.email')}
                placeholder={t('Popup.ManageUser.email-placeholder')}
                value={fields?.email || ''}
                onChange={ val => setFields({ ...fields, email: val }) }
                error={emailError !== undefined}
            />
            { emailError && <ErrorMessage className="manage-user__error" errors={emailError} /> }
            <Input
                className="manage-user__input"
                title={t('Popup.ManageUser.phone')}
                placeholder={t('Popup.ManageUser.phone-placeholder')}
                value={fields?.phone || ''}
                onChange={ val => setFields({ ...fields, phone: val }) }
                error={phoneError !== undefined}
            />
            { phoneError && <ErrorMessage className="manage-user__error" errors={phoneError} /> }
            <Button text={button} onClick={ () => submit() } />
        </div>
    )
}

export default ManageUser