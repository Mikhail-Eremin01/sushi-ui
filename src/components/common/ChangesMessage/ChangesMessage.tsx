import React from 'react'
import _ from 'lodash'
import classNames from 'classnames'

import './styles.css'
import { useTranslation } from 'react-i18next'

export interface ChangesMessageProps {
    status: string
}

const ChangesMessage: React.FC<ChangesMessageProps> = ({status}) => {
    const { t } = useTranslation()
    return (
        <div className={classNames(`messageContainer ${status === 'success' ? 'successContainer' : 'errorContainer'}`)}>
            <div
                className={`messageContainer__image ${status === 'success' ? 'successImg' : 'errorImg'}`}
            ></div>
            <div
                className={`messageContainer__text ${status === 'success' ? 'successText' : 'errorText'}`}
            >
                {
                    status === 'success'
                    ?
                    t('Settings.msg-success')
                    :
                    status === 'error'
                    ?
                    t('Settings.msg-error')
                    :
                    t('Settings.msg-requireField')
                }
            </div>
        </div>
    )
}

export default ChangesMessage