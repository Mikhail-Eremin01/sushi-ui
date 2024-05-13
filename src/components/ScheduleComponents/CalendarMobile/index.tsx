import React from 'react'
import _ from 'lodash'
import classNames from 'classnames'
import * as Moment from 'moment'
import 'moment/locale/fi'
import 'moment/locale/sv'
import { extendMoment } from 'moment-range'
import { Maybe, Schedule, ScheduleEvent } from '../../../types/graphql'
import { userVar } from '../../../cache/cache'
import { useReactiveVar } from '@apollo/client'
import { getCalendarCellColor } from '../utils'

import './styles.css'

const moment = extendMoment(Moment)

interface ICalendarProps {
    calendar: Moment.Moment[]
    schedule: Schedule[] | any
    handler(event: Schedule, isActualDate: boolean): void
    selectedDate: string
}   

const CalendarMobile: React.FC<ICalendarProps> = props => {
    const { calendar, selectedDate, handler } = props;
    const user = useReactiveVar(userVar)
    const period = calendar[14].format('YYYY-MM')
    const monthNumber = moment(period).format('MM')
    const weekdaysShort = moment().localeData().weekdaysShort()
    
    return (
        <div className="calendar-mobile">
            <div className="calendar-mobile__weeks">
                <div className="calendar-mobile__week">{weekdaysShort[1]}</div>
                <div className="calendar-mobile__week">{weekdaysShort[2]}</div>
                <div className="calendar-mobile__week">{weekdaysShort[3]}</div>
                <div className="calendar-mobile__week">{weekdaysShort[4]}</div>
                <div className="calendar-mobile__week">{weekdaysShort[1]}</div>
                <div className="calendar-mobile__week">{weekdaysShort[6]}</div>
                <div className="calendar-mobile__week">{weekdaysShort[0]}</div>
            </div>
            <div className="calendar-mobile__days">
                {calendar.map((d: Moment.Moment) => {
                    const event: Schedule = _.find(props.schedule, { date: d.format('YYYY-MM-DD') });
                    const day = d.format('DD')
                    const currentDay = d.format('DD.MM')
                    const today = moment().format('DD.MM')
                    const isActualDate = moment().subtract(1, "day").format() < d.format();
                    const hasEvents = event?.events && event?.events?.length > 0;
                    const canCreate = event?.available && event?.available > 0;

                    const status = getCalendarCellColor(event?.available || 0)
                    
                    return (
                        <div
                            key={currentDay}
                            className={classNames(
                                "calendar-mobile__day__wrap",
                                {
                                    "calendar-mobile__day__wrap--hidden": +monthNumber !== +d.format('MM'),
                                    "calendar-mobile__day__wrap--selected": selectedDate === event?.date,
                                    "calendar-mobile__day__wrap--past": !isActualDate && !user?.isAdmin,
                                    "calendar-mobile__day__wrap--cant-create": !user?.isAdmin && !canCreate && !hasEvents,
                                    "currentDay": today === currentDay
                                })}
                            onClick={() => handler(event, isActualDate)}
                        >
                            <div
                                className={`calendar-mobile__day__status calendar-mobile__day__status--${status}`}
                            >
                                <span
                                    className={`calendar-mobile__day__status-icon calendar-mobile__day__status-icon--${status}`}
                                />
                            </div>

                            <div className="calendar-mobile__day">
                                <div className="calendar-mobile__day-date">{day}</div>
                                <div className="calendar-mobile__events">
                                    {
                                        (event?.events && event.events?.length < 3) ? (event.events.map((e:  Maybe<ScheduleEvent>) => {
                                            return (
                                                <div
                                                    key={`${e?.eventId}-${currentDay}}`}
                                                    className="calendar-mobile__dot"
                                                >
                                                </div>
                                            )
                                        })) : (
                                            <div className={classNames({"calendar-mobile__events-counter": event?.events && event.events?.length > 2})}>
                                                {event?.events?.length}
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

export default CalendarMobile