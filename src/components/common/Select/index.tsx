import React from 'react'
import classNames from 'classnames'
import _ from 'lodash'
import useOnClickOutside from  '../../../hooks/useOnClickOutside'

import { ReactComponent as ArrowIcon } from '../../../assets/select-arrow.svg'
import './styles.css'

export interface ISelectProps {
    schema: ISelectItem[]
    className?: string
    title: string
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

const Select: React.FC<ISelectProps> = props => {
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
        <div className={classNames("select", { [`${props?.className}`]: props?.className, "select--disabled": props?.disabled, "select--error": props?.error })}>
            <div ref={wrapRef} className="select__wrap">
                <div className="select__selected" onClick={ () => { if (!props?.disabled) setIsOpened(!isOpened) } }>
                    <div className="select__title">{props.title}</div>
                    {activeItem?.name}
                    <ArrowIcon className={classNames("select__arrow", { "select__arrow--opened": isOpened })} />
                </div>
                {
                    isOpened &&
                    <div className="select__list">
                        {
                            props.schema.map(el => {
                                return (
                                    <div
                                        key={el.value}
                                        className={classNames("select__item", { "select__item--active": el.selected })}
                                        onClick={ () => change(el.value) }
                                    >
                                        {el.name}
                                    </div>
                                )
                            })
                        }
                    </div>
                }
            </div>
        </div>
    )
}

export default Select