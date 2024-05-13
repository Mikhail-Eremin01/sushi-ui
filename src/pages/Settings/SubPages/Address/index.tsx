import React from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../../../../components/common/Button'
import Input from '../../../../components/common/Input'
import { AddressInput, useCompanyQuery, useEditAddressesMutation } from '../../../../types/graphql'
import { changesMessageVar, userVar } from '../../../../cache/cache'
import { ReactComponent as AddAddressIcon } from '../../../../assets/location-add.svg'
import { useTranslation } from 'react-i18next'
import { COMPANY, ROUTES } from '../../../../graphql/queries'
import Textarea from '../../../../components/common/Textarea'
import { useReactiveVar } from '@apollo/client'
import moment from 'moment'

import './styles.css'

const Address: React.FC = () => {
    let user = useReactiveVar(userVar)

    const { data, loading } = useCompanyQuery({
        variables: {companyId: user?.companyId as string}
    })

    const [editAddress] = useEditAddressesMutation({
        onCompleted() {
            changesMessageVar('success')
            showMessage('success')
        },
        onError(error) {
            console.log(error.message)
            error.message === 'Address is required'
                ? showMessage('requiredField')
                : showMessage('error')
        },
        refetchQueries: [
            {
                query: COMPANY,
                variables: {companyId: user?.companyId as string}
            },
            {
                query: ROUTES,
                variables: { date: moment().format('YYYY-MM-DD') }
            }
        ]
    })
    const [fields, setFields] = React.useState<AddressInput[]>([{address: '', instruction: ''}])
    const navigate = useNavigate()
    const { t } = useTranslation()

    const showMessage = (status: 'success' | 'error' | 'requiredField') => {
        changesMessageVar(status)
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
            });
        setTimeout((id: any) => {
            console.log(id)
            changesMessageVar(null)
        }, 3000)
    }

    function getAddresses(): AddressInput[] {
        return data?.company?.addresses && data?.company?.addresses && Array.isArray(data?.company?.addresses)
            ? data?.company?.addresses?.map((el) => ({
                address: String(el?.address),
                instruction: String(el?.instruction),
            }))
            : [];
    }

    //Set edit fields
    React.useEffect(() => {
        if(data?.company?.addresses) {
            if(data?.company?.addresses?.length > 0) {
                const addresses = getAddresses()
                setFields(addresses)
            } else {
                setFields([])
            }
        }
    }, [data])

    const editField = (value: string, field: "address" | "instruction", index: number) => {
        setFields([...fields.map((elem, i) => {
                if (i === index) {
                    elem[field] = value
                }
                return elem
            })
        ])
    }

    function addressesArraysAreEqual(oldAddresses: AddressInput[], newAddresses: AddressInput[]): boolean {
        if (oldAddresses.length !== newAddresses.length) {
            return false;
        }
    
        for (let i = 0; i < oldAddresses.length; i++) {
            if (oldAddresses[i].address !== newAddresses[i].address || oldAddresses[i].instruction !== newAddresses[i].instruction) {
                return false;
            }
        }
    
        return true;
    }

    if (loading) return <div className="preloader"></div>
    
    return (
        <div>
            <div className='mainContent'>
                {
                    fields?.map((elem, index) => {
                        return (
                            <div 
                                className='address_mainContent'
                                key={index}
                            >
                                <div className='address_title address_container'>
                                    <span className='address_title__title'>{t('Settings.address')} {index + 1}</span>
                                    {
                                        index !== 0 
                                        &&
                                        <div
                                            className='address__delete'
                                            onClick={() => navigate('#delete-address', {state: {
                                                address:fields.filter((elem: any, i: number) => i !== index)
                                            }})}
                                        >
                                        </div>
                                    }
                                </div>
                                
                                <div className='address_container'>
                                    <Input
                                        title={t('Settings.address')}
                                        value={elem?.address || ""}
                                        onChange={(val) => editField(val, 'address', index)}
                                    />
                                </div>
                                <div className='address_container'>
                                    <Textarea  
                                        title={t('Settings.instruction')}
                                        placeholder={t('Settings.instruction-placeholder')}
                                        value={elem?.instruction || ""}
                                        onChange={(val) => editField(val, 'instruction', index)}
                                    />
                                </div>
                                {
                                    index !== fields.length - 1
                                    &&
                                    <div className='border-line'></div>
                                }
                            </div>
                        )
                    })
                }
            </div>
            <div className='btns_container'>
                <Button
                    text={t('Address.add-address')}
                    icon={<AddAddressIcon/>}
                    onClick={ () => navigate('#manage-address') }
                    className='btns_container__btn-addAddress'
                />
                <Button
                    text={t('Address.save')}
                    onClick={() => editAddress({
                        variables: {addresses: fields}
                    })}
                    className='btns_container__btn-saveChanges'
                    disabled={addressesArraysAreEqual(getAddresses(), fields)}
                />
            </div>
        </div>
    )
}

export default Address