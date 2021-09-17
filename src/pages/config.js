
let baseUrl = 'http://192.168.0.167:1337'
const getDefaultHeader = () => ({
    'x-auth-token': window.localStorage.getItem('token')
});
const staticServerUrl = 'http://192.168.0.167:3000'

let config = {
    baseUrl,
    getDefaultHeader,
    staticServerUrl
}


export { baseUrl, getDefaultHeader, staticServerUrl }
export default config;