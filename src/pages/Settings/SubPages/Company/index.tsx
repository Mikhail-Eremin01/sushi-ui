import { useReactiveVar } from '@apollo/client'
import React, { useState } from 'react'
import Button from '../../../../components/common/Button'
import Input from '../../../../components/common/Input'
import { useCompanyQuery, useEditCompanyMutation } from '../../../../types/graphql'
import { userVar, changesMessageVar } from '../../../../cache/cache'
import { useTranslation } from 'react-i18next'

import './styles.css'

const Company: React.FC = () => {
    const { t } = useTranslation()
    let user = useReactiveVar(userVar)

    const { data, loading } = useCompanyQuery({
        variables: {companyId: user?.companyId as string}
    })
    const [companyName, setCompanyName] = useState<string>('')
    const [editCompany] = useEditCompanyMutation({
        onCompleted() {
            showMessage('success')
        },
        onError(error) {
            console.log(error.message)
            error.message === 'Name of company if required field'
            ?
            showMessage('requiredField')
            :
            showMessage('error')
        },
    })   
    const showMessage = (status: 'success' | 'error' | 'requiredField') => {
        changesMessageVar(status)
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
            });
        setTimeout(() => {
            changesMessageVar(null)
        }, 3000)
    }

    React.useEffect(() => {
        if (data)
        setCompanyName(data.company?.name!)
    }, [data])

    if (loading) return <div className="preloader"></div>


    return (
        <div>
            <div className='personalInfo_mainContainer'>
                <div className='personalInfo_mainContent'>
                    <Input
                        className='personalInfo__input'
                        type="text"
                        title={t('Company.tab')}
                        value={companyName}
                        onChange={val => setCompanyName(val)}
                    />
                </div>
                <div className='personalInfo_btn-saveChanges'>
                    <Button
                        text={t('Settings.save')}
                        onClick={() => editCompany({
                            variables: {
                                name: companyName
                            }
                        })}
                        className='btn_container__btn-saveChanges'
                    />
                </div>
            </div>
        </div>
    )
}

export default Company