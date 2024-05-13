import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useLocation } from 'react-router-dom'
import { useReactiveVar } from '@apollo/client'
import { userVar, eventDeleteVar } from '../../cache/cache'
import { AddressInput, InputMaybe, useDeleteEventMutation, useEditAddressesMutation } from '../../types/graphql'
import { COMPANY, SCHEDULE } from '../../graphql/queries'

import './styles.css'

const Button = React.lazy(() => import('../../components/common/Button'))

const DeleteEvent: React.FC = () => {
    interface LocationState {
        address: any[];
    }
    const { t } = useTranslation()
    const navigate = useNavigate()
    const location = useLocation()
    const user = useReactiveVar(userVar)
    const from = location.state as LocationState;

    const [editAddress] = useEditAddressesMutation({
        refetchQueries: [
            {query: COMPANY, variables: {companyId: user?.companyId as string}}
        ],
        onCompleted: () => {
            navigate(location.pathname+location.search)
        }
    })
    
    //Redirect to auth
    React.useEffect(() => {
        if (user === null) {
            navigate('/', { replace: true })
        }
    }, [ user, navigate ])

    const deleteAddress = () => {
        editAddress({
            variables: {addresses: from.address}
        })
    }

    return (
        <div className="delete-address">
            <div className="delete-address__title">{t('Popup.DeleteAddress.title')}</div>
            <div className="delete-address__text">{t('Popup.DeleteAddress.text')}</div>
            <div className="delete-address__btns">
                <Button text={t('Popup.DeleteAddress.delete-btn')} mode="red-outline" onClick={ () => deleteAddress() } />
            </div>
        </div>
    )
}

export default DeleteEvent