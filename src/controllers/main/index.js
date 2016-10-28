(function () {

    angular.module('q-wap-front').config(['$stateProvider', function ($stateProvider) {

        /**
         * 主页
         */
        $stateProvider.state("main.index", {
            url: "/",
            resolve: {
                curUser: ['userService', function (userService) {
                    return userService.getCurUser(true, true);
                }]
            },
            views: {
                "@": {
                    templateUrl: 'views/main/index.html',
                    controller: IndexController
                }
            }
        });
    }]);

    IndexController.$inject = ['$scope', '$timeout', '$state', 'curUser', '$http', 'appConfig', 'wxService', 'alertService'];
    function IndexController($scope, $timeout, $state, curUser, $http, appConfig, wxService, alertService) {
        //用户的基本信息
        $scope.baseInfo = curUser.data.userInfo;
        //用户的本月收入和本日收入
        $scope.account = {};
        $scope.index = {};
        $scope.leftOpen = false;
        $scope.openLeftMenu = function () {
            $scope.leftOpen = !$scope.leftOpen;
        };

        //获取本月的收入和本日的收入
        $http
            .get(appConfig.apiPath + '/account/accountDate')
            .then(function (resp) {
                $scope.account = resp.data;
            });


        //获取首页的信息
        $http
            .get(appConfig.apiPath + '/index/indexData')
            .then(function (resp) {
                $scope.index = resp.data;
                if ($scope.index.nickName) {
                    if ($scope.index.nickName.length > 2) {
                        $scope.index.showRealName = $scope.index.nickName.substr(0, 3);
                    } else {
                        $scope.index.showRealName = $scope.index.nickName;
                    }

                } else if ($scope.index.realName) {
                    if ($scope.index.realName.length > 2) {
                        $scope.index.showRealName = $scope.index.realName.substr(0, 3);
                        /*+ "..." +
                         $scope.index.realName.substr($scope.index.realName.length - 1, 1);*/
                    } else {
                        $scope.index.showRealName = $scope.index.realName;
                    }
                } else if ($scope.index.username) {
                    if ($scope.index.username.length > 2) {
                        $scope.index.showRealName = $scope.index.username.substr(0, 3);
                    } else {
                        $scope.index.showRealName = $scope.index.username;
                    }
                }
            });

        /* wxService.initShareOnStart("baidu.com","测试","http://img.kingsilk.net/43100c3436bad4f1cf263149d0a50435?imageView2/2/w/200/h/200");*/
        $scope.apply = function () {

            if ($scope.index.staffType == 'EXPRESS' || !$scope.index.staffType || $scope.index.staffType == '') {
                if ($scope.index.status === 'CUSTOM_EXAMINE' || $scope.index.status === 'EXAMINE') {
                    $state.go("main.apply.applySuccess");
                } else if ($scope.index.status === 'LOCKED' || $scope.index.status === 'DISABLED') {
                    alert("禁用");
                } else if ($scope.index.status === 'UNPASS' || $scope.index.status === 'CUSTOM_UNPASS') {
                    $state.go("main.apply");
                } else {
                    $state.go("main.apply");
                }
            } else {
                alertService.confirm(null, "继续操作将会覆盖租赁会员身份", "警告", "取消", "覆盖").then(function (data) {
                    if (data) {
                        $state.go("main.apply");
                        return;
                    }
                });
            }
        };
    }

})();



