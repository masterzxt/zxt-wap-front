(function () {
    angular.module('q-wap-front').config(['$stateProvider', function ($stateProvider) {

        $stateProvider.state("main.order", {
            url: '/order?newtask&id',
            views: {
                "@": {
                    templateUrl: 'views/main/order/index.root.html',
                    controller: OrderController,
                    controllerAs: 'vm'
                }
            }
        });


    }]);
    // ----------------------------------------------------------------------------
    OrderController.$inject = ['$scope', '$http', '$mdDialog', 'appConfig', '$state', 'alertService', 'transportService'];
    function OrderController($scope, $http, $mdDialog, appConfig, $state, alertService, transportService) {
        var vm = this;
        vm.result = {};
        //回退页面
        vm.rollback = function () {
            history.back();
        }
        // 没有选择任务,直接返回
        var id = $state.params.id;
        if (!id || id === '') {
            // 显示完成后跳转页面
            alertService.msgAlert(null, "请选择任务").then(function (data) {
                vm.rollback();
            });
            return;
        }
        // 获取任务的详情
        vm.detail = function () {
            // 获取当前任务的详情的数据
            $http({
                method: 'GET',
                url: appConfig.apiPath + "/transport/detail",
                params: {
                    id: id
                }
            }).then(function (resp) {
                vm.result = resp.data.result;
                // 计算当前下一步要做的地址
                if (vm.result.transportStatus === 'TAKE' || vm.result.transportStatus === 'NEW') {
                    // 服务商送给用户
                    vm.address = vm.result.takeAddr;
                } else if (vm.result.transportStatus === 'AND') {
                    // 换货 只有取用户
                    vm.address = vm.result.useAddr;
                } else {
                    // 反过来送
                    vm.address = vm.result.sentAddr;
                }
                vm.baiduMap();
                // 判断当前任务的状态
            }, function (resp) {
            });
        };
        vm.detail();
        //送货详情地址弹框
        vm.addrShowDialog = function ($event) {
            var parentEl = angular.element(document.body);
            $mdDialog.show({
                parent: parentEl,
                targetEvent: null,
                templateUrl: 'views/main/order/dailog/index.root.html',
                controller: DialogController,
                controllerAs: 'vms'
            });
            DialogController.$inject = ['$scope', '$mdDialog'];
            function DialogController($scope, $mdDialog) {
                var vms = this;
                vms.result = vm.result;
                vms.closeDialog = function () {
                    $mdDialog.hide();
                };
            }
        };
        //任务的商品数量弹框
        vm.skusshowDialog = function ($event) {
            var parentEl = angular.element(document.body);
            $mdDialog.show({
                parent: parentEl,
                targetEvent: $event,
                templateUrl: 'views/main/order/taskDailog/index.root.html',
                controller: DialogController,
                controllerAs: 'vms'
            });
            DialogController.$inject = ['$scope', '$mdDialog'];
            function DialogController($scope, $mdDialog) {
                var vms = this;
                vms.result = vm.result;

                // 获取当前任务的详情的数据
                $http({
                    method: 'GET',
                    url: appConfig.apiPath + "/transport/detail",
                    params: {
                        id: id
                    }
                }).then(function (resp) {
                    vms.result = resp.data.result;
                }, function (resp) {
                });
                vms.closeDialog = function () {
                    $mdDialog.hide();
                };
            }
        };
        //调整弹框
        vm.dateShowDialog = function ($event) {
            var parentEl = angular.element(document.body);
            $mdDialog.show({
                parent: parentEl,
                targetEvent: $event,
                templateUrl: 'views/main/order/dateDailog/index.root.html',
                controller: DialogController,
                controllerAs: 'vms'
            }).then(function (date) {
                if (date) {
                    vm.result.date = date;
                }
            });
            DialogController.$inject = ['$scope', '$mdDialog', '$httpParamSerializer', '$filter'];
            function DialogController($scope, $mdDialog, $httpParamSerializer, $filter) {
                var vms = this;
                vms.date = new Date();
                vms.result = vm.result;
                vms.updateDate = function () {
                    var dateTime = $filter("date")(vms.date, "yyyy-MM-ddHH:mm:ss");
                    $http({
                        method: "POST",
                        url: appConfig.apiPath + '/transport/updateDate',
                        data: $httpParamSerializer({
                            id: vms.result.id,
                            date: dateTime,
                            memo: vms.memo
                        }),
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                        }
                    }).success(function (data) {
                        $mdDialog.hide(vms.date);
                    }).error(function (data) {
                    });
                }

                vms.closeDialog = function () {
                    $mdDialog.hide();
                };
            }
        };
        // 百度地图
        vm.baiduMap = function () {
            // 百度地图API功能
            var map = new BMap.Map("allmap");
            var point = new BMap.Point(116.331398, 39.897445);
            map.enableScrollWheelZoom();
            map.centerAndZoom(point, 12);
            // 创建地址解析器实例
            var myGeo = new BMap.Geocoder();
            // 将地址解析结果显示在地图上,并调整地图视野
            myGeo.getPoint(vm.address.addr + vm.address.street, function (point) {
                if (point) {
                    map.centerAndZoom(point, 11);
                    map.addOverlay(new BMap.Marker(point));
                }
            }, "杭州市");
            if (vm.result.takeAddr) {
                // 将地址解析结果显示在地图上,并调整地图视野
                myGeo.getPoint(vm.result.takeAddr.addr + vm.result.takeAddr.street, function (point) {
                    if (point) {
                        vm.result.takeAddr.point = point;
                    }
                }, "杭州市");
            }
            if (vm.result.useAddr) {
                // 将地址解析结果显示在地图上,并调整地图视野
                myGeo.getPoint(vm.result.useAddr.addr + vm.result.useAddr.street, function (point) {
                    if (point) {
                        vm.result.useAddr.point = point;
                    }
                }, "杭州市");
            }
            if (vm.result.sentAddr) {
                // 将地址解析结果显示在地图上,并调整地图视野
                myGeo.getPoint(vm.result.sentAddr.addr + vm.result.sentAddr.street, function (point) {
                    if (point) {
                        vm.result.sentAddr.point = point;
                    }
                }, "杭州市");
            }
        }
        // 导航,进行展示用户的地址
        vm.navigation = function (type) {
            var title = "地址";
            var content = "服务中心";
            // if (type === "TAKE") {
            //     ltgt = vm.result.takeAddr.point.lat + "," + vm.result.takeAddr.point.lng;
            // } else if (type === "SENT") {
            //     ltgt = vm.result.sentAddr.point.lat + "," + vm.result.sentAddr.point.lng;
            // } else {
            //     ltgt = vm.result.useAddr.point.lat + "," + vm.result.useAddr.point.lng;
            // }
            var lt = vm.address.point.lat;
            var gt = vm.address.point.lng
            // 获取导航的地点
            if (window.cordova) {
                var url = null;
                if (type === 'B') {
                    var host = "bdapp";
                    if (cordova.platformId === 'ios') {
                        host = "baidumap"
                    }
                    url = host + "://map/marker?location=" + lt + "," + gt + "&title=" + title + "&content=" + content + "&src=webapp.marker.yourCompanyName.yourAppName";
                } else {
                    var host = "androidamap";
                    if (cordova.platformId === 'ios') {
                        host = "iosamap"
                    }
                    url = host + "://viewMap?sourceApplication=applicationName&poiname=" + title + "&lat=" + lt + "&lon=" + gt + "&dev=1";
                }
                // location.href = host + "://map/marker?location=" + ltgt + "&title=" + title + "&content=" + content + "&src=webapp.marker.yourCompanyName.yourAppName";
                var ref = window.cordova.InAppBrowser.open(url, '_system', 'location=yes');
            }

        }
        /*补差价进行弹框*/
        vm.priceRepair = function () {
            transportService.priceRepairShowlog(vm.result).then(function (selectedItem) {
                if (selectedItem) {
                    vm.detail();
                }
            });
        };
        /*抢单弹框*/
        vm.robOrder = function () {
            transportService.robOrder(vm.result).then(function (selectedItem) {
                if (selectedItem) {
                    vm.detail();
                }
            });
        };
        /*已取件已换货,已送达弹框*/
        vm.takeShowlog = function () {
            transportService.takeShowlog(vm.result).then(function (selectedItem) {
                if (selectedItem) {
                    vm.detail();
                }
            });
        };

    }
})();