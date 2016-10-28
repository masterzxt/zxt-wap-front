
(function () {
    angular.module('q-wap-front')
        .config(['$stateProvider', function ($stateProvider) {

            $stateProvider.state("main.account", {
                url: "/account",
                views: {
                    "@": {
                        templateUrl: 'views/main/account/index.root.html',
                        controller: accountController
                    }
                }
            });
        }]);


    // ----------------------------------------------------------------------------
    accountController.$inject = ['$scope', '$state', '$http', 'appConfig','$httpParamSerializer','alertService','$timeout'];
    function accountController($scope, $state, $http, appConfig,$httpParamSerializer,alertService,$timeout) {
        $scope.backshow = false;
        $scope.drawLoading = false;
        $scope.success = false;
        $scope.with = {};
        $scope.fallbackPage = function () {
            if(history.length===1){
                $state.go("main.index",null,{reload:true});
            }else{
                history.back();
            }
        };
        //获取账户信息
        $http({
            method:"GET",
            url:appConfig.apiPath + '/account/account'
        }).then(function (resp) {
            $scope.account = resp.data;
        });

        $scope.backOpen = function () {
            $scope.backshow = !$scope.backshow;
        };
        //判断提现金额
        $scope.getMaxNum = function () {
            var reg = /^(\d+)([.]{0,1})(\d{0,3})$/;
            var money = $scope.with.nums;
            if (money.match(reg) == null && money !== "") {
                $scope.with.nums = "";
            } else if (money !== "" && money.indexOf(".") &&
                money.length > money.indexOf(".") + 3 &&money.indexOf(".")>0) {
                money = money.substring(0, money.indexOf(".") + 3);
                $scope.with.nums = money;
            }
        };
        //提现account/withdraw
        $scope.withdraw = function () {
            if($scope.with.nums<1){
                alertService.msgAlert('ks-exclamation-circle', '提现金额必须大于1元');
            }else{
                $scope.drawLoading = true;
                $timeout(function(){
                    $http({
                        method:"POST",
                        headers:{
                            'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
                        },
                        url:appConfig.apiPath + '/account/withdraw',
                        data:$httpParamSerializer({
                            withdraw: $scope.with.nums*100
                        })
                    }).then(
                        function () {
                            $scope.success = true;
                            //重新获取余额
                            $timeout(function () {
                                $state.reload();
                            },800);
                        },function () {
                            $scope.drawLoading = false;
                        }
                    );
                },1300);
            }
        };

        /**
         * 协议
         */
        $scope.goCmsPage = function () {
            $http({
                method: "GET",
                url: appConfig.apiPath + '/common/agreement',
                params:{
                    type:'Q_RULES'
                }
            }).success(function (data) {
                if(data.data.id){
                    //路由跳转到文章页面
                    $state.go("main.cms.detail",{id:data.data.id});
                }
            }).error(function (data) {

            });
        };
    }
})();