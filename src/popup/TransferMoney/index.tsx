import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom'
import { useReactiveVar } from '@apollo/client'
import { setError } from '../../misc/common'
import { userVar, transferMoneyVar, fundEditVar, errorsVar } from '../../cache/cache'
import { EditFundMutationVariables, useSendMoneyMutation, useTransactionDetailsQuery } from '../../types/graphql'
import { STATISTICS } from '../../graphql/queries'
import { LIMIT } from '../../pages/Statistics'
import moment from 'moment'

import './styles.css'

const Button = React.lazy(() => import('../../components/common/Button'))

const TransferMoney: React.FC = () => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const location = useLocation()
    const user = useReactiveVar(userVar)
    const operationId = useReactiveVar(transferMoneyVar)
    const [transferStatus, setTransferStatus] = useState<"success" | "error" | null>(null);
    let errors = useReactiveVar(errorsVar);
    const [searchParams] = useSearchParams({})
    const page = (Number(searchParams.get('page')) === 0) ? 1 : Number(searchParams.get('page'))
    const end = searchParams.get('endDate') || moment().format("YYYY-MM-DD")
    const start = searchParams.get('startDate') || moment().subtract(1, "month").format("YYYY-MM-DD")
    const status = searchParams.get('status')

    const { data, loading } = useTransactionDetailsQuery({
        onError: e => {
            console.log(e);
            const newErrors = setError(errors, [{ place: 'details', message: e.message }]);
            errorsVar(newErrors);
            setTransferStatus("error")
        },
        variables: { operationId: operationId || "" },
        skip: !operationId,
        fetchPolicy: "network-only"
    })

    const [sendMoney, { data: transaction, loading: transactionLoading }] = useSendMoneyMutation({
        onCompleted: data => {
            if (data?.sendMoney) {
                setTransferStatus("success")
            }
        },
        onError: e => {
            console.log(e);
            const newErrors = setError(errors, [{ place: 'transfer', message: e.message }]);
            errorsVar(newErrors);
            setTransferStatus("error")
        },
        refetchQueries: [
            {
                query: STATISTICS,
                variables: {
                    offset: (page - 1) * LIMIT,
                    limit: LIMIT,
                    startDate: start,
                    endDate: end,
                    status: (status && ["process", "success", "fail"].includes(status)) ? status : null
                }
            }
        ]
    })

    //Redirect to auth
    React.useEffect(() => {
        if (user === null || !user?.isAdmin) {
            navigate('/', { replace: true })
        }
    }, [ user, navigate ])

    const handleSubmit = () => {
        if (operationId) {
            setTransferStatus(null)
            sendMoney({ variables: { operationId } })
        }
    }

    const handleCancel = () => {
        setTransferStatus(null)
        transferMoneyVar(null)
        navigate(location.pathname+location.search)
    }

    const editFund = () => {
        const fund: EditFundMutationVariables = {
            address: data?.transactionDetails?.fund?.address || "",
            country: data?.transactionDetails?.fund?.country || "",
            fundId: data?.transactionDetails?.fund?.id || "",
            iban: data?.transactionDetails?.fund?.iban || "",
            name: data?.transactionDetails?.fund?.name || "",
            message: data?.transactionDetails?.fund?.message || "",
            reference: data?.transactionDetails?.fund?.reference || "",
        }
        fundEditVar(fund)
        navigate(location.search + '#manage-fund')
    }

    React.useEffect(() => {
        if (operationId === null) {
            navigate(location.pathname+location.search)
        }
    }, [ navigate, location, operationId ])

    const detailsError = errors.find(el => el?.place === 'details')
    const transferError = errors.find(el => el?.place === 'transfer')

    const isValid = data?.transactionDetails?.fund?.name && data?.transactionDetails?.fund?.name.length > 0
        // && data.transactionDetails?.fund?.country && data.transactionDetails?.fund?.country.length > 0
        // && data.transactionDetails?.fund?.address && data.transactionDetails?.fund?.address.length > 0
        && data.transactionDetails?.fund?.iban && data.transactionDetails?.fund?.iban.length > 0
        && data.transactionDetails?.amount && data.transactionDetails?.amount.length > 0
        && ((data.transactionDetails?.fund?.message && data.transactionDetails?.fund?.message.length > 0)
        || (data.transactionDetails?.fund?.reference && data.transactionDetails?.fund?.reference.length > 0))

    if (loading || transactionLoading) return <div>Loading...</div>

    return (
        <div className="transfer-money">
            <div className="transfer-money__head">
                {data?.transactionDetails?.paymentStatus === "PROCESSING"
                    ? t('Popup.TransferMoney.title-get-status')
                    : !data?.transactionDetails?.hasCheck && data?.transactionDetails?.paymentStatus === "PROCESSED"
                        ? t('Popup.TransferMoney.title-generate')
                        : t('Popup.TransferMoney.title')
                }
            </div>
            {data && (
                <>
                    {transferStatus === null ? (
                        <>
                            <div className="transfer-money__desc">
                                {data?.transactionDetails?.paymentStatus === "PROCESSING"
                                    ? t('Popup.TransferMoney.text-get-status')
                                    : !data?.transactionDetails?.hasCheck && data?.transactionDetails?.paymentStatus === "PROCESSED"
                                        ? t('Popup.TransferMoney.text-generate')
                                        : t('Popup.TransferMoney.text')
                                }
                            </div>
                            <div className="transfer-money__details">
                                <div className="transfer-money__details-item">
                                    <div className="transfer-money__title">
                                        {t('Charities.name')}
                                    </div>
                                    <div className="transfer-money__value">
                                        {data.transactionDetails?.fund?.name || "-"}
                                    </div>
                                </div>
                                {/* <div className="transfer-money__details-item">
                                    <div className="transfer-money__title">
                                        {t('Charities.country')}
                                    </div>
                                    <div className="transfer-money__value">
                                        {data.transactionDetails?.fund?.country || "-"}
                                    </div>
                                </div>
                                <div className="transfer-money__details-item">
                                    <div className="transfer-money__title">
                                        {t('Charities.address')}
                                    </div>
                                    <div className="transfer-money__value">
                                        {data.transactionDetails?.fund?.address || "-"}
                                    </div>
                                </div> */}
                                <div className="transfer-money__details-item">
                                    <div className="transfer-money__title">
                                        {t('Charities.iban')}
                                    </div>
                                    <div className="transfer-money__value">
                                        {data.transactionDetails?.fund?.iban || "-"}
                                    </div>
                                </div>
                                {data.transactionDetails?.fund?.message ? (
                                    <div className="transfer-money__details-item">
                                        <div className="transfer-money__title">
                                            {t('Charities.message')}
                                        </div>
                                        <div className="transfer-money__value">
                                            {data.transactionDetails?.fund?.message || "-"}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="transfer-money__details-item">
                                        <div className="transfer-money__title">
                                            {t('Charities.reference')}
                                        </div>
                                        <div className="transfer-money__value">
                                            {data.transactionDetails?.fund?.reference || "-"}
                                        </div>
                                    </div>
                                )}
                                <div className="transfer-money__details-item">
                                    <div className="transfer-money__title">
                                        {t('Charities.amount')}
                                    </div>
                                    <div className="transfer-money__value">
                                        {data.transactionDetails?.amount || "-"} EUR
                                    </div>
                                </div>
                                <div className="transfer-money__details-item">
                                    <div className="transfer-money__title">
                                        {t('Charities.status')}
                                    </div>
                                    <div className="transfer-money__value">
                                        {data.transactionDetails?.paymentStatus || "-"}
                                    </div>
                                </div>
                            </div>
                            {!isValid && (
                                <div className='transfer-money__invalid-data'>
                                    {t('Popup.TransferMoney.invalid-data')}
                                </div>
                            )}
                            <div className="transfer-money__buttons">
                                <Button
                                    text={t('Popup.TransferMoney.cancel')}
                                    mode="red"
                                    onClick={handleCancel}
                                />
                                
                                {!isValid ? (
                                    <Button
                                        text={t('Popup.TransferMoney.edit')}
                                        onClick={editFund}
                                    />
                                ) : (
                                    <Button
                                        text={t('Popup.TransferMoney.confirm')}
                                        onClick={handleSubmit}
                                    />
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="transfer-money__desc">
                            <div>
                                {transferStatus === "success" ? (
                                    <>
                                        <div className="transfer-money__details">
                                            <div className="transfer-money__details-item">
                                                <div className="transfer-money__title">
                                                    {t('Charities.archiveId')}
                                                </div>
                                                <div className="transfer-money__value">
                                                    {transaction?.sendMoney?.archiveId || "-"}
                                                </div>
                                            </div>
                                            <div className="transfer-money__details-item">
                                                <div className="transfer-money__title">
                                                    {t('Charities.amount')}
                                                </div>
                                                <div className="transfer-money__value">
                                                    {transaction?.sendMoney?.amount || "-"}
                                                </div>
                                            </div>
                                            <div className="transfer-money__details-item">
                                                <div className="transfer-money__title">
                                                    {t('Charities.status')}
                                                </div>
                                                <div className="transfer-money__value">
                                                    {transaction?.sendMoney?.status || "-"}
                                                </div>
                                            </div>
                                        </div>
                                        <Button
                                            text={t('Popup.TransferMoney.close')}
                                            mode='outline'
                                            onClick={handleCancel}
                                        />
                                    </>
                                ) : (
                                    <div className='transfer-money__invalid-data'>{transferError?.message}</div>
                                )}
                            </div>
                        </div>
                    )}
                </>
            )}
            {detailsError && (
                <div className='transfer-money__invalid-data'>{detailsError?.message}</div>
            )}
        </div>
    )
}

export default TransferMoney