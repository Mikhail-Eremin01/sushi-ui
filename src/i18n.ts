import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import Backend from 'i18next-http-backend'
import LanguageDetector from 'i18next-browser-languagedetector'

i18n
.use(Backend)
.use(LanguageDetector)
.use(initReactI18next)
// for all options read: https://www.i18next.com/overview/configuration-options
.init({
    load: 'languageOnly',
    supportedLngs: ['en', 'fi', 'sv', 'ru'],
    fallbackLng: 'en',
    cleanCode: true,
    debug: true,
    react: {
        useSuspense: true
    },
    detection: {
        order: ['localStorage', 'sessionStorage', 'navigator', 'querystring', 'cookie', 'htmlTag']
    }
})

export default i18n