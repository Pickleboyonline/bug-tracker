

/**
 * Retrieves error message from AJAX request
 * @param {Error} error 
 * @returns {String} The error message
 */
const getErrorMessage = (error) => {
    if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx\
        // let message = '';
        // console.log(error.response.data);
        // console.log(error.response.status);
        // console.log(error.response.headers);

        if ((typeof error.response.data) === 'string') {
            return error.response.data.split('\n')[0]
        }

        if (error.response.status === 403) {
            return 'FORBIDDEN'
        } else if (error.response.status === 500) {
            return 'Server Error'
        } else {
            return 'unknown'
        }

    } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        //console.log(error.request);
        return 'Request Timeout'
    } else {
        // Something happened in setting up the request that triggered an Error
        //console.log('Error', error.message);
        return error.message
    }
    // console.log(error.config);

}

/**
 * Logs error with console.error
 * @param {Error} error 
 */
const logErrorMessage = (error) => {
    console.error('Error: ' + getErrorMessage(error))
}

module.exports = {
    getErrorMessage,
    logErrorMessage
}


