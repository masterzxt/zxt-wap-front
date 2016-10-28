/**
 * Created by lihl on 16-9-24.
 */


(function () {
    angular.module('q-wap-front').config(['$stateProvider', function ($stateProvider) {

        $stateProvider.state("main.order.dailog", {
            url: '/dailog',
            views: {
                "@": {
                    templateUrl: 'views/main/order/dailog/index.root.html',
                    controller: DailogController
                }
            }
        });


    }]);
    // ----------------------------------------------------------------------------
    DailogController.$inject = ['$scope', '$http','$mdDialog'];
    function DailogController($scope, $http, $mdDialog) {

    }
})();











