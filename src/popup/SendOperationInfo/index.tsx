import React from 'react'
import { useTranslation } from 'react-i18next'
import InputDropDownList, { ISelectItem } from '../../components/common/InputDropDownList/InputDropDownList'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { useSendLetterOperationInfoMutation, useSendOperationEmailInfoQuery } from '../../types/graphql'
import { STATISTICS } from '../../graphql/queries'
import { ReactComponent as SuccessIcon } from '../../assets/success.svg'
import { setError, validateEmail } from '../../misc/common'
import { errorsVar, successErrorType } from '../../cache/cache'
import { useReactiveVar } from '@apollo/client'
import { LIMIT } from '../../pages/Statistics'
import moment from 'moment'

import './styles.css'

const Button = React.lazy(() => import('../../components/common/Button'))

interface LocationState {
    operationId: string
}

const SendOperationInfo: React.FC = () => {
    const location = useLocation();
    const from = location.state as LocationState
    let errors = useReactiveVar(errorsVar)
    const navigate = useNavigate()
	const [valueDropDown, setValueDropDown] = React.useState<string>('')
    const [letterHasBeenSent, setLetterHasBeenSent] = React.useState<boolean>(false)
    const [buttonDisable, setButtonDisable] = React.useState<boolean>(false)
    const [selectedEmails, setSelectedEmails] = React.useState<string[]>([])
    const [searchParams] = useSearchParams({})
    const page = (Number(searchParams.get('page')) === 0) ? 1 : Number(searchParams.get('page'))
    const end = searchParams.get('endDate') || moment().format("YYYY-MM-DD")
    const start = searchParams.get('startDate') || moment().subtract(1, "month").format("YYYY-MM-DD")
    const status = searchParams.get('status')

    const { t } = useTranslation()

    const { data } = useSendOperationEmailInfoQuery({
        variables: {
            operationId: from?.operationId
        },
        onCompleted: (data) => {
            const emails = data?.sendOperationEmailInfo?.userEmails && Array.isArray(data?.sendOperationEmailInfo?.userEmails)
            ? data?.sendOperationEmailInfo?.userEmails?.map((el) => String(el)) : []
            setSelectedEmails(emails)
        },
        skip: !from.operationId
    })
    
	const [sendInfoOperation] = useSendLetterOperationInfoMutation({
        onCompleted() {
            setLetterHasBeenSent(true)
            setButtonDisable(false)
        },
        onError(error) {
            console.log('error: ', error)
            setButtonDisable(false)
        },
        refetchQueries: [
            {
                query: STATISTICS,
                variables: {
                    offset: (page - 1) * LIMIT,
                    limit: LIMIT,
                    startDate: start,
                    endDate: end,
                    status: (status && ["process", "success", "fail"].includes(status)) ? status : null
                }
            }
        ]
    })
	const submit = () => {
        errors = errorsVar([])
        const newErrors: successErrorType[] = []

        if(selectedEmails.length === 0) newErrors.push({ place: 'send-operation-info.email', message: t('errors.email-wrong-format') })
        if (newErrors.length === 0) {
            setButtonDisable(true)
            sendInfoOperation({
                variables: {
                    operationId: from.operationId,
                    userEmails: selectedEmails
                }
            })
        } else {
            errorsVar(setError(errors, newErrors))
        }
	}

    const deleteEMail = (emailIndex: number) => {
        setSelectedEmails(prevState => {
            return prevState.filter((elem, index) => index !== emailIndex)
        })
    }

    const addEmail = (value: string) => {
        setSelectedEmails(prevState => {
            return [...prevState, value]
        })
    }

    const select: ISelectItem[] = data?.sendOperationEmailInfo?.userEmails && Array.isArray(data?.sendOperationEmailInfo?.userEmails)
        ? data?.sendOperationEmailInfo?.userEmails?.map((el) => String(el)).map((elem) => ({
            name: elem,
            value: elem,
            selected: false
        }))
        : [];

    const enterPressed = (e: React.KeyboardEvent<HTMLInputElement>) => {
        errors = errorsVar([])
        const newErrors: successErrorType[] = []
        if(e.key === 'Enter') {
            if (!validateEmail(valueDropDown)) newErrors.push({ place: 'send-operation-info.email', message: t('errors.email-wrong-format') })
            if (newErrors.length === 0) {
                setSelectedEmails(prevState => [...prevState, valueDropDown])
                setValueDropDown('')
            } else {
                errorsVar(setError(errors, newErrors))
            }     
        }
    }
    const clearAllEmails = () => {
        setSelectedEmails([])
    }

    const emailError = errors.find(el => el?.place === 'send-operation-info.email' )

	return (
		<div className="send-operation-info">
            {
                letterHasBeenSent
                ?
                <div className='send-operation-info_successContainer'>
                    <SuccessIcon />
                    <div className='send-operation-info__successText'>{t('Popup.SendLetter.text.firstParagraph')}</div>
                    <div className='send-operation-info__successText'>{t('Popup.SendLetter.text.secondParagraph')}</div>
                    <Button
                        className='send-operation-info__successBtn'
                        text={t('Popup.SendLetter.btnClose')}
                        onClick={ () => navigate(location.pathname+location.search)}
                    />
                </div>
                :
                <>
                    <div className="send-operation-info__title">{t(`${data?.sendOperationEmailInfo?.suggestFunds ? 'Popup.SendLetter.suggestFunds' : 'Popup.SendLetter.title'}`)}</div>
                    <div className='send-operation-info__subtitle'>Add recipient</div>
                    <InputDropDownList
                        className="send-operation-info__dropDownList" 
                        title={'Email'}
                        schema={select}
                        value={valueDropDown}
                        onChangeDropDown={setValueDropDown}
                        onChange={val => {
                            addEmail(val)
                            setValueDropDown('')
                        }}
                        onKeyPress={(e) => enterPressed(e)}
                        error={emailError !== undefined} 
                    />
                    <div className='send-operation-info__dividedLine'></div>
                    <div className='send-operation-info_emailsContainer'>
                        <div className='send-operation-info__recipientsContainer'>
                            <div className='send-operation-info__emails_title'>Recipients</div>
                            <div
                                className='send-operation-info__recipients__clearAll'
                                onClick={clearAllEmails}
                            >
                                Clear all recipients
                            </div>
                        </div>
                        <div className='send-operation-info_emails'>
                            {
                                selectedEmails.map((elem, i) => {
                                    return(
                                        <div className='send-operation-info__email'>
                                            <div>{elem}</div>
                                            <div className='send-operation-info__emailClose' onClick={() => deleteEMail(i)}></div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                    <Button disabled={buttonDisable} text={t('Popup.SendLetter.btn')} onClick={ () => submit() } />
                </>
            }
        </div>
	)
}
export default SendOperationInfo