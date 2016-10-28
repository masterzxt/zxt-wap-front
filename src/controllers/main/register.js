/**
 * Module : xxx
 */
(function () {
    angular.module('q-wap-front')
        .config(['$stateProvider', function ($stateProvider) {

            $stateProvider.state("main.register", {
                url: "/register?type",
                views: {
                    "@": {
                        templateUrl: 'views/main/register/index.root.html',
                        controller: registerController
                    }
                }
            });
        }]);


    // ----------------------------------------------------------------------------
    registerController.$inject = ['$scope', '$state', 'alertService',
        '$http', 'appConfig', '$httpParamSerializer', '$interval'];
    function registerController($scope, $state, alertService,
                                $http, appConfig, $httpParamSerializer, $interval) {
        $scope.type = $state.params.type;
        $scope.user = {};
        $scope.fsyzm = "发送验证码";
        $scope.login = {};
        $scope.state = 1;
        if ($scope.type === 'register') {
            $scope.user.title = "手机注册";
        } else if ($scope.type === 'findPwd') {
            $scope.user.title = "找回密码";
        } else if ($scope.type === 'bindWx') {
            $scope.user.title = "绑定手机号";
        } else if ($scope.type === 'login') {
            $scope.user.title = "手机号登录";
        } else {
            $scope.fallbackPage();
        }
        var intervalStop = "";
        $scope.fallbackPage = function () {
            $state.go("main.login", null, {reload: true});
        };

        $scope.index = function () {
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
        // 进行登陆
        /*$scope.login = function () {
            if (!$scope.user.username) {
                alertService.msgAlert("exclamation-circle", "请输入账号");
                return;
            }

            $http({
                method: "POST",
                url: appConfig.apiPath + '/j_spring_security_check',
                data: $httpParamSerializer({
                    j_username: $scope.user.username,
                    j_password: $scope.user.password
                }),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            }).success(function (data) {
                $scope.index();
            }).error(function (data) {
                console.log(data);
            });
        };*/


        //首次加载
        // 进行注册/或找回密码
        $scope.register = function () {
            /*if ($scope.user.password === undefined || $scope.user.password.length < 6) {
                alertService.msgAlert("cancle", "密码太短");
                return;
            }*/
            if ($scope.user.code === undefined || $scope.user.code.length !== 6) {
                alertService.msgAlert("exclamation-circle", "请输入6位验证码");
                return;
            }
            $http({
                method: "POST",
                url: appConfig.apiPath + '/user/registerPhone',
                data: $httpParamSerializer({
                    code: $scope.user.code,
                    password: $scope.user.password,
                    phone: $scope.user.username,
                }),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            }).success(function (data, status, headers, config) {
                if ($scope.type === 'findPwd') {
                    alertService.msgAlert("success", "找回成功,请登录");
                    //跳转到登录页
                    $state.go("main.register", {type: "login"});
                } else if($scope.type === 'bindWx'){
                    alertService.msgAlert("success", "微信绑定成功");
                    //注册成功默认登录到首页/我的
                    $scope.index();
                }else if($scope.type === 'login'){
                    alertService.msgAlert("success", "登录成功");
                    //注册成功默认登录到首页/我的
                    $scope.index();
                }else{
                    alertService.msgAlert("success", "注册成功");
                    //注册成功默认登录到首页/我的
                    $scope.index();
                }
            });
        };


        // 校验图形验证码并获取短信验证码
        $scope.getSmsCode = function () {
            if (!$scope.checkPhone()) {
                alertService.msgAlert("cancle", "请输入正确的手机号码");
                return;
            }
            if ($scope.type === 'findPwd') {
                //忘记密码，直接发送验证码
                $scope.sentSms("PASSWORD_RETRIEVE");
            } else if ($scope.type === 'bindWx') {
                $scope.sentSms("BIND_WX");
            } else if ($scope.type === 'register' || $scope.type === 'login') {
               /* //注册，先校验帐号是否存在
                $http({
                    method: "GET",
                    url: appConfig.apiPath + '/user/ifAccountExists',
                    params: {
                        phone: $scope.user.username
                    },
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    }
                }).success(function (data, status, headers, config) {

                });*/
                $scope.sentSms("USER_REG");
            }
        };

        /**真正的发短信操作**/
        $scope.sentSms = function (codeType) {
            $http({
                method: "POST",
                url: appConfig.apiPath + '/user/sendVerifyCodeNew',
                data: $httpParamSerializer({
                    account: $scope.user.username,
                    regType: 'PHONE',
                    codeType: codeType
                }),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            }).success(function (data) {
                //倒计时
                if(data.code === 'SUCCESS'){
                    $scope.intervalAccountTile();
                }

            }).error(function (data) {
                $scope.waitShow = false;
                $scope.fsyzm = "重新发送";
                $interval.cancel(intervalStop);//解除计时器
                $scope.state = 1;
            });
        };

        //限制手机号输入
        $scope.checkPhone = function () {
            var phone = $scope.user.username;
            if (!(/^1[34578]\d{9}$/.test(phone))) {
                return false;
            }
            return true;
        };

        $scope.intervalAccountTile = function () {
            $scope.step = 2;
            $scope.waitShow = true;
            alertService.msgAlert("success", "已发送");
            if (intervalStop) {
                $interval.cancel(intervalStop);//解除计时器
            }
            var i = 60;
            intervalStop = $interval(function () {
                i--;
                $scope.fsyzm = i + 'S';
                $scope.state = 2;
                if (i <= 0) {
                    $scope.waitShow = false;
                    $scope.fsyzm = "重新获取";
                    $scope.state = 1;
                    var b = $interval.cancel(intervalStop);//解除计时器

                    intervalStop = undefined;
                }
            }, 1000);
        };
    }
})();