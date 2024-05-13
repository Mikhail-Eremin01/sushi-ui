import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useLocation } from 'react-router-dom'
import { useReactiveVar } from '@apollo/client'
import { userVar, errorsVar, successErrorType } from '../../cache/cache'
import { SuggestOrganizationMutationVariables, useSuggestOrganizationMutation } from '../../types/graphql'
import { setError } from '../../misc/common'

import { ReactComponent as SuccessIcon } from '../../assets/success.svg'
import './styles.css'

const Input = React.lazy(() => import('../../components/common/Input'))
const Button = React.lazy(() => import('../../components/common/Button'))
const ErrorMessage = React.lazy(() => import('../../components/common/ErrorMessage'))

const SuggestOrganization: React.FC = () => {
    const [fields, setFields] = React.useState<SuggestOrganizationMutationVariables>({ name: '', url: '' })
    const [isSuccess, setIsSuccess] = React.useState<boolean>(false)

    const { t } = useTranslation()
    const navigate = useNavigate()
    const location = useLocation()
    const user = useReactiveVar(userVar)
    let errors = useReactiveVar(errorsVar)

    const [suggest] = useSuggestOrganizationMutation({
        onCompleted: data => {
            if (data?.suggestOrganization) {
                setIsSuccess(true)
            }
        },
        onError: err => {
            console.log('SUGGEST ORGANIZATION ERROR', err)
        }
    })

    //Redirect to auth
    React.useEffect(() => {
        if (user === null) {
            navigate('/', { replace: true })
        }
    }, [ user, navigate ])


    const submit = () => {
        errors = errorsVar([])
        const newErrors: successErrorType[] = []

        if ((fields?.name || '').trim().length === 0) newErrors.push({ place: 'suggest-organization.name', message: t('errors.field-required') })

        if (newErrors.length === 0) {
            suggest({ variables: { name: fields?.name, url: fields?.url } }) 
        } else {
            errorsVar(setError(errors, newErrors))
        }
    }

    const nameError = errors.find(el => el?.place === 'suggest-organization.name' )

    return (
        <div className="suggest-organization">
            {
                isSuccess
                ? <div className="suggest-organization__success">
                    <SuccessIcon/>
                    <div className="suggest-organization__title">{t('Popup.SuggestOrganization.success-title')}</div>
                    <div className="suggest-organization__desc">{t('Popup.SuggestOrganization.success-desc')}</div>
                    <Button text={t('Popup.SuggestOrganization.close')} onClick={ () => navigate(location.pathname+location.search) } />
                </div>
                : <>
                    <div className="suggest-organization__title">{t('Popup.SuggestOrganization.title')}</div>
                    <Input className="suggest-organization__input" title={t('Popup.SuggestOrganization.name')} placeholder={t('Popup.SuggestOrganization.name-placeholder')} value={fields?.name || ''} onChange={ val => setFields({ ...fields, name: val }) } error={nameError !== undefined} />
                    { nameError && <ErrorMessage className="suggest-organization__error" errors={nameError} /> }
                    <Input className="suggest-organization__input" title={t('Popup.SuggestOrganization.url')} placeholder={t('Popup.SuggestOrganization.url-placeholder')} value={fields?.url || ''} onChange={ val => setFields({ ...fields, url: val }) } />
                    <Button text={t('Popup.SuggestOrganization.submit')} onClick={ () => submit() } />
                </>
            }
        </div>
    )
}

export default SuggestOrganization