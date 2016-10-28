// 开发环境的配置
angular.module('q-wap-front').factory('appConfig', function () {

    // // -------------------------- mock api
    // var domain = "http://dev.test.me";
    // var rootPath = domain + "/qh/admin/mock/";
    // var apiPath = rootPath + "/16025/api";


    // // -------------------------- 测试环境 api
    var domain = "//kingsilk.net";
    var rootPath = domain + "/q/wap/local/?_ddnsPort=16400";   // 如果后台开发人员使用本地启动的API，仅仅修改此行的端口即可，不要提交修改。
    var apiPath = domain + "/q/wap/local/16400/api";
    var appVersion = "1.0.0";
    return {
        share: "https:" + rootPath + "#/share",
        apiPath: apiPath,
        appVersion: appVersion,
        maxSize: 5,  // 页数多少多少翻页数
        pageSize: 10, // 每页多少条数据
        imgUrl: "//o96iiewkd.qnssl.com/",   // 图片地址
        cdnUrl: "//o96iczjtp.qnssl.com/q-wap-front/prod/",// cdn地址访问本地图片
        imgView1: "?imageView2/2/w/500/h/500",// 对图片进行缩放(首页)
        imgView2: "?imageView2/2/w/100/h/100",// 对图片进行缩放(用户中心)
        imgUpload: "/common/uploadImgS",
        tokenImg: apiPath + "/common/generatorToken"
    };
});
