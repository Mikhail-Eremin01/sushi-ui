import React from 'react'
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useReactiveVar } from '@apollo/client'
import { useMediaQuery } from 'react-responsive'
import { STATISTICS } from '../../graphql/queries'
import { operationEditVar, transferMoneyVar, userVar } from '../../cache/cache'
import { EditOperationMutationVariables, useDeleteOperationMutation, Statistic as StatisticType, useStatisticsQuery } from '../../types/graphql'
import { IDropmenuSchema } from '../../components/common/DropMenu'
import { ISelectItem } from '../../components/common/Select'
import moment from 'moment'
import classNames from 'classnames'

import { ReactComponent as AddOperationIcon } from '../../assets/button-add-operation.svg'
import { ReactComponent as PlusIcon } from '../../assets/button-plus.svg'
import { ReactComponent as NoResultIcon } from '../../assets/statistic-none.svg'
import { ReactComponent as DropmenuEditIcon } from '../../assets/dropmenu-edit.svg'
import { ReactComponent as DropmenuSendIcon } from '../../assets/dropmenu-send.svg'
import { ReactComponent as DropmenuDeleteIcon } from '../../assets/dropmenu-delete.svg'
import { ReactComponent as DropmenuSendMoneyIcon } from '../../assets/dropmenu-send-money.svg'
import './styles.css'


const Wrapper = React.lazy(() => import('../../components/common/Wrapper'))
const Button = React.lazy(() => import('../../components/common/Button'))
const Select = React.lazy(() => import('../../components/common/Select'))
const DropMenu = React.lazy(() => import('../../components/common/DropMenu'))
const OperationItem = React.lazy(() => import('../../components/StatisticComponents/OperationItem'))
const Pagination = React.lazy(() => import('../../components/common/Pagination'))
const DownloadOperationsData = React.lazy(() => import('../../components/StatisticComponents/DownloadOperationsData'))

export const LIMIT = 10

const Statistic: React.FC = () => {
    const [dropmenu, setDropmenu] = React.useState<string>('')    
    const { t } = useTranslation()
    const user = useReactiveVar(userVar)
    const navigate = useNavigate()
    const location = useLocation()
    const [searchParams] = useSearchParams({})
    const limit = LIMIT
    const page = (Number(searchParams.get('page')) === 0) ? 1 : Number(searchParams.get('page'))
    const [, setOffset] = React.useState<number>((page - 1) * limit)
    const isMobile = useMediaQuery({ query: '(max-width: 575.98px)' })
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const status = searchParams.get('status') || "all"

    const end = endDate || moment().format("YYYY-MM-DD")
    const start = startDate || moment().subtract(user?.isAdmin ? 1 : 3, "month").format("YYYY-MM-DD")

    const { data, loading } = useStatisticsQuery({
        variables: {
            offset: (page - 1) * limit,
            limit,
            startDate: start,
            endDate: end,
            status: (status && ["process", "success", "fail"].includes(status)) ? status : null
        },
        onCompleted: (data) => {
            if (data.statistics?.total && data.statistics?.total > 0 && Math.ceil(data.statistics?.total / LIMIT) < page) {
                searchParams.set("page", "1")
                navigate(location.pathname+'?'+searchParams.toString())
            }
        }
    })

    const [deleteOperation] = useDeleteOperationMutation({
        onError: e => {
            console.log(e)
        },
        refetchQueries: [
            {
                query: STATISTICS,
                variables: {
                    offset: (page - 1) * limit,
                    limit,
                    startDate: start,
                    endDate: end,
                    status: (status && ["process", "success", "fail"].includes(status)) ? status : null
                }
            }
        ]
    })
    
    const sendMoney = (operationId: string) => {
        transferMoneyVar(operationId)
        navigate(location.search + "#transfer-money")
    }

    const edit = (operation: EditOperationMutationVariables) => {
        operationEditVar(operation)
        navigate(location.search + '#manage-operation')
    }

    const getSchema = (el: StatisticType | null): IDropmenuSchema[] => {
        if (!el) {
            return [];
        }
        const schemaResult = [
            {
                icon: <DropmenuSendIcon/>,
                name: t(`${el?.companyFunds?.length === 0 ? 'Statistics.suggestFunds' : 'Statistics.send'}`),
                handler: () => navigate(location.search + '#send-operation-info', {state: { operationId: el?.id }})
            },
            
            {
                icon: <DropmenuEditIcon/>, 
                name: t('Statistics.edit'),
                handler: () => edit({
                    operationId: el?.id || '',
                    date: el?.date || '',
                    companyId: el?.companyId || '', 
                    status: el?.status || '', 
                    total: el?.total || 0,
                    amount: el?.amount || 0, 
                    payout: el?.payout || 0, 
                    amountPaid: el?.amountPaid || 0, 
                    amountKept: el?.amountKept || 0, 
                    timeSpent: el?.timeSpent || 0, 
                    distanceDriven: el?.distanceDriven || 0,
                    funds: el?.funds?.map(el => el?.id || "") || [],
                    files: el?.files || []
                })
            },
            {
                icon: <DropmenuDeleteIcon/>, 
                name: t('Statistics.delete'), 
                handler: () => deleteOperation({
                    variables: { operationId: el?.id || '' }
                    })
            }
        ]

        const hasFunds = el?.funds?.length && el?.funds?.length > 0;
        const hasProofTransferFile = el?.files?.find(file => file?.typeProof === "proofOfMoneyTransfer");
        const wasPaid = el?.paymentStatus && el?.paymentStatus === "PROCESSED" && hasProofTransferFile;
        const noPdf = el?.paymentStatus && el?.paymentStatus === "PROCESSED" && !hasProofTransferFile;
        
        if (hasFunds && !wasPaid) {
            schemaResult.push({
                icon: <DropmenuSendMoneyIcon/>,
                name: t(`${el?.paymentStatus === "PROCESSING" ? 'Statistics.check-status' : noPdf ? "Statistics.gen-check" : 'Statistics.send-money'}`),
                handler: () => sendMoney(el?.id || '')
            })
        }
        return schemaResult
    }

    const statusSelect: ISelectItem[] = [
        { name: "All", value: "all", selected: status === "all" },
        { name: "In progress", value: "process", selected: status === "process" },
        { name: "Complected", value: "success", selected: status === "success" },
        { name: "Fail", value: "fail", selected: status === "fail" },
    ]

    //Redirect to authorize page
    React.useEffect(() => {
        if (user === null) navigate('/', { state: { referer: location.pathname }})
    }, [user, location, navigate])

    if (loading) return <div className="preloader"></div>
    return (
        <div className='statistics'>
            <Wrapper>
                <div className="statistics__title">
                    <div className="statistics__title-text">{t('Statistics.title')}</div>
                    { 
                        user?.isAdmin && 
                        <div className="statistics__title-buttons">
                            {
                                isMobile ? 
                                    <Button
                                        className="statistics__add-button-mobile"
                                        text=""
                                        icon={<PlusIcon/>}
                                        onClick={ () => navigate(location.search + '#manage-operation') }
                                    />
                                : <Button
                                    text={t('Statistics.add-button')}
                                    icon={<AddOperationIcon/>}
                                    onClick={ () => navigate(location.search + '#manage-operation') }
                                />
                            }
                        </div>
                    }
                </div>
                
                <div
                    className={classNames(
                        "statistics__row",
                        {
                            'statistics__row--full': user?.isAdmin
                        }
                    )} 
                >
                    {user?.isAdmin && (
                        <Select className="statistics__status-filter" 
                            title={t('Statistics.status')}
                            schema={statusSelect} 
                            value={status || ""} 
                            onChange={val => {
                                searchParams.set('status', val);
                                navigate(location.pathname+'?'+searchParams.toString())
                            }}
                        />
                    )}
                    <DownloadOperationsData
                        start={start}
                        end={end}
                    />
                </div>
                <div className="statistics__info">
                    <div className="statistics__info-item">
                        <div className="statistics__table-mobile__title">Total amount</div>
                        <div className="statistics__table-mobile__value">{data?.statistics?.amount} EURO</div>
                    </div>
                    <div className="statistics__info-item">
                        <div className="statistics__table-mobile__title">Number</div>
                        <div className="statistics__table-mobile__value">{data?.statistics?.total}</div>
                    </div>
                </div>
                {
                    data?.statistics?.operations && data?.statistics.operations.length > 0                  
                    ?   <div className="table-mobile">
                            {
                                data?.statistics?.operations?.map(el => {
                                    const schema = getSchema(el);
                                    return (
                                        <div key={el?.id} className="statistics__table-mobile__item">
                                            <div className="statistics__table-mobile__item_mainContent">
                                                <OperationItem
                                                    date = {el?.date || ''}
                                                    companyName = {el?.companyName || ''}
                                                    status = {el?.status || ''}
                                                    total = {el?.total || 0}
                                                    payout = {el?.payout || 0}
                                                    amountPaid = {el?.amountPaid || 0}
                                                    amountKept = {el?.amountKept || 0}
                                                    timeSpent = {el?.timeSpent || 0}
                                                    distanceDriven = {el?.distanceDriven || 0}
                                                    funds = {el?.funds?.map(fund => fund?.name || "")}
                                                    isAdmin = {user?.isAdmin || false}
                                                    files = {el?.files}
                                                    operationId={el?.id || ''}
                                                    companyId={el?.companyId || ''}
                                                    letterSent={el?.letterSent || ''}
                                                    paymentStatus={el?.paymentStatus || ''}
                                                    paymentDate={el?.paymentDate || ''}
                                                />
                                            </div>
                                            <div>
                                                {
                                                    user?.isAdmin &&
                                                    <div className="table-mobile__menu">
                                                        <div className="table-mobile__menu-button" onClick={ () => setDropmenu(el?.id || '') }></div>
                                                        {
                                                            dropmenu === `${el?.id}` &&
                                                            <React.Suspense fallback={''}>
                                                                <DropMenu 
                                                                    schema={schema} 
                                                                    setDropmenu={setDropmenu}
                                                                />
                                                            </React.Suspense>
                                                        }
                                                    </div>
                                                }
                                               
                                            </div>
                                            
                                        </div>
                                )})
                            }
                        </div>                        
                    : <div className="statistics__noresults">
                        <NoResultIcon className="statistics__noresults-image"/>
                        <div className="statistics__noresults-title">{t('Statistics.noresult-title')}</div>
                        {t('Statistics.noresult-text')}
                    </div>

                }
                {
                    data?.statistics?.total && (data.statistics.total > limit)
                    &&
                    <Pagination limit={limit} setOffset={setOffset} total={data?.statistics?.total || 0} page={page} />
                }
                
            </Wrapper>
        </div>
    )
}

export default Statistic