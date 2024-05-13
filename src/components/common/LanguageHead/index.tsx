import React from 'react'
import classNames from 'classnames'
import { useTranslation } from 'react-i18next'
import useOnClickOutside from  '../../../hooks/useOnClickOutside'

import { ReactComponent as GlobeIcon } from '../../../assets/lang.svg'
import { ReactComponent as ArrowIcon } from '../../../assets/lang-arrow-head.svg'
import './styles.css'

const LanguageHead: React.FC = props => {
    const wrapRef = React.useRef<HTMLDivElement | null>(null)
    const [isOpened, setIsOpened] = React.useState<boolean>(false)
    const { i18n } = useTranslation()

    useOnClickOutside(wrapRef, () => setIsOpened(false))

    const changeLang = (lang: string) => {
        i18n.changeLanguage(lang)
        setIsOpened(false)
    }

    return (
        <div className={classNames("language-head", { "language-head--opened": isOpened })}>
            <div className="language-head__current" onClick={() => setIsOpened(!isOpened)}>
                <GlobeIcon className="language-head__globe" />
                {i18n.language.toUpperCase()}
                <ArrowIcon className="language-head__arrow" />
            </div>
            <div ref={wrapRef} className="language-head__list">
                <div className="language-head__item" onClick={ () => changeLang('en') }>English</div>
                <div className="language-head__item language-head__item--fi" onClick={ () => changeLang('fi') }>Suomi</div>
                <div className="language-head__item language-head__item--sv" onClick={ () => changeLang('sv') }>Svenska</div>
            </div>
        </div>
    )
}

export default LanguageHead