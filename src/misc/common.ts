import axios from 'axios'
import _ from 'lodash'
import { successErrorType } from '../cache/cache'
import { Buffer } from 'buffer'

export const setError = (errors: successErrorType[], error: successErrorType[]): successErrorType[] => {
    return _.uniqWith([ ...errors, ...error ], _.isEqual)
}

export const validateEmail = (email: string) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; // eslint-disable-line
    return re.test(String(email).toLowerCase())
}

export const convertFileToBase64 = (file: File) => {
    return new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = reject
    })
}

export const truncate = (str: string, len: number = 150) => {
    return str.length > len ? `${str.substring(0, len)}...` : str
}

export const validURL = (str: string) => {
    var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return !!pattern.test(str);
}

/**
 * Escape special characters in the given string of text.
 *
 * @param  {string} string The string to escape for inserting into HTML
 * @return {string}
 * @public
 */

export const escapeHtml = (string: string) => {
    var str = '' + string
    var match = /["'&<>]/.exec(str)
  
    if (!match) {
      return str
    }
  
    var escape
    var html = ''
    var index = 0
    var lastIndex = 0
  
    for (index = match.index; index < str.length; index++) {
      switch (str.charCodeAt(index)) {
        case 34: // "
          escape = '&quot;'
          break
        case 38: // &
          escape = '&amp;'
          break
        case 39: // '
          escape = '&#39;'
          break
        case 60: // <
          escape = '&lt;'
          break
        case 62: // >
          escape = '&gt;'
          break
        default:
          continue
      }
  
      if (lastIndex !== index) {
        html += str.substring(lastIndex, index)
      }
  
      lastIndex = index + 1
      html += escape
    }
  
    return lastIndex !== index
      ? html + str.substring(lastIndex, index)
      : html
}

/**
 * Склонение числительных
 * countTextFormatter(count, ['найдена', 'найдено', 'найдены'])
 * @param n 
 * @param titles 
 * @returns 
 */
export const countTextFormatter = (n: number, titles: [string, string, string]) => {
    return titles[(n % 10 === 1 && n % 100 !== 11) ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2]
}

export const readAsDataURL = (file: File): Promise<{ data: string | ArrayBuffer | null, name: string, size: number, type: string }> => {
  return new Promise((resolve, reject) => {
      let fileReader = new FileReader()
      fileReader.onload = function() {
          return resolve({ data: fileReader.result, name: file.name, size: file.size, type: file.type })
      }
      fileReader.readAsDataURL(file)
  })
}

export const getImageBase64FromUrl = async (url: string): Promise<string> =>{
  try {   
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    window.Buffer = window.Buffer || Buffer
    const base64 = window.Buffer.from(response.data, 'binary').toString('base64');

    return base64;
  } catch (error) {
    console.error('Error fetching or converting the image:', error);
    throw error;
  }
}

export const writeCookie = (name: string, val: string, expires: number) => {
  var date = new Date();
  date.setDate(date.getDate() + expires);
  document.cookie = name+"="+val+"; path=/; expires=" + date.toUTCString();
}

export const readCookie = (name: string) => {
  let matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ))
  return matches ? decodeURIComponent(matches[1]) : undefined;
}
