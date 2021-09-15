const { getErrorMessage } = require('../../network-error-handling');
const axios = require('axios');
const { getDefaultHeader, baseUrl } = require('../../../pages/config');



const throwError = err => {
    throw new Error(getErrorMessage(err))
}

/**
 * Gets announcement based on announcementId
 * @param {string} announcementId
 * @returns {Object} Bug
 */
const getAnnouncement = async (announcementId) => {
    try {
        let { data: { announcement } } = await axios.get(baseUrl + '/announcement', {
            headers: getDefaultHeader(),
            params: {
                announcementId
            }
        })

        return announcement
    } catch (e) {
        throwError(e)
    }
}

module.exports = {
    getAnnouncement
}

