/**
 * Module : xxx
 */
(function () {
    angular.module('q-wap-front')
        .config(['$stateProvider', function ($stateProvider) {

            $stateProvider.state("main.extend", {
                url: "/extend",
                views: {
                    "@": {
                        templateUrl: 'views/main/extend/index.root.html',
                        controller: extendController
                    }
                }
            });
        }]);


    // ----------------------------------------------------------------------------
    extendController.$inject = ['$scope', '$state', '$scope', '$httpParamSerializer', '$http', 'appConfig','wxService'];
    function extendController($scope, $state, $scope, $httpParamSerializer, $http, appConfig,wxService) {
        $scope.fallbackPage = function () {
            if (history.length === 1) {
                $state.go("main.index", null, {reload: true});
            } else {
                history.back();
            }
        };
        $scope.imgUrl = appConfig.imgUrl;
        $scope.wapIndex = {};
        $scope.showBack = false;
        /**
         * 获取推广信息
         */
        $scope.getWapIndex = function () {
            $http({
                method: "GET",
                url: appConfig.apiPath + '/common/wapIndex'
            }).then(function (resp) {
                if (resp.data.code === 'SUCCESS') {
                    $scope.wapIndex = resp.data.recList;
                }
            });
        };
        $scope.getWapIndex();

        //打开二维码
        $scope.showCode = function (data) {
            if ($scope.showBack) {
                $scope.showBack = false;
            } else {
                $scope.showBack = true;
                $scope.showUrl = data.url;
                $scope.downUrl = data.img;
                $scope.cnName = data.cnName;
            }
        };

        /**
         * 分享
         */
        $scope.share = function () {

            //wxService.initShareOnStart($scope.downUrl, $scope.cnName,$scope.downUrl);
        };
        /**
         * 下载
         */
        $scope.download = function () {
            if ($scope.downUrl) {
                
            }
        };
        /**
         * 复制
         */
        $scope.copy = function () {
            //TODO 复制 $scope.showUrl

        };
    }
})();