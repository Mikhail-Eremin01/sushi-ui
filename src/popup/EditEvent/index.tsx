import React from 'react'
import _ from 'lodash'
import { useTranslation } from 'react-i18next'
import { useNavigate, useLocation } from 'react-router-dom'
import { useReactiveVar } from '@apollo/client'
import { userVar, eventEditVar } from '../../cache/cache'
import { useEditEventMutation } from '../../types/graphql'
import { ROUTES, SCHEDULE } from '../../graphql/queries'

import './styles.css'
import moment from 'moment'

const Button = React.lazy(() => import('../../components/common/Button'))

const EditEvent: React.FC = () => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const location = useLocation()
    const user = useReactiveVar(userVar)
    const eventEdit = useReactiveVar(eventEditVar)
    const calendarDate = location.pathname.split('/')[3]

    const [updateEvent] = useEditEventMutation({
        onCompleted: data => {
            if (data?.editEvent) {
                navigate(location.pathname+location.search)
                eventEditVar(null)
            }
        },
        onError: e => {
            console.log(e)
        },
        refetchQueries: () => {
            return [
                {
                    query: SCHEDULE,
                    variables: { date: calendarDate }
                },
                {
                    query: ROUTES,
                    variables: { date: moment().format('YYYY-MM-DD') }
                }
            ]
        }
    })

    //Redirect to auth
    React.useEffect(() => {
        if (user === null) {
            navigate('/', { replace: true })
        }
    }, [ user, navigate ])

    return (
        <div className="edit-event">
            <div className="edit-event__title">{t('Popup.EditEvent.title')}</div>
            <div className="edit-event__desc">{t('Popup.EditEvent.text')}</div>
            <div className="edit-event__buttons">
                <Button text={t('Popup.EditEvent.edit-time')} onClick={ () => { if (eventEdit) { updateEvent({ variables: eventEdit }) } }  } />
                <Button text={t('Popup.EditEvent.edit-event')} mode="outline" onClick={ () => { if (eventEdit) { updateEvent({ variables: _.omit(eventEdit, 'deleteDate') }) } } } />
            </div>
        </div>
    )
}

export default EditEvent