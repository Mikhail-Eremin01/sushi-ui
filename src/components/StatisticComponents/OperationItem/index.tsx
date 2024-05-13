import React from 'react'
import moment from 'moment'
import { useTranslation } from 'react-i18next'
import { useMediaQuery } from 'react-responsive' 
import { ReactComponent as CaretDown } from '../../../assets/caretDown.svg'
import { ReactComponent as CaretUp } from '../../../assets/caretUp.svg'
import { useReactiveVar } from '@apollo/client'
import { userVar } from '../../../cache/cache'

import './styles.css'

interface IOperationItemProps {
    date?: string
    companyName?: string
    companyId?: string
    operationId?: string
    status?: string
    funds?:Array<string | null> | null
    total?: number
    payout?: number
    amountPaid?: number
    amountKept?: number
    timeSpent?: number
    distanceDriven?: number
    isAdmin: boolean
    files?: any[] | null
    letterSent: string
    paymentStatus: string
    paymentDate: string
}
const FileItem = React.lazy(() => import('../FileItem'))

const OperationItem: React.FC<IOperationItemProps> = props => {    
    const { t } = useTranslation()
    const isDesktop = useMediaQuery({ query: '(min-width: 992px)' })
    const isMobile = useMediaQuery({ query: '(max-width: 642px)' })
    const [fullInfo, setFullInfo] = React.useState<boolean>(false)
    const user = useReactiveVar(userVar)
    const toggleFullInfo = () => {setFullInfo(prevState => !prevState)}
    const columnCount = isDesktop
        ? props.isAdmin 
            ? '5'
            : '4'
        : !isMobile
            ? props.isAdmin 
                ? '4'
                : '3'
            : '2'
    const columnClassName = `statistics__table-mobile__col statistics__table-mobile__col_${columnCount}`

    return (                
        <div className="statistic_item">
            { isDesktop
                ? <div className="w100">
                    <div className="statistics__table-mobile__row">
                        <div className={columnClassName}>
                            <div className="statistics__table-mobile__title">{t('Statistics.date')}</div>
                            <div className="statistics__table-mobile__value">{moment(props.date).format('DD.MM.YYYY HH:mm')}</div>
                        </div>                                                                        
                        { props.isAdmin &&
                            <div className="statistics__table-mobile__col statistics__table-mobile__col_5">
                                <div className="statistics__table-mobile__title">{t('Statistics.company')}</div>
                                <div className="statistics__table-mobile__value">{props.companyName}</div>
                            </div>
                        }                       
                        <div className={columnClassName}>
                            <div className="statistics__table-mobile__title">{t('Statistics.status')}</div>
                            <div className="statistics__table-mobile__value">
                                <div className={`statistics__status statistics__status--${props.status}`}>
                                    <span></span>
                                    {
                                    props.status === 'success'
                                        ? "Complected"
                                        : props.status === 'process'
                                            ? "In progress"
                                            : props.status === 'fail'
                                                ? "Fail"
                                                : "Unknown"
                                    }
                                </div>
                            </div>
                        </div>
                        <div className={columnClassName}>
                            <div className="statistics__table-mobile__title">{t('Statistics.funds')}</div>
                            <div className="statistics__table-mobile__value">{props.funds?.join(', ') || "-"}</div>
                        </div>
                        <div className={columnClassName}>
                            <div className="statistics__table-mobile__title">{t('Statistics.amountPaid')}</div>
                            <div className="statistics__table-mobile__value">{props?.amountPaid || 0} EUR</div>
                        </div>
                    </div>
                    {
                        fullInfo &&
                        <div>
                            <div className="statistics__table-mobile__row">
                                <div className={columnClassName}>
                                    <div className="statistics__table-mobile__title">{t('Statistics.total')}</div>
                                    <div className="statistics__table-mobile__value">{props.total || 0} EUR</div>
                                </div>
                                <div className={columnClassName}>
                                    <div className="statistics__table-mobile__title">{t('Statistics.payout')}</div>
                                    <div className="statistics__table-mobile__value">{props.payout || 0} %</div>
                                </div>
                                <div className={columnClassName}>
                                    <div className="statistics__table-mobile__title">{t('Statistics.amountKept')}</div>
                                    <div className="statistics__table-mobile__value">{props.amountKept || 0} EUR</div>
                                </div>
                                <div className={columnClassName}>
                                    <div className="statistics__table-mobile__title">{t('Statistics.timeSpent')}</div>
                                    <div className="statistics__table-mobile__value">{props.timeSpent || 0} min</div>
                                </div>
                                { props.isAdmin &&
                                    <div className="statistics__table-mobile__col statistics__table-mobile__col_5">
                                        <div className="statistics__table-mobile__title">{t('Statistics.distanceDriven')}</div>
                                        <div className="statistics__table-mobile__value">{props.distanceDriven || 0} km</div>
                                    </div>
                                }
                            </div>
                            { !props.isAdmin &&
                                <div className="statistics__table-mobile__row">
                                    <div className="statistics__table-mobile__col statistics__table-mobile__col_4">
                                        <div className="statistics__table-mobile__title">{t('Statistics.distanceDriven')}</div>
                                        <div className="statistics__table-mobile__value">{props.distanceDriven || 0} km</div>
                                    </div>
                                </div>
                            }
                            <div className="statistics__table-mobile__row">
                                { user?.isAdmin && (
                                    <>
                                        <div className="statistics__table-mobile__col statistics__table-mobile__col_5">
                                            <div className="statistics__table-mobile__title">{t('Statistics.email')}</div>
                                            <div className={`statistics__table-mobile__value`}>
                                                <div className={`statistic_email ${props.letterSent !== '' ? 'statistic_emailSent' : 'statistic_emailNotSent'}`}>
                                                    <span></span>
                                                        {
                                                            props.letterSent || "-"
                                                        }
                                                </div>
                                            </div>
                                        </div>
                                        <div className="statistics__table-mobile__col statistics__table-mobile__col_5">
                                            <div className="statistics__table-mobile__title">{t('Statistics.payment-status')}</div>
                                            <div className="statistics__table-mobile__value">
                                                <div className={`statistics__status statistics__status--${props.paymentStatus.toLowerCase()}`}>
                                                    <span></span>
                                                    {
                                                        props.paymentStatus === 'PROCESSED' || props.paymentStatus === 'PROCESSING'
                                                            ? props.paymentDate
                                                            : "Not paid"
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}
                                {
                                    props.files && props.files.length > 0 
                                    &&
                                    <div className="statistics__table-mobile__col statistics__table-mobile__col_2">
                                        <div className="statistics__table-mobile__title">{t('Statistics.files')}</div>
                                        <div className="statistic_files-wrap">
                                            { props.files.map(file =>
                                                <FileItem key={file.fileId} file={file} /> 
                                            )}
                                        </div>
                                    </div>
                                }   
                            </div>
                        </div>
                    }
                </div>
                : !isMobile 
                    ? <div className="w100">
                        <div className="statistics__table-mobile__row">
                            <div className={columnClassName}>
                                <div className="statistics__table-mobile__title">{t('Statistics.date')}</div>
                                <div className="statistics__table-mobile__value">{moment(props.date).format('DD.MM.YYYY HH:mm')}</div>
                            </div>                
                            { props.isAdmin &&
                                <div className="statistics__table-mobile__col statistics__table-mobile__col_4">
                                    <div className="statistics__table-mobile__title">{t('Statistics.company')}</div>
                                    <div className="statistics__table-mobile__value">{props.companyName}</div>
                                </div>
                            } 
                            <div className={columnClassName}>
                                    <div className="statistics__table-mobile__title">{t('Statistics.funds')}</div>
                                    <div className="statistics__table-mobile__value">{props.funds?.join(', ') || "-"}</div>
                            </div>  
                            <div className={columnClassName}>
                                <div className="statistics__table-mobile__title">{t('Statistics.amountPaid')}</div>
                                <div className="statistics__table-mobile__value">{props?.amountPaid || 0} EUR</div>
                            </div>
                        </div>
                        { fullInfo &&
                            <div>
                                <div className="statistics__table-mobile__row">
                                    <div className={columnClassName}>
                                        <div className="statistics__table-mobile__title">{t('Statistics.status')}</div>
                                        <div className="statistics__table-mobile__value">
                                            <div className={`statistics__status statistics__status--${props.status}`}>
                                                <span></span>
                                                {
                                                props.status === 'success'
                                                    ? "Complected"
                                                    : props.status === 'process'
                                                        ? "Process"
                                                        : props.status === 'fail'
                                                            ? "Fail"
                                                            : "Unknown"
                                                }
                                            </div>
                                        </div>
                                    </div>                        
                                    <div className={columnClassName}>
                                        <div className="statistics__table-mobile__title">{t('Statistics.total')}</div>
                                        <div className="statistics__table-mobile__value">{props.total || 0} EUR</div>
                                    </div>
                                    <div className={columnClassName}>
                                        <div className="statistics__table-mobile__title">{t('Statistics.payout')}</div>
                                        <div className="statistics__table-mobile__value">{props.payout || 0} %</div>
                                    </div>
                                    
                                    {  props.isAdmin &&
                                        <div className={columnClassName}>
                                            <div className="statistics__table-mobile__title">{t('Statistics.amountKept')}</div>
                                            <div className="statistics__table-mobile__value">{props.amountKept || 0} EUR</div>
                                        </div>
                                    }
                                </div>
                                
                                <div className="statistics__table-mobile__row">
                                    {  !props.isAdmin &&
                                        <div className={columnClassName}>
                                            <div className="statistics__table-mobile__title">{t('Statistics.amountKept')}</div>
                                            <div className="statistics__table-mobile__value">{props.amountKept || 0} EUR</div>
                                        </div>
                                    }
                                    <div className={columnClassName}>
                                        <div className="statistics__table-mobile__title">{t('Statistics.timeSpent')}</div>
                                        <div className="statistics__table-mobile__value">{props.timeSpent || 0} min</div>
                                    </div>
                                    <div className={columnClassName}>
                                        <div className="statistics__table-mobile__title">{t('Statistics.distanceDriven')}</div>
                                        <div className="statistics__table-mobile__value">{props.distanceDriven || 0} km</div>
                                    </div>
                                    {user?.isAdmin && (
                                        <>
                                            <div className={columnClassName}>
                                                <div className="statistics__table-mobile__title">{t('Statistics.email')}</div>
                                                <div className={`statistics__table-mobile__value`}>
                                                    <div className={`statistic_email ${props.letterSent !== '' ? 'statistic_emailSent' : 'statistic_emailNotSent'}`}>
                                                        <span></span>
                                                        {
                                                            props.letterSent || "-"
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={columnClassName}>
                                                <div className="statistics__table-mobile__title">{t('Statistics.payment-status')}</div>
                                                <div className="statistics__table-mobile__value">
                                                    <div className={`statistics__status statistics__status--${props.paymentStatus.toLowerCase()}`}>
                                                        <span></span>
                                                        {
                                                            props.paymentStatus === 'PROCESSED' || props.paymentStatus === 'PROCESSING'
                                                                ? props.paymentDate
                                                                : "Not paid"
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                                { props.files && props.files.length > 0 &&
                                    <div className="statistics__table-mobile__row">
                                        <div className="m-10">
                                            <div className="statistics__table-mobile__title">{t('Statistics.files')}</div>
                                            <div className="statistic_files-wrap">
                                                <FileItem key={props.files[0].fileId} file={props.files[0]} />
                                                { props.files.length > 1 && 
                                                    <FileItem key={props.files[1].fileId} file={props.files[1]} />
                                                }
                                            </div>
                                            { props.files.length > 2 &&
                                                <div className="statistic_files-wrap">
                                                    <FileItem key={props.files[2].fileId} file={props.files[2]} />
                                                    { props.files.length > 3 && 
                                                        <FileItem key={props.files[3].fileId} file={props.files[3]} />
                                                    }
                                                </div>
                                            }
                                        </div>
                                    </div>
                                }
                            </div>
                        }            
                    </div>
                    : <div className="w100">
                        <div className="statistics__table-mobile__row">
                            <div className={columnClassName}>
                                <div className="statistics__table-mobile__title">{t('Statistics.date')}</div>
                                <div className="statistics__table-mobile__value">{moment(props.date).format('DD.MM.YYYY HH:mm')}</div>
                            </div>                
                            { props.isAdmin &&
                                <div className={columnClassName}>
                                    <div className="statistics__table-mobile__title">{t('Statistics.company')}</div>
                                    <div className="statistics__table-mobile__value">{props.companyName}</div>
                                </div>
                            } 
                        </div>
                        <div className="statistics__table-mobile__row"> 
                            <div className={columnClassName}>
                                <div className="statistics__table-mobile__title">{t('Statistics.funds')}</div>
                                <div className="statistics__table-mobile__value">{props.funds?.join(', ') || "-"}</div>
                            </div>
                            <div className={columnClassName}>
                                <div className="statistics__table-mobile__title">{t('Statistics.amountPaid')}</div>
                                <div className="statistics__table-mobile__value">{props?.amountPaid || 0} EUR</div>
                            </div>                      
                                                    
                            
                        </div>
                        { fullInfo &&
                            <div>
                                <div className="statistics__table-mobile__row">
                                    <div className={columnClassName}>
                                            <div className="statistics__table-mobile__title">{t('Statistics.status')}</div>
                                            <div className="statistics__table-mobile__value">
                                                <div className={`statistics__status statistics__status--${props.status}`}>
                                                    <span></span>
                                                    { props.status === 'success'
                                                        ? "Complected"
                                                        : props.status === 'process'
                                                            ? "Process"
                                                            : props.status === 'fail'
                                                                ? "Fail"
                                                                : "Unknown"
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    <div className={columnClassName}>
                                        <div className="statistics__table-mobile__title">{t('Statistics.total')}</div>
                                        <div className="statistics__table-mobile__value">{props.total || 0} EUR</div>
                                    </div>
                                    
                                </div>
                                <div className="statistics__table-mobile__row">
                                    <div className={columnClassName}>
                                        <div className="statistics__table-mobile__title">{t('Statistics.payout')}</div>
                                        <div className="statistics__table-mobile__value">{props.payout || 0} %</div>
                                    </div>
                                    <div className={columnClassName}>
                                        <div className="statistics__table-mobile__title">{t('Statistics.amountKept')}</div>
                                        <div className="statistics__table-mobile__value">{props.amountKept || 0} EUR</div>
                                    </div>
                                </div>                                
                                <div className="statistics__table-mobile__row">
                                    <div className={columnClassName}>
                                        <div className="statistics__table-mobile__title">{t('Statistics.timeSpent')}</div>
                                        <div className="statistics__table-mobile__value">{props.timeSpent || 0} min</div>
                                    </div>
                                    <div className={columnClassName}>
                                        <div className="statistics__table-mobile__title">{t('Statistics.distanceDriven')}</div>
                                        <div className="statistics__table-mobile__value">{props.distanceDriven || 0} km</div>
                                    </div>
                                </div>
                                {user?.isAdmin && (
                                    <div className="statistics__table-mobile__row">
                                        <div className={columnClassName}>
                                            <div className="statistics__table-mobile__title">{t('Statistics.email')}</div>
                                            <div className={`statistics__table-mobile__value`}>
                                                <div className={`statistic_email ${props.letterSent !== '' ? 'statistic_emailSent' : 'statistic_emailNotSent'}`}>
                                                    <span></span>
                                                    {
                                                        props.letterSent || "-"
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                        <div className={columnClassName}>
                                            <div className="statistics__table-mobile__title">{t('Statistics.payment-status')}</div>
                                            <div className="statistics__table-mobile__value">
                                                <div className={`statistics__status statistics__status--${props.paymentStatus.toLowerCase()}`}>
                                                    <span></span>
                                                    {
                                                        props.paymentStatus === 'PROCESSED' || props.paymentStatus === 'PROCESSING'
                                                            ? props.paymentDate
                                                            : "Not paid"
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                { props.files && props.files.length > 0 &&
                                    <div className="statistics__table-mobile__row">
                                        <div className="m-10">
                                            <div className="statistics__table-mobile__title">{t('Statistics.files')}</div>
                                            <div className="statistic_files-wrap">
                                                { props.files.map( file =>
                                                    <FileItem key={file.fileId} file={file} /> )
                                                }
                                            </div>
                                        </div>
                                    </div>
                                }
                            </div>
                        }
                    </div>
            }            
            <button className = "statistics__button_toglleFullInfo" onClick = {toggleFullInfo}>
                {fullInfo ? <CaretUp/> : <CaretDown/>}
            </button>
        </div>    
    )
}

export default OperationItem