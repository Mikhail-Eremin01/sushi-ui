import React from 'react'
import moment from 'moment'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useReactiveVar } from '@apollo/client'
import { useRequestAuthLazyQuery, useAuthLazyQuery } from '../../types/graphql'
import { userVar, errorsVar } from '../../cache/cache'
import { setError, validateEmail } from '../../misc/common'
import { ReactComponent as LogoIcon } from '../../assets/logo-white.svg'
import './styles.css'
import Window_userIsLocked from '../../components/common/Window_userIsLocked/Window_userIsLocked'

const Input = React.lazy(() => import('../../components/common/Input'))
const Button = React.lazy(() => import('../../components/common/Button'))
const Language = React.lazy(() => import('../../components/common/Language'))
const ErrorMessage = React.lazy(() => import('../../components/common/ErrorMessage'))

interface ILocationState {
    referer: string
} 

const Auth: React.FC = () => {
    const [step, setStep] = React.useState<'auth' | 'code'>('auth')
    const [email, setEmail] = React.useState<string>('')
    const [code, setCode] = React.useState<string>('')
    const [showUserIsLocked, setShowUserIsLocked] = React.useState<boolean>(false)
    const [timeLeft_userLocked, setTimeLeft_userLocked] = React.useState<any>('')
    const { t } = useTranslation()
    let errors = useReactiveVar(errorsVar)
    const user = useReactiveVar(userVar)
    const navigate = useNavigate()
    const location = useLocation()

    //Redirect to cabinet if user already auth
    React.useEffect(() => {
        if (user) {
            const state = location?.state as ILocationState | null
            if (state && state?.referer) {
                navigate(state?.referer)
            } else {
                navigate(`/cabinet/schedule/${moment().format('YYYY-MM')}/`, { replace: true })
            }
        }
    }, [ user, location, navigate ])

    const [ requestAuthUser ] = useRequestAuthLazyQuery({
        onError: (e: any) => {
            if (e?.graphQLErrors[0]?.extensions?.code === 'USER_IS_BLOCKED' && e?.graphQLErrors[0]?.extensions?.timeLeft) {
                console.log('eeeee: ', e?.graphQLErrors[0]?.extensions?.timeLeft)
                setTimeLeft_userLocked(e?.graphQLErrors[0]?.extensions?.timeLeft?.toString())
                setStep('code')
                return setShowUserIsLocked(true)
            }
            let errMessage = e?.message
            if (e?.graphQLErrors?.length > 0) {
                if (e?.graphQLErrors[0]?.extensions?.code === 'USER_NOT_EXIST') {
                    errMessage = t('errors.user-not-exist')
                } else if (e?.graphQLErrors[0]?.extensions?.code === 'USER_EMAIL_NOT_ACTIVE') {
                    errMessage = t('errors.user-not-active')
                }
            }
            const newErrors = setError(errors, [{ place: 'auth', message: errMessage }])
            errorsVar(newErrors)
        },
        onCompleted: data => {
            if (data?.requestAuth !== null) {
                setShowUserIsLocked(false)
                setCode('')
                errors = errorsVar([])
                setStep('code')
            }
        },
        nextFetchPolicy: 'network-only',
        fetchPolicy: 'network-only'
    })

    const [ authUser ] = useAuthLazyQuery({
        onError: (e: any) => {
            console.log('errorr: ', e.graphQLErrors)
            if (e?.graphQLErrors[0]?.extensions?.code === 'USER_IS_BLOCKED' && e?.graphQLErrors[0]?.extensions?.timeLeft) {
                console.log('e: ', e?.graphQLErrors[0]?.extensions?.timeLeft)
                setTimeLeft_userLocked(e?.graphQLErrors[0]?.extensions?.timeLeft?.toString())
                return setShowUserIsLocked(true)
            }
            let errMessage = e?.message
            if (e?.graphQLErrors?.length > 0) {
                if (e?.graphQLErrors[0]?.extensions?.code === 'PASSWORD_WRONG') {
                    console.log('e?.graphQLErrors[0]?.extensions: ', e?.graphQLErrors[0]?.extensions.numberOfRemainingAttempts)
                    const countRemainingAttempts = e?.graphQLErrors[0]?.extensions.numberOfRemainingAttempts
                    errMessage = `${t('errors.code-wrong.firstPart')} ${countRemainingAttempts} ${t('errors.code-wrong.secondPart')}`
                }
            }
            const newErrors = setError(errors, [{ place: 'code', message: errMessage }])
            errorsVar(newErrors)
        },
        onCompleted: data => {
            console.log('123456sss')
            if (data?.auth?.accessToken) {
                localStorage.setItem('AccessToken', data?.auth?.accessToken)
                window.location.reload()
            }
        }
    })

    //Send auth code
    const login = () => {
        errors = errorsVar([])
        if (email.trim().length > 0) {
            if (validateEmail(email)) {
                requestAuthUser({ variables: { email: email } })
            } else {
                const newErrors = setError(errors, [{ place: 'auth', message: t('errors.email-wrong-format') }])
                errorsVar(newErrors)
            }
        } else {
            const newErrors = setError(errors, [{ place: 'auth', message: t('errors.email-required') }])
            errorsVar(newErrors)
        }
    }

    //Authorization
    const auth = () => {
        errors = errorsVar([])
        if (code.trim().length > 0) {
            authUser({ variables: { email: email, tempPassword: code } })
        } else {
            const newErrors = setError(errors, [{ place: 'code', message: t('errors.code-required')}])
            errorsVar(newErrors)
        }
    }

    //Enter button to submit
    const onKeyPress = (e: React.KeyboardEvent<HTMLInputElement> | undefined, step: 'auth' | 'code') => {
        if (e && e?.key === 'Enter') {
            step === 'auth' ? login() : auth()
        } 
    }

    const authError = errors.find(el => el?.place === 'auth')
    const codeError = errors.find(el => el?.place === 'code')

    return (
        <div className="auth">
            <Language className="auth__language" />
            <div className="auth__wrap">
                <div className="auth__logo">
                    <LogoIcon className="auth__logo-icon" />
                </div>
                <div className="auth__form">
                    {
                        <>
                            <div className="auth__title">{t('Auth.title')}</div>
                            {
                                step === 'auth' &&
                                <>
                                    <div className="auth__text">{t('Auth.text')}</div>
                                    <Input
                                        className="auth__input"
                                        title={t('Auth.email')}
                                        placeholder={t('Auth.placeholder')}
                                        value={email}
                                        onChange={setEmail}
                                        onKeyPress={e => onKeyPress(e, 'auth')}
                                        error={authError !== undefined}
                                    />
                                    {
                                        authError && <ErrorMessage className="auth__error" errors={authError} />
                                    }
                                    <Button className="auth__button" text={t('Auth.button')} onClick={login} />
                                </>
                            }
                            {
                                step === 'code'
                                &&
                                showUserIsLocked
                                &&
                                <Window_userIsLocked
                                    lockedTimeMinutes={timeLeft_userLocked}
                                    setStep={setStep}
                                />
                            }
                            { 
                                step === 'code' 
                                &&
                                !showUserIsLocked
                                &&
                                <>
                                    <div className="auth__text">{t('Auth.text-code', { email })}</div>
                                    <Input
                                        className="auth__input"
                                        type='number'
                                        title={t('Auth.code')}
                                        placeholder={t('Auth.placeholder-code')}
                                        value={code} onChange={setCode}
                                        onKeyPress={e => onKeyPress(e, 'code')}
                                        error={codeError !== undefined}
                                    />
                                    {
                                        codeError && <ErrorMessage className="auth__error" errors={codeError} />
                                    }
                                    <Button className="auth__button" text={t('Auth.button-code')} onClick={auth} />
                                </>
                            }
                        </>
                    }
                </div>
                <div className="auth__footer">
                    {t('Auth.account')} <Link to="/register/">{t('Auth.link-register')}</Link>
                </div>
            </div>
        </div>
    )
}

export default Auth
