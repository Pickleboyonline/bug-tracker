
module.exports = {
    baseUrl: 'http://192.168.0.167:1337',
    getDefaultHeader: () => ({
        'x-auth-token': window.localStorage.getItem('token')
    }),
    staticServerUrl: 'http://192.168.0.167:3000'
}