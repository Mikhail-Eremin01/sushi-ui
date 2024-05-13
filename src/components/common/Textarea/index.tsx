import React from 'react'
import classNames from 'classnames'

import './styles.css'

interface ITextareaProps {
    className?: string
    title: string
    placeholder?: string
    value: string
    onChange(val: string): void
    error?: boolean
}

const Textarea: React.FC<ITextareaProps> = props => {
    const [isFocused, setIsFocused] = React.useState<boolean>(false)

    return (
        <div 
            className={
                classNames(`textarea ${props.className}`, 
                { 
                    "textarea--show-title": !isFocused && ((!isFocused && props.value !== '') || props.value !== ''), 
                    'textarea--focused': isFocused, 
                    'textarea--error': props?.error 
                })}
        >
            <div className="textarea__wrap">
                <div className="textarea__title">{props.title}</div>
                <textarea 
                    className="textarea__textarea" 
                    name="name" 
                    placeholder={props.placeholder} 
                    onChange={ e => props.onChange(e.target.value)}
                    onFocus={ e => setIsFocused(true) }
                    onBlur={ e => setIsFocused(false) }
                    autoComplete="off"
                    value={props.value}
                ></textarea>
            </div>
        </div>
    )
}

Textarea.defaultProps = {
    className: '',
    error: false
}

export default Textarea