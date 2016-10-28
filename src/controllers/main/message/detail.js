/**
 * Module : xxx
 */
(function () {
    angular.module('q-wap-front')
        .config(['$stateProvider', function ($stateProvider) {

            $stateProvider.state("main.message.detail", {
                url: "/detail?type",
                resolve: {
                    curUser: ['userService', function (userService) {
                        return userService.getCurUser(true, true);
                    }]
                },
                views: {
                    "@": {
                        templateUrl: 'views/main/message/detail/index.root.html',
                        controller: messageDetailController
                    }
                }
            });
        }]);


    // ----------------------------------------------------------------------------
    messageDetailController.$inject = ['$scope','$state', '$httpParamSerializer', '$http', 'appConfig'];
    function messageDetailController($scope,$state , $httpParamSerializer, $http, appConfig) {

        $scope.messages = {};
        $scope.title = "";
        $scope.type = $state.params.type;
        $scope.fallbackPage = function () {
            if(history.length===1){
                $state.go("main.index",null,{reload:true});
            }else{
                history.back();
            }
        };

        /**
         * 获取配送信息
         */
        $scope.getTransportMsg = function () {
            $http({
                method: "GET",
                url: appConfig.apiPath + '/message/getTransportLogMsg'
            }).then(function (resp) {
                if (resp.data.code === 'SUCCESS') {
                    $scope.messages = resp.data.recList;
                }
            });
        };

        /**
         * 获取系统信息
         */
        $scope.getSystemMsg = function () {
            $http({
                method: "GET",
                url: appConfig.apiPath + '/message/getSystemMsg'
            }).then(function (resp) {
                if (resp.data.code === 'SUCCESS') {
                    $scope.messages = resp.data.recList;
                }
            });
        };

        /**
         *  获取账户信息
         */
        $scope.accountLog = function () {

            $http
                .get(appConfig.apiPath + '/account/accountLog')
                .then(function (resp) {
                    $scope.messages = resp.data.recList;
                }).then(function () {

            });
        };

        if($state.params.type === 'system'){
            $scope.title = "系统消息";
            $scope.getSystemMsg();
        }else if($state.params.type === 'transport'){
            $scope.title = "配送消息";
            $scope.getTransportMsg();
        }else if($state.params.type === 'account'){
            $scope.title = "余额消息";
            $scope.accountLog();
        }


        //Todo 加载更多

    }
})();