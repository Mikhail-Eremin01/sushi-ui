import React, { useEffect } from 'react'
import * as Moment from 'moment'
import 'moment/locale/fi'
import 'moment/locale/sv'
import { useTranslation } from 'react-i18next'
import { extendMoment } from 'moment-range'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import { useReactiveVar } from '@apollo/client'
import { useMediaQuery } from 'react-responsive'
import { userVar } from '../../cache/cache'
import { Schedule as ScheduleType, useCompanyQuery, useScheduleQuery } from '../../types/graphql'
import classNames from 'classnames'

import { ReactComponent as AddEventIcon } from '../../assets/button-add-event.svg'
import { ReactComponent as PlusIcon } from '../../assets/button-plus.svg'
import { ReactComponent as PlusIconPurple } from '../../assets/button-plus_purple.svg'
import { ReactComponent as QuestionIcon } from '../../assets/pajamas_question.svg'

import InfoFounds from '../../components/ScheduleComponents/InfoMessage'
import { ReactComponent as Box } from '../../assets/box.svg'
import './styles.css'
import { getLocalTimeZone, today } from '@internationalized/date'
import { Link } from 'react-router-dom'
import _ from 'lodash'
import { readCookie } from '../../misc/common'
import CalendarDayTooltip from '../../components/ScheduleComponents/CalendarDayTooltip'

const Wrapper = React.lazy(() => import('../../components/common/Wrapper'))
const Button = React.lazy(() => import('../../components/common/Button'))
const Calendar = React.lazy(() => import('../../components/ScheduleComponents/Calendar'))
const CalendarMobile = React.lazy(() => import('../../components/ScheduleComponents/CalendarMobile'))

const moment = extendMoment(Moment)

const Schedule: React.FC = () => {
    const { t, i18n } = useTranslation()
    let user = useReactiveVar(userVar)
    const navigate = useNavigate()
    const location = useLocation()
    moment.locale(i18n.language, {
        week: {
            dow: 6
        }
    })
    const [selectedDate, setSelectedDate] = React.useState<string>('')
    let { date } = useParams()
    const dateMoment = moment(`${date}-01`, 'YYYY-MM-DD')
    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 767.98px)' })
    const isMobile = useMediaQuery({ query: '(max-width: 710.98px)' })

    const { data, loading } = useScheduleQuery({
        variables: {
            date: dateMoment.format("YYYY-MM")
        },
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'network-only'
    })
    const { data: dataCompany, loading: loadingCompany } = useCompanyQuery({
        variables: {companyId: user?.companyId || ""}
    })
    const showInfoFounds = !dataCompany?.company?.funds?.length && readCookie('show_info_founds') !== 'false'
    
    //Redirect to authorize page
    React.useEffect(() => {
        if (user === null) navigate('/', { state: { referer: location.pathname }})
    }, [user, location, navigate])

    const getDaysInAMonth = (year = +moment().format("YYYY"), month = +moment().format("MM") - 1) => {
        const startDate = moment([year, month]);
    
        const firstDay = moment(startDate).startOf('month').startOf('isoWeek')
        const endDay = moment(startDate).endOf('month').endOf('isoWeek')

        const monthRange = moment.range(firstDay, endDay)
        const days = Array.from(monthRange.by('day'))

        return days
    }

    function getAvailableDates(): string[] {
        return data?.schedule
            ?.flat()
            ?.filter(event => event?.available && event?.available > 0 && event?.date && moment().format('YYYY-MM-DD') <= event?.date)
            ?.map(event => String(event?.date)) || []
    }

    function navigateTo(date: string, hash: "#order-box" | "#manage-event"): void {
        navigate(hash, {
            state: {
                availableDates: getAvailableDates(),
                initialDate: date
            }
        })
    }

    const handleDateClick = (event: ScheduleType, isActualDate: boolean) => {
        if (!isActualDate && !user?.isAdmin) return;
        if (event?.events) toggleActiveDate(event?.date || '');
        if (event) {
            if (event?.events && event?.events?.length > 0) {
                const events = event?.events.map((e: any) => e?.info)

                navigate(`#manage-day-events`, {
                    state: {
                        initialDate: event.date,
                        dayEvents: events,
                        availableDates: getAvailableDates(),
                    }
                })
            } else if (event?.available && event?.available > 0) {
                navigateTo(event?.date || "", "#manage-event")
            }
        }
    }

    useEffect(() => {
        const element = document.getElementsByClassName('current-month');
        if (data && element[0]) {
          element[0].scrollIntoView({ behavior: 'smooth', block: "center" });
        }
    }, [data]);

    const toggleActiveDate = (date: string) => {
        setSelectedDate(date)
    }

    if (loading || loadingCompany) return <div className="preloader"></div>
    
    return (
        <div className="schedule">
            {data?.schedule?.length && (
                <>
                    <div className={classNames('schedule__title__wrapper', {'schedule__title__shadow': !showInfoFounds})}>
                        <div className="schedule__title">
                            <div className="schedule__title-text">{t('Calendar.title')}</div>
                            <div className="schedule__switch">
                                <Link className="schedule__switch-arrow" to={`/cabinet/schedule/${_.cloneDeep(dateMoment).subtract(1, 'month').format('YYYY-MM')}`} ></Link>
                                <Link className="schedule__switch-arrow schedule__switch-arrow--next" to={`/cabinet/schedule/${_.cloneDeep(dateMoment).add(1, 'month').format('YYYY-MM')}`}></Link>
                            </div>
                            <div className="schedule__title-buttons">
                                {isMobile
                                    ?
                                    <div className='schedule__title-buttons__suggestBtn'>
                                        <Button
                                            className="schedule__suggest-feature-mobile btn__suggestFeature__mobile"
                                            text=""
                                            icon={<PlusIconPurple/>}
                                            onClick={ () => navigateTo(today(getLocalTimeZone()).toString(), "#order-box")}
                                        />
                                    </div>
                                        
                                    :
                                    <div className='schedule__title-buttons__suggestBtn'>
                                        <Button
                                            text={t('Calendar.orderBox')}
                                            mode={'outline'}
                                            icon={<Box/>}
                                            className='btn__header btn__suggestFeature'
                                            onClick={ () => navigateTo(today(getLocalTimeZone()).toString(), "#order-box")}
                                        />
                                    </div>
                                }
                                {isMobile
                                    ?
                                        <Button
                                            className="schedule__add-button-mobile"
                                            text=""
                                            icon={<PlusIcon/>}
                                            onClick={ () => navigateTo(today(getLocalTimeZone()).toString(), "#manage-event")}
                                        />
                                    :
                                        <Button
                                            text={t('Calendar.add-event')}
                                            icon={<AddEventIcon/>}
                                            className='btn__header'
                                            onClick={ () => navigateTo(today(getLocalTimeZone()).toString(), "#manage-event")}
                                        />
                                }
                            </div>
                        </div>
                        
                    </div>
                    {
                        showInfoFounds && 
                        <div className="schedule__info-founds">
                            <InfoFounds/>
                        </div>
                    }
                    <Wrapper>                    
                        {data?.schedule?.map((monthSchedule, index) => (
                            <div key={index} className={classNames("schedule__month-wrapper", { "current-month": index === 1})}>
                                {monthSchedule?.length && (
                                    <>
                                        <div className="schedule__month">
                                            <div className="schedule__month-name">
                                                {moment(monthSchedule[0]?.date).format('MMMM YYYY')}
                                            </div>
                                            <div className="schedule__question-button">
                                                <QuestionIcon
                                                    id={`schedule__month-wrapper${index}`}
                                                    className="schedule__question-icon"
                                                />
                                            </div>
                                            <CalendarDayTooltip id={`#schedule__month-wrapper${index}`} />
                                        </div>
                                        {isTabletOrMobile ? (
                                            <CalendarMobile
                                                calendar={getDaysInAMonth(+moment(monthSchedule[0]?.date).format("YYYY"), +moment(monthSchedule[0]?.date).format("MM") - 1)}
                                                schedule={monthSchedule}
                                                handler={handleDateClick}
                                                selectedDate={selectedDate}
                                            />
                                        ) : (
                                            <Calendar
                                                calendar={getDaysInAMonth(+moment(monthSchedule[0]?.date).format("YYYY"), +moment(monthSchedule[0]?.date).format("MM") - 1)}
                                                schedule={monthSchedule}
                                                handler={handleDateClick}
                                            />
                                        )}
                                    </>
                                )}
                            </div>
                        ))}
                    </Wrapper>
                </>
            )}
            
        </div>
    )
}

export default Schedule