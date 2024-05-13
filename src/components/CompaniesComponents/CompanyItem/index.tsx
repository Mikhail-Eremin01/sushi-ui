import React from 'react'
import { useTranslation } from 'react-i18next'
import { ReactComponent as CaretDown } from '../../../assets/caretDown.svg'
import { ReactComponent as CaretUp } from '../../../assets/caretUp.svg'
import { ReactComponent as EmailIcon } from '../../../assets/email.svg'
import { ReactComponent as PhoneIcon } from '../../../assets/phone.svg'
import { Company } from '../../../types/graphql'

import './styles.css'

interface ICompanyItemProps {    
    company: Company
}
const CompanyItem: React.FC<ICompanyItemProps> = props => {    
    const { t } = useTranslation()    
    const [fullInfo, setFullInfo] = React.useState<boolean>(false)
    const toggleFullInfo = () => {setFullInfo(prevState => !prevState)}       
    const addresses = props.company?.addresses?.map(add => add?.address + (add?.instruction ? ` (${add?.instruction})` : ""))
   
    return (                
        <div className="company-item">
             <div className="w100">
                    <div className="company-item__table__row">
                        <div className="company-item__table__col20">
                            <div className="company-item__table__title">{t('Companies.company-name')}</div>
                            <div className="company-item__table__value">{props?.company?.name}</div>
                        </div>
                        
                        <div className="company-item__table__col40">
                            <div className="company-item__table__title">{t('Companies.addresses')}</div>
                            <div className="company-item__table__value">
                                { addresses?.map(address => <div key={address}> {address} </div>) }
                            </div>
                        </div>
                        <div className="company-item__table__col40">
                            <div className="company-item__table__title">{t('Companies.date')}</div>
                            <div className="company-item__table__value">{ props?.company?.registerDate || "-"}</div>
                        </div>
                    </div>
                    {
                        fullInfo &&
                        <div>
                            <div className="company-item__table__row">
                                <div className="company-item__table__col60">
                                    <div className="company-item__table__title">{t('Companies.users')}</div>
                                    <div className="company-item__table__value">
                                        { props?.company?.users?.map(user =>
                                            <div key={user?.id} className="company-item__user-wrap">
                                                <div> {user?.name} </div>
                                                <div> <PhoneIcon/> {user?.phone} </div> 
                                                <div> <EmailIcon/> {user?.email} </div> 
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="company-item__table__col40">
                                    <div className="company-item__table__title">{t('Companies.funds')}</div>
                                    <div className="company-item__table__value">
                                        { props?.company?.funds?.map(fund => 
                                            <div key={`${props.company.name}-${fund?.name}`}> 
                                                {fund?.name} 
                                            </div>
                                        )}
                                    </div>
                                </div>
                                                                                            
                            </div>
                        </div>
                    }
                </div>                         
            <button className = "company-item__button_toglleFullInfo" onClick = {toggleFullInfo}>
                {fullInfo ? <CaretUp/> : <CaretDown/>}
            </button>
        </div>    
    )
}

export default CompanyItem