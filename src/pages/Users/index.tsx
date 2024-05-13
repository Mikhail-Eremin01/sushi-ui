import React from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useReactiveVar } from '@apollo/client'
import { useMediaQuery } from 'react-responsive'
import { useUsersQuery, EditUserMutationVariables, useDeleteUserMutation } from '../../types/graphql'
import { cache, userEditVar, userVar } from '../../cache/cache'

import { ReactComponent as AddUserIcon } from '../../assets/button-add-user.svg'
import { ReactComponent as PlusIcon } from '../../assets/button-plus.svg'
import { ReactComponent as DropmenuEditIcon } from '../../assets/dropmenu-edit.svg'
import { ReactComponent as DropmenuDeleteIcon } from '../../assets/dropmenu-delete.svg'
import './styles.css'

const Wrapper = React.lazy(() => import('../../components/common/Wrapper'))
const Head = React.lazy(() => import('../../components/common/Head'))
const Button = React.lazy(() => import('../../components/common/Button'))
const DropMenu = React.lazy(() => import('../../components/common/DropMenu'))

const Users: React.FC = props => {
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
            }
        },
        onError: e => {
            console.log(e)
        }
    })

    const edit = (user: EditUserMutationVariables) => {
        userEditVar(user)
        navigate('#manage-user')
    }

    //Redirect to authorize page
    React.useEffect(() => {
        if (user === null) navigate('/', { state: { referer: location.pathname }})
    }, [user, location, navigate])

    if (loading) return <div className="preloader"></div>

    return (
        <div className="users">
            <Wrapper>
                <div className="users__title">
                    <div className="users__title-text">{t('Users.title')}</div>
                    <div className="users__title-buttons">
                        {
                            isMobile
                            ? <Button className="users__add-button-mobile" text="" icon={<PlusIcon/>} onClick={ () => navigate('#manage-user') }/>
                            : <Button text={t('Users.add-button')} icon={<AddUserIcon/>} onClick={ () => navigate('#manage-user') }/>
                        }
                    </div>
                </div>

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
                                                        schema={[
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
                                                        ]} 
                                                        setDropmenu={setDropmenu}
                                                    />
                                                </React.Suspense>
                                            }
                                        </div>

                                        <div className="table-mobile__row">
                                            <div className="table-mobile__col">
                                                <div className="table-mobile__title">ID</div>
                                                <div className="table-mobile__value">{el?.id}</div>
                                            </div>
                                            <div className="table-mobile__col">
                                                <div className="table-mobile__title">{t('Users.name')}</div>
                                                <div className="table-mobile__value">{el?.name}</div>
                                            </div>
                                        </div>
                                        <div className="table-mobile__row">
                                            <div className="table-mobile__col">
                                                <div className="table-mobile__title">{t('Users.email')}</div>
                                                <div className="table-mobile__value">{el?.email}</div>
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
                                    <th>ID</th>
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
                                                <td className="users__id">{el?.id}</td>
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
                
            </Wrapper>
        </div>
    )
}

export default Users