import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useReactiveVar } from '@apollo/client'
import { errorsVar,  successErrorType } from '../../cache/cache'
import { useRegisterMutation } from '../../types/graphql'
import { setError, validateEmail } from '../../misc/common'

import { ReactComponent as LogoIcon } from '../../assets/logo-white.svg'
import { ReactComponent as SuccessIcon } from '../../assets/success.svg'
import './styles.css'

const Input = React.lazy(() => import('../../components/common/Input'))
const Button = React.lazy(() => import('../../components/common/Button'))
const Language = React.lazy(() => import('../../components/common/Language'))
const ErrorMessage = React.lazy(() => import('../../components/common/ErrorMessage'))

interface IFields {
    email: string
    phone: string
    name: string
    company: string
    address: string
}

const Register: React.FC = () => {
    const [fields, setFields] = React.useState<IFields>({ email: '', phone: '', name: '', company: '', address: ''})
    const [isSuccess, setIsSuccess] = React.useState<boolean>(false)

    const { t } = useTranslation()
    let errors = useReactiveVar(errorsVar)
    const navigate = useNavigate()
    
    const [register] = useRegisterMutation({
        onError: e => {
            let errMessage = e?.message
            if (e?.graphQLErrors?.length > 0) {
                if (e?.graphQLErrors[0]?.extensions?.code === 'INVALID_EMAIL') {
                    errMessage = t('errors.email-wrong-format')
                }
                if (e?.graphQLErrors[0]?.extensions?.code === 'USER_ALREADY_EXIST') {
                    errMessage = t('errors.user-exist')
                }
                if (e?.graphQLErrors[0]?.extensions?.code === 'COMPANY_ALREADY_EXIST') {
                    errMessage = t('errors.company-exist')
                }
                const errorPlace = e?.graphQLErrors[0]?.extensions?.code === 'COMPANY_ALREADY_EXIST' ? "company" : "email"
                const newErrors = setError(errors, [{ place: errorPlace, message: errMessage }])
                errorsVar(newErrors)

            }
        },
        onCompleted: data => {
            if (data?.register && data.register.message === 'ok') {
                setIsSuccess(true)
            }
        }
    })

    const reg = () => {
        const newErrors: successErrorType[] = []
        errors = errorsVar([])
        
        if (fields.email.trim().length === 0) newErrors.push({ place: 'email', message: t('errors.email-required') })
        if (!validateEmail(fields.email))  newErrors.push({ place: 'email', message: t('errors.email-wrong-format') })
        if (fields.phone.trim().length === 0) newErrors.push({ place: 'phone', message: t('errors.field-required') })
        if (fields.name.trim().length === 0) newErrors.push({ place: 'name', message: t('errors.field-required') })
        if (fields.company.trim().length === 0) newErrors.push({ place: 'company', message: t('errors.field-required') })
        
        if (newErrors.length === 0) {
            register({ variables: fields })
        } else {
            errorsVar(setError(errors, newErrors))
        }
    }

    const emailError = errors.find(el => el?.place === 'email')
    const phoneError = errors.find(el => el?.place === 'phone')
    const nameError = errors.find(el => el?.place === 'name')
    const companyError = errors.find(el => el?.place === 'company')

    return (
        <div className="register">
            <Language className="register__language" />
            <div className="register__wrap">
                <div className="register__logo">
                    <LogoIcon/>
                </div>
                <div className="register__form">
                    {
                        isSuccess
                        ? <div className="register__success">
                            <SuccessIcon/>
                            <div className="register__title">{t('Register.success-title')}</div>
                            <div className="register__desc">{t('Register.success-desc')}</div>
                            <Button text={t('Register.link-auth')} onClick={ () => navigate('/') } />
                        </div>
                        :
                        <>
                        <div className="register__title">{t('Register.title')}</div>

                        <Input
                            className="register__input"
                            title={t('Register.email')}
                            placeholder={t('Register.email-placeholder')}
                            value={fields.email}
                            onChange={val => setFields({...fields, email: val})}
                            error={emailError !== undefined}
                        />
                        { emailError && <ErrorMessage className="register__error" errors={emailError} /> }

                        <Input
                            className="register__input"
                            title={t('Register.phone')}
                            placeholder={t('Register.phone-placeholder')}
                            value={fields.phone}
                            onChange={val => setFields({...fields, phone: val})}
                            error={phoneError !== undefined}
                        />
                        { phoneError && <ErrorMessage className="register__error" errors={phoneError} /> }

                        <Input
                            className="register__input"
                            title={t('Register.person')}
                            placeholder={t('Register.person-placeholder')}
                            value={fields.name}
                            onChange={val => setFields({...fields, name: val})}
                            error={nameError !== undefined}
                        />
                        { nameError && <ErrorMessage className="register__error" errors={nameError} /> }

                        <Input
                            className="register__input"
                            title={t('Register.company')}
                            placeholder={t('Register.company-placeholder')}
                            value={fields.company}
                            onChange={val => setFields({...fields, company: val})}
                            error={companyError !== undefined}
                        />
                        { companyError && <ErrorMessage className="register__error" errors={companyError} /> }

                        <Input
                            className="register__input"
                            title={t('Register.address')}
                            placeholder={t('Register.address-placeholder')}
                            value={fields.address}
                            onChange={val => setFields({...fields, address: val})}
                        />
                        
                        <Button className="register__button" text={t('Register.button')} onClick={reg} />
                        </>
                    }
                </div>
                <div className="register__footer">
                    {t('Register.account')} <Link to="/">{t('Register.link-auth')}</Link>
                </div>
            </div>
        </div>
    )
}

export default Register