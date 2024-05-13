import React from 'react'
import classNames from 'classnames'

import './styles.css'

interface IButton {
    id?: string
    className?: string
    text: string
    icon?: React.ReactNode
    mode?: 'outline' | 'black' | 'red' | 'red-outline'
    disabled?: boolean
    onClick(): void
}

const Button: React.FC<IButton> = props => {
    return (
        <div id={props.id}
            className={classNames(
                `button ${props.className}`,
                {
                    'button--with-icon': props.icon !== undefined,
                    [`button--${props?.mode}`]: props?.mode !== undefined,
                    'button--disabled': props?.disabled,
                }
            )} 
            onClick={ () => { if (!props?.disabled) props.onClick() } }
        >
            {props.icon}  {props.text}
        </div>
    )
}

Button.defaultProps = {
    className: '',
    disabled: false
}

export default Button