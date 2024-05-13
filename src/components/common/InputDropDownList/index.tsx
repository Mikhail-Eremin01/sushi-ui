import React from 'react'
import classNames from 'classnames'

import './styles.css'
import _ from 'lodash'

interface InputDropDownListProps {
    className?: string
    title: string
    placeholder?: string
    type?: 'text' | 'number' | 'date' | 'time' | 'datetime-local' 
    value: string
    onChange(val: string): void
    onKeyPress?(e: React.KeyboardEvent<HTMLInputElement>): void
    icon?: React.ReactNode
    error?: boolean,
    schema: ISelectItem[]
}

export interface ISelectItem {
    name: string
    value: string
    selected: boolean
}

const InputDropDownList: React.FC<InputDropDownListProps> = props => {
    const [isFocused, setIsFocused] = React.useState<boolean>(false)

    const change = (newValue: string) => {
        const newItems = _.cloneDeep(props.schema)
        const item = newItems.find(el => el.value === newValue)
        if (item) {
            newItems.forEach(el => { el.selected = false })
            item.selected = true
        }
        props.onChange(newValue)
        setIsFocused(false)
    }

    return (
        <div 
            className={
                classNames(`input ${props.className}`, 
                { 
                    "input--show-title": !isFocused && ((!isFocused && props.value !== '') || props.value !== ''), 
                    'input--focused': isFocused, 
                    'input--error': props?.error 
                })}
        >
            <div className="input__wrap">
                <div className="input__title">{props.title}</div>
                <input 
                    className="input__input" 
                    type={props?.type}
                    name="name" 
                    placeholder={props.placeholder} 
                    value={props.value} 
                    onChange={ e => props.onChange(e.target.value)}
                    onFocus={ e => {
                        setIsFocused(true) }
                    }
                    onBlur={ e => {
                        setIsFocused(false) }
                    }
                    onKeyPress={e => { if (props.onKeyPress) props.onKeyPress(e) }}
                    autoComplete="off"
                />
                { props?.icon && <div className="input__icon">{props.icon}</div> }
                {
                    isFocused &&
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

InputDropDownList.defaultProps = {
    className: '',
    error: false,
    type: 'text'
}

export default InputDropDownList