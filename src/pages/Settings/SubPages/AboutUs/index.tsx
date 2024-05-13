import React from 'react'
import { useTranslation } from 'react-i18next'
import './styles.css'
import { ReactComponent as MainImage } from '../../../../assets/Frame.svg'

const AboutUs: React.FC = () => {
    const { t } = useTranslation()

    return (
        <div className='about-us'>
            <div className='about-us-container'>
                <div className='abous-us-mainContent'>
                    <div className='about-us__companyMessage'>
                        <div className='mainInfo-container'>
                            <div className='companyInfo_item__text'>
                                <span>
                                {t('AboutUs.mainText.firstParagraph.firstPart')}
                                <b>{t('AboutUs.mainText.firstParagraph.boldText')}</b>
                                {t('AboutUs.mainText.firstParagraph.secondPart')}
                                </span>
                                <br /><br />
                                <span>
                                {t('AboutUs.mainText.secondParagraph.firstPart')}
                                <a href="mailto:hi@charitybo.fi">{t('AboutUs.mainText.secondParagraph.mail')}</a>.  
                                {t('AboutUs.mainText.secondParagraph.secondPart')}
                                </span>
                                <br /><br />
                                <span>
                                {t('AboutUs.mainText.thirdParagraph')}
                                </span>
                            </div>
                            <div>
                                <MainImage/>
                            </div>
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AboutUs