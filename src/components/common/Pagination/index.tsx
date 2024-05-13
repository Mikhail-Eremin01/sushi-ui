import React from "react"
import { useMediaQuery } from 'react-responsive'
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom'
import { ReactComponent as Arrow } from "../../../assets/arrow-left.svg"
import "./styles.css"

interface IPaginationProps {
    page: number
    limit: number
    total: number
    setOffset(offset: number): void
}

const Pagination: React.FC<IPaginationProps> = props => {
    const { page, limit, total, setOffset } = props
    const navigate = useNavigate()
    const location = useLocation()
    const [searchParams] = useSearchParams({})
    const countPage = Math.ceil(total/limit)
    const isMobile = useMediaQuery({ query: "(max-width: 642px)"})
    const [pageNumber, setPageNumber] = React.useState<string | number>(page)
    const rangeLeft: (number | string)[] = page === 1
        ? [] 
        : page === 2
            ? [1]
            : page === 3 
                ? [1, 2]
                : page === 4
                    ? [1, 2, 3]
                    : [1, '...', page - 1]
    const rangeRight: (number | string)[] = page === countPage
        ? [] 
        : page === countPage - 1
            ? [countPage]
            : page === countPage - 2 
                ? [countPage - 1, countPage]
                : page === countPage - 3
                    ? [countPage - 2, countPage - 1, countPage]
                    : [page + 1, '...', countPage]
    const rangeAll: (number | string)[] = [...rangeLeft, page, ...rangeRight]
    const incPage = () => {
        if (page < countPage) {
            searchParams.set('page', (page + 1).toString())
            navigate(location.pathname+'?'+searchParams.toString())
            setOffset(page * limit)
        }
    }
    const decPage = () => {
        if (page > 2) {
            searchParams.set('page', (page - 1).toString())
            navigate(location.pathname+'?'+searchParams.toString())
            setOffset((page-2) * limit)
        }
    }
    const gotoPage = (pageNum:number | string) => {
        if (typeof pageNum === "number" && pageNum > 0 && pageNum <= countPage) {
            searchParams.set('page', pageNum.toString())
            navigate(location.pathname+'?'+searchParams.toString())
            setOffset((pageNum-1) * limit)
        }
    }

    const getClassNamesForPage = (pageNumber: number | string) => {
        return "pagination__item " + (pageNumber === '...' 
            ? "pagination__item-dots" 
            : (pageNumber === page ? "pagination__item-active" : ""))
    }
    const onInput = (e: any) => {
        const val = e.target.value 
        const prev = pageNumber
        setPageNumber(val)
        if (val && Number(val)) {            
            gotoPage(Number(val))
            if (Number(val) > countPage || Number(val) < 1) {
                setPageNumber(prev)
            }
        }
        
    }
    React.useEffect(() => {
        setPageNumber(page)
    }, [page])    
    return (
        <div className="pagination">
            { page>1 && <div className="pagination__item" onClick={decPage}>
                <Arrow/>
            </div>}
            { isMobile
                ? <div className="pagination-mobile__wrap">
                    <input type="number" value={pageNumber || ''} onInput={val=> onInput(val)}/>
                    <div className="pagination-mobile__count">
                        /{countPage}
                    </div>                    
                  </div>
                : rangeAll.map((el, ind) => <div className={getClassNamesForPage(el)} key={el.toString()+ind} onClick={() => gotoPage(el)}>
                {el}
            </div>)
            }        
                
            { page<countPage && <div className="pagination__item pagination__item-right" onClick={incPage}>
                <Arrow/>
            </div>}
            
        </div>
   )
}

export default Pagination