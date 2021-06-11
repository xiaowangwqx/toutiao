// postCSS配置文件
module.exports = {
    plugins: {
        // 生成浏览器css样式规则前缀
        // 'autoprefixer': {
        //     // 配置要兼容的环境信息
        //     browsers: ['Android >= 4.0', 'iOS >= 8']
        // },
        // 配置要使用postcss-pxtorem插件
        // 把px转换为rem
        'postcss-pxtorem': {
            // 如果你使用的是基于 lib-flexable 的 REM 适配方案，则应该设置为你的设计稿的十分之一。
            // 例如设计稿是 750 宽，则应该设置为 75。
            // 因为 Vant 是基于 375 写的，所以如果你设置为 75 的话，Vant 的样式就小了一半
            // 必须设置为37.5 缺点是设计稿尺寸必须除以2
            // 解决方法 如果是vantu样式 就按照37.5转换 如果是自己的样式 就按照75转换
            // postCSS处理每个css文件都会调用这个函数 会把被处理的css文件通过参数传递给该函数
            rootValue({ file }) {
                return file.indexOf('vant') !== -1 ? 37.5 : 75
            },
            // 配置要转换的css属性 *表示所有
            propList: ['*']
        }
    }
}