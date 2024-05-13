import React from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import moment from 'moment'
import { useTranslation } from 'react-i18next'
import ErrorMessage from '../../common/ErrorMessage'
import { getImageBase64FromUrl, setError } from '../../../misc/common'
import { ReactComponent as CalendarIcon } from '../../../assets/input-calendar.svg'
import { useStatisticsDownloadLazyQuery } from '../../../types/graphql'
import { useReactiveVar } from '@apollo/client'
import { errorsVar, successErrorType, userVar } from '../../../cache/cache'
import { EventCalendar } from '../../EventCalendar';
import JSZip from 'jszip'
import * as XLSX from 'xlsx';
import { saveAs} from 'file-saver'
import classNames from 'classnames'
import useOnClickOutside from '../../../hooks/useOnClickOutside'
import { CalendarDate, getLocalTimeZone, parseDate, today } from '@internationalized/date'
import { CalendarStateOptions } from 'react-stately'
import MaskedInput from 'react-text-mask'
import { maybeAddLeadingZero } from '../../../popup/ManageEvent/index.utils'
import './styles.css'

const Button = React.lazy(() => import('../../common/Button'))
const Checkbox = React.lazy(() => import('../../common/Checkbox'))

type operationCSV = {
    companyName: string,
    address: string,
    date: string,
    distanceDriven: number,
    timeSpent: number,
    total: number,
    amountKept: number,
    amountPaid: number
}

type fileData = {
    name: string,
    url: string
}

interface IDownloadOperationsDataProps {
    start: string
    end: string
}

const DownloadOperationsData: React.FC<IDownloadOperationsDataProps> = ({ start, end }) => {
    const [startDate, setStartDate] = React.useState<string>(start || today(getLocalTimeZone()).toString())
    const [endDate, setEndDate] = React.useState<string>(end || today(getLocalTimeZone()).toString())   
    const [calendarStartDate, setCalendarStartDate] = React.useState<CalendarDate>(parseDate(startDate))
    const [calendarEndDate, setCalendarEndDate] = React.useState<CalendarDate>(parseDate(endDate))
    const [isStartDatePickerVisible, setIsStartDatePickerVisible] = React.useState<boolean>(false)
    const [isEndDatePickerVisible, setIsEndDatePickerVisible] = React.useState<boolean>(false)
    const [isStartFocused, setIsStartFocused] = React.useState<boolean>(false)
    const [isEndFocused, setIsEndFocused] = React.useState<boolean>(false)
    const [isLoading, setIsLoading] = React.useState<boolean>(false)
    const [withFiles, setWithFiles] = React.useState<boolean>(false);
    const [searchParams] = useSearchParams();
    const { t } = useTranslation()
    const navigate = useNavigate()
    const location = useLocation()
    const user = useReactiveVar(userVar)
    let errors = useReactiveVar(errorsVar)
    const [loadStatistics] = useStatisticsDownloadLazyQuery({
        onError: e => console.log(e.graphQLErrors[0].extensions?.code)
    })

    function updateSearchParams(start: string, end: string) {
        searchParams.set('startDate', start);
        searchParams.set('endDate', end);
        navigate(location.pathname+'?'+searchParams.toString())
    }
    
    const calendarStartRef = React.useRef(null)
	useOnClickOutside(calendarStartRef, () => {
		setIsStartDatePickerVisible(false)
		setCalendarStartDate(parseDate(startDate))
        updateSearchParams(startDate, endDate)
	})    
    const calendarEndRef = React.useRef(null)
	useOnClickOutside(calendarEndRef, () => {
		setIsEndDatePickerVisible(false)
		setCalendarEndDate(parseDate(endDate))
        updateSearchParams(startDate, endDate)
	})

    const handleStartDateInputFocus = React.useCallback(() => {
		setIsStartFocused(true);
		setIsStartDatePickerVisible(false)
	}, [])
    const handleEndDateInputFocus = React.useCallback(() => {
		setIsEndFocused(true);
		setIsEndDatePickerVisible(false)
	}, [])

    const handleStartDateInputBlur: React.FocusEventHandler<HTMLInputElement> = React.useCallback((event) => {
		setIsStartFocused(false);
		const day = event.target.value.slice(0, 2)
		const month = event.target.value.slice(3, 5)
		const year = event.target.value.slice(6, 10)
		const selectedDate = `${year}-${month}-${day}`
        updateSearchParams(selectedDate, endDate)
		try {
            setCalendarStartDate(parseDate(selectedDate));
            setStartDate(selectedDate);
		} catch {			
            setCalendarStartDate(parseDate(startDate));
		}
	}, [startDate])

    const handleEndDateInputBlur: React.FocusEventHandler<HTMLInputElement> = React.useCallback((event) => {
		setIsEndFocused(false);
		const day = event.target.value.slice(0, 2)
		const month = event.target.value.slice(3, 5)
		const year = event.target.value.slice(6, 10)
		const selectedDate = `${year}-${month}-${day}`
        updateSearchParams(startDate, selectedDate)
		try {
            setCalendarEndDate(parseDate(selectedDate));
            setEndDate(selectedDate);
		} catch {			
			setCalendarEndDate(parseDate(endDate));
		}
	}, [endDate])

    const calendarStartStateOptions = React.useMemo<Partial<CalendarStateOptions>>(() => ({
		value: parseDate(startDate),
		onChange: (date: any) => {
            const day = maybeAddLeadingZero(date.day)
			const month = maybeAddLeadingZero(date.month)
			setCalendarStartDate(parseDate(`${date.year}-${month}-${day}`))
		}		
	}), [startDate])
    const calendarEndStateOptions = React.useMemo<Partial<CalendarStateOptions>>(() => ({
		value: parseDate(endDate),
		onChange: (date: any) => {
            const day = maybeAddLeadingZero(date.day)
			const month = maybeAddLeadingZero(date.month)
			setCalendarEndDate(parseDate(`${date.year}-${month}-${day}`))
		}		
	}), [endDate])

    const downloadZip = async () => {
        errors = errorsVar([])
        const newErrors: successErrorType[] = []
        if ((startDate || '').trim().length === 0) newErrors.push({ place: 'statistics.startdate', message: t('errors.date-required') })
        if ((endDate || '').trim().length === 0) newErrors.push({ place: 'statistics.enddate', message: t('errors.date-required') })
        if (moment(endDate).isBefore(moment(startDate))) newErrors.push({ place: 'statistics.enddate', message: t('errors.date-interval') })        
        if (newErrors.length === 0) {
            setIsLoading(true)
            let dataFile: fileData[] = []
            const fileNames: string[] = []
            const { data } = await loadStatistics({variables: {startDate, endDate }})
            const operationsCSV: operationCSV[] = data?.statisticsDownload?.map(el => {
                if (withFiles) {
                    el?.files?.forEach(file => {
                        if (!file || !file.name) return 
                        let fileName:string = file?.name
                        let isChanged:boolean = false
                        let n: number = 1
                        while (fileNames.includes(fileName)) {
                            isChanged = true
                            const index: number = fileName.lastIndexOf('.')
                            const ext: string = fileName.slice(index + 1, fileName.length)
                            const indexCorrect = isChanged ? index - 3 : index
                            fileName = `${fileName.slice(0, indexCorrect)}(${n}).${ext}`
                            n +=1
                        }
                        dataFile.push({
                            name: fileName,
                            url: file?.urlGet || ""
                        })
                        fileNames.push(fileName)
                    })
                }
                return {
                    companyName: el?.companyName || "",
                    address: el?.companyAddress || "",
                    date: el?.date || "",
                    distanceDriven: el?.distanceDriven || 0,
                    timeSpent: el?.timeSpent || 0,
                    total: el?.total || 0,
                    amountKept: el?.amountKept || 0,
                    amountPaid: el?.amountPaid || 0
                }
            }) || []
                                  
            const ws = XLSX.utils.json_to_sheet(operationsCSV)
            const wb = XLSX.utils.book_new()
            XLSX.utils.book_append_sheet(wb, ws, 'operations')
            const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
           
            const zip = new JSZip();
            const name: string = `operations ${moment(startDate).format("DD.MM.YYYY")}-${moment(endDate).format("DD.MM.YYYY")}`
            const rootFolder = zip.folder(name)
            rootFolder?.file("operations.xlsx", excelBuffer)
            if (withFiles) {
                const reseipts = rootFolder?.folder("receipts")
                await Promise.all(dataFile.map( async file => {
                    const fileBase64 = await getImageBase64FromUrl(file.url)              
                    if (fileBase64) reseipts?.file(file.name, fileBase64, {base64: true})
                }))
            }
            zip.generateAsync({type:"blob"}).then(function(content) {           
                saveAs(content, `${name}.zip`)
            })
            setIsLoading(false)
        } else {
            errorsVar(setError(errors, newErrors))
        }
    }
    const allErrors = errors.filter(el => ['statistics.startdate', 'statistics.enddate'].includes(el?.place || '') )   

    return (                
        <>
            {user?.isAdmin && (
                <>
                    {
                        allErrors.length > 0 &&
                        <ErrorMessage className="download__error" errors={allErrors} />
                    }
                </>
            )}
            <div className={classNames('input download__input', {
                'datepicker--show-title': !isStartFocused, 
                'datepicker--focused': isStartFocused})}
            >
                <div className='datepicker-wrap'>
                    {
                        !isStartFocused && 
                        <div className='datepicker__title'>
                            {t('DownloadOperationsData.startDate')}
                        </div>
                    }                        
                    <MaskedInput
                        placeholderChar=' '
                        value={`${maybeAddLeadingZero(calendarStartDate.day)}.${maybeAddLeadingZero(calendarStartDate.month)}.${calendarStartDate.year}`}
                        placeholder='DD.MM.YYYY'
                        mask={[/\d/, /\d/, '.', /\d/, /\d/, '.', /\d/, /\d/, /\d/, /\d/]}
                        className='input__input'
                        type='text'
                        onFocus={handleStartDateInputFocus}
                        onBlur={handleStartDateInputBlur}
                    />
                    <CalendarIcon
                        className='datepicker__icon'
                        onClick={() => setIsStartDatePickerVisible((s) => !s)}
                    />
                </div>
                {isStartDatePickerVisible && (
                    <div ref={calendarStartRef} className='download__calendar download__calendar--start'>
                        <EventCalendar                                
                            calendarStateOptions={calendarStartStateOptions}
                            prevSelectedDate={parseDate(startDate)}
                        />
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                            <button
                                onClick={() => {
                                    setCalendarStartDate(parseDate(startDate));
                                    updateSearchParams(startDate, endDate)
                                    setIsStartDatePickerVisible(false);
                                }}
                                className='download__button download__button--cancel'
                            >
                                {t('Popup.ManageEvent.calendar-cancel')}
                            </button>
                            <button
                                onClick={() => {
                                    setStartDate(calendarStartDate.toString() );
                                    updateSearchParams(calendarStartDate.toString(), endDate)
                                    setIsStartDatePickerVisible(false);
                                }}
                                className='download__button download__button--confirm'
                            >
                                {t('Popup.ManageEvent.calendar-done')}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        
            <div className={classNames('input download__input', {
                'datepicker--show-title': !isEndFocused, 
                'datepicker--focused': isEndFocused})}
            >
                <div className='datepicker-wrap'>
                    {
                        !isEndFocused && 
                        <div className='datepicker__title'>
                            {t('DownloadOperationsData.endDate')}
                        </div>
                    }                        
                    <MaskedInput
                        placeholderChar=' '
                        value={`${maybeAddLeadingZero(calendarEndDate.day)}.${maybeAddLeadingZero(calendarEndDate.month)}.${calendarEndDate.year}`}
                        placeholder='DD.MM.YYYY'
                        mask={[/\d/, /\d/, '.', /\d/, /\d/, '.', /\d/, /\d/, /\d/, /\d/]}
                        className='input__input'
                        type='text'
                        onFocus={handleEndDateInputFocus}
                        onBlur={handleEndDateInputBlur}
                    />
                    <CalendarIcon
                        className='datepicker__icon'
                        onClick={() => setIsEndDatePickerVisible(s => !s)}
                    />
                </div>
                {isEndDatePickerVisible && (
                    <div ref={calendarEndRef} className='download__calendar download__calendar--end'>
                        <EventCalendar                                
                            calendarStateOptions={calendarEndStateOptions}
                            prevSelectedDate={parseDate(endDate)}
                        />
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                            <button
                                onClick={() => {
                                    setCalendarEndDate(parseDate(endDate));
                                    setIsEndDatePickerVisible(false);
                                    updateSearchParams(startDate, endDate)
                                }}
                                className='download__button download__button--cancel'
                            >
                                {t('Popup.ManageEvent.calendar-cancel')}
                            </button>
                            <button
                                onClick={() => {
                                    setEndDate(calendarEndDate.toString() );
                                    updateSearchParams(startDate, calendarEndDate.toString())
                                    setIsEndDatePickerVisible(false);
                                }}
                                className='download__button download__button--confirm'
                            >
                                {t('Popup.ManageEvent.calendar-done')}
                            </button>
                        </div>
                    </div>
                )}
            </div>
            {user?.isAdmin && (
                <div className='download__buttons'>
                    <Button
                        onClick={downloadZip}
                        text={ isLoading
                            ? t('DownloadOperationsData.wait')
                            : t('DownloadOperationsData.download-button')
                        }
                    />
                    <Checkbox
                        id="with-files"
                        checkboxValue="1"
                        name="download-files"
                        title="Files"
                        value={withFiles ? "1" : ""}
                        onChange={() => setWithFiles(!withFiles)}
                    />
                </div>
            )}
        </>   
    )
}

export default DownloadOperationsData