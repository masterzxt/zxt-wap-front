// 测试环境的配置
angular.module('q-wap-front').factory('appConfig', function () {
    var domain = "https://kingsilk.net";
    var rootPath = domain + "/q/wap/local/?_ddnsPort=16500";
    var apiPath = domain + "/q/wap/local/16500/api";
    var appVersion = "1.0.0";
    return {
        share: "https:" + rootPath + "#/share",
        apiPath: apiPath,
        baidupushAndroid: "7VBX8YYexhEhM8I3fairhGjXTV1Yqzvq",
        appVersion: appVersion,
        maxSize: 5,  // 页数多少多少翻页数
        pageSize: 10, // 每页多少条数据
        imgUrl: "https://o96iiewkd.qnssl.com/",   // 图片地址
        cdnUrl: "https://o96iczjtp.qnssl.com/q-wap-front/prod/",// cdn地址访问本地图片
        imgView1: "?imageView2/1/w/500/h/200",// 对图片进行缩放(首页)
        imgView2: "?imageView2/2/w/100/h/100",// 对图片进行缩放(用户中心)
        imgUpload: "/common/uploadImgS",
        tokenImg: apiPath + "/common/generatorToken"
    };
});
