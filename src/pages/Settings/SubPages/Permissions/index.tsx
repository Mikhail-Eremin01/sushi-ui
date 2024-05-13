import { useReactiveVar } from '@apollo/client'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import { changesMessageVar, userVar } from '../../../../cache/cache'
import Button from '../../../../components/common/Button'
import Checkbox from '../../../../components/common/Checkbox'
import { useEditPermissionsMutation, usePermissionsQuery } from '../../../../types/graphql'
import { PERMISSIONS } from '../../../../graphql/queries'
import './styles.css'

const Permissions: React.FC = () => {

    const [emailNotifications, setEmailNotifications] = useState<string[]>([])
    const [mentionCompany, setMentionCompany] = useState<string[]>([])
    const {data, loading} = usePermissionsQuery()
    const [editPermissions] = useEditPermissionsMutation({
        onCompleted(data) {
            showMessage('success')
        },
        onError(error) {
            console.log(error.message)
            error.message === 'Email permissions and mention company is required'
            ?
            showMessage('requiredField')
            :
            showMessage('error')
        },
        refetchQueries: () => {
            return [{
                query: PERMISSIONS
            }]
        }
    })
    const { t } = useTranslation()
    const user = useReactiveVar(userVar)
    const navigate = useNavigate()
    const location = useLocation()

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
    
    //Redirect to authorize page
    React.useEffect(() => {
        if (user === null) navigate('/', { state: { referer: location.pathname }})
    }, [user, location, navigate])

    //Set permissions fields
    React.useEffect(() => {
        if (data)
        setEmailNotifications(data?.permissions?.emailNotifications as string[])
        setMentionCompany(data?.permissions?.mentionCompany as string[])

    }, [data])

    if (loading) return <div className="preloader"></div>

    return (
        <div>
            <div className='permissions-mainContainer'>
                <div className='permissions-mainContent'>
                    <div className='permissions-container permissions-emailNotifications'>
                        <p className='permissions__title permissions-emailNotifications__title'>
                            {t('Permissions.email-notifications.title')}
                        </p>
                        <div className='permissions_item'>
                            <Checkbox id="new_features" title={t('Permissions.email-notifications.new-features-released')} name="funds" checkboxValue="new_features_released" value={emailNotifications || []} onChange={ val => setEmailNotifications([ ...val ] ) } />
                        </div>
                        <div className='permissions_item'>
                            <Checkbox id="new_blog_posts" title={t('Permissions.email-notifications.new-blog-posts')} name="funds" checkboxValue="new_blog_posts" value={emailNotifications || []} onChange={ val => setEmailNotifications([ ...val ] ) } />
                        </div>
                        <div className='permissions_item'>
                            <Checkbox id="payments_made" title={t('Permissions.email-notifications.payments-made')} name="funds" checkboxValue="payments_made" value={emailNotifications || []} onChange={ val => setEmailNotifications([ ...val ] ) } />
                        </div>
                    </div>
                    <div className='permissions-container permissions-mentionCompany'>
                        <p className='permissions__title permissions-mentionCompany__title'>
                            {t('Permissions.mention-company.title')}
                        </p>
                        <div className='permissions_item'>
                            <Checkbox id="41" title={t('Permissions.mention-company.mention-company-website')} name="funds" checkboxValue="company_logo_on_websiteBlog" value={mentionCompany || []} onChange={ val => setMentionCompany([ ...val ] ) } />
                        </div>
                        <div className='permissions_item'>
                            <Checkbox id="51" title={t('Permissions.mention-company.mention-company-linkedin')} name="funds" checkboxValue="mention_company_in_blogLinkedin" value={mentionCompany || []} onChange={ val => setMentionCompany([ ...val ] ) } />
                        </div>
                    </div>
                </div>

                <div className='permissions-btnContainer'>
                    <Button
                        text={t('Settings.save')}
                        onClick={() => editPermissions({
                            variables: {
                                emailNotifications,
                                mentionCompany
                            }
                        })}
                        className='permissions-btnContainer__saveChanges'
                    />
                </div>
            </div>
        </div>
    )
}

export default Permissions