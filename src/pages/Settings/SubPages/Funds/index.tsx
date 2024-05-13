import { useReactiveVar } from '@apollo/client'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import { changesMessageVar, userVar } from '../../../../cache/cache'
import Button from '../../../../components/common/Button'
import Checkbox from '../../../../components/common/Checkbox'
import { useEditFundsMutation, useUserFundsQuery } from '../../../../types/graphql'
import { FUNDS } from '../../../../graphql/queries'

import './styles.css'

const Funds: React.FC = () => {
    const [fields, setFields] = React.useState<any[]>([])
    const { t } = useTranslation()
    const user = useReactiveVar(userVar)
    const navigate = useNavigate()
    const location = useLocation()
    const { data, loading } = useUserFundsQuery()

    const [editFunds] = useEditFundsMutation({
        onCompleted(data) {
            showMessage('success')
        },
        onError(error) {
            console.log(error.message)
            error.message === 'Funds is required'
            ?
            showMessage('requiredField')
            :
            showMessage('error')
        },
        refetchQueries: () => {
            return [{
                query: FUNDS
            }]
        }
    })

    const showMessage = (status: 'success' | 'error' | 'requiredField') => {
        changesMessageVar(status)
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
            });
        setTimeout(() => {
            changesMessageVar(null)
        }, 3000)
    }
    
    //Set funds fields
    React.useEffect(() => {
        if (data) {
            const fundsArray = data?.userFunds?.filter(fund => fund?.selected).map(fund => fund?.id || "")
            setFields(fundsArray || [])
        }
    }, [data])
    
    //Redirect to authorize page
    React.useEffect(() => {
        if (user === null) navigate('/', { state: { referer: location.pathname }})
    }, [user, location, navigate])

    if (loading) return <div className="preloader"></div>

    return (
        <div>
            <div className='funds_mainContainer'>
                <div className='funds_mainContainer__title'>
                    <p>{t('Funds.title')}</p>
                </div>
                <div className="funds_main-content">
                    {data?.userFunds?.map(fund => (
                        <Checkbox
                            key={fund?.id}
                            id={fund?.id || ""}
                            title={fund?.name || ""}
                            name="funds"
                            checkboxValue={fund?.id || ""}
                            value={fields || []}
                            onChange={ val => {setFields([ ...val ]) }}
                        />
                    ))}
                    <div className='emptyBox checkbox'/>
                </div>
            </div>
            <div className='funds_btns-container'>
                <div className="funds__suggest" onClick={ () => navigate('#suggest-organization') }>{t('Settings.suggest')}</div>
                <Button
                    text={t('Settings.save')}
                    onClick={() => editFunds(
                        {
                            variables: {funds: fields}
                        }
                    )}
                    className='btns_container__btn-saveChanges'
                />
            </div>
        </div>
    )
}

export default Funds