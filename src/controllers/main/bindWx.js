/**
 * Module : xxx
 */
(function () {
    angular.module('q-wap-front')
        .config(['$stateProvider', function ($stateProvider) {

            $stateProvider.state("main.bindWx", {
                url: "/bindWx",
                views: {
                    "@": {
                        templateUrl: 'views/main/bindWx/index.root.html',
                        controller: bindWxController
                    }
                }
            });
        }]);


    // ----------------------------------------------------------------------------
    bindWxController.$inject = ['$scope', '$state', 'alertService',
        '$http', 'appConfig', '$httpParamSerializer'];
    function bindWxController($scope, $state, alertService,
                              $http, appConfig, $httpParamSerializer) {
        console.log(window.location.href);
        $scope.wxInfo = {};
        $scope.fallbackPage = function () {
            if (history.length === 1) {
                $state.go("main.index", null, {reload: true});
            } else {
                history.back();
            }
        };

        //获取用户微信的基本信息
        $http({
            method: "GET",
            url: appConfig.apiPath + "/user/getWxAccount"
        }).then(function (resp) {
            if(resp.data.code === 'SUCCESS'){
                $scope.wxInfo = resp.data;
            }
        }).then(function (resp) {

        });

        $scope.srcState = encodeURIComponent(window.location.href);
        // 绑定微信
        $scope.bindWx = function () {
            var ua = window.navigator.userAgent.toLowerCase();
            if (window.cordova) {
                var scope = "snsapi_userinfo";
                window.Wechat.isInstalled(function (installed) {
                    if (!installed) {
                        alertService.msgAlert("cancle", "您尚未安装微信!");
                        return;
                    }
                    // 获取登录用的 state
                    $http({
                        method: "POST",
                        url: appConfig.apiPath + '/weiXin/genLoginState',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                        }
                    }).then(function (resp) {
                        if (resp.data.code === "SUCCESS") {
                            // 调用微信 APP 进行登录
                            window.Wechat.auth(scope, resp.data.state, function (response) {
                                // you may use response.code to get the access token.
                                // 获取该商品的属性
                                $http({
                                    method: 'GET',
                                    url: appConfig.apiPath + "/weiXin/wxLoginVerify?code=" + response.code + "&state=" + response.state + "&wxType=qhApp"
                                }).then(function () {
                                    $scope.fallbackPage();
                                }, function () {

                                });
                            }, function () {

                            });
                        }
                    }, function () {

                    });
                }, function () {
                    alertService.msgAlert("cancle", "您尚未安装微信!");
                });
            } else if (ua.match(/MicroMessenger/i) && !ua.match(/windows/i)) {

                $http({
                    method: 'GET',
                    url: appConfig.apiPath + '/weiXin/wxOauthLogin?backUrl=' + $scope.srcState
                }).then(function (resp) {
                    var data = resp.data;
                    window.location.href = data.uri;
                }, function () {

                });
            } else {
                $http({
                    method: 'GET',
                    url: appConfig.apiPath + '/weiXin/wxWebLogin?backUrl=' + $scope.srcState
                }).then(function (resp) {
                    var data = resp.data;
                    window.location.href = data.uri;
                }, function () {

                });
            }
        };
        // 微信解绑
        $scope.relieveWx = function () {
            alertService.confirm(null, "", "确定解除绑定?", "取消", "确定").then(function (data) {
                if (data) {
                    $http({
                        method: "POST",
                        url: appConfig.apiPath + '/weiXin/wxRelieve',
                        data: $httpParamSerializer({}),
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                        }
                    }).success(function () {
                        alertService.msgAlert("success", "解绑成功");
                        $state.reload();
                    });
                }
            });
        };
    }
})();