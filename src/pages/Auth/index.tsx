import React from 'react'
import { ReactComponent as LogoIcon } from '../../assets/logo-white.svg'
import './styles.css'

const Auth: React.FC = () => {

    return (
        <div className="auth">
            <div className="auth__wrap">
                <div className="auth__logo">
                    <LogoIcon className="auth__logo-icon" />
                </div>
            </div>
        </div>
    )
}

export default Auth