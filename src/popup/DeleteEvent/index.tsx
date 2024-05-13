import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useLocation } from 'react-router-dom'
import { useReactiveVar } from '@apollo/client'
import { userVar, eventDeleteVar } from '../../cache/cache'
import { useDeleteEventMutation } from '../../types/graphql'
import { SCHEDULE } from '../../graphql/queries'

import './styles.css'

const Button = React.lazy(() => import('../../components/common/Button'))

const DeleteEvent: React.FC = () => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const location = useLocation()
    const user = useReactiveVar(userVar)
    const eventDelete = useReactiveVar(eventDeleteVar)
    const calendarDate = location.pathname.split('/')[3]

    const [deleteEvent] = useDeleteEventMutation({
        onCompleted: data => {
            if (data?.deleteEvent) {
                navigate(location.pathname+location.search)
                eventDeleteVar(null)
            }
        },
        onError: e => {
            console.log(e)
        },
        refetchQueries: () => {
            return [{
                query: SCHEDULE,
                variables: { date: calendarDate }
            }]
        }
    })

    //Redirect to auth
    React.useEffect(() => {
        if (user === null) {
            navigate('/', { replace: true })
        }
    }, [ user, navigate ])


    const submit = (deleteDate: string = '') => {
        if (deleteDate === '') { //delete event
            deleteEvent({ variables: { deleteEventId: eventDelete?.deleteEventId || '' } })
        } else { //delete only this time
            deleteEvent({ variables: { deleteEventId: eventDelete?.deleteEventId || '', deleteDate: eventDelete?.deleteDate } })
        }
    }

    return (
        <div className="delete-event">
            <div className="delete-event__title">{t('Popup.ManageEvent.delete')}</div>
            <div className="delete-event__desc">{t('Popup.DeleteEvent.text')}</div>
            <div className="delete-event__buttons">
                <Button text={t('Popup.DeleteEvent.delete-time')} mode="red" onClick={ () => submit(eventDelete?.deleteDate || '') } />
                <Button text={t('Popup.DeleteEvent.delete-event')} mode="red-outline" onClick={ () => submit() } />
            </div>
        </div>
    )
}

export default DeleteEvent