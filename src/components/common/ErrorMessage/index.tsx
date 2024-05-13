import React from 'react'
import { successErrorType } from '../../../cache/cache'

import './styles.css'

interface IButton {
    className?: string
    errors: successErrorType | successErrorType[]
}

const ErrorMessage: React.FC<IButton> = props => {
    return (
        <div className={`error-message ${props.className}`}>
            {
                Array.isArray(props.errors)
                ? props.errors.map((err, i) => {
                    return (
                        <React.Fragment key={i}>{err.message}<br/></React.Fragment>
                    )
                })
                : props.errors.message
            }
            
        </div>
    )
}

ErrorMessage.defaultProps = {
    className: ''
}

export default ErrorMessage