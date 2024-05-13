import React from 'react'
import moment from 'moment'
import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useReactiveVar } from '@apollo/client'
import useOnClickOutside from  '../../../hooks/useOnClickOutside'
import { cache, userVar } from '../../../cache/cache'

import { ReactComponent as LogoIcon } from '../../../assets/logo-white.svg'
import './styles.css'

const LanguageHead = React.lazy(() => import('../LanguageHead'))

const Head: React.FC = () => {
    const wrapRef = React.useRef<HTMLDivElement | null>(null)
    const [showMobileMenu, setShowMobileMenu] = React.useState<boolean>(false)

    useOnClickOutside(wrapRef, () => setShowMobileMenu(false))

    const { t } = useTranslation()
    const user = useReactiveVar(userVar)

    const logout = () => {
        localStorage.removeItem('AccessToken')
        cache.modify({
            fields: {
                userInfo(existingUserRef, { DELETE }) {
                    return null
                }
            }
        })
        userVar(undefined)
    }

    return (
        <header className="head">
            {
                showMobileMenu &&
                <>
                    <div className="head__overlay"></div>
                    <div ref={wrapRef} className="head__menu-mobile">
                        <div
                            className="head__menu-mobile-close"
                            onClick={ () => setShowMobileMenu(!showMobileMenu) }
                        />
                        <div className="head__menu-mobile-logo">
                            <LogoIcon/>
                        </div>
                        <div className="head__menu-mobile-menu">
                            <NavLink
                                onClick={() => setShowMobileMenu(!showMobileMenu)}
                                to={`/cabinet/schedule/${moment().format('YYYY-MM')}/`}
                            >
                                {t('Head.schedule')}
                            </NavLink>
                            <NavLink
                                onClick={() => setShowMobileMenu(!showMobileMenu)}
                                to="/cabinet/statistics/"
                            >
                                {t('Head.statistics')}
                            </NavLink>
                            { user?.isAdmin && (
                                <NavLink
                                    onClick={() => setShowMobileMenu(!showMobileMenu)}
                                    to="/cabinet/charities/"
                                >
                                    {t('Head.charities')}
                                </NavLink>
                            )}
                            { user?.isAdmin && 
                                <NavLink 
                                    onClick={() => setShowMobileMenu(!showMobileMenu)} 
                                    to="/cabinet/companies/">{t('Head.companies')}
                                </NavLink> 
                            }
                            <NavLink
                                onClick={() => setShowMobileMenu(!showMobileMenu)}
                                to="/cabinet/settings/"
                            >
                                {t('Head.settings')}
                            </NavLink>                            
                            { user?.isAdmin && (
                                <NavLink
                                    onClick={() => setShowMobileMenu(!showMobileMenu)}
                                    to="/cabinet/route/"
                                >
                                    {t('Head.route')}
                                </NavLink>
                            )}
                        </div>
                        <div className="head__menu-mobile-logout" onClick={ logout }>
                            {t('Head.logout')}
                        </div>
                    </div>
                </>
            }

            <div className="head__wrap">
                <div
                    className="head__menu-mobile-button"
                    onClick={ () => setShowMobileMenu(!showMobileMenu) }
                />
                <div className="head__logo">
                    <LogoIcon/>
                </div>
                <nav className="head__menu">
                    <NavLink to={`/cabinet/schedule/${moment().format('YYYY-MM')}/`}>
                        {t('Head.schedule')}
                    </NavLink>
                    <NavLink to="/cabinet/statistics/">
                        {t('Head.statistics')}
                    </NavLink>
                    { user?.isAdmin && <NavLink to="/cabinet/charities/">
                        {t('Head.charities')}
                    </NavLink> }
                    { user?.isAdmin && <NavLink to="/cabinet/companies/">{t('Head.companies')}</NavLink> }
                    <NavLink to="/cabinet/settings/">
                        {t('Head.settings')}
                    </NavLink>
                    
                    { user?.isAdmin && <NavLink to="/cabinet/route/">
                        {t('Head.route')}
                    </NavLink> }
                </nav>
                <div className="head__lang">
                    <LanguageHead/>
                </div>
                <div className="head__logout">
                    <div className="head__logout-link" onClick={logout}>
                        {t('Head.logout')}
                    </div>
                </div>
            </div>
        </header>  
    )
}

export default Head