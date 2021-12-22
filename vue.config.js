module.exports = {
    lintOnSave: false,
    // devServer: {
    //     host: '127.0.0.1',
    //     port: 8080,
    //     headers: {
    //         'Access-Control-Allow-Origin': '*',
    //     },
    //     hotOnly: false,
    //     disabledHostCheck: true
    // },
    publicPath: '/mit-wildfire/',
    configureWebpack: {
        resolve: {
            alias: {
                'assets': '@/assets',
                'components': '@/components',
                'data': '@/data'
            }
        }
    }
}