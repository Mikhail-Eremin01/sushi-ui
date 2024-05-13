import { useTranslation } from 'react-i18next'
import { ReactComponent as LockIcon } from '../../../assets/lock.svg'
import Button from '../Button'
import './styles.css'

interface Window_userIsLockedProps {
	lockedTimeMinutes: string
	setStep: any
}

const Window_userIsLocked: React.FC<Window_userIsLockedProps> = ({lockedTimeMinutes, setStep}) => {
	const { t } = useTranslation()
	return (
		<div className='userIsLocked_container'>
			<LockIcon className="userIsLocked__logo-icon" />
			<p className='userIsLocked__title'>{t('Auth.window_userLocked.title')}</p>
			<div className='userIsLocked_subtitleContainer'>
				<span className='userIsLocked__subtitle'>{t('Auth.window_userLocked.text.firstParagraph')}</span>
				<span className='userIsLocked__subtitle'>
					{`${t('Auth.window_userLocked.text.secondParagraph.firstPart')}
					${lockedTimeMinutes}
					${t('Auth.window_userLocked.text.secondParagraph.secondPart')}`}
				</span>
			</div>
			<Button className="back_button" text={t('Auth.window_userLocked.button')} onClick={() => setStep('auth')} />
		</div>
	)
}
export default Window_userIsLocked