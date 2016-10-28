/**
 * Module : xxx
 */
(function () {
    angular.module('q-wap-front')
        .config(['$stateProvider', function ($stateProvider) {

            $stateProvider.state("main.setting", {
                url: "/setting",
                views: {
                    "@": {
                        templateUrl: 'views/main/setting/index.root.html',
                        controller: settingController
                    }
                }
            });
        }]);


    // ----------------------------------------------------------------------------
    settingController.$inject = ['$scope','$state','appConfig','alertService','$http'];
    function settingController($scope,$state,appConfig,alertService,$http) {
        $scope.appVersion = appConfig.appVersion;
        $scope.fallbackPage = function () {
            if(history.length===1){
                $state.go("main.index",null,{reload:true});
            }else{
                history.back();
            }
        };
        /**
         * 退出
         */
        $scope.exit = function () {
            alertService.confirm(null, "", "确定退出吗?", "取消", "确定").then(function (data) {
                if (data) {
                    $http({
                        method: "POST",
                        url: appConfig.apiPath + '/j_spring_security_logout',
                    }).success(function () {
                        alertService.msgAlert("success", "退出成功");
                        $scope.fallbackPage();
                    });
                }
            });
        };
    }
})();