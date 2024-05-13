import React from 'react'
import _ from 'lodash'
import classNames from 'classnames'

import './styles.css'

export interface ICheckboxProps {
    id: string
    className?: string
    title: string
    name: string
    checkboxValue: string
    value: string | string[] | any
    onChange(val: string | string[]): void
    error?: boolean
    disabled?: boolean
}

const Checkbox: React.FC<ICheckboxProps> = props => {

    const isChecked = () => {
        if (typeof props.value === 'string') {
            return props.value === props.checkboxValue
        } else {
            return props.value.indexOf(props.checkboxValue) > -1
        }
    }

    const onChange = (val: string) => {
        if (typeof props.value === 'string') {
            props.onChange(val)
        } else {
            let newValue = _.cloneDeep(props.value)
            if (_.includes(newValue, val)) {
                newValue = _.without(newValue, val)
            } else {
                newValue.push(val)
            }
            props.onChange(_.uniq(newValue))
        }
    }

    return (
        <div className={classNames("checkbox", props.className)}>
            <label htmlFor={props.id}>
                <input
                    id={props.id} 
                    type="checkbox" 
                    name={props.name}
                    value={props.checkboxValue}
                    checked={isChecked()}
                    onChange={ e => onChange(e.target.value) } 
                />
                <div className="checkbox__icon"></div>
                <span className="checkbox__text">{props.title}</span>
            </label>
        </div>
    )
}

export default Checkbox