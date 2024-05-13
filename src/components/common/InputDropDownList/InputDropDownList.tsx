import React from 'react'
import classNames from 'classnames'
import reactStringReplace from 'react-string-replace';
import './styles.css'
import _ from 'lodash'
import useOnClickOutside from '../../../hooks/useOnClickOutside';

interface InputDropDownListProps {
    className?: string
    title: string
    placeholder?: string
    type?: 'text' | 'number' | 'date' | 'time' | 'datetime-local' 
    onChange(val: string): void
    onChangeDropDown(val:string):void
    onKeyPress?(e: React.KeyboardEvent<HTMLInputElement>): void
    icon?: React.ReactNode
    error?: boolean
    schema: ISelectItem[]
    value: string
}

export interface ISelectItem {
    name: string
    value: string
    selected: boolean
}

const InputDropDownList: React.FC<InputDropDownListProps> = props => {
    const [isFocused, setIsFocused] = React.useState<boolean>(false)
    const [isResult, setIsResult] = React.useState<boolean>(false)
    const wrapRef = React.useRef<HTMLDivElement | null>(null)
    useOnClickOutside(wrapRef, () => setIsResult(false))

    const change = (newValue: string, newName: string) => {
        props.onChangeDropDown(newName)
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
                })
            }
        >
            <div className="input__wrap">
                <div className="input__title">{props.title}</div>
                <input 
                    className="input__input" 
                    type={props?.type}
                    name="name" 
                    placeholder={props.placeholder} 
                    value={props.value}
                    onChange={ e => props.onChangeDropDown(e.target.value)}
                    onFocus={ e => {setIsFocused(true); props.schema.length !== 0 && setIsResult(true);} }
                    onBlur={ e => setIsFocused(false) }
                    onKeyDown={e => { if (props.onKeyPress) props.onKeyPress(e) }}
                    autoComplete="off"
                    onClick={e => props.schema.length !== 0 && setIsResult(true)}
                />
                { props?.icon && <div className="input__icon">{props.icon}</div> }
                {
                    isResult &&
                    <div className='dropDownList__container'>
                        <div ref={wrapRef} className="dropDown__list">
                            {
                                props.schema.map(el => {
                                    if(el.name.toLowerCase().includes(props.value.toLowerCase())) {
                                        return (
                                            <div
                                                key={el.value}
                                                className={classNames("dropDown__item", { "select__item--active": el.selected })}
                                                onClick={ (e) => {change(el.value, el.name); setIsResult(false);} }
                                            >
                                                {
                                                    reactStringReplace(el.name, props.value, (match) => (
                                                        <span className='selectedText'>{match}</span>
                                                    ))
                                                }
                                            </div>
                                        )
                                    }
                                })
                            }
                        </div>
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