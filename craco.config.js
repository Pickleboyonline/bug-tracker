const CracoLessPlugin = require('craco-less');

module.exports = {
    plugins: [
        {
            plugin: CracoLessPlugin,
            options: {
                lessLoaderOptions: {
                    lessOptions: {
                        modifyVars: {
                            '@primary-color': '#1DA57A',
                            '@menu-dark-inline-submenu-bg': 'red'
                        },
                        javascriptEnabled: true,
                    },
                },
            },
        },
    ],
};