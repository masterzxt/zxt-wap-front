(function () {
    angular.module('q-wap-front').config(['$stateProvider', function ($stateProvider) {

        $stateProvider.state("main.login", {
            url: '/login?backUrl',
            views: {
                "@": {
                    templateUrl: 'views/main/login/index.root.html',
                    controller: loginController
                }
            }
        });


    }]);
    // ----------------------------------------------------------------------------
    loginController.$inject = ['$scope', '$http', '$state', 'alertService', 'appConfig', '$log', 'updateService'];
    function loginController($scope, $http, $state, alertService, appConfig, $log, updateService) {
        $scope.appVersion = appConfig.appVersion;
        $scope.srcState = $state.params.backUrl;
        $scope.login = {};
        /**
         * 回到主页面
         */
        $scope.fallbackPage = function () {
            $state.go("main.index");
        };


        $scope.fallbackPage = function () {
            $state.go("main.index");
        };
        /**
         * 获取背景图
         */
        $scope.getImg = function () {
            $http({
                method: "GET",
                url: appConfig.apiPath + '/index/backImg',
            }).then(function (resp) {
                $scope.login.bg = appConfig.imgUrl + resp.data.key;
                if (!$scope.login.bg.startsWith("http")) {
                    $scope.login.b = "https:" + $scope.login.b;
                }

            });
        };

        $scope.getImg();
        $scope.wxInstall = true;
        if (window.cordova) {
            // 检测是否安装微信
            window.Wechat.isInstalled(function (installed) {
                if (!installed) {
                    $scope.wxInstall = false;
                }
            }, function (reason) {
                $scope.wxInstall = false;
            });
        }
        //微信登录
        var ua = window.navigator.userAgent.toLowerCase();
        $scope.wxLogin = function () {
            updateService.init();
            if (!$scope.wxInstall) {
                return;
            }
            var url = "";
            if ($scope.srcState) {
                // 在这里要重新给url解码后在重新编码
                url = decodeURIComponent($scope.srcState);
                url = encodeURIComponent(url);
            }
            var ua = window.navigator.userAgent.toLowerCase();
            if (ua.match(/MicroMessenger/i) && !ua.match(/windows/i)) {
                $http
                    .get(appConfig.apiPath + '/weiXin/wxOauthLogin?backUrl=' + url)
                    .success(function (data) {
                        window.location.href = data.uri;
                    });
            } else if (window.cordova) {
                var scope = "snsapi_userinfo";
                // 获取登录用的 state
                $http({
                    method: "POST",
                    url: appConfig.apiPath + '/weiXin/genLoginState',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    }
                }).success(function (genState) {
                    // 调用微信 APP 进行登录
                    window.Wechat.auth(scope, genState.state, function (response) {
                        $log.log("====== Wechat.auth = " + JSON.stringify(response));
                        // you may use response.code to get the access token.
                        // 进行微信登陆
                        $http.get(appConfig.apiPath + "/weiXin/wxLoginVerify?code=" + response.code + "&state=" + response.state + "&wxType=qhApp")
                            .success(function () {
                                $scope.isLogin = true;
                                $scope.fallbackPage();
                            })
                            .error(function (data) {
                                if (data.code === "NOT_WEIXIN") {
                                    $state.go("main.register", {type: "bindWx"}, null);
                                }
                            });
                    }, function () {

                    });

                }).error(function (data, status, headers, config) {

                });
            } else {
                $http
                    .get(appConfig.apiPath + '/weiXin/wxWebLogin?backUrl=' + url)
                    .success(function (data) {
                        window.location.href = data.uri;
                    });
            }
        };
    }
})();