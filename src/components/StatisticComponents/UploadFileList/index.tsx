import React, { useState } from 'react'
import _ from 'lodash'
import UploadFileItem from '../UploadFileItem'
import './styles.css'

interface IUploadFileListProps {
    files: Array<{
        name: string,
        size: number,
        typeProof?: string
    }>
    onChangeType(val:string, index:number): void
    onDelete(index:number): void
    
}
const UploadFileList: React.FC<IUploadFileListProps> = props => {
    const{ files } = props
    const [fileList, setFileList] = useState<any[]>(files)
    
    const onChangeType = (val: string, index: number) => {
        props?.onChangeType(val, index)
        const newFiles = _.cloneDeep(files)
        newFiles[index].typeProof=val
        setFileList(newFiles)
    }
    const onDelete = (index:number) => {
        props?.onDelete(index)
        setFileList(prevState => prevState.filter((file, ind) => ind !== index))
    }
   
    return (
        <div className="uploadFileList__wrap">
            {
                props?.files?.map((el:{name: string, size: number, typeProof?: string}, index) => 
                    <div key={index} className="uploadFileList__item">
                        <UploadFileItem
                            name={el.name}
                            size={el.size}
                            typeProof={el.typeProof || ''}
                            onChangeType={ val=> onChangeType(val, index) }
                            onDelete={ () => onDelete(index) }
                        />
                    </div>
                )
            }
        </div>
    )
}
export default UploadFileList