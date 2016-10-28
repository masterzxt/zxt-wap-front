(function () {
    angular.module('q-wap-front').config(['$stateProvider', function ($stateProvider) {

        $stateProvider.state("main.recharge.record", {
            url: '/record',
            views: {
                "@": {
                    templateUrl: 'views/main/recharge/record/index.root.html',
                    controller: recordController
                }
            }
        });


    }]);
    // ----------------------------------------------------------------------------
    recordController.$inject = ['$scope', '$state', '$http', 'appConfig'];
    function recordController($scope, $state, $http, appConfig) {
        $scope.comments = new Array(5);
        $http
            .get(appConfig.apiPath + '/recharge/payLog')
            .then(function (resp) {
                $scope.data = resp.data;
                console.log($scope.data);
                if ($scope.data.code === 'SUCCESS') {
                    $scope.recharges = $scope.data.result;
                    console.log($scope.recharges);
                }
            });
       

        $scope.fallbackPage = function () {
            if (history.length === 1) {
                $state.go("main.index", null, {reload: true});
            } else {
                history.back();
            }
        };
    }
})();