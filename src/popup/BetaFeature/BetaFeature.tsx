import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useLocation } from 'react-router-dom'
import { useReactiveVar } from '@apollo/client'
import { userVar } from '../../cache/cache'
import { useAcceptNewFeatureMutation } from '../../types/graphql'
import { USER_INFO } from '../../graphql/queries'
import { ReactComponent as CarImage } from '../../assets/imageSuggestFeature.svg'
import { ReactComponent as CompletedFeature } from '../../assets/completedNewFeature.svg'

import './styles.css'

const Textarea = React.lazy(() => import('../../components/common/Textarea'))
const Button = React.lazy(() => import('../../components/common/Button'))

const DeleteEvent: React.FC = () => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const location = useLocation()
    const user = useReactiveVar(userVar)
    const [messageText, setMessageText] = useState('')

    //Redirect to auth
    React.useEffect(() => {
        if (user === null) {
            navigate('/', { replace: true })
        }
    }, [ user, navigate ])
    const [requestFeature] = useAcceptNewFeatureMutation({
        refetchQueries: () => {
            return [{
                query: USER_INFO
            }]
        }
    })
    const requestNewFeature = () => {
        requestFeature({variables: {
            message: messageText
        }})
    }
    return (
        <div className="new-feature__container">
            {
                !user?.acceptNewFeature 
                ? 
                <div className="suggestFeature__container">
                    <div className="new-feature__title">{t('Popup.SuggestNewFeature.title')}</div>
                    <div className="svg__container">
                        <CarImage />
                    </div>
                    
                    <div className='new-feature__text__container'>
                        <div className="new-feature__text">{t('Popup.SuggestNewFeature.text')}</div>
                    </div>
                    <div className='suggestFeature__message'>
                        <Textarea
                            onChange={(val) => setMessageText(val)}
                            title="Message"
                            value={messageText}
                            placeholder={t('Popup.SuggestNewFeature.textareaPlaceholder')}
                        />
                    </div>
                    <div className="new-feature__btn">
                        <Button text={t('Popup.SuggestNewFeature.button')} onClick={ () => requestNewFeature() } />
                    </div>
                </div>
                :
                <div className='acceptedFeature__container'>
                    <CompletedFeature />
                    <div className='acceptedFeature__title'>
                        {t('Popup.SuggestNewFeature.requestAccepted.title.firstParagraph')}<br/>
                        {t('Popup.SuggestNewFeature.requestAccepted.title.secondParagraph')}
                    </div>
                    <div className='acceptedFeature__text'>
                        {t('Popup.SuggestNewFeature.requestAccepted.text')}
                    </div>
                    <Button className='acceptedFeature__btn' text={t('Popup.SuggestNewFeature.requestAccepted.btn')} onClick={ () => navigate(location.pathname+location.search) } />
                </div>
            }
        </div>
    )
}

export default DeleteEvent