import axios from 'axios';
import { getDefaultHeader, baseUrl } from '../../../pages/config';
import { getErrorMessage } from '../../network-error-handling';


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


export default ({
    getUnreadNotifications
})

