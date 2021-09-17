import axios from 'axios';
import { getDefaultHeader, baseUrl } from '../../../pages/config';
import { getErrorMessage } from '../../network-error-handling';

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
let object = {
    getAnnouncement
};

export default object

