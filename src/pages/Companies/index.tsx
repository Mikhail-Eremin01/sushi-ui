import React from 'react'
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useReactiveVar } from '@apollo/client'
import { userVar } from '../../cache/cache'
import { useCompaniesQuery } from '../../types/graphql'
import { ReactComponent as NoResultIcon } from '../../assets/statistic-none.svg'
import './styles.css'

const Wrapper = React.lazy(() => import('../../components/common/Wrapper'))
const CompanyItem = React.lazy(() => import('../../components/CompaniesComponents/CompanyItem'))
const Pagination = React.lazy(() => import('../../components/common/Pagination'))

export const LIMIT = 10

const Companies: React.FC = () => {
    const { t } = useTranslation()
    const user = useReactiveVar(userVar)
    const navigate = useNavigate()
    const location = useLocation()
    const [searchParams] = useSearchParams({})
    const limit = LIMIT
    const page = (Number(searchParams.get('page')) === 0) ? 1 : Number(searchParams.get('page'))  
    const [offset, setOffset] = React.useState<number>((page - 1) * limit)
    const { data, loading } = useCompaniesQuery({variables: {offset, limit}})

    //Redirect to authorize page
    React.useEffect(() => {
        if (user === null) navigate('/', { state: { referer: location.pathname }})
    }, [user, location, navigate])

    if (loading) return <div className="preloader"></div>
    return (
        <Wrapper>               
            {
                user?.isAdmin 
                ? <>
                    <div className="companies__title">
                        <div className="companies__title-text">{t('Companies.title')}</div>                            
                    </div>
                    {
                        data?.companies  && data.companies.companies && data?.companies.companies.length  &&                  
                        <div className="table-mobile">
                            {
                                data?.companies.companies.map(el => {
                                    return (
                                        <div key={el?.id} className="companies__table__item">
                                            <div className="companies__table__item_mainContent">
                                                <CompanyItem company={el || {}} />
                                            </div>
                                        </div>
                                )})
                            }
                        </div>
                    }
                    {
                        data?.companies?.total && (data.companies.total > limit)
                        &&
                        <Pagination limit={limit} setOffset={setOffset} total={data?.companies.total || 0} page={page} />
                    }
                </>
                : <div className="companies__accessdenied">
                    <NoResultIcon className="companies__accessdenied-image"/>
                    <div className="companies__accessdenied-title">{t('Companies.access-denied-title')}</div>                    
                </div>
            }
            
        </Wrapper>
        
    )
}

export default Companies