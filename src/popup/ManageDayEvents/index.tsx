import React, { useEffect, useState } from 'react';
import * as Moment from 'moment';
import 'moment/locale/fi';
import 'moment/locale/sv';
import { extendMoment } from 'moment-range';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { SCHEDULE } from '../../graphql/queries';
import { useReactiveVar } from '@apollo/client';
import { DeleteEventMutationVariables, Event, useDeleteEventMutation } from '../../types/graphql';
import { eventDeleteVar, eventEditVar, userVar } from '../../cache/cache';

import { ReactComponent as DropmenuEditIcon } from '../../assets/dropmenu-edit.svg';
import { ReactComponent as DropmenuDeleteIcon } from '../../assets/dropmenu-delete.svg';
import { ReactComponent as AddEventIcon } from '../../assets/button-add-event.svg';

import './styles.css';

const DropMenu = React.lazy(() => import('../../components/common/DropMenu'));
const Button = React.lazy(() => import('../../components/common/Button'));
const ErrorMessage = React.lazy(() => import('../../components/common/ErrorMessage'));

const moment = extendMoment(Moment);

const ManageDayEvents: React.FC = () => {
    const location = useLocation()
    interface LocationState {
        initialDate: string,
        availableDates: string[],
        dayEvents: [Event] | null | undefined
    }
    const [dayEvents, setDayEvents] = useState<Array<Event> | null | undefined>([]);
    const [initialDate, setInitialDate] = useState<string | null | undefined>("");
    const [dropmenu, setDropmenu] = useState<string | null | undefined>("");
    const from = location?.state as LocationState;
    let user = useReactiveVar(userVar)

    const { t, i18n } = useTranslation();
    const navigate = useNavigate();    

    moment.locale(i18n.language);
    const [deleteEvent] = useDeleteEventMutation({
        onCompleted: data => {
            if (data?.deleteEvent) {
                setDayEvents(prevSate => prevSate?.filter(e => e.id !== data?.deleteEvent?.id));
            if (dayEvents?.length === 1) {
                navigate(location.pathname+location.search)
            }

                eventDeleteVar(null)
            }
        },
        onError: e => {
            console.log(e)
        },
        refetchQueries: () => {
            return [{
                query: SCHEDULE,
                variables: { date: moment(initialDate).format('YYYY-MM') }
            }]
        }
    })
    
    const edit = (info: Event | null | undefined, deleteDate: string | null | undefined = undefined) => {
        if (info) {
            eventEditVar({
                editEventId: info?.id || '',
                startDate: info?.startDate || '',
                startTime: info?.startTime || '',
                endTime: info?.endTime || '',
                type: info?.type || '',
                ...(info.period) && { period: info.period },
                ...(info.comment) && { comment: info.comment },
                ...(deleteDate) && { deleteDate: deleteDate },
                address: info.address,
                amount: info.amount
            })
            info.amount
                ? navigate('#order-box', {
                    state: {
                        initialDate: initialDate,
                        companyId: info?.companyInfo?.id,
                        address: info?.address,
                        availableDates: from?.availableDates,
                    }
                })
                : navigate('#manage-event', {
                    state: {
                        initialDate: initialDate,
                        companyId: info?.companyInfo?.id,
                        address: info?.address,
                        availableDates: from?.availableDates,
                    }
                })
        }
        
    }
    const remove = (type: string, event: DeleteEventMutationVariables) => {
        if (event) {
            if (type === 'once') {
                deleteEvent({
                    variables: {
                        deleteEventId: event?.deleteEventId || ''
                    } 
                })
            }
            if (type === 'periodic') {
                eventDeleteVar({
                    deleteEventId: event?.deleteEventId || '',
                    deleteDate: initialDate || ''
                })
                navigate('#delete-event')
            }
        }        
    }
    useEffect(() => {
        if(from?.initialDate !== undefined){
            setInitialDate(from.initialDate);
        } else {
            navigate(location.pathname+location.search)
        }
        if(from?.dayEvents){
            setDayEvents(from.dayEvents);
        }
    }, [])

    const isAvailableDateError = !user?.isAdmin && !from?.availableDates.includes(initialDate || "");

    return (
        <div className="manage-day-events">
            <div className='manage-day-events__title'>
                <div>{t('Popup.ManageDayEvents.schedule-for')} </div>
                <div>{moment(initialDate).format('MMMM DD, YYYY')}</div>
            </div>
            <div className="manage-day-events__list">
                {
                    dayEvents && dayEvents.map(event => {
                        return (
                            <div key={event?.id} className="manage-day-events__item">
                                <div className='manage-day-events__info'>
                                    <div className='manage-day-events__info__column'>
                                        <div className='manage-day-events__info__title'>{t('Popup.ManageDayEvents.time')}</div>
                                        <div>
                                            <span>{event?.startTime}</span>
                                            <span> - </span>
                                            <span>{event?.endTime}</span>
                                        </div>
                                    </div>
                                    <div className='manage-day-events__info__column'>
                                        <div className='manage-day-events__info__title'>{t('Popup.ManageDayEvents.company')}</div>
                                        <div>{event?.companyInfo?.name || t('Popup.ManageDayEvents.unknownName')}</div>
                                    </div>
                                </div>
                                <div className='manage-day-events__menu'>
                                    <div className="manage-day-events__dots" onClick={ () => setDropmenu(event?.id)}></div>
                                    {
                                        dropmenu === event?.id &&
                                        <React.Suspense fallback={''}>
                                            <div className='manage-day-events__drop-menu'>
                                                <DropMenu 
                                                    schema={[{
                                                        icon: <DropmenuEditIcon/>,
                                                        name: t('Calendar.Calendar.edit'),
                                                        handler: () => edit(event, event?.startDate) 
                                                    }, {
                                                        icon: <DropmenuDeleteIcon/>, 
                                                        name: t('Calendar.Calendar.delete'),
                                                        handler: () => remove(
                                                            event?.type || '', 
                                                            { deleteEventId: event?.id || '', deleteDate: event?.startDate }
                                                        ) 
                                                    }]}
                                                    setDropmenu={setDropmenu}
                                                />
                                            </div>
                                        </React.Suspense>
                                    }
                                </div>
                            </div>
                        )
                    })
                }
            </div>
            {isAvailableDateError && (
                <ErrorMessage
                    className='manage-day-events__error'
                    errors={{
                        message: t('Popup.ManageEvent.not-available')
                    }}
                />
            )}
            <Button
                text={t('Calendar.add-event')}
                icon={<AddEventIcon/>}
                onClick={ () => navigate('#manage-event', {
                    state: {
                        initialDate: initialDate,
                        availableDates: from?.availableDates,
                    }
                })}
                disabled={!from?.availableDates?.includes(initialDate || "") && !user?.isAdmin}
            />
        </div>
    );
};

export default ManageDayEvents;
