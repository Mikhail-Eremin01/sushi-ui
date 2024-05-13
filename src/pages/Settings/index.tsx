import React from 'react'
import { useNavigate, useLocation, Outlet, NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useReactiveVar } from '@apollo/client'
import { userVar, changesMessageVar } from '../../cache/cache'

import './styles.css'
import { useCompanyQuery } from '../../types/graphql'
import ChangesMessage from '../../components/common/ChangesMessage/ChangesMessage'

const Wrapper = React.lazy(() => import('../../components/common/Wrapper'))

const Settings: React.FC = () => {
    const { t } = useTranslation()
    const user = useReactiveVar(userVar)
    const changesMessage = useReactiveVar(changesMessageVar)
    const navigate = useNavigate()
    const location = useLocation()
    const {data, loading} = useCompanyQuery({variables: {companyId: user?.companyId as string}})
    //Redirect to authorize page
    React.useEffect(() => {
        if (user === null) navigate('/', { state: { referer: location.pathname }})
    }, [user, location, navigate])

    if (loading) return <div className="preloader"></div>
    return (
        <div className="settings">
            <Wrapper>
                
            <div className="settings__title">{t('Settings.title')}</div>
                {
                    changesMessage === 'success'
                    ? 
                    <ChangesMessage status={'success'} />
                    :
                    changesMessage === 'error'
                    ?
                    <ChangesMessage status={'error'} />
                    :
                    changesMessage === 'requiredField'
                    ?
                    <ChangesMessage status={'requiredField'} />
                    :
                    <></>
                }
                <nav className='settings_nav'>
                    <NavLink to="/cabinet/settings/">{t('Company.tab')}</NavLink>
                    <NavLink to="/cabinet/settings/address/">{t('Address.tab')}</NavLink>
                    <NavLink to="/cabinet/settings/users/">{t('Users.tab')}</NavLink>
                    <NavLink to="/cabinet/settings/funds/">{t('Funds.tab')}</NavLink>
                    <NavLink to="/cabinet/settings/permissions/">{t('Permissions.tab')}</NavLink>
                    {data!.company!.isDevShop === null && <NavLink to="/cabinet/settings/about_us/">{t('AboutUs.tab')}</NavLink>}
                </nav>
                <Outlet />
            </Wrapper>
        </div>
    )
}

export default Settings