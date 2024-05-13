import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import _ from 'lodash';
import moment from 'moment';
import 'moment/locale/fi';
import 'moment/locale/sv';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { useReactiveVar } from '@apollo/client';
import { userVar, eventEditVar, errorsVar, successErrorType, eventDeleteVar } from '../../cache/cache';
import { EditEventMutationVariables, useAddEventMutation, useEditEventMutation, useDeleteEventMutation, useCompanyQuery } from '../../types/graphql';
import { SCHEDULE } from '../../graphql/queries';
import { setError } from '../../misc/common';
import { ISelectItem } from '../../components/common/Select';

import { ReactComponent as CalendarIcon } from '../../assets/input-calendar.svg';
import { ReactComponent as TimeIcon } from '../../assets/input-clock.svg';
import classNames from 'classnames';
import { EventCalendar } from '../../components/EventCalendar';
import { getLocalTimeZone, parseDate, today } from '@internationalized/date';
import MaskedInput from 'react-text-mask';
import useOnClickOutside from '../../hooks/useOnClickOutside';
import { MAX_FUTURE_YEAR_FROM_NOW, maybeAddLeadingZero } from './index.utils';
import { CalendarStateOptions } from 'react-stately';

import './styles.css';

const Input = React.lazy(() => import('../../components/common/Input'));
const Button = React.lazy(() => import('../../components/common/Button'));
const ErrorMessage = React.lazy(() => import('../../components/common/ErrorMessage'));
const Select = React.lazy(() => import('../../components/common/Select'));
const Textarea = React.lazy(() => import('../../components/common/Textarea'));

const ManageEvent: React.FC = () => {
	const user = useReactiveVar(userVar);
	const editFields = useReactiveVar(eventEditVar);
	
	const navigate = useNavigate();
	const location = useLocation();
	const from = location.state as LocationState;
	const todayDay = moment().format("YYYY-MM-DD")
	
	const { t, i18n } = useTranslation();
	const initialFields = {
        editEventId: '',
		startDate: from && from?.initialDate < today(getLocalTimeZone()).toString()
			? today(getLocalTimeZone()).toString()
			: todayDay,
		startTime: moment().format('HH:00'),
		endTime: moment().add(1, 'hour').format('HH:00'),
		type: 'once',
		period: 'Mon||1',
		comment: '',
		address: ""
    }
	const [fields, setFields] = React.useState<EditEventMutationVariables>(initialFields);

	const [isFocused, setIsFocused] = React.useState<boolean>(false);
	const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
	const [eventDate, setEventDate] = useState(parseDate(fields.startDate));
	const [isProcess, setIsProcess] = React.useState<boolean>(false)
	const repeat = fields.period?.split('||')[1] || ""
	const schema: ISelectItem[] = [
		{ name: `1 ${t('Popup.ManageEvent.week')}`, value: '1', selected: repeat === '1' },
		{ name: `2 ${t('Popup.ManageEvent.weeks')}`, value: '2', selected: repeat === '2' },
		{ name: `3 ${t('Popup.ManageEvent.weeks')}`, value: '3', selected: repeat === '3' },
		{ name: `4 ${t('Popup.ManageEvent.weeks')}`, value: '4', selected: repeat === '4' },
		{ name: `5 ${t('Popup.ManageEvent.weeks')}`, value: '5', selected: repeat === '5' },
	];
	interface LocationState {
		initialDate: string;
		availableDates: string[];
		type?: 'once' | 'periodic';
		companyId?: string;
		address?: string;
	}	
	
	let errors = useReactiveVar(errorsVar);
	const calendarDate = location.pathname.split('/')[3];
  	moment.locale(i18n.language);

	const { data } = useCompanyQuery({
		variables: {companyId: editFields === null ? user?.companyId as string : from.companyId as string},
		onCompleted: (data) => {
			const initialAddress = data?.company?.addresses && data?.company?.addresses?.length > 0 ? data?.company?.addresses[0]?.address : ""
			setFields({ ...fields, address: initialAddress})
		}
	})

	const companyAddresses = data?.company && data?.company?.addresses && Array.isArray(data?.company?.addresses) ? data?.company?.addresses : []
	const addressSelect: ISelectItem[] = companyAddresses.map((el) => ({ 
		name: el?.address || '', 
		value: el?.address || '',
		selected: el?.address === fields.address
	}))

	const changeAddress = (val: string) => {
		setFields({ ...fields, address: val})
	}

	const [updateEvent] = useEditEventMutation({
		onCompleted: () => {
			navigate(location.pathname + location.search);
			eventEditVar(null);
			setIsProcess(false);
		},
		refetchQueries: () => {
			return [{
				query: SCHEDULE,
				variables: { date: calendarDate }
			}];
		}
	});

	const [addEvent] = useAddEventMutation({
		onCompleted: () => {
			navigate(location.pathname + location.search);
			setIsProcess(false);
		},
		onError: (e) => {
			console.log(e);
			setIsProcess(false);
			let errMessage = e?.message
            if (e?.graphQLErrors?.length > 0) {
                if (e?.graphQLErrors[0]?.extensions?.code === 'DATE_UNAVAILABLE') {
                    errMessage = t('Popup.ManageEvent.not-available')
                }
                const newErrors = setError(errors, [{ place: 'manage-event.unavailable-date', message: errMessage }])
                errorsVar(newErrors)
            }
		},
		refetchQueries: () => {
			return [{
				query: SCHEDULE,
				variables: { date: calendarDate }
			}];
		},
		awaitRefetchQueries: true
	});

	const [deleteEvent] = useDeleteEventMutation({
		onCompleted: data => {
			if (data?.deleteEvent) {
				navigate(location.pathname+location.search)
				eventDeleteVar(null)
				eventEditVar(null)
			}
		},
		onError: (e) => {
			console.log(e);
		},
		refetchQueries: () => {
			return [{
				query: SCHEDULE,
				variables: { date: calendarDate }
			}];
		}
	});

	React.useEffect(() => {
		if (user === null) {
			navigate('/', { replace: true });
		}
	}, [data]);

	//Redirect to auth
	React.useEffect(() => {
		if (user === null) {
			navigate('/', { replace: true });
		}
	}, [user, navigate]);

	// Set initial date value
	React.useEffect(() => {
		if (from?.initialDate !== undefined) {
			if(from.type === 'periodic') {
				setEventDate(parseDate(from.initialDate))
				setFields({ ...fields, startDate: from.initialDate });
			} else {
				if(from.initialDate < today(getLocalTimeZone()).toString()) {
					setEventDate(parseDate(today(getLocalTimeZone()).toString()))
					setFields({ ...fields, startDate: today(getLocalTimeZone()).toString() })
				} else {
					setEventDate(parseDate(from.initialDate))
					setFields({ ...fields, startDate: from.initialDate });
				}
			}
		} else {
			navigate(location.pathname+location.search)
		}
	}, []);

	//Set edit fields
	React.useEffect(() => {
		if (editFields !== null) {
			setFields(editFields);
		}
	}, [editFields]);

	const changePeriodWeek = (dayOfWeek: string) => {
		const parsePeriod = fields.period?.split('||');
		if (parsePeriod) {
			const daysOfWeek = parsePeriod[0].split(',');
			_.includes(daysOfWeek, dayOfWeek)
				? _.pull(daysOfWeek, dayOfWeek)
				: daysOfWeek.push(dayOfWeek);
			const newPeriod = daysOfWeek.join(',') + '||' + parsePeriod[1];			
			setFields({ ...fields, period: newPeriod });
		}
	};

	function getCurrentDayOfWeek(): string {
		const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
		const currentDate = new Date();
		const currentDayIndex = currentDate.getDay();
		return daysOfWeek[currentDayIndex];
	}
	
	function getDifference(dayOfWeek: string): number {
		const currentDayOfWeek = getCurrentDayOfWeek();
		const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
		const currentIndex = daysOfWeek.indexOf(currentDayOfWeek);
		const checkIndex = daysOfWeek.indexOf(dayOfWeek);
		return checkIndex - currentIndex;
	}
	
	const calculateNearestDate = (): string => {
		let daysOfWeek: string[] = [];
		const parsePeriod = fields.period?.split('||');
		if (parsePeriod) {
			daysOfWeek = parsePeriod[0].split(',').filter(d => d.length);
		}
	
		const dates = daysOfWeek.map(day => {
			const difference = getDifference(day)
			const weeksToAdd = difference >= 0 ? 0 : repeat
			const hour = +fields.startTime.split(":")[0]
			const minutes = +fields.startTime.split(":")[1]
			const date = moment().add(difference, "day").add(weeksToAdd, "week").hour(hour).minutes(minutes).format('LLLL')
			return `${t('Popup.ManageEvent.next-pickup')}: ` + date
		}).sort()
	
		return dates[0];
	};

	const changePeriodRepeat = (value: string) => {
		const parsePeriod = fields.period?.split('||');
		if (parsePeriod) {
			const newPeriod = parsePeriod[0] + '||' + value;
			setFields({ ...fields, period: newPeriod });
		}
	};

	const submit = () => {
		errors = errorsVar([]);
		const newErrors: successErrorType[] = [];

		if ((fields?.startDate || '').trim().length === 0) {
			newErrors.push({
				place: 'manage-event.start-date',
				message: t('errors.field-required'),
			});
		}

		if ((fields?.startTime || '').trim().length === 0) {
			newErrors.push({
				place: 'manage-event.start-time',
				message: t('errors.field-required'),
			});
		}

		if ((fields?.endTime || '').trim().length === 0) {
			newErrors.push({
				place: 'manage-event.end-time',
				message: t('errors.field-required'),
			});
		}

		if ((fields?.comment || '').length > 2000) {
			newErrors.push({
				place: 'manage-event.comment',
				message: t('errors.comment-length'),
			});
		}

		if (fields?.type === 'periodic') {
			const parsePeriod = fields.period?.split('||');
			if (parsePeriod && parsePeriod[0].split(',').length === 0) {
				newErrors.push({
					place: 'manage-event.dayweek',
					message: t('errors.field-required'),
				});
			}
		}

		if ((fields?.address || '').trim().length === 0) {
			newErrors.push({
				place: 'manage-event.address',
				message: t('errors.field-required'),
			});
		}

		if (newErrors.length === 0) {
			setIsProcess(true);
			if (editFields === null) {				
				addEvent({ variables: _.omit(fields, 'editEventId', 'deleteDate') });
			} else if (editFields !== null) {
				if (editFields.type === 'once') {
					updateEvent({ variables: _.omit(fields, 'deleteDate') });
				} else if (editFields.type === 'periodic') {
					eventEditVar(fields);
					navigate('#edit-event');
				}
			}
		} else {
			errorsVar(setError(errors, newErrors));
		}
  };

	const remove = () => {
		if (editFields?.type === 'once') {
			deleteEvent({
				variables: {
				deleteEventId: editFields?.editEventId || '',
				},
			});
		}
		if (editFields?.type === 'periodic') {
			eventDeleteVar({
				deleteEventId: editFields?.editEventId || '',
				deleteDate: editFields?.deleteDate || '',
			});
			navigate('#delete-event');
			eventEditVar(null);
		}
	};

	const title = editFields === null ? t('Popup.ManageEvent.add-title') : t('Popup.ManageEvent.edit-title');
	const button = editFields === null ? t('Popup.ManageEvent.add-button') : t('Popup.ManageEvent.edit-button');

	const weekdaysShort = moment().localeData().weekdaysMin();

	const calendarRef = useRef(null);
	useOnClickOutside(calendarRef, () => {
		setIsDatePickerVisible(false);
		setEventDate(parseDate(fields.startDate));
	});

	useEffect(() => {
		setIsFocused(isDatePickerVisible);
	}, [isDatePickerVisible]);

  	const handleDateInputBlur: React.FocusEventHandler<HTMLInputElement> = useCallback((event) => {
		setIsFocused(false);

		const day = event.target.value.slice(0, 2);
		const month = event.target.value.slice(3, 5);
		const year = event.target.value.slice(6, 10);

		const selectedDate = `${year}-${month}-${day}`;

		try {
			const todayDateString = today(getLocalTimeZone()).toString();

		if (
			new Date(selectedDate).getFullYear() -
			new Date(todayDateString).getFullYear() >
			MAX_FUTURE_YEAR_FROM_NOW
		) {
			// if date is too far ahead
			setEventDate(parseDate(fields.startDate));
			return;
		}

		if (new Date(selectedDate) < new Date(todayDateString)) {
			// if date is past
			setEventDate(parseDate(fields.startDate));
			return;
		}

		setEventDate(parseDate(selectedDate));
		setFields({ ...fields, startDate: selectedDate });
		} catch {
			// reset
			setEventDate(parseDate(fields.startDate));
		}
	}, [fields]);

	const handleDateInputFocus = useCallback(() => {
		setIsFocused(true);
		setIsDatePickerVisible(false);
	}, []);

	const calendarStateOptions = useMemo<Partial<CalendarStateOptions>>(() => ({
		value: eventDate,
		onChange: (date: any) => {
			const day = maybeAddLeadingZero(date.day);
			const month = maybeAddLeadingZero(date.month);

			setEventDate(parseDate(`${date.year}-${month}-${day}`));
		},
		minValue: today(getLocalTimeZone()),
	}), [eventDate]);

	const startDateError = errors.find((el) => el?.place === 'manage-event.start-date');
	const startTimeError = errors.find((el) => el?.place === 'manage-event.start-time');
	const endTimeError = errors.find((el) => el?.place === 'manage-event.end-time');
	const addressError = errors.find(el => el?.place === 'manage-event.address' )
	const unavailableDateError = errors.find(el => el?.place === 'manage-event.unavailable-date' )
	const isAvailableDateError = !user?.isAdmin && fields.type === "once"
		&& (editFields === null || from?.initialDate !== fields.startDate)
		&& !from?.availableDates.includes(fields.startDate);

	const timeError = errors
		.filter((el) => ['manage-event.start-time', 'manage-event.end-time']
		.includes(el?.place || ''));

	return (
		<div className='manage-event'>
		<div className='manage-event__title'>{title}</div>
		<div
			className={classNames('input manage-event__input', {
			'datepicker--show-title': !isFocused,
			'datepicker--focused': isFocused,
			})}
		>
			<div className='datepicker-wrap'>
				<div className='datepicker__title'>
					{t('Popup.ManageEvent.start-date')}
				</div>
				<MaskedInput
					placeholderChar=' '
					value={`${maybeAddLeadingZero(eventDate.day)}.${maybeAddLeadingZero(eventDate.month)}.${eventDate.year}`}
					placeholder='DD.MM.YYYY'
					mask={[/\d/, /\d/, '.', /\d/, /\d/, '.', /\d/, /\d/, /\d/, /\d/]}
					className='input__input'
					type='text'
					onFocus={handleDateInputFocus}
					onBlur={handleDateInputBlur}
				/>				
			</div>
			<CalendarIcon
				className='datepicker__icon'
				onClick={() => setIsDatePickerVisible((s) => !s)}
			/>
			{isDatePickerVisible && (
				<div ref={calendarRef} className={classNames('manage-event__calendar')}>
					<EventCalendar
						aria-label='Event date'
						calendarStateOptions={calendarStateOptions}
						prevSelectedDate={parseDate(fields.startDate)}
					/>
					<div
						style={{
							display: 'flex',
							justifyContent: 'space-between',
							gap: '10px',
						}}
					>
						<button
							onClick={() => {
								setEventDate(parseDate(fields.startDate));
								setIsDatePickerVisible(false);
							}}
							className={classNames(
								'manage-event__button',
								'manage-event__button--cancel'
							)}
						>
							{t('Popup.ManageEvent.calendar-cancel')}
						</button>
						<button
							onClick={() => {
								setFields({ ...fields, startDate: eventDate.toString() });
								setIsDatePickerVisible(false);
							}}
							className={classNames(
								'manage-event__button',
								'manage-event__button--confirm'
							)}
						>
							{t('Popup.ManageEvent.calendar-done')}
						</button>
					</div>
				</div>
			)}
		</div>

		{startDateError && (
			<ErrorMessage className='manage-event__error' errors={startDateError} />
		)}
		{(isAvailableDateError || unavailableDateError) && (
			<ErrorMessage
				className='manage-event__error'
				errors={{
					message: t('Popup.ManageEvent.not-available')
				}}
			/>
		)}

		<div className='manage-event__row'>
			<Input
				className='manage-event__input'
				title={t('Popup.ManageEvent.from')}
				type='time'
				value={fields?.startTime || ''}
				onChange={(val) => setFields({ ...fields, startTime: val })}
				error={startTimeError !== undefined}
				icon={<TimeIcon />}
			/>
			<Input
				className='manage-event__input'
				title={t('Popup.ManageEvent.to')}
				type='time'
				value={fields?.endTime || ''}
				onChange={(val) => setFields({ ...fields, endTime: val })}
				error={endTimeError !== undefined}
				icon={<TimeIcon />}
			/>
		</div>
		{timeError.length > 0 && (
			<ErrorMessage className='manage-event__error' errors={timeError} />
		)}

		<div className='manage-event__type'>
			<div
				className={classNames('manage-event__type-item', {
					'manage-event__type-item--active': fields.type === 'once',
				})}
				onClick={() => setFields({ ...fields, type: 'once' })}
			>
			{t('Popup.ManageEvent.type-once')}
			</div>
			<div
				className={classNames('manage-event__type-item', {
					'manage-event__type-item--active': fields.type === 'periodic',
				})}
				onClick={() => setFields({ ...fields, type: 'periodic' })}
			>
				{t('Popup.ManageEvent.type-periodic')}
			</div>
		</div>
		{fields.type === 'periodic' && (
			<>
				<div className='manage-event__periodic-row'>
					<div>{t('Popup.ManageEvent.repeat-label')}</div>
					<Select
						className='manage-event__select'
						title={t('Popup.ManageEvent.repeat')}
						schema={schema}
						value={repeat}
						onChange={(val) => changePeriodRepeat(val)}
					/>
				</div>
				<ErrorMessage
					className='manage-event__error'
					errors={{
						message: calculateNearestDate() || ""
					}} 
				/>
				<div className='manage-event__periodic-row'>
					<div>{t('Popup.ManageEvent.weekday')}</div>
					<div className='manage-event__weeks'>
						<div
							className={classNames('manage-event__day', {
								'manage-event__day--active': _.includes(fields.period, 'Mon'),
							})}
							onClick={() => changePeriodWeek('Mon')}
						>
							{weekdaysShort[1]}
						</div>
						<div
							className={classNames('manage-event__day', {
								'manage-event__day--active': _.includes(fields.period, 'Tue'),
							})}
							onClick={() => changePeriodWeek('Tue')}
						>
							{weekdaysShort[2]}
						</div>
						<div
							className={classNames('manage-event__day', {
								'manage-event__day--active': _.includes(fields.period, 'Wed'),
							})}
							onClick={() => changePeriodWeek('Wed')}
						>
							{weekdaysShort[3]}
						</div>
						<div
							className={classNames('manage-event__day', {
								'manage-event__day--active': _.includes(fields.period, 'Thu'),
							})}
							onClick={() => changePeriodWeek('Thu')}
						>
							{weekdaysShort[4]}
						</div>
						<div
							className={classNames('manage-event__day', {
								'manage-event__day--active': _.includes(fields.period, 'Fri'),
							})}
							onClick={() => changePeriodWeek('Fri')}
						>
							{weekdaysShort[5]}
						</div>
						<div
							className={classNames('manage-event__day', {
								'manage-event__day--active': _.includes(fields.period, 'Sat'),
							})}
							onClick={() => changePeriodWeek('Sat')}
						>
							{weekdaysShort[6]}
						</div>
						<div
							className={classNames('manage-event__day', {
								'manage-event__day--active': _.includes(fields.period, 'Sun'),
							})}
							onClick={() => changePeriodWeek('Sun')}
						>
							{weekdaysShort[0]}
						</div>
					</div>
				</div>
			</>
		)}
		<div className='manage-event__selectAddress'>
			<Select
				className='manage-event__select'
				title={t('Popup.ManageEvent.address')}
				schema={addressSelect}
				value={fields.address || ""}
				onChange={(val) => changeAddress(val)}
			/>
			{ addressError && <ErrorMessage className="address__error" errors={addressError} /> }
		</div>
		
		<Textarea
			title={t('Popup.ManageEvent.comment')}
			placeholder={t('Popup.ManageEvent.comment-placeholder')}
			value={fields?.comment || ''}
			onChange={(val) => setFields({ ...fields, comment: val })}
		/>

		<Button
			text={isProcess? t('Popup.ManageEvent.wait') : button}
			onClick={() => submit()}
			disabled={isProcess || isAvailableDateError}
		/>
		{
			editFields !== null 
			  && 
			(
				<div className='manage-event__delete' onClick={() => remove()}>
					{t('Popup.ManageEvent.delete')}
				</div>
			)
		}
		</div>
	);
};

export default ManageEvent;
