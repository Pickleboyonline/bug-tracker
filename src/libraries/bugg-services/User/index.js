const { getErrorMessage } = require('./../../network-error-handling');
const axios = require('axios');
const { getDefaultHeader, baseUrl } = require('./../../../pages/config');

function UserData(obj = {
    name: '',
    email: '',
    id: ''
}) {
    this.name = obj.name;
    this.email = obj.email;
    this.id = obj.id;
}

const throwError = err => {
    throw new Error(getErrorMessage(err))
}

const getMe = async () => {
    try {
        let { data } = await axios.get(baseUrl + '/user/me', {
            headers: getDefaultHeader()
        })
        const { id, name, email } = data.user;
        let user = {
            id, name, email
        }
        return new UserData(user)
    } catch (e) {
        throw new Error(getErrorMessage(e))
    }
}
function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

/**
 * updates user (name or email ONLY)
 * @param {string} field 
 * @param {string} value 
 * @returns {UserData} updated user
 */
const updateUser = async (field, value) => {
    if (field === 'email' && !validateEmail(value)) {
        throw new Error('Email is invalid')
    }
    try {
        let { data: { user } } = await axios.put(baseUrl + '/user/update', {
            [field]: value
        }, {
            headers: getDefaultHeader()
        });

        return new UserData(user)
    } catch (e) {
        throwError(e)
    }
}

/**
 * Updates password, MUST SET TOKEN AFTER THIS
 * @param {string} password current password
 * @param {string} newPassword new password
 * @returns {string} token
 */
const updatePassword = async (password, newPassword) => {
    try {
        let { data } = await axios.patch(baseUrl + '/user/password', {
            password,
            newPassword
        }, {
            headers: getDefaultHeader()
        });
        // console.log(data)
        return data.token
    } catch (e) {
        throwError(e)
    }
}

module.exports = {
    getMe,
    updateUser,
    updatePassword
}

