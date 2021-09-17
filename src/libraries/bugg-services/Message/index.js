import axios from 'axios';
import { getDefaultHeader, baseUrl } from '../../../pages/config';
import { getErrorMessage } from '../../network-error-handling';



const throwError = err => {
    throw new Error(getErrorMessage(err))
}

/**
 * Gets all conversations
 * @returns {Array}
 */
const getConversations = async () => {
    try {


        let { data: { conversations } } = await axios.get(baseUrl + '/conversation/all', {
            headers: getDefaultHeader()
        })

        return conversations

    } catch (e) {
        throwError(e)
    }
}

const readAllMessages = async (conversationId) => {
    try {
        await axios.patch(baseUrl + '/message/read/' + conversationId, {}, {
            headers: getDefaultHeader()
        })
    } catch (e) {
        throwError(e)
    }
}

export default ({
    getConversations,
    readAllMessages
})

