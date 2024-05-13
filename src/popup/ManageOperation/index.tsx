import React, { useState } from 'react'
import _ from 'lodash'
import moment from 'moment'
import { useTranslation } from 'react-i18next'
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom'
import { useReactiveVar } from '@apollo/client'
import { userVar, operationEditVar, errorsVar, successErrorType } from '../../cache/cache'
import {
    EditOperationMutationVariables,
    useAddOperationMutation,
    useEditOperationMutation,
    useCompaniesQuery
} from '../../types/graphql'
import { STATISTICS } from '../../graphql/queries'
import { readAsDataURL, setError } from '../../misc/common'
import { ISelectItem } from '../../components/StatisticComponents/SelectFile'
import { ReactComponent as CalendarIcon } from '../../assets/input-calendar.svg'
import { FileUploader } from 'react-drag-drop-files'
import { v4 as uuid } from 'uuid'
import { sendFilesToS3 } from './utils'
import InputDropDownList from '../../components/common/InputDropDownList/InputDropDownList'
import { LIMIT } from '../../pages/Statistics'

import './styles.css'

const Input = React.lazy(() => import('../../components/common/Input'))
const Button = React.lazy(() => import('../../components/common/Button'))
const ErrorMessage = React.lazy(() => import('../../components/common/ErrorMessage'))
const Select = React.lazy(() => import('../../components/common/Select'))
const Radio = React.lazy(() => import('../../components/common/Radio'))
const UploadFileList = React.lazy(() => import('../../components/StatisticComponents/UploadFileList'))
const fileTypes = ["JPG", "JPEG", "PNG", "GIF", "PDF"]

const ManageOperaton: React.FC = () => {
    const [fields, setFields] = React.useState<EditOperationMutationVariables>({
        operationId: '', 
        date: moment().format('YYYY-MM-DDTHH:mm'),
        companyId: '',
        status: 'process',
        total: 0,
        amount:0,
        payout: 50,
        amountPaid: 0, 
        amountKept: 0,
        timeSpent: 0,
        distanceDriven:0,
        funds: ['']
    })
    const [select, setSelect] = React.useState<ISelectItem[]>([
        { name: 'Not selected', value: '', selected: true }
    ])
    const [valueDropDown, setValueDropDown] = React.useState<string>('')
    const [files, setFiles] = useState<any[]>([])
    const { t } = useTranslation()
    const navigate = useNavigate()
    const location = useLocation()
    const user = useReactiveVar(userVar)
    const editFields = useReactiveVar(operationEditVar)
    let errors = useReactiveVar(errorsVar)
    const [searchParams] = useSearchParams({})
    const page = (Number(searchParams.get('page')) === 0) ? 1 : Number(searchParams.get('page'))
    const end = searchParams.get('endDate') || moment().format("YYYY-MM-DD")
    const start = searchParams.get('startDate') || moment().subtract(1, "month").format("YYYY-MM-DD")
    const status = searchParams.get('status')
    
    const { data } = useCompaniesQuery()

    const [updateOperation] = useEditOperationMutation({
        onCompleted: async data => {
            if (data?.editOperation) {
                const fileUrlstoAdd = data.editOperation?.files?.filter(file => (files.filter(el => el?.fileId === file?.fileId && el.body).length > 0)) || []
                await sendFilesToS3(fileUrlstoAdd, files)
                navigate(location.pathname+location.search)
            }
            operationEditVar(null)
        },
        
        refetchQueries: [
            {
                query: STATISTICS,
                variables: {
                    offset: (page - 1) * LIMIT,
                    limit: LIMIT,
                    startDate: start,
                    endDate: end,
                    status: (status && ["process", "success", "fail"].includes(status)) ? status : null
                }
            }
        ]
    })
     
    const [addOperation] = useAddOperationMutation({
        onCompleted: async data => {
            if (data?.addOperation) {
                operationEditVar(null)
                const fileUrls = data.addOperation.files || []
                await sendFilesToS3(fileUrls, files)
                navigate(location.pathname+location.search)
            }
        },
        onError: err => {
            console.log('ADD OPERATION ERROR', err)
        },
        refetchQueries: [
            {
                query: STATISTICS,
                variables: {
                    offset: (page - 1) * LIMIT,
                    limit: LIMIT,
                    startDate: start,
                    endDate: end,
                    status: (status && ["process", "success", "fail"].includes(status)) ? status : null
                }
            },
        ]
    })

    React.useEffect(() => {
        if(editFields !== null) {
            data?.companies?.companies?.map((elem) => {
                if(elem?.id === editFields.companyId) {
                    setValueDropDown(elem.name!)
                }
            })
        }
    }, [data])

    //Redirect to auth
    React.useEffect(() => {
        if (user === null) {
            navigate('/', { replace: true })
        }
    }, [ user, navigate ])  
    
    //Set edit fields
    React.useEffect(() => {
        if (editFields !== null && select.length > 1) {
            setFields(editFields)
            if (editFields.amount && editFields.amount !== 0) {
                setFields({
                    ...editFields,
                    amountPaid: editFields.amount,
                })
            }
            if (editFields.files) {
                setFiles(Object.values(editFields.files))
            }
        }
    }, [editFields, select])

    //Set companies select
    React.useEffect(() => {
        if (data?.companies && data?.companies.companies && select.length === 1) {
            const newItems = data?.companies.companies.map(el => ({ name: el?.name || '', value: el?.id || '', selected: false }))
            const newSelect = _.union(_.cloneDeep(select), newItems)
            setSelect(newSelect)
        }
    }, [data?.companies, select, fields.companyId])

    const title = (editFields === null) ? t('Popup.ManageOperation.add-title') : t('Popup.ManageOperation.edit-title')
    const button = (editFields === null) ? t('Popup.ManageOperation.add-button') : t('Popup.ManageOperation.edit-button')
    
    const onChangeType = (val:string, index:number) => {
        const newFiles = _.cloneDeep(files)
        newFiles[index].typeProof = val
        setFiles(newFiles)
    }
    const onDeleteFile = (index:number) => {
        setFiles(prevState => prevState.filter((file, ind) => ind !== index))
    }    
    
    const onChangeFiles = async(file: any) => {
        const body = await readAsDataURL(file[0])
        const fileToAdd = {
            body: body.data,
            name: file[0].name,
            type: file[0].type,
            typeProof: file[0].typeProof || '',
            size: file[0].size,                  
            fileId: uuid()
        }
        setFiles(prevState => [...prevState, fileToAdd])        
    }
    function DragDrop() {        
        const childrenFileUploader = <div className="manage-operation__fileUploader-wrap">
            <div className="manage-operation__fileUploader-dragDrop">Drag and drop files, or Browse</div>
            <div className="manage-operation__fileUploader-support">Support png, jpeg, jpg or pdf files</div>
        </div>
        return (
            <>
                <label htmlFor="fileUploader" className="manage-operation__fileUploader-label">Upload files</label>
                <FileUploader
                    id="fileUploader"
                    handleChange={onChangeFiles}
                    name="file"
                    fileOrFiles={files}                    
                    types={fileTypes}                    
                    multiple={true} 
                    children={childrenFileUploader}
                    maxSize={20}
                />
                <UploadFileList
                    files={files}
                    onChangeType={onChangeType}
                    onDelete={onDeleteFile}
                />
            </>
          
        );
    }
        
    const submit = async () => {        
        errors = errorsVar([])
        const newErrors: successErrorType[] = []
        let filesToSendServer: any[] = []
        if(files && files[0]) {
            filesToSendServer =  files.map(file =>{ return {
                name: file.name,
                type: file.type,
                typeProof: file.typeProof || '',
                size: file.size ,                 
                fileId: file.fileId
            }})
        }
        
        if ((fields?.date || '').trim().length === 0) newErrors.push({ place: 'manage-operation.date', message: t('errors.date-required') })
        if ((fields?.companyId || '').trim().length === 0) newErrors.push({ place: 'manage-operation.company', message: t('errors.company-required') })
                     
        if (newErrors.length === 0) {
            (editFields === null)
                ? addOperation({ variables: {...fields, files: filesToSendServer} })                
                : updateOperation({ variables: {...fields, files: filesToSendServer} })
        } else {
            errorsVar(setError(errors, newErrors))
        }        
        
    }

    function updatePaymentFields(val: number, type: "total" | "amountPaid" | "payout" | "amountKept") {
        let total = fields.total;
        let amountPaid = fields.amountPaid;
        let amountKept = fields.amountKept;
        let payout = fields.payout;

        switch (type) {
            case "total":
                total = +val.toFixed(2);
                amountPaid = +(total / 100 * payout).toFixed(2);
                amountKept = +(total - amountPaid).toFixed(2);
                break;
            case "amountPaid":
                amountPaid = +val.toFixed(2);
                amountKept = +(total - amountPaid).toFixed(2);
                payout = total ? +(amountPaid / total * 100).toFixed(1) : 0
                break;
            case "amountKept":
                amountKept = +val.toFixed(2);
                payout = total ? +((total - amountKept) / total * 100).toFixed(2) : 0;
                amountPaid = +(total - amountKept).toFixed(2);
                break;

            case "payout":
                payout = +val.toFixed(1)
                amountPaid = +(total / 100 * payout).toFixed(2);
                amountKept = +(total - amountPaid).toFixed(2);
                break;
        
            default:
                break;
        }
        
        setFields({ ...fields, total, amountPaid, payout, amountKept }) 
    }

    const onChangeCompany = (val: string) => {
        const company = data?.companies?.companies?.find(company => company?.id === val)
        const companyFunds = company && company?.funds && Array.isArray(company?.funds) ? company?.funds : []
        const randomFund = companyFunds[(Math.floor(Math.random() * companyFunds.length))]
        setFields({ ...fields, companyId: val, funds: [randomFund?.id || ""] })
    }

    const getCompanyFunds = (): ISelectItem[] => {
        const company = data?.companies?.companies?.find(company => company?.id === fields.companyId)
        const companyFunds = company && company?.funds && Array.isArray(company?.funds) ? company?.funds : []
        const selectFunds: ISelectItem[] = fields?.companyId && companyFunds
            ? companyFunds?.map(el => ({ 
                    name: el?.name || '', 
                    value: el?.id || '',
                    selected: !!(fields?.funds?.includes(el?.id || ""))
                }))
            : []
        return selectFunds
    }

    const allErrors = errors.filter(el => ['manage-operation.date', 'manage-operation.company', 'manage-operation.fund'].includes(el?.place || '') )
    const dateError = errors.find(el => el?.place === 'manage-operation.date' )
    const companyError = errors.find(el => el?.place === 'manage-operation.company' )
    const fundsError = errors.find(el => el?.place === 'manage-operation.fund' )
    
    return (
        <div className="manage-operation">
            <div className="manage-operation__title">{title}</div>
            {
                allErrors.length > 0 &&
                    <ErrorMessage className="manage-operation__error" errors={allErrors} />
            }
            <Input
                className="manage-operation__input"
                title={t('Popup.ManageOperation.date')}
                placeholder={t('Popup.ManageOperation.date-placeholder')}
                type="datetime-local"
                value={fields?.date || ''}
                onChange={ val => setFields({ ...fields, date: val }) }
                error={dateError !== undefined} icon={<CalendarIcon/>}
            />
            <InputDropDownList className="manage-operation__dropDownList" 
                title={t('Popup.ManageOperation.company')} 
                schema={select}
                value={valueDropDown}
                onChangeDropDown={setValueDropDown}
                onChange={val => onChangeCompany(val)} 
                error={companyError !== undefined} 
            />
            <Select className="manage-operation__select" 
                title={t('Popup.ManageOperation.funds')}
                schema={getCompanyFunds()} 
                value={(fields.funds && fields.funds[0]?.toString()) || '' } 
                onChange={val => {                                      
                    setFields({ ...fields, funds: [val] })
                } } 
                error={fundsError !== undefined} 
            />
            <div className="manage-operation__radio-title">{t('Popup.ManageOperation.status')}</div>
            <div className="manage-operation__radio">
                <Radio id="process" title={t('Popup.ManageOperation.status-process')} name="status" radioValue="process" value={fields.status} onChange={ val => setFields({ ...fields, status: val }) } />
                <Radio id="success" title={t('Popup.ManageOperation.status-success')} name="status" radioValue="success" value={fields.status} onChange={ val => setFields({ ...fields, status: val }) } />
                <Radio id="fail" title={t('Popup.ManageOperation.status-fail')} name="fail" radioValue="fail" value={fields.status} onChange={ val => setFields({ ...fields, status: val }) } />
            </div>
            <div className="manage-operation__groupInput">            
                <Input 
                    className="manage-operation__input" 
                    title={t('Popup.ManageOperation.total')} 
                    placeholder={t('Popup.ManageOperation.total-placeholder')} 
                    type='number' 
                    value={String(fields?.total) || ''} 
                    onChange={ val => updatePaymentFields(+val, "total")}
                />
                <Input 
                    className="manage-operation__input" 
                    title={t('Popup.ManageOperation.payout')} 
                    placeholder={t('Popup.ManageOperation.payout-placeholder')} 
                    type='number' 
                    value={String(fields?.payout) || ''}
                    onChange={ val => updatePaymentFields(+val, "payout")}
                />
            </div>
            <div className="manage-operation__groupInput">   
                <Input 
                    className="manage-operation__input" 
                    title={t('Popup.ManageOperation.amountPaid')} 
                    placeholder={t('Popup.ManageOperation.amountPaid-placeholder')} 
                    type='number' 
                    value={String(fields?.amountPaid) || ''}
                    onChange={ val => updatePaymentFields(+val, "amountPaid")}
                />
                <Input 
                    className="manage-operation__input" 
                    title={t('Popup.ManageOperation.amountKept')} 
                    placeholder={t('Popup.ManageOperation.amountKept-placeholder')} 
                    type='number' 
                    value={String(fields?.amountKept) || ''}
                    onChange={ val => updatePaymentFields(+val, "amountKept")}
                />
            </div>
            <div className="manage-operation__groupInput">
                <Input className="manage-operation__input" title={t('Popup.ManageOperation.timeSpent')} placeholder={t('Popup.ManageOperation.timeSpent-placeholder')} type='number' value={String(fields?.timeSpent) || ''} onChange={ val => setFields({ ...fields, timeSpent: parseFloat(parseFloat(val).toFixed(2)) || 0 }) } />
                <Input className="manage-operation__input" title={t('Popup.ManageOperation.distanceDriven')} placeholder={t('Popup.ManageOperation.distanceDriven-placeholder')} type='number' value={String(fields?.distanceDriven) || ''} onChange={ val => setFields({ ...fields, distanceDriven: parseFloat(parseFloat(val).toFixed(2)) || 0 }) } />
            </div>
            {DragDrop()}
            <Button text={button} className="manage-operation__btn" onClick={ () => submit() } />
        </div>
    )
}

export default ManageOperaton