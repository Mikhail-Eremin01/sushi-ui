import React from 'react'
import classNames from 'classnames'
import { useLocation, useNavigate } from 'react-router-dom'
import useOnClickOutside from  '../../../hooks/useOnClickOutside'
import { transferMoneyVar  } from '../../../cache/cache'

import './styles.css'

interface IPopupProps {
    children?: React.ReactNode
    overflow?: boolean
}

const Popup: React.FC<IPopupProps> = props => {
    const wrapRef = React.useRef<HTMLDivElement | null>(null)
    const navigate = useNavigate()
    const location = useLocation()

    useOnClickOutside(wrapRef, () => close())

    const close = () => {
        navigate(location.pathname+location.search)
        transferMoneyVar(null)
    }

    return (
        <div className={classNames("popup", { "popup--overflow": props?.overflow })}>
            <div className="popup__overlay"></div>
            <div ref={wrapRef} className="popup__wrap">
                <div onClick={ () => close() } className="popup__close" />
                {props.children}
            </div>
        </div>
    )
}

export default Popup