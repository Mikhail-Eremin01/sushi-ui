import classNames from 'classnames'
import React from 'react'
import useOnClickOutside from  '../../../hooks/useOnClickOutside'

import './styles.css'

export interface IDropmenuSchema {
    icon?: React.ReactNode
    name: string
    handler(...args: any): void
}

interface IDropMenuProps {
    schema: IDropmenuSchema[]
    setDropmenu (id: string): void
}

const DropMenu: React.FC<IDropMenuProps> = props => {
    const wrapRef = React.useRef<HTMLDivElement | null>(null)

    useOnClickOutside(wrapRef, () => props.setDropmenu(''))

    return (
        <div className="dropmenu">
            <div ref={wrapRef} className="dropmenu__wrap">
                {
                    props.schema.map(el => {
                        return (
                            <div key={el.name} className={classNames("dropmenu__item", { "dropmenu__item--icon": el?.icon })} onClick={ () => { el.handler(); props.setDropmenu(''); } }>
                                { el?.icon && el?.icon }
                                {el.name}
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default DropMenu