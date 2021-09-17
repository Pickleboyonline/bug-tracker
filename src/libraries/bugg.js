import axios from 'axios';
import Announcement from './bugg-services/Announcement/index';
import Bug from './bugg-services/Bug/index';
import Project from './bugg-services/Project/index';
import Message from './bugg-services/Message/index';
import Notification from './bugg-services/Notification/index';
import User from './bugg-services/User/index';
import { getErrorMessage } from './network-error-handling';
import { getDefaultHeader, baseUrl } from './../pages/config'

function UserData(obj = {
    name: '',
    email: '',
    id: ''
}) {
    this.name = obj.name;
    this.email = obj.email;
    this.id = obj.id;
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


let bugg = {
    /**
     * Gets user info from server
     * @returns {UserData} user
     */
    getMe,
    User,
    Notification,
    Message,
    Bug,
    Announcement,
    Project
}


export {
    getMe,
    User,
    Notification,
    Message,
    Bug,
    Announcement,
    Project
}
export default bugg;

