import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useLocation } from 'react-router-dom'
import { useReactiveVar } from '@apollo/client'
import { userVar, errorsVar, successErrorType, fundEditVar } from '../../cache/cache'
import {
    EditFundMutationVariables,
    useEditFundMutation,
    useAddFundMutation
} from '../../types/graphql'
import { CHARITIES } from '../../graphql/queries'
import { setError } from '../../misc/common'

import './styles.css'

const Input = React.lazy(() => import('../../components/common/Input'))
const Button = React.lazy(() => import('../../components/common/Button'))
const ErrorMessage = React.lazy(() => import('../../components/common/ErrorMessage'))
const Radio = React.lazy(() => import('../../components/common/Radio'))

const ManageFund: React.FC = () => {
    const [type, setType] = React.useState<"reference" | "message">("reference");
    const [fields, setFields] = React.useState<EditFundMutationVariables>({
        fundId: "",
        name: "",
        iban: "",
        address: "",
        country: "",
        message: "",
        reference: ""
    });

    const { t } = useTranslation()
    const navigate = useNavigate()
    const location = useLocation()
    const user = useReactiveVar(userVar)
    const editFields = useReactiveVar(fundEditVar)
    let errors = useReactiveVar(errorsVar)

    const [updateFund] = useEditFundMutation({
        onCompleted: (data) => {
            if (data) {
                fundEditVar(null)
                navigate(location.pathname+location.search)
            }
        },
        onError: err => {
            console.log('UPDATE FUND ERROR', err)
        },
        refetchQueries: [{ query: CHARITIES }]
    })
     
    const [addFund] = useAddFundMutation({
        onCompleted: (data) => {
            if (data?.addFund) {
                fundEditVar(null)
                navigate(location.pathname+location.search)
            }
        },
        onError: err => {
            console.log('ADD FUND ERROR', err)
        },
        refetchQueries: [{ query: CHARITIES }]
    })

    //Redirect to auth
    React.useEffect(() => {
        if (user === null || !user?.isAdmin) {
            navigate('/', { replace: true })
        }
    }, [ user, navigate ])  
    
    //Set edit fields
    React.useEffect(() => {
        if (editFields !== null) {
            setFields(editFields)
            setType(editFields.reference ? "reference" : "message")
        }
    }, [editFields])

    const title = (editFields === null) ? t('Popup.ManageFund.add-title') : t('Popup.ManageFund.edit-title')
    const button = (editFields === null) ? t('Popup.ManageFund.add-button') : t('Popup.ManageFund.edit-button')
            
    const submit = async () => {        
        errors = errorsVar([])
        const newErrors: successErrorType[] = []
        
        const nameLength = (fields?.name).trim().length;
        if (nameLength === 0) {
            newErrors.push({ place: 'manage-fund.name', message: t('errors.name-required') })
        }
        if (nameLength > 70) {
            newErrors.push({ place: 'manage-fund.name', message: t('errors.name-length') })
        }

        // const countryLength = (fields?.country).trim().length;
        // if (countryLength === 0) {
        //     newErrors.push({ place: 'manage-fund.country', message: t('errors.country-required') })
        // }
        // if (countryLength > 3) {
        //     newErrors.push({ place: 'manage-fund.country', message: t('errors.country-length') })
        // }

        // const address = fields?.address?.trim();
        // if (address.length === 0) {
        //     newErrors.push({ place: 'manage-fund.address', message: t('errors.address-required') })
        // }
        
        // if (address.split(" ").length < 2) {
        //     newErrors.push({ place: 'manage-fund.address', message: t('errors.address-length') })
        // }

        const ibanLength = (fields?.iban).trim().length;
        if (ibanLength === 0) {
            newErrors.push({ place: 'manage-fund.iban', message: t('errors.iban-required') })
        }
        if (ibanLength > 34) {
            newErrors.push({ place: 'manage-fund.iban', message: t('errors.iban-length') })
        }

        const messageLength = (fields?.message || "").trim().length;
        if (type === "message" && messageLength === 0) {
            newErrors.push({ place: 'manage-fund.message', message: t('errors.message-required') })
        }
        if (type === "message" && messageLength > 140) {
            newErrors.push({ place: 'manage-fund.message', message: t('errors.message-length') })
        }

        const refLength = (fields?.reference || "").trim().length;
        if (type === "reference" && refLength === 0) {
            newErrors.push({ place: 'manage-fund.reference', message: t('errors.reference-required') })
        }
        if (type === "reference" && (refLength > 25) ) {
            newErrors.push({ place: 'manage-fund.reference', message: t('errors.reference-length') })
        }
                     
        if (newErrors.length === 0) {
            if (type === "message") {
                delete fields.reference;
            } else {
                delete fields.message;
            }
            (editFields === null)
                ? addFund({ variables: { ...fields } })                 
                : updateFund({ variables: { ...fields } })
        } else {
            errorsVar(setError(errors, newErrors))
        }        
        
    }
    const allErrors = errors.filter(el => [
        'manage-fund.name',
        // 'manage-fund.country',
        // 'manage-fund.address',
        'manage-fund.iban',
        'manage-fund.message',
        'manage-fund.reference'

    ].includes(el?.place || ''))
    const nameError = errors.find(el => el?.place === 'manage-fund.name' )
    // const countryError = errors.find(el => el?.place === 'manage-fund.country' )
    // const addressError = errors.find(el => el?.place === 'manage-fund.address' )
    const ibanError = errors.find(el => el?.place === 'manage-fund.iban' )
    const messageError = errors.find(el => el?.place === 'manage-fund.message' )
    const referenceError = errors.find(el => el?.place === 'manage-fund.reference' )
    
    return (
        <div className="manage-fund">
            <div className="manage-fund__title">{title}</div>
            {
                allErrors.length > 0 &&
                    <ErrorMessage className="manage-fund__error" errors={allErrors} />
            }
            <Input 
                className="manage-fund__input" 
                title={t('Popup.ManageFund.name')} 
                placeholder={t('Popup.ManageFund.name-placeholder')} 
                value={fields?.name} 
                onChange={ val => setFields({ ...fields, name: val })}
                error={!!nameError}
            />
            {/* <div className="manage-fund__groupInput">
                <Input 
                    className="manage-fund__input manage-fund__input--country" 
                    title={t('Popup.ManageFund.country')} 
                    placeholder={t('Popup.ManageFund.country-placeholder')} 
                    value={fields?.country} 
                    onChange={ val => setFields({ ...fields, country: val })}
                    error={!!countryError}
                />
                <Input 
                    className="manage-fund__input manage-fund__input--address" 
                    title={t('Popup.ManageFund.address')} 
                    placeholder={t('Popup.ManageFund.address-placeholder')} 
                    value={fields?.address} 
                    onChange={ val => setFields({ ...fields, address: val })}
                    error={!!addressError}
                />
            </div> */}

            <Input 
                className="manage-fund__input" 
                title={t('Popup.ManageFund.iban')} 
                placeholder={t('Popup.ManageFund.iban-placeholder')} 
                value={fields?.iban} 
                onChange={ val => setFields({ ...fields, iban: val })}
                error={!!ibanError}
            />
            <div className="manage-fund__radio">
                <Radio
                    id="reference"
                    title={t('Popup.ManageFund.type-reference')}
                    name="type"
                    radioValue="reference"
                    value={type}
                    onChange={ () => setType('reference') }
                />
                <Radio
                    id="message"
                    title={t('Popup.ManageFund.type-message')}
                    name="type"
                    radioValue="message"
                    value={type}
                    onChange={ () => setType('message') }
                />
            </div>
            {type === "reference" ? (
                <Input 
                    className="manage-fund__input" 
                    title={t('Popup.ManageFund.reference')} 
                    placeholder={t('Popup.ManageFund.reference-placeholder')} 
                    value={fields?.reference || ""} 
                    onChange={ val => setFields({ ...fields, reference: val })}
                    error={!!referenceError}
                />
            ) : (
                <Input 
                    className="manage-fund__input" 
                    title={t('Popup.ManageFund.message')} 
                    placeholder={t('Popup.ManageFund.message-placeholder')} 
                    value={fields?.message || ""} 
                    onChange={ val => setFields({ ...fields, message: val })}
                    error={!!messageError}
                />
            )}
            <Button text={button} className="manage-fund__btn" onClick={ () => submit() } />
        </div>
    )
}

export default ManageFund