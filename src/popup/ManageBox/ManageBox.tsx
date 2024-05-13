import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useLocation } from 'react-router-dom'
import { useReactiveVar } from '@apollo/client'
import { userVar, errorsVar, successErrorType, eventEditVar, eventDeleteVar } from '../../cache/cache'
import { useCompanyQuery, useOrderBoxMutation, useDeleteEventMutation, useEditBoxMutation } from '../../types/graphql'
import { SCHEDULE } from '../../graphql/queries'
import { setError } from '../../misc/common'
import classNames from 'classnames';
import { getLocalTimeZone, parseDate, today } from '@internationalized/date';
import { ReactComponent as TimeIcon } from '../../assets/input-clock.svg';
import { ReactComponent as CalendarIcon } from '../../assets/input-calendar.svg';
import moment from 'moment';
import 'moment/locale/fi';
import 'moment/locale/sv';
import Select, { ISelectItem } from '../../components/common/Select'
import { EventCalendar } from '../../components/EventCalendar'
import MaskedInput from 'react-text-mask'
import { MAX_FUTURE_YEAR_FROM_NOW, maybeAddLeadingZero } from '../ManageEvent/index.utils'
import { CalendarStateOptions } from 'react-stately'
import Textarea from '../../components/common/Textarea'

import './styles.css'

const Input = React.lazy(() => import('../../components/common/Input'))
const Button = React.lazy(() => import('../../components/common/Button'))
const ErrorMessage = React.lazy(() => import('../../components/common/ErrorMessage'))

const ManageBox: React.FC = () => {
    const { t } = useTranslation();
    const user = useReactiveVar(userVar);
    const editFields = useReactiveVar(eventEditVar);
    let errors = useReactiveVar(errorsVar);
    
	const navigate = useNavigate();
	const location = useLocation();
    const calendarDate = location.pathname.split('/')[3];
    const from = location.state as LocationState;
    const initialFields = {
        amount: editFields === null ? 0 : editFields.amount,
		startDate: editFields === null ? today(getLocalTimeZone()).toString() : from.initialDate,
		startTime: editFields === null ? moment().format('HH:00') : editFields.startTime,
		endTime: editFields === null ? moment().add(1, 'hour').format('HH:00') : editFields.endTime,
		comment: editFields === null ? '' : editFields.comment,
		address: editFields === null ? '' : editFields.address,
        type: "once",
        period: "Mon||1"
    }

    interface LocationState {
		initialDate: string;
        availableDates: string[];
		type?: 'once' | 'periodic';
		companyId?: string;
		address?: string;
	}
   
    const [fields, setFields] = useState<any>(initialFields);
    const [isFocused, setIsFocused] = React.useState<boolean>(false);
    const [eventDate, setEventDate] = useState(parseDate(fields.startDate));
    const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
    const [isProcess, setIsProcess] = React.useState<boolean>(false)

	const calendarRef = useRef(null);

    const [amount, setAmount] = useState<any[]>([])
	const [isActualQuantityBoxes, setIsActualQuantityBoxes] = React.useState<string>('0');

    const { data } = useCompanyQuery({
		variables: {companyId: user?.companyId as string},
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
    
    useEffect(() => {
        if(editFields !== null) {
			setFields(editFields);
            setIsActualQuantityBoxes(editFields.amount?.toString() as string)
		}
        const amountOfBoxes = Array.from(Array(10).keys()).map((elem, index) => {
            return {name: (elem + 1).toString(), value: (elem + 1).toString(), selected: index + 1 === 1 ? true : false}
        })
        setAmount([...amountOfBoxes])
    }, [data])

    useEffect(() => {
        if(from === null){
            navigate(location.pathname+location.search)
        }
    }, [])

    const changeAddress = (val: string) => {
		setFields({ ...fields, address: val})
	}

    const changeAmount = (val: string) => {
		setIsActualQuantityBoxes(val)
		setFields({ ...fields, amount: amount.find(elem => elem.value === val).name})
	}

    const handleDateInputFocus = useCallback(() => {
		setIsFocused(true);
		setIsDatePickerVisible(false);
	}, []);

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
    
    const calendarStateOptions = useMemo<Partial<CalendarStateOptions>>(() => ({
		value: eventDate,
		onChange: (date: any) => {
			const day = maybeAddLeadingZero(date.day);
			const month = maybeAddLeadingZero(date.month);

			setEventDate(parseDate(`${date.year}-${month}-${day}`));
		},
		minValue: today(getLocalTimeZone()),
	}), [eventDate]);
    
    const [orderNewBox] = useOrderBoxMutation({
        onCompleted() {
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
    })

    const [deleteEvent] = useDeleteEventMutation({
		onCompleted: data => {
			if (data?.deleteEvent) {
				navigate(location.pathname+location.search)
				eventDeleteVar(null)
				eventEditVar(null)
                setIsProcess(false);
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

    const [editBox] = useEditBoxMutation({
        onCompleted: () => {
            navigate(location.pathname+location.search)
            setIsProcess(false);
		},
        refetchQueries: () => {
			return [{
				query: SCHEDULE,
				variables: { date: calendarDate }
			}];
		}
    })

    const submit = () => {
        errors = errorsVar([]);
		const newErrors: successErrorType[] = [];

        if ((fields?.amount || '').trim().length === 0) {
			newErrors.push({
				place: 'order-box.amount',
				message: t('errors.field-required'),
			});
		}

		if ((fields?.startDate || '').trim().length === 0) {
			newErrors.push({
				place: 'order-box.start-date',
				message: t('errors.field-required'),
			});
		}

		if ((fields?.startTime || '').trim().length === 0) {
			newErrors.push({
				place: 'order-box.start-time',
				message: t('errors.field-required'),
			});
		}

		if ((fields?.endTime || '').trim().length === 0) {
			newErrors.push({
				place: 'order-box.end-time',
				message: t('errors.field-required'),
			});
		}

		if ((fields?.address || '').trim().length === 0) {
			newErrors.push({
				place: 'order-box.address',
				message: t('errors.field-required'),
			});
		}

		if (newErrors.length === 0) {
			setIsProcess(true);
			if (editFields === null) {				
				orderNewBox({
                    variables: {...fields}
                })
			} else if (editFields !== null) {
				editBox({ variables: {
                    id: editFields.editEventId,
                    amount: fields.amount,
                    startDate: fields.startDate,
                    startTime: fields.startTime,
                    endTime: fields.endTime,
                    comment: fields.comment,
                    address: fields.address
                } });
			}
		} else {
			errorsVar(setError(errors, newErrors));
		}

    }

    const remove = () => {
        deleteEvent({
            variables: {
            deleteEventId: editFields?.editEventId || '',
            },
        });
	};   

    const amountError = errors.find((el) => el?.place === 'order-box.amount');
	const startTimeError = errors.find((el) => el?.place === 'order-box.start-time');
    const unavailableDateError = errors.find(el => el?.place === 'manage-event.unavailable-date' )    
    const isAvailableDateError = !user?.isAdmin && fields.type === "once"
		&& (editFields === null || from.initialDate !== fields.startDate)
		&& !from?.availableDates.includes(fields.startDate);
	const endTimeError = errors.find((el) => el?.place === 'order-box.end-time');
	const addressError = errors.find(el => el?.place === 'order-box.address' )
    const timeError = errors
    .filter((el) => ['order-box.start-time', 'order-box.end-time']
    .includes(el?.place || ''));

    const title = editFields === null ? t('Popup.OrderBox.add-title') : t('Popup.OrderBox.edit-title');
	const button = editFields === null ? t('Popup.OrderBox.add-button') : t('Popup.OrderBox.edit-button');
    
    return(
        <div className='orderBox_mainContent'>
            <div>
                <p className='orderBox__title'>{title}</p>
                <p className='subTitle'>
                    {t('Popup.OrderBox.checkPicture')}
                    <a className='subTitle__link' target='blank' href='https://app.charitybo.fi/assets/box.jpg'>{t('Popup.OrderBox.link')}</a>.
                </p>
            </div>
            <div className='orderBox_row orderBox_amount'>
                <Select
                    className='orderBox__select'
                    title={t('Popup.OrderBox.amount')}
                    schema={amount}
                    value={isActualQuantityBoxes}
                    onChange={(val) => changeAmount(val)}
                />
                { amountError && <ErrorMessage className="address__error" errors={amountError} /> }
            </div>
            <div className='orderBox_row orderBox_address'>
                <Select
                    className='orderBox__select'
                    title={t('Popup.OrderBox.address')}
                    schema={addressSelect}
                    value={fields.address}
                    onChange={(val) => changeAddress(val)}
                />
                { addressError && <ErrorMessage className="address__error" errors={addressError} /> }
            </div>
            <div className='orderBox_row orderBox_date'>
                <div
                    className={classNames('input manage-box__input', {
                    'datepicker--show-title': !isFocused,
                    'datepicker--focused': isFocused,
                    })}
                >
                    <div className='datepicker-wrap'>
                        <div className='datepicker__title'>
                            {t('Popup.OrderBox.start-date')}
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
                        <CalendarIcon
                            className='datepicker__icon'
                            onClick={() => setIsDatePickerVisible((s) => !s)}
                        />
                    </div>
                    {isDatePickerVisible && (
                        <div ref={calendarRef} className={classNames('manage-box__calendar')}>
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
                                        'manage-box__button',
                                        'manage-box__button--cancel'
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
                                        'manage-box__button',
                                        'manage-box__button--confirm'
                                    )}
                                >
                                    {t('Popup.ManageEvent.calendar-done')}
                                </button>
                            </div>
                        </div>
                    )}
		        </div>
            </div>
            {(isAvailableDateError || unavailableDateError) && (
                <ErrorMessage
                    className='time_error'
                    errors={{
                        message: t('Popup.ManageEvent.not-available')
                    }}
                />
            )}
            <div className={`orderBox_row orderBox_time ${timeError.length > 0 && 'orderBox_timeWithError'}`}>
                <div>
                    <Input
                        className='orderBox__input'
                        title={t('Popup.OrderBox.from')}
                        type='time'
                        value={fields?.startTime || ''}
                        onChange={(val) => setFields({ ...fields, startTime: val })}
                        error={startTimeError !== undefined}
                        icon={<TimeIcon />}
                    />
                    {startTimeError && (
                        <ErrorMessage className="time_error" errors={startTimeError} />
                    ) }
                </div>
                <div>
                    <Input
                        className='orderBox__input'
                        title={t('Popup.OrderBox.to')}
                        type='time'
                        value={fields?.endTime || ''}
                        onChange={(val) => setFields({ ...fields, endTime: val })}
                        error={endTimeError !== undefined}
                        icon={<TimeIcon />}
                    />
                    { endTimeError && <ErrorMessage className="time_error" errors={endTimeError} /> }
                </div>
                
            </div>
            <div className='orderBox_row orderBox_comments'>
                <Textarea
                    title={t('Popup.OrderBox.comments-placeholder')}
                    placeholder={t('Popup.OrderBox.comments-placeholder')}
                    value={fields?.comment || ''}
                    onChange={(val) => setFields({ ...fields, comment: val })}
                />
            </div>
            <Button
                text={isProcess? t('Popup.OrderBox.wait') : button}
                onClick={() => submit()}
                disabled={isProcess || isAvailableDateError}
            />
            {
			editFields !== null 
			  && 
			(
				<div className='order-box__delete' onClick={() => remove()}>
					{t('Popup.OrderBox.delete')}
				</div>
			)
		}
        </div>
    )
}

export default ManageBox