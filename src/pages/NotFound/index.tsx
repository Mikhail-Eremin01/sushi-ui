import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { ReactComponent as LogoIcon } from '../../assets/logo-white.svg'
import { ReactComponent as NotFoundIcon } from '../../assets/404.svg'
import './styles.css'

const Language = React.lazy(() => import('../../components/common/Language'))
const Button = React.lazy(() => import('../../components/common/Button'))

const NotFound: React.FC = () => {
    const { t } = useTranslation()
    const navigate = useNavigate()

    return (
        <div className="notfound">
            <div className="notfound__logo">
                <LogoIcon/>
            </div>
            <Language className="notfound__language" />
            <div className="notfound__wrap">
                <NotFoundIcon className="notfound__image"/>
                <div className="notfound__text">
                    {t('NotFound.text')}
                </div>
                <Button text={t('NotFound.home')} mode="black" onClick={ () => navigate('/') } />
            </div>
        </div>
    )
}

export default NotFound