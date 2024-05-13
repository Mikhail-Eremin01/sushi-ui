import React from 'react'
import moment from 'moment'
import { useNavigate, useParams } from 'react-router-dom'
import { useReactiveVar } from '@apollo/client'
import { useTranslation } from 'react-i18next'
import { setError } from '../../misc/common'
import { errorsVar, successErrorType } from '../../cache/cache'
import { useCompanyStatisticQuery, useAddEventMutation, AddEventMutationVariables } from '../../types/graphql'

import { ReactComponent as OperationIcon } from '../../assets/success-stat.svg'
import { ReactComponent as CalendarIcon } from '../../assets/input-calendar.svg'
import { ReactComponent as TimeIcon } from '../../assets/input-clock.svg'
import { ReactComponent as SuccessIcon } from '../../assets/success.svg'
import './styles.css'

const Language = React.lazy(() => import('../../components/common/Language'))
const Input = React.lazy(() => import('../../components/common/Input'))
const Textarea = React.lazy(() => import('../../components/common/Textarea'))
const ErrorMessage = React.lazy(() => import('../../components/common/ErrorMessage'))
const Button = React.lazy(() => import('../../components/common/Button'))

interface ICompanyStatisticsProps {
    view: 'stats' | 'add-event'
}

const CompanyStatistics: React.FC<ICompanyStatisticsProps> = props => {
    const { companyId } = useParams()
    const [isSuccess, setIsSuccess] = React.useState<boolean>(false)
    const [fields, setFields] = React.useState<AddEventMutationVariables>({
        companyId: companyId || '', 
        startDate: moment().format('YYYY-MM-DD'), 
        startTime: moment().format('HH:00'), 
        endTime: moment().add(1, 'hour').format('HH:00'), 
        type: 'once', 
        period: 'Mon||1',  //Mon,Tue,Wed,Thu,Fri,Sat,Sun||1
        comment: '',
        address: ''
    })
    let errors = useReactiveVar(errorsVar)
    const { t } = useTranslation()
    const navigate = useNavigate()

    const { data } = useCompanyStatisticQuery({
        variables: {
            companyId: companyId || ''
        }
    })

    const [addEvent] = useAddEventMutation({
        onCompleted: data => {
            setIsSuccess(true)
        },
        onError: e => {
            console.log(e)
        }
    })

    const submit = () => {
        errors = errorsVar([])
        const newErrors: successErrorType[] = []

        if ((fields?.startDate || '').trim().length === 0) newErrors.push({ place: 'company-statistics.start-date', message: t('errors.field-required') })
        if ((fields?.startTime || '').trim().length === 0) newErrors.push({ place: 'company-statistics.start-time', message: t('errors.field-required') })
        if ((fields?.endTime || '').trim().length === 0) newErrors.push({ place: 'company-statistics.end-time', message: t('errors.field-required') })
        if ((fields?.comment || '').length > 2000) newErrors.push({ place: 'company-statistics.comment', message: t('errors.comment-length') })

        if (newErrors.length === 0) {
            addEvent({ variables: fields }) 
        } else {
            errorsVar(setError(errors, newErrors))
        }
    }

    const startDateError = errors.find(el => el?.place === 'company-statistics.start-date')
    const startTimeError = errors.find(el => el?.place === 'company-statistics.start-time')
    const endTimeError = errors.find(el => el?.place === 'company-statistics.end-time')
    const timeError = errors.filter(el => ['company-statistics.start-time', 'company-statistics.end-time'].includes(el?.place || '') )

    return (
        <div className="company-statistics">
            <div className="company-statistics__content">
                <div className="company-statistics__wrap">
                    {
                        props.view === 'stats' &&
                        <>
                        <div className="company-statistics__logo"></div>
                        <div className="company-statistics__name">{data?.companyStatistic?.companyName}</div>
                        <div className="company-statistics__address">{data?.companyStatistic?.companyAddress}</div>
                        <div className="company-statistics__button" onClick={ () => navigate(`/qr/${companyId}/add-event/`) }>
                            <div>{t('CompanyStatistics.order')}</div>
                        </div>
                        <div className="company-statistics__stat-total">
                            <div className="company-statistics__stat-total-item">
                                {t('CompanyStatistics.last-month')}
                                <div className="company-statistics__total-amount">&euro; {data?.companyStatistic?.lastMonthAmount}</div>
                            </div>
                            <div className="company-statistics__stat-total-item">
                                {t('CompanyStatistics.total')}
                                <div className="company-statistics__total-amount">&euro; {data?.companyStatistic?.totalAmount}</div>
                            </div>
                        </div>
                        <div className="company-statistics__subtitle">{t('CompanyStatistics.latest-operations')}</div>
                        <div className="company-statistics__stat">
                            {
                                data?.companyStatistic?.funds?.map((el, i) => {
                                    return (
                                        <div key={i} className="company-statistics__stat-item">
                                            <OperationIcon/>
                                            <div className="company-statistics__stat-name">
                                                {el?.name}
                                                <div className="company-statistics__stat-date">{moment(el?.lastDate).format('DD.MM.YYYY HH:mm')}</div>
                                            </div>
                                            <div className="company-statistics__stat-amount">&euro; {el?.amount}</div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                        </>
                    }

                    {
                        props.view === 'add-event' &&
                        <>
                        <div className="company-statistics__logo"></div>
                        {
                            isSuccess
                            ? <div className="company-statistics__success">
                                <SuccessIcon/>
                                <div className="company-statistics__success-title">{t('CompanyStatistics.success-title')}</div>
                                <div className="company-statistics__success-desc">{t('CompanyStatistics.success-desc')}</div>
                                <Button text={t('CompanyStatistics.success-button')} onClick={ () => navigate('/') } />
                            </div>
                            : <>
                                <div className="company-statistics__name">{t('CompanyStatistics.form-title')}</div>
                                <div className="company-statistics__address">{t('CompanyStatistics.form-desc')}</div>
                                <div className="company-statistics__form">
                                    <Input className="company-statistics__input" title={t('CompanyStatistics.start-date')} type="date" value={fields?.startDate || ''} onChange={ val => setFields({ ...fields, startDate: val }) } error={startDateError !== undefined} icon={<CalendarIcon/>} />
                                    { startDateError && <ErrorMessage className="company-statistics__error" errors={startDateError} /> }

                                    <div className="company-statistics__input-row">
                                        <Input className="company-statistics__input" title={t('CompanyStatistics.from')} type="time" value={fields?.startTime || ''} onChange={ val => setFields({ ...fields, startTime: val }) } error={startTimeError !== undefined} icon={<TimeIcon/>} />
                                        <Input className="company-statistics__input" title={t('CompanyStatistics.to')}  type="time" value={fields?.endTime || ''} onChange={ val => setFields({ ...fields, endTime: val }) } error={endTimeError !== undefined} icon={<TimeIcon/>} />
                                    </div>
                                    { timeError.length > 0 && <ErrorMessage className="company-statistics__error" errors={timeError} /> }

                                    <Textarea className="company-statistics__input" title={t('CompanyStatistics.comment')} placeholder={t('CompanyStatistics.comment-placeholder')} value={fields?.comment || ''} onChange={ val => setFields({ ...fields, comment: val }) } />
                                                
                                    <Button text={t('CompanyStatistics.submit')} onClick={ () => submit() } />
                                </div>
                            </>
                        }
                        </>
                    }
                </div>
            </div>
            <div className="company-statistics__footer">
                <div className="company-statistics__footer-wrap">
                    <div className="company-statistics__footer-contacts">
                        <div className="company-statistics__footer-phones">
                            <a href="tel:+358503122473">+358-50-312-2473</a>
                            <a href="https://charitybo.fi" target="_blank" rel="noreferrer">charitybo.fi</a>
                        </div>
                        <div className="company-statistics__footer-button">
                            <a href="https://app.charitybo.fi" target="_blank" rel="noreferrer">{t('CompanyStatistics.get-started')}</a>
                        </div>
                    </div>
                    <div className="company-statistics__footer-address">CharityBo ry, Vallikallionkatu 1, Espoo, Finland</div>
                </div>
            </div>
            <Language className="company-statistics__language" />
        </div>
    )
}

export default CompanyStatistics