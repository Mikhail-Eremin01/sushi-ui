import React from 'react'
import { File } from "../../../types/graphql"
import { getShortName} from '../utils'
import { useTranslation } from 'react-i18next'
import './styles.css'

interface IFile {
    file: File
}
const FileItem: React.FC<IFile> = props => {
    const { t } = useTranslation()   

    const getImgClassNames = (fileName: string) => {
        const ext = fileName.slice(fileName.length - 3)
        return `file-icon file-icon-${ext === 'pdf' ? 'pdf' : 'img'}`
    }
          
    const openFile = () => {
        props?.file?.urlGet && window.open(props?.file?.urlGet, '_blank')
    }
    const type = props?.file?.typeProof && props?.file?.typeProof !== ''
        ? `${t(`Statistics.${props?.file?.typeProof}`)}`
        : ''
    return (
        <>
            { props?.file?.name && props?.file?.size &&
                <div className="file-wrap" onClick={openFile}>
                <div className={getImgClassNames(props?.file?.name || '')}/>
                <div className="file">
                    <div className="file-name">{getShortName(props?.file?.name || '', 16)} </div>
                    <div className="file-info">{type}</div>                                       
                    <div className="file-info">{Math.round((props?.file?.size || 0)/1024)}Kb</div>                                       
                </div>
            </div>
            }
             
        </>
    )
}
export default FileItem
