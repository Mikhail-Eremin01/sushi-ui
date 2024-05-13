import React from 'react'
import classNames from 'classnames'
import _ from 'lodash'
import useOnClickOutside from  '../../../hooks/useOnClickOutside'

import { ReactComponent as ArrowIcon } from '../../../assets/select-arrow.svg'
import './styles.css'

export interface ISelectFileProps {
    schema: ISelectItem[]
    className?: string
    value: string
    onChange(val: string): void
    error?: boolean
    disabled?: boolean
}

export interface ISelectItem {
    name: string
    value: string
    selected: boolean
}

const SelectFile: React.FC<ISelectFileProps> = props => {
    const wrapRef = React.useRef<HTMLDivElement | null>(null)
    const [isOpened, setIsOpened] = React.useState<boolean>(false)

    useOnClickOutside(wrapRef, () => setIsOpened(false))

    const change = (newValue: string) => {
        const newItems = _.cloneDeep(props.schema)
        const item = newItems.find(el => el.value === newValue)
        if (item) {
            newItems.forEach(el => { el.selected = false })
            item.selected = true
        }
        props.onChange(newValue)
        setIsOpened(false)
    }

    const activeItem = props.schema.find(el => el.value === props.value)

    return (
        <div className={classNames("selectFile", { [`${props?.className}`]: props?.className, "selectFile--disabled": props?.disabled, "selectFile--error": props?.error })}>
            <div ref={wrapRef} className="selectFile__wrap">
                <div className="selectFile__selected" onClick={ () => { if (!props?.disabled) setIsOpened(!isOpened) } }>                    
                    {activeItem?.name}
                    <ArrowIcon className={classNames("selectFile__arrow", { "selectFile__arrow--opened": isOpened })} />
                </div>
                {
                    isOpened &&
                    <div className="selectFile__list">
                        {
                            props.schema.map(el => {
                                return (
                                    <div key={el.value} className={classNames("selectFile__item", { "selectFile__item--active": el.selected })} onClick={ () => change(el.value) }>{el.name}</div>
                                )
                            })
                        }
                    </div>
                }
            </div>
        </div>
    )
}

export default SelectFile