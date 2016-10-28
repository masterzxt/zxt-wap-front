/**
 * Module : xxx
 */
(function () {
    angular.module('q-wap-front')
        .config(['$stateProvider', function ($stateProvider) {

            $stateProvider.state("main.cms", {
                url: "/cms",
                views: {
                    "@": {
                        templateUrl: 'views/main/cms/index.root.html',
                        controller: cmsController
                    }
                }
            });
        }]);
    // ----------------------------------------------------------------------------
    cmsController.$inject = ['$scope'];
    function cmsController($scope) {
    }
})();