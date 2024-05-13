import React from 'react'
import classNames from 'classnames'

import './styles.css'

interface InputProps {
    className?: string
    title: string
    placeholder?: string
    type?: 'text' | 'number' | 'date' | 'time' | 'datetime-local' 
    value: string
    onChange(val: string): void
    onKeyPress?(e: React.KeyboardEvent<HTMLInputElement>): void
    icon?: React.ReactNode
    error?: boolean
}

const Input: React.FC<InputProps> = props => {
    const [isFocused, setIsFocused] = React.useState<boolean>(false)

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
                    onFocus={ e => setIsFocused(true) }
                    onBlur={ e => setIsFocused(false) }
                    onKeyPress={e => { if (props.onKeyPress) props.onKeyPress(e) }}
                    autoComplete="off"
                />
                { props?.icon && <div className="input__icon">{props.icon}</div> }
            </div>
        </div>
    )
}

Input.defaultProps = {
    className: '',
    error: false,
    type: 'text'
}

export default Input