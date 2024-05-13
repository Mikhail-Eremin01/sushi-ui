import React from 'react'

import './styles.css'

interface IWrapperProps {
    children?: React.ReactNode
}

const Wrapper: React.FC<IWrapperProps> = props => {
    return (
        <article className="wrapper">
            {props.children}
        </article>
    )
}

export default Wrapper