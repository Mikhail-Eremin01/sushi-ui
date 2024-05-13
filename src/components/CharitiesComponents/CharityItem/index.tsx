import React from 'react'
import { useTranslation } from 'react-i18next'
import { useMediaQuery } from 'react-responsive' 
import './styles.css'
interface ICharityItemProps {
    name: string
    iban: string
    message: string
    reference: string
    country: string
    address: string
    createdAt: string
}
const CharityItem: React.FC<ICharityItemProps> = props => {    
    const { t } = useTranslation()
    const isDesktop = useMediaQuery({ query: '(min-width: 992px)' })
    const isMobile = useMediaQuery({ query: '(max-width: 642px)' })
    return (                
        <div className="charity_item">
            {isDesktop ? (
                <>
                    <div className="charity__table__row">
                        <div className="charity__table__col charity__table__col_3">
                            <div className="charity__table__title">{t('Charities.name')}</div>
                            <div className="charity__table__value">{props.name || "-"}</div>
                        </div>
                        <div className="charity__table__col charity__table__col_3">
                            <div className="charity__table__title">{t('Charities.iban')}</div>
                            <div className="charity__table__value">{props.iban || "-"}</div>
                        </div>
                        {props.message ? (
                            <div className="charity__table__col charity__table__col_3">
                                <div className="charity__table__title">{t('Charities.message')}</div>
                                <div className="charity__table__value">{props.message || "-"}</div>
                            </div>
                        ) : (
                            <div className="charity__table__col charity__table__col_3">
                                <div className="charity__table__title">{t('Charities.reference')}</div>
                                <div className="charity__table__value">{props.reference || "-"}</div>
                            </div>
                        )}
                    </div>
                </>
            ) : !isMobile ? (
                <>
                    <div className="charity__table__row">
                        <div className="charity__table__col charity__table__col_2">
                            <div className="charity__table__title">{t('Charities.name')}</div>
                            <div className="charity__table__value">{props.name || "-"}</div>
                        </div>
                        <div className="charity__table__col charity__table__col_2">
                            <div className="charity__table__title">{t('Charities.iban')}</div>
                            <div className="charity__table__value">{props.iban || "-"}</div>
                        </div>
                    </div>
                    <div className="charity__table__row">
                        {props.message ? (
                            <div className="charity__table__col charity__table__col_2">
                                <div className="charity__table__title">{t('Charities.message')}</div>
                                <div className="charity__table__value">{props.message || "-"}</div>
                            </div>
                        ) : (
                            <div className="charity__table__col charity__table__col_2">
                                <div className="charity__table__title">{t('Charities.reference')}</div>
                                <div className="charity__table__value">{props.reference || "-"}</div>
                            </div>
                        )}
                    </div>
                </>
            ) : (
                <>
                    <div className="charity__table__row">
                        <div className="charity__table__col">
                            <div className="charity__table__title">{t('Charities.name')}</div>
                            <div className="charity__table__value">{props.name || "-"}</div>
                        </div>
                    </div>
                    <div className="charity__table__row">
                        <div className="charity__table__col">
                            <div className="charity__table__title">{t('Charities.iban')}</div>
                            <div className="charity__table__value">{props.iban || "-"}</div>
                        </div>
                    </div>
                    <div className="charity__table__row">
                        {props.message ? (
                            <div className="charity__table__col">
                                <div className="charity__table__title">{t('Charities.message')}</div>
                                <div className="charity__table__value">{props.message || "-"}</div>
                            </div>
                        ) : (
                            <div className="charity__table__col">
                                <div className="charity__table__title">{t('Charities.reference')}</div>
                                <div className="charity__table__value">{props.reference || "-"}</div>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>    
    )
}
export default CharityItem