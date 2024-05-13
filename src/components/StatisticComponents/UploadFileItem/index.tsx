import React, { useState } from 'react'
import { ISelectItem } from '../SelectFile'
import { getShortName} from '../utils'
import './styles.css'

const SelectFile = React.lazy(() => import('../SelectFile'))
interface IUploadFileItemProps {    
    name: string
    size: number
    typeProof?: string
    onChangeType(val: string): void
    onDelete(): void
}
const UploadFileItem: React.FC<IUploadFileItemProps> = props => {

    const [typeProof, setTypeProof] = useState<string>(props?.typeProof || '')
    const [select] = useState <ISelectItem[]>([
        { name: 'Not selected', value: '', selected: typeProof === '' },
        { name: 'proofOfMoneyCollection', value: 'proofOfMoneyCollection', selected: typeProof === 'proofOfMoneyCollection' },
        { name: 'proofOfMoneyTransfer', value: 'proofOfMoneyTransfer', selected: typeProof === 'proofOfMoneyTransfer' }
    ])
    const onChange = (val: string) => {
        props?.onChangeType(val)
        setTypeProof(val)
    }

    const getImgClassNames = (fileName: string) => {
        const ext = fileName.slice(fileName.length - 3)
        return `uploadFile-icon uploadFile-icon-${ext === 'pdf' ? 'pdf' : 'img'}`
    }
    return (
        <>
            <div className="uploadFileList__item-file-wrap">
                <div className={getImgClassNames(props?.name)}/>
                <div className="uploadFileList__item-file">
                    <div className="uploadFileList__item-file-name">{getShortName(props?.name, 7)} </div>
                    <div className="uploadFileList__item-file-size">{Math.round(props?.size/1024)}Kb</div>
                </div>
            </div>                    
            <div className="uploadFileList__select-wrap">
                <SelectFile
                    className="uploadFileList__select"
                    schema={select}
                    value={(props?.typeProof) ||''}
                    onChange={val => onChange(val)}
                />
                <button className="uploadFileList__btn-delete" onClick={props?.onDelete} />
            </div>
        </>
    )
}
export default UploadFileItem