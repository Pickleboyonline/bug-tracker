import axios from 'axios';
import { getDefaultHeader, baseUrl } from './../../../pages/config';
import { getErrorMessage } from './../../network-error-handling';

const throwError = err => {
    throw new Error(getErrorMessage(err))
}

/**
 * Gets bug based on bugId
 * @param {string} bugId
 * @returns {Object} Bug
 */
const getBug = async (bugId) => {
    try {
        let { data: { bug } } = await axios.get(baseUrl + '/bug/' + bugId, {
            headers: getDefaultHeader()
        })

        return bug
    } catch (e) {
        throwError(e)
    }
}

const deleteBug = async (bugId) => {
    try {
        await axios.delete(baseUrl + '/bug/' + bugId, {
            headers: getDefaultHeader()
        })

    } catch (e) {
        throwError(e)
    }
}

export default {
    getBug,
    deleteBug
}

