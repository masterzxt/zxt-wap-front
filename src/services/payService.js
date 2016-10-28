angular.module('q-wap-front').factory('payService', ['appConfig', '$mdDialog', '$q', function (appConfig, $mdDialog, $q) {
    /*抢单弹框*/
    function pay(type, payType, data) {
        // 扫一扫的时候,负责数据
        if (type === 'SCAN') {
            // 支付宝
            if (payType === 'ALIPAY') {
                return data.aliPay.scan.qr_code
                // $scope.params.codeUrl = resp.data.aliPay.scan.qr_code;
            } else {
                return data.weiXin.code_url
                // 微信
                // $scope.params.codeUrl = resp.data.weixin.code_url;
            }
        } else if (type === 'WAP') {
            // console.log(data.aliPay.uri)
            var urldecode = decodeURIComponent(data.aliPay.uri);
            window.location.href = urldecode;
        } else if (type === 'qhPub') {
            var ua = window.navigator.userAgent.toLowerCase();
            if (ua.match(/MicroMessenger/i) && !ua.match(/windows/i)) {
                // 处于微信浏览器，打开微信支付
                var payParams = data.payParams;
                payParams.success = function () {
                    return true;
                };
                payParams.fail = function () {
                    return false;
                };
                wx.chooseWXPay(payParams);
            } else {
                alert("当前不支持微信支付");
            }

        } else {
            // 支付宝
            if (payType === 'ALIPAY') {
                window.alipay.pay(data, function (successResults) {
                    return true;
                }, function (errorResults) {
                    return false;
                });
                // $scope.params.codeUrl = resp.data.aliPay.scan.qr_code;
            } else {
                var payParams = data.payParams;
                window.Wechat.sendPaymentRequest(payParams, function () {
                    return true;
                }, function () {
                    return false;
                });
            }
        }
    };

    return {
        pay: pay
    };

}]);