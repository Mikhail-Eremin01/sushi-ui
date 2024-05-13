import React from 'react'
import { ReactComponent as Heart } from '../../../assets/heart-tick.svg'
import { ReactComponent as Close } from '../../../assets/close.svg'
import { NavLink } from 'react-router-dom'
import { writeCookie } from '../../../misc/common'
import { useTranslation } from 'react-i18next'
import './styles.css'

const InfoFounds: React.FC = () => {
    const { t } = useTranslation()   
    const [showCookie, setShowCookie] = React.useState<boolean>(true)
    const handleClose= () => {
        writeCookie("show_info_founds", "false", 60 * 60 * 24 * 7 )    
        setShowCookie(false)
    }
    
    return (
        <>
        {
            showCookie &&
            <div className="info-founds__wrap">
                <div className="info-founds__content">
                    <div className="info-founds__info">
                        <div className="info-founds__icon"> <Heart/> </div>
                        <div className="info-founds__text">
                            {t('Calendar.info-founds-text1')}&nbsp;
                            <NavLink to="/cabinet/settings/funds/">{t('Calendar.info-founds-link')}</NavLink> 
                            &nbsp;{t('Calendar.info-founds-text2')}
                        </div>
                    </div>
                    <div className="info-founds__button" onClick={handleClose}>
                        <Close/>
                    </div>
                </div> 
            </div>
        }
    </>
    )
}

export default InfoFounds