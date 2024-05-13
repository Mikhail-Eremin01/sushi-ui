import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useReactiveVar } from '@apollo/client'
import { useMediaQuery } from 'react-responsive'
import { CHARITIES } from '../../graphql/queries'
import { fundEditVar, userVar } from '../../cache/cache'
import { EditFundMutationVariables, useCharityFundsQuery, useDeleteFundMutation } from '../../types/graphql'
import { ReactComponent as AddOperationIcon } from '../../assets/button-add-operation.svg'
import { ReactComponent as PlusIcon } from '../../assets/button-plus.svg'
import { ReactComponent as NoResultIcon } from '../../assets/statistic-none.svg'
import { ReactComponent as DropmenuEditIcon } from '../../assets/dropmenu-edit.svg'
import { ReactComponent as DropmenuDeleteIcon } from '../../assets/dropmenu-delete.svg'
import './styles.css'

const Wrapper = React.lazy(() => import('../../components/common/Wrapper'))
const Button = React.lazy(() => import('../../components/common/Button'))
const DropMenu = React.lazy(() => import('../../components/common/DropMenu'))
const CharityItem = React.lazy(() => import('../../components/CharitiesComponents/CharityItem'))

const Charities: React.FC = () => {
    const [dropmenu, setDropmenu] = React.useState<string>('')    
    const { t } = useTranslation()
    const user = useReactiveVar(userVar)
    const navigate = useNavigate()
    const location = useLocation()
    const isMobile = useMediaQuery({ query: '(max-width: 642px)' })

    const { data, loading } = useCharityFundsQuery({
        skip: !user?.isAdmin
    })

    const [deleteFound] = useDeleteFundMutation({
        onError: e => {
            console.log(e)
        },
        refetchQueries: [{ query: CHARITIES }]
    })

    const edit = (fund: EditFundMutationVariables) => {
        fundEditVar(fund)
        navigate(location.search + '#manage-fund')
    }

    //Redirect to main page
    React.useEffect(() => {
        if (user && !user?.isAdmin) navigate('/')
    }, [user, location, navigate])

    if (loading) return <div className="preloader"/>
    return (
        <>
            <Wrapper>
                <div className="charities__title">
                    <div className="charities__title-text">{t('Charities.title')}</div>
                    { 
                        user?.isAdmin && 
                        <div className="charities__title-buttons">
                            {
                                isMobile ? 
                                    <Button
                                        className="charities__add-button-mobile"
                                        text=""
                                        icon={<PlusIcon/>}
                                        onClick={ () => navigate(location.search + '#manage-fund') }
                                    />
                                : <Button
                                    text={t('Charities.add-button')}
                                    icon={<AddOperationIcon/>}
                                    onClick={ () => navigate(location.search + '#manage-fund') }
                                />
                            }
                        </div>
                    }
                </div>
                {
                    data?.charityFunds && data?.charityFunds.length > 0                    
                    ?   <div className="table-mobile">
                            {
                                data?.charityFunds?.map(el => {
                                    return (
                                        <div key={el?.id} className="charities__table-mobile__item">
                                            <div className="charities__table-mobile__item_mainContent">
                                                <CharityItem
                                                    name={el?.name || ""}
                                                    iban={el?.iban || ""}
                                                    message={el?.message || ""}
                                                    reference={el?.reference || ""}
                                                    country={el?.country || ""}
                                                    address={el?.address || ""}
                                                    createdAt={el?.createdAt || ""}
                                                />
                                            </div>                                            
                                            <div>
                                                <div className="table-mobile__menu">
                                                    <div className="table-mobile__menu-button" onClick={ () => setDropmenu(el?.id || '') }></div>
                                                    {
                                                        dropmenu === `${el?.id}` &&
                                                        <React.Suspense fallback={''}>
                                                            <DropMenu 
                                                                schema={[
                                                                    { 
                                                                        icon: <DropmenuEditIcon/>, 
                                                                        name: t('Charities.edit'),
                                                                        handler: () => edit({
                                                                            fundId: el?.id || '',
                                                                            name: el?.name || '',
                                                                            iban: el?.iban || '', 
                                                                            country: el?.country || '', 
                                                                            message: el?.message || "",
                                                                            reference: el?.reference || "", 
                                                                            address: el?.address || "",
                                                                        })
                                                                    }, {
                                                                        icon: <DropmenuDeleteIcon/>, 
                                                                        name: t('Charities.delete'), 
                                                                        handler: () => deleteFound({ variables: {
                                                                            fundId: el?.id || ""
                                                                        }})
                                                                    }
                                                                ]} 
                                                                setDropmenu={setDropmenu}
                                                            />
                                                        </React.Suspense>
                                                    }
                                                </div>
                                            </div>
                                            
                                        </div>
                                )})
                            }
                        </div>                        
                    : <div className="charities__noresults">
                        <NoResultIcon className="charities__noresults-image"/>
                        <div className="charities__noresults-title">{t('Charities.noresult-title')}</div>
                    </div>

                }
            </Wrapper>
        </>
    )
}

export default Charities