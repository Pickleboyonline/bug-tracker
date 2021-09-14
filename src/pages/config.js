
module.exports = {
    baseUrl: 'http://localhost:1337',
    getDefaultHeader: () => ({
        'x-auth-token': window.localStorage.getItem('token')
    }),
}