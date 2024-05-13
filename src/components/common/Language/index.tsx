import React from 'react'
import classNames from 'classnames'
import { useTranslation } from 'react-i18next'
import useOnClickOutside from  '../../../hooks/useOnClickOutside'

import './styles.css'

interface ILanguageProps {
    className?: string
}

const Language: React.FC<ILanguageProps> = props => {
    const wrapRef = React.useRef<HTMLDivElement | null>(null)
    const [isOpened, setIsOpened] = React.useState<boolean>(false)
    const { i18n } = useTranslation()

    useOnClickOutside(wrapRef, () => setIsOpened(false))

    const changeLang = (lang: string) => {
        i18n.changeLanguage(lang)
        setIsOpened(false)
    }

    return (
        <div className={classNames("language", props.className, { "language--opened": isOpened })}>
            <div className="language__current" onClick={() => setIsOpened(!isOpened)}>
                <div className={`language__flag language__flag--${i18n.language}`}></div>
                <div className="language__arrow"></div>
            </div>
            <div ref={wrapRef} className="language__list">
                <div className="language__item" onClick={ () => changeLang('en') }>English</div>
                <div className="language__item language__item--fi" onClick={ () => changeLang('fi') }>Suomi</div>
                <div className="language__item language__item--sv" onClick={ () => changeLang('sv') }>Svenska</div>
            </div>
        </div>
    )
}

export default Language