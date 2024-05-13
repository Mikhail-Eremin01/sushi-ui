import React, { useState } from 'react'
import moment from 'moment'
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useReactiveVar } from '@apollo/client'
import { useMediaQuery } from 'react-responsive'
import { userVar } from '../../cache/cache'
import { useRouteQuery } from '../../types/graphql'

import { ReactComponent as CalendarIcon } from '../../assets/input-calendar.svg'
import './styles.css'

const Wrapper = React.lazy(() => import('../../components/common/Wrapper'))
const Input = React.lazy(() => import('../../components/common/Input'))

const Route: React.FC = () => {
    const [searchParams] = useSearchParams({})
    const initialDate = searchParams.get('date') || moment().format('YYYY-MM-DD')
    const [date, setDate] = useState<string>(initialDate)
    const [withAmount, setWithAmount] = useState<boolean>(false)
    const { t } = useTranslation()
    const user = useReactiveVar(userVar)
    const navigate = useNavigate()
    const location = useLocation()
    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 970.98px)' })

    const { data } = useRouteQuery({
        variables: {
            date: date
        },
        onCompleted(data) {
            if(data.route?.points) {
                const withEventOrderBoxes = data.route?.points.some(elem => elem?.amount)
                withEventOrderBoxes ? setWithAmount(true) : setWithAmount(false)
            }
            
        },
    })
    
    console.log('withAmount: ', withAmount)
    //Redirect to authorize page
    React.useEffect(() => {
        if (user === null) navigate('/', { state: { referer: location.pathname }})
    }, [user, location, navigate])

    return (
        <div className="route">
            <Wrapper>
            <div className="route__title">
                    <div className="route__title-text">{t('Route.title')}</div>
                    <div className="route__title-date">
                        <Input className="manage-operation__input" title={t('Route.date')} placeholder={t('Route.date-placeholder')} type="date" value={date} onChange={ val => setDate(val) } icon={<CalendarIcon/>} />
                    </div>
                </div>
                {
                    isTabletOrMobile
                    ? <div className="table-mobile">
                        {
                            data?.route?.points?.map(el => {
                                return (
                                    <div key={el?.num} className="table-mobile__item">
                                        <div className="table-mobile__row">
                                            <div className="table-mobile__col">
                                                <div className="table-mobile__title">{t('Route.pin')}</div>
                                                <div className="table-mobile__value">{el?.num}</div>
                                            </div>
                                            <div className="table-mobile__col">
                                                <div className="table-mobile__title">{t('Route.date')}</div>
                                                <div className="table-mobile__value">{el?.date}</div>
                                            </div>
                                        </div>
                                        <div className="table-mobile__row">
                                            <div className="table-mobile__col">
                                                <div className="table-mobile__title">{t('Route.company')}</div>
                                                <div className="table-mobile__value">{el?.companyName}</div>
                                            </div>
                                            <div className="table-mobile__col">
                                                <div className="table-mobile__title">{t('Route.person')}</div>
                                                <div className="table-mobile__value">{el?.person}</div>
                                            </div>
                                        </div>
                                        <div className="table-mobile__row">
                                            <div className="table-mobile__col">
                                                <div className="table-mobile__title">{t('Route.address')}</div>
                                                <div className="table-mobile__value">{el?.companyAddress}</div>
                                            </div>
                                            <div className="table-mobile__col">
                                                <div className="table-mobile__title">{t('Route.instructions')}</div>
                                                <div className="table-mobile__value">{el?.instruction}</div>
                                            </div>
                                        </div>
                                        <div className="table-mobile__row">
                                            <div className="table-mobile__col">
                                                <div className="table-mobile__title">{t('Route.comments')}</div>
                                                <div className="table-mobile__value">{el?.eventComment}</div>
                                            </div>
                                            {
                                                withAmount &&
                                                <div className="table-mobile__col">
                                                    <div className="table-mobile__title">{t('Route.amount')}</div>
                                                    <div className="table-mobile__value">{el?.amount}</div>
                                                </div>
                                            }
                                        </div>
                                       
                                    </div>
                                )
                            })
                        }
                    </div>
                    : <div className="route__table">
                        <table>
                            <thead>
                                <tr>
                                    <th>{t('Route.pin')}</th>
                                    <th>{t('Route.date')}</th>
                                    <th>{t('Route.company')}</th>
                                    <th>{t('Route.person')}</th>
                                    <th>{t('Route.address')}</th>
                                    <th>{t('Route.instructions')}</th>
                                    <th>{t('Route.comments')}</th>
                                    {
                                        withAmount &&
                                        <th>{t('Route.amount')}</th>
                                    }
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    data?.route?.points && data?.route?.points?.length > 0
                                    ? data?.route?.points?.map(el => {
                                        const date = el?.date?.split(' ')
                                        return (
                                            <tr key={el?.num}>
                                                <td>{el?.num}</td>
                                                <td className="route__date">{date && <>{date[0]} <br/> {date[1]}</>}</td>
                                                <td>{el?.companyName}</td>
                                                <td>{el?.person}</td>
                                                <td>{el?.companyAddress}</td>
                                                <td>{el?.instruction}</td>
                                                <td>{el?.eventComment}</td>
                                                {
                                                    withAmount &&
                                                    <td>{el?.amount}</td>
                                                }
                                            </tr>
                                        )
                                    })
                                    : <tr><td className="route__none" colSpan={6}>{t('Route.none')}</td></tr>

                                }
                            </tbody>
                        </table>
                    </div>
                }
                {
                    data?.route?.map &&
                    <div className="route__map">
                        <img src={data?.route?.map} alt="" />
                    </div>
                }
            </Wrapper>
        </div>
    )
}

export default Route