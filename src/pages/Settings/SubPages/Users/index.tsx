import React from 'react'
import { useNavigate, useLocation, Link, Outlet } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useReactiveVar } from '@apollo/client'
import { useMediaQuery } from 'react-responsive'
import { useUsersQuery, EditUserMutationVariables, useDeleteUserMutation } from '../../../../types/graphql'
import { cache, changesMessageVar, userEditVar, userVar } from '../../../../cache/cache'

import { ReactComponent as AddUserIcon } from '../../../../assets/user-add.svg'
import { ReactComponent as PlusIcon } from '../../../../assets/button-plus.svg'
import { ReactComponent as DropmenuEditIcon } from '../../../../assets/dropmenu-edit.svg'
import { ReactComponent as DropmenuDeleteIcon } from '../../../../assets/dropmenu-delete.svg'
import './styles.css'

const Button = React.lazy(() => import('../../../../components/common/Button'))
const DropMenu = React.lazy(() => import('../../../../components/common/DropMenu'))

const Users: React.FC = () => {
    const [dropmenu, setDropmenu] = React.useState<string>('')
    const user = useReactiveVar(userVar)
    const navigate = useNavigate()
    const location = useLocation()
    const { t } = useTranslation()
    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 767.98px)' })
    const isMobile = useMediaQuery({ query: '(max-width: 575.98px)' })

    const { data, loading } = useUsersQuery()

    const [deleteUser] = useDeleteUserMutation({
        onCompleted: data => {
            if (data?.deleteUser) {
                cache.evict({ id: `User:${data?.deleteUser.id}` })
                showMessage('success')
            }
        },
        onError(error) {
            console.log(error.message)
            showMessage('error')
        },
    })

    const edit = (user: EditUserMutationVariables) => {
        userEditVar(user)
        navigate('#manage-user')
    }

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

    if (loading) return <div className="preloader"></div>

    return (
        <div className='users-mainContainer'>
            {
                isTabletOrMobile
                ? <div className="table-mobile">
                    {
                        data?.users?.map(el => {
                            return (
                                <div key={el?.id} className="table-mobile__item">
                                    
                                    <div className="table-mobile__menu">
                                        <div className="table-mobile__menu-button" onClick={ () => setDropmenu(el?.id || '') }></div>
                                        {
                                            dropmenu === `${el?.id}` &&
                                            <React.Suspense fallback={''}>
                                                <DropMenu 
                                                    schema={
                                                        (
                                                            data?.users && data.users.length > 1 
                                                            && 
                                                            el?.id !== user?.id
                                                        ) 
                                                         ?
                                                        [
                                                            { 
                                                                icon: <DropmenuEditIcon/>, 
                                                                name: t('Users.edit'), 
                                                                handler: () => edit({
                                                                    userId: el?.id || '', 
                                                                    name: el?.name || '', 
                                                                    email: el?.email || '', 
                                                                    phone: el?.phone || '' 
                                                                })
                                                            }, {
                                                                icon: <DropmenuDeleteIcon/>, 
                                                                name: t('Users.delete'), 
                                                                handler: () => deleteUser({
                                                                    variables: { userId: el?.id || '' } 
                                                                }) 
                                                        }
                                                        ]
                                                         : 
                                                        [
                                                            { 
                                                                icon: <DropmenuEditIcon/>, 
                                                                name: t('Users.edit'), 
                                                                handler: () => edit({
                                                                    userId: el?.id || '', 
                                                                    name: el?.name || '', 
                                                                    email: el?.email || '', 
                                                                    phone: el?.phone || '' 
                                                                })
                                                            }
                                                        ]
                                                    } 
                                                    setDropmenu={setDropmenu}
                                                />
                                            </React.Suspense>
                                        }
                                    </div>

                                    <div className="table-mobile__row">
                                        <div className="table-mobile__col">
                                            <div className="table-mobile__title">{t('Users.name')}</div>
                                            <div className="table-mobile__value">{el?.name}</div>
                                        </div>
                                        
                                    </div>
                                    <div className="table-mobile__row">
                                        <div className="table-mobile__col">
                                            <div className="table-mobile__title">{t('Users.email')}</div>
                                            <div className="table-mobile__value email">{el?.email}</div>
                                        </div>
                                        <div className="table-mobile__col">
                                            <div className="table-mobile__title">{t('Users.phone')}</div>
                                            <div className="table-mobile__value">{el?.phone}</div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
                : <div className="users__table">
                    <table>
                        <thead>
                            <tr>
                                <th>{t('Users.name')}</th>
                                <th>{t('Users.email')}</th>
                                <th>{t('Users.phone')}</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                data?.users?.map(el => {
                                    return (
                                        <tr key={el?.id}>
                                            <td>{el?.name}</td>
                                            <td>{el?.email}</td>
                                            <td>{el?.phone}</td>
                                            <td>
                                                <div className="users__buttons">
                                                    <div
                                                        className="users__edit"
                                                        onClick={ () => edit(
                                                            {
                                                                userId: el?.id || '',
                                                                name: el?.name || '',
                                                                email: el?.email || '',
                                                                phone: el?.phone || '' 
                                                            }
                                                        )}
                                                    >
                                                    </div>
                                                    { 
                                                        data?.users && data.users.length > 1 
                                                        && 
                                                        el?.id !== user?.id
                                                        &&
                                                        <div
                                                            className="users__delete"
                                                            onClick={ () => deleteUser({
                                                                variables: { userId: el?.id || '' }
                                                            })}
                                                        >
                                                        </div>
                                                    }
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>
            }
            <div className="users__title">
                <div className="users__title-buttons">
                     <Button className='users__add-btn' text={t('Users.add-button')} icon={<AddUserIcon/>} onClick={ () => navigate('#manage-user') }/>
                </div>
            </div>
        </div>
    )
}

export default Users