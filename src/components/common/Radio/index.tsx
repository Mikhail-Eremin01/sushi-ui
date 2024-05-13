import React from 'react'
import classNames from 'classnames'

import './styles.css'

export interface IRadioProps {
    id: string
    className?: string
    title: string
    name: string
    radioValue: string
    value: string
    onChange(val: string): void
    error?: boolean
    disabled?: boolean
}

const Checkbox: React.FC<IRadioProps> = props => {
    return (
        <div className={classNames("radio", props.className, { 'radio--disabled': props.disabled })}>
            <label>
                <input 
                    type="radio" 
                    name={props.name}
                    value={props.radioValue}
                    checked={props.value === props.radioValue}
                    onChange={ e => props.onChange(e.target.value) }
                    disabled={props.disabled} 
                />
                <div className="radio__icon"></div>
                {props.title}
            </label>
        </div>
    )
}

export default Checkbox