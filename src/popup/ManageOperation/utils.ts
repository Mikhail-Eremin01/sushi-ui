import axios from 'axios'
import { Buffer } from 'buffer'

type file = {
    name: string,
    type: string,
    typeProof: string,
    size: number,
    fileId: string,
    body: string
}

export const sendFilesToS3 = async(fileUrls: any[] | [], files: file[] | [] ) => {
    try {
        fileUrls?.forEach(async fileUrl => {
            const file = files.find(el => el.fileId === fileUrl.fileId)
            if(!file) throw new Error(`File not found`)
            if(!isBase64(file.body)) throw new Error(`Wrong base64 string`)
            const base64 = file.type.slice(0, 6) === 'image/' 
                ? file.body.replace(/^data:image\/\w+;base64,/, '')
                : file.body.replace(/^data:application\/\w+;base64,/, '')
            window.Buffer = window.Buffer || Buffer
            const buffer = window.Buffer.from(base64, 'base64')   
            await axios.put(fileUrl.urlPut, buffer, {
                headers: { 'Content-Type': file.type }
            })
        })        
    } catch(err) { console.log(err)}
}

export const isBase64 = (base64: string) => {
    const regex = '(data:\\w+\\/[a-zA-Z\\+\\-\\.]+;base64,)?(?:[A-Za-z0-9+\\/]{4})*(?:[A-Za-z0-9+\\/]{2}==|[A-Za-z0-9+\\/]{3}=)?'
    return (new RegExp('^' + regex + '$', 'gi')).test(base64)
}