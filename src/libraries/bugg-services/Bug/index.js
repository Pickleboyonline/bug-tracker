const { getErrorMessage } = require('./../../network-error-handling');
const axios = require('axios');
const { getDefaultHeader, baseUrl } = require('./../../../pages/config');



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

module.exports = {
    getBug
}

