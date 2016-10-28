/**
 * Module : xxx
 */
(function () {
    angular.module('q-wap-front')
        .config(['$stateProvider', function ($stateProvider) {

            $stateProvider.state("main.account.rule", {
                url: "/account/rule",
                views: {
                    "@": {
                        templateUrl: 'views/main/account/rule/index.root.html',
                        controller: ruleController
                    }
                }
            });
        }]);


    // ----------------------------------------------------------------------------
    ruleController.$inject = ['$scope','$scope'];
    function ruleController($scope,$scope) {
        $scope.fallbackPage = function () {
            if(history.length===1){
                $state.go("main.index",null,{reload:true});
            }else{
                history.back();
            }
        };
    }
})();