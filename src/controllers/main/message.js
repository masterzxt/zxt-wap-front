/**
 * Module : xxx
 */
(function () {
    angular.module('q-wap-front')
        .config(['$stateProvider', function ($stateProvider) {

            $stateProvider.state("main.message", {
                url: "/message",
                resolve: {
                    curUser: ['userService', function (userService) {
                        return userService.getCurUser(true, true);
                    }]
                },
                views: {
                    "@": {
                        templateUrl: 'views/main/message/index.root.html',
                        controller: messageController
                    }
                }
            });
        }]);


    // ----------------------------------------------------------------------------
    messageController.$inject = ['$scope','$state', '$httpParamSerializer', '$http', 'appConfig'];
    function messageController($scope,$state , $httpParamSerializer, $http, appConfig) {
        
        $scope.fallbackPage = function () {
            if(history.length===1){
                $state.go("main.index",null,{reload:true});
            }else{
                history.back();
            }
        };
        /**
         * 获取系统信息
         */
        $scope.messages = function () {
            $http({
                method: "GET",
                url: appConfig.apiPath + '/message/getMainMsg'
            }).then(function (resp) {
                if (resp.data.code === 'SUCCESS') {
                    $scope.transportMsg = resp.data.transportMsg;
                    $scope.systemMsg = resp.data.systemMsg;
                    $scope.accountMsg = resp.data.accountMsg;
                }
            });
        };
        $scope.messages();
    }
})();