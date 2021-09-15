const axios = require('axios')
const { getDefaultHeader, baseUrl } = require('./../pages/config');
const { getErrorMessage } = require('./network-error-handling')
const User = require('./bugg-services/User/index')
const Notification = require('./bugg-services/Notification/index')

function UserData(obj = {
    name: '',
    email: '',
    id: ''
}) {
    this.name = obj.name;
    this.email = obj.email;
    this.id = obj.id;
}

module.exports = {
    /**
     * Gets user info from server
     * @returns {UserData} user
     */
    getMe: async () => {
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
    },

    User,
    Notification


}