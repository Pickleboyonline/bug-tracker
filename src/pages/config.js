
const isDev = true;

let baseUrl = true ? 'http://192.168.0.167:1337' : 'https://bugg.imranbey.com'
const getDefaultHeader = () => ({
    'x-auth-token': window.localStorage.getItem('token')
});
const staticServerUrl = isDev ? 'http://192.168.0.167:3000' : 'https://bugg.imranbey.com'

let config = {
    baseUrl,
    getDefaultHeader,
    staticServerUrl
}


export { baseUrl, getDefaultHeader, staticServerUrl }
export default config;