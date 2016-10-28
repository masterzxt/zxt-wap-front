/**
 * Module : xxx
 */
(function () {
    angular.module('q-wap-front')
        .config(['$stateProvider', function ($stateProvider) {

            $stateProvider.state("main.apply.applySuccess", {
                url: "/applySuccess",
                views: {
                    "@": {
                        templateUrl: 'views/main/apply/applySuccess/index.root.html',
                        controller: applySuccessController
                    }
                }
            });
        }]);


    // ----------------------------------------------------------------------------
    applySuccessController.$inject = ['$scope', '$state', '$http', 'appConfig',
        '$httpParamSerializer', 'FileUploader', 'imgService', '$timeout', 'alertService', '$interval'];
    function applySuccessController($scope, $state, $http, appConfig, $httpParamSerializer, FileUploader, imgService, $timeout, alertService, $interval) {
        $scope.fallbackPage = function () {
            if (history.length === 1) {
                $state.go("main.index", null, {reload: true});
            } else {
                history.back();
            }
        };
    }
})();