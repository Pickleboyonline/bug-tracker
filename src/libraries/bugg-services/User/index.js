import axios from 'axios';
import { getErrorMessage } from './../../network-error-handling'
import { baseUrl, getDefaultHeader } from './../../../pages/config';

function UserData(obj = {
    name: '',
    email: '',
    id: '',
    iconId: ''
}) {
    this.name = obj.name;
    this.email = obj.email;
    this.id = obj.id;
    this.iconId = obj.iconId
}

const throwError = err => {
    throw new Error(getErrorMessage(err))
}

const getMe = async () => {
    try {
        let { data } = await axios.get(baseUrl + '/user/me', {
            headers: getDefaultHeader()
        })
        const { id, name, email, iconId } = data.user;
        let user = {
            id, name, email, iconId
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
/**
 * Returns user avatar icon based on user id. Returns logged in user id by 
 * default
 * @param {string} id
 * @returns {string} iconId
 */
const getUserIconUri = async (id) => {
    try {
        let { iconId } = await getMe();
        if (iconId) {
            return baseUrl + '/user/icon/' + iconId
        } else {
            return ''
        }
    } catch (e) {
        throwError(e);
    }
}


/**
 * Uploads user avatar
 * @param {FormData} formData attatch 1 icon to "icon" 
 */
const uploadUserIcon = async (formData) => {
    try {
        if (!formData) throw new Error('Must have formData')

        await axios.post(baseUrl + '/user/icon', formData, {
            headers: {
                ...(getDefaultHeader()),
                'Content-Type': 'multipart/form-data'
            }
        });

    } catch (e) {
        throwError(e)
    }
}

let obj = {
    getMe,
    updateUser,
    updatePassword,
    getUserIconUri,
    uploadUserIcon
}

export {
    getMe,
    updateUser,
    updatePassword,
    getUserIconUri,
    uploadUserIcon
};
export default obj;

