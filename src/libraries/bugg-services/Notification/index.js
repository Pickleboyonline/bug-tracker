const { getErrorMessage } = require('./../../network-error-handling');
const axios = require('axios');
const { getDefaultHeader, baseUrl } = require('./../../../pages/config');


const throwError = err => {
    throw new Error(getErrorMessage(err))
}

/**
 * Gets all
 * @returns {Number}
 */
const getUnreadNotifications = async () => {
    try {
        let { data: { totalUnreadNotifcations } } = await axios.get(baseUrl + '/notification/all', {
            headers: getDefaultHeader(),
            params: {
                limit: 0,
                skip: 0
            }
        })

        return totalUnreadNotifcations

    } catch (e) {
        throwError(e)
    }
}


module.exports = {
    getUnreadNotifications
}

