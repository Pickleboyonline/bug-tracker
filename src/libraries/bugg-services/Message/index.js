const { getErrorMessage } = require('./../../network-error-handling');
const axios = require('axios');
const { getDefaultHeader, baseUrl } = require('./../../../pages/config');



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


module.exports = {
    getConversations,
    readAllMessages
}

