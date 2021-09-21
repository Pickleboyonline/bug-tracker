import axios from 'axios';
import { getDefaultHeader, baseUrl } from '../../../pages/config';
import { getErrorMessage } from '../../network-error-handling';


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


/**
 * Leave project (only works if use is not owner)
 * @param {string} projectId
 * @returns 
 */
const leaveProject = async (projectId) => {
    try {
        await axios.delete(baseUrl + '/project/member/me', {
            headers: getDefaultHeader(),
            params: {
                projectId
            }
        })

    } catch (e) {
        throw new Error(getErrorMessage(e))
    }
}
function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}


export default ({
    leaveProject
})

