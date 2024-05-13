import React from 'react'
import _ from 'lodash'
import classNames from 'classnames'
import * as Moment from 'moment'
import 'moment/locale/fi'
import 'moment/locale/sv'
import { extendMoment } from 'moment-range'
import { Maybe, Schedule, ScheduleEvent } from '../../../types/graphql'
import { useTranslation } from 'react-i18next'
import { userVar } from '../../../cache/cache'
import { useReactiveVar } from '@apollo/client'
import { getCalendarCellColor } from '../utils'

import './styles.css'

const moment = extendMoment(Moment)

interface ICalendarProps {
    calendar: Moment.Moment[]
    schedule: Schedule[] | any
    handler(event: Schedule, isActualDate: boolean): void
}

const Calendar: React.FC<ICalendarProps> = props => {
    const { t } = useTranslation()
    const user = useReactiveVar(userVar)
    const weekdaysShort = moment().localeData().weekdaysShort()
    const period = props.calendar[14].format('YYYY-MM')
    const monthNumber = moment(period).format('MM')
    
    return (
        <div className="calendar">
            <div className="calendar__weeks">
                <div className="calendar__week">{weekdaysShort[1]}</div>
                <div className="calendar__week">{weekdaysShort[2]}</div>
                <div className="calendar__week">{weekdaysShort[3]}</div>
                <div className="calendar__week">{weekdaysShort[4]}</div>
                <div className="calendar__week">{weekdaysShort[5]}</div>
                <div className="calendar__week">{weekdaysShort[6]}</div>
                <div className="calendar__week">{weekdaysShort[0]}</div>
            </div>
            <div className="calendar__days">
                {props.calendar.map((d: Moment.Moment) => {
                    const event: Schedule = _.find(props.schedule, { date: d.format('YYYY-MM-DD') });
                    const eventsCount = event?.events ? event?.events?.length : 0;
                    const slicedEvent = eventsCount > 1 ? event?.events?.slice(0, 1) : event?.events;
                    const day = d.format('DD.MM');
                    const today = moment().format('DD.MM')
                    const isActualDate = moment().subtract(1, "day").format() < d.format();
                    const hasEvents = event?.events && event?.events?.length > 0;
                    const canCreate = event?.available && event?.available > 0;

                    const status = getCalendarCellColor(event?.available || 0)

                    return (
                        <div
                            key={day}
                            className={classNames(
                                "calendar__day__wrap",
                                { 
                                    "calendar__day__wrap--hidden": +monthNumber !== +d.format('MM'),
                                    "calendar__day__wrap--hasEvent": hasEvents,
                                    "calendar__day__wrap--past": !isActualDate && !user?.isAdmin,
                                    "calendar__day__wrap--cant-create": !user?.isAdmin && !canCreate && !hasEvents,
                                    "currentDay": today === day
                                })}
                            onClick={() => props.handler(event, isActualDate)}
                        >
                            <div
                                className={`calendar__day__status calendar__day__status--${status}`}
                            >
                                <span
                                    className={`calendar__day__status-icon calendar__day__status-icon--${status}`}
                                />
                                <span>{t(`Calendar.Tooltip.${status}.title`)}</span>
                            </div>
                            
                            <div className="calendar__day">
                                <div className="calendar__day-date">{day}</div>
                                <div className="calendar__events">
                                    {slicedEvent?.map((e: Maybe<ScheduleEvent>) => {
                                        return (
                                            <div key={`${e?.eventId}-${day}}`} className="calendar__dropmenu">
                                                <div className="calendar__time">
                                                    {e?.time}
                                                </div>
                                            </div>
                                        )
                                    })}
                                    {eventsCount > 1 && (
                                        <div className="calendar__more-events">
                                            {`${eventsCount - 1} ${t('Calendar.Calendar.more')}`}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default Calendar