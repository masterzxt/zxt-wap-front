(function () {
    angular.module('q-wap-front').config(['$stateProvider', function ($stateProvider) {

        $stateProvider.state("main.recharge", {
            url: '/recharge?backUrl',
            views: {
                "@": {
                    templateUrl: 'views/main/recharge/index.root.html',
                    controller: rechargeController
                }
            }
        });


    }]);
    // ----------------------------------------------------------------------------
    rechargeController.$inject = ['$scope', '$state', '$mdDialog', '$http', 'appConfig', 'alertService', '$httpParamSerializer'];
    function rechargeController($scope, $state, $mdDialog, $http, appConfig, alertService, $httpParamSerializer) {
        $scope.srcState = $state.params.backUrl;

        //选择的充值卡的数量
        $scope.cardCount = 0;
        //选择的充值卡的金额
        $scope.totalPrice = 0;
        //充值卡信息
        $scope.recharges = [];
        //
        $scope.recharges.count = 0;
        //选择的充值卡的id
        $scope.rechargeids = [];
        $http
            .get(appConfig.apiPath + '/recharge/rechargeActivity')
            .then(function (resp) {
                $scope.data = resp.data;
                if ($scope.data.code === 'SUCCESS') {
                    $scope.recharges = $scope.data.recList;
                }
            });
        /**
         * 减少充值卡
         * @param index
         */

        $scope.reduce = function (index) {
            if ($scope.cardCount < 0) {
                return;
            }
            if ($scope.recharges[index].count === undefined || $scope.recharges[index].count === 0) {
                return;
            } else {
                $scope.recharges[index].count--;
            }
            $scope.cardCount--;
            $scope.totalPrice -= $scope.recharges[index].requiredMoney / 100;
            $scope.removeId($scope.recharges[index].id);

        };
        /**
         * 添加充值卡
         * @param index
         */
        $scope.add = function (index) {
            $scope.cardCount++;
            $scope.totalPrice += $scope.recharges[index].requiredMoney / 100;
            $scope.rechargeids.push($scope.recharges[index].id);
            if ($scope.recharges[index].count === undefined) {
                $scope.recharges[index].count = 1;
            } else {
                $scope.recharges[index].count++;
            }

        };
        /**
         * 删除相应的充值卡的id
         * @param id
         */
        $scope.removeId = function (id) {
            for (var i = 0; i < $scope.rechargeids.length; i++) {
                if ($scope.rechargeids[i] === id) {
                    $scope.rechargeids.splice(i, 1);
                    return;
                }
            }
        };

        //支付弹框
        $scope.showDialog = function () {
            if ($scope.cardCount === 0) {
                return;
            }
            var totalPrice = $scope.totalPrice;
            var rechargeids = $scope.rechargeids;
            var parent = angular.element(document.body);
            $mdDialog.show({
                parent: parent,
                targetEvent: null,
                templateUrl: 'views/main/recharge/dialog/index.root.html',
                controller: DialogController,
                controllerAs: 'vm'
            });
            DialogController.$inject = ['$mdDialog'];
            function DialogController($mdDialog) {
                var vm = this;
                vm.totalPrice = totalPrice;
                vm.rechargeids = rechargeids;
                vm.code_url = "";
                vm.type = "";
                vm.closeDialog = function () {
                    $mdDialog.hide();
                };

                /**
                 * 充值卡去支付
                 * @param type
                 */

                vm.payUser = function (type) {
                    $http({
                        method: "POST",
                        url: appConfig.apiPath + "/recharge/payUser",
                        data: $httpParamSerializer({
                            payType: type,
                            phone: vm.phone,
                            recharges: angular.toJson(vm.rechargeids)
                        }),
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                        }
                    }).then(function (resp) {
                        if (resp.data.code === 'SUCCESS') {
                            vm.type = type;
                            if (type === 'ALIPAY') {
                                vm.code_url = resp.data.aliPay.scan.qr_code;
                            } else {
                                vm.code_url = resp.data.weiXin.code_url;
                            }
                        }
                    });
                };

                /**
                 * 更改支付方式
                 */

                vm.changeType = function () {
                    vm.type = "";
                    vm.code_url = "";
                    /*if(vm.type==='ALIPAY'){
                     vm.type = 'WEIXIN';
                     }else {
                     vm.type = 'ALIPAY';
                     }
                     vm.payUser(vm.type);*/
                };
            }
        };

        /**
         * 返回
         */
        $scope.fallbackPage = function () {
            if (history.length === 1) {
                $state.go("main.index", null, {reload: true});
            } else {
                history.back();
            }
        };
    }
})();