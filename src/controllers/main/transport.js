(function () {
    angular.module('q-wap-front').config(['$stateProvider', function ($stateProvider) {

        $stateProvider.state("main.transport", {
            url: '/transport?',
            views: {
                "@": {
                    templateUrl: 'views/main/transport/index.root.html',
                    controller: YunshuController
                }
            }
        });

    }]);
    // ----------------------------------------------------------------------------
    YunshuController.$inject = ['$scope', '$http', '$mdDialog', '$state', 'appConfig', 'transportService', '$timeout'];
    function YunshuController($scope, $http, $mdDialog, $state, appConfig, transportService, $timeout) {
        //新任务
        $scope.dataList = {};
        //进行中
        $scope.rollback = function () {
            history.back();
        };
        // 暂时定义编译只有10个
        $scope.params = {};
        $scope.params.tableType = "NEW";
        // // 获取当前的数据
        // $scope.dataQueryList = function (type, status, curPage) {
        //     $scope.transportListAll(type, status, curPage);
        // }

        /*新任务跳转页面*/
        $scope.newTask = function (transport) {
            $state.go("main.order", {
                newtask: false,
                id: transport.id
            }, {reload: true});
        };
        /*补差价进行弹框*/
        $scope.priceRepair = function (transport) {
            transportService.priceRepairShowlog(transport).then(function (selectedItem) {
                if (selectedItem) {
                    $scope.transportListAll($scope.params.tableType, $scope.params.tableStatus, 1, true);
                }
            });
        };
        /*抢单弹框*/
        $scope.robOrder = function (transport) {
            transportService.robOrder(transport).then(function (selectedItem) {
                if (selectedItem) {
                    $scope.transportListAll($scope.params.tableType, $scope.params.tableStatus, 1, true);
                }
            });
        };
        /*已取件已换货,已送达弹框*/
        $scope.takeShowlog = function (transport) {
            transportService.takeShowlog(transport).then(function (selectedItem) {
                if (selectedItem) {
                    $scope.transportListAll($scope.params.tableType, $scope.params.tableStatus, 1, true);
                }
            });
        };

        // In this example, we set up our model using a class.
        // Using a plain object works too. All that matters
        // is that we implement getItemAtIndex and getLength.
        var DynamicItems = function () {
            /**
             * @type {!Object<?Array>} Data pages, keyed by page number (0-index).
             */
            this.loadedPages = {};

            /** @type {number} Total number of items. */
            this.numItems = 0;

            /** @const {number} Number of items to fetch per request. */
            this.PAGE_SIZE = appConfig.pageSize;

            this.fetchNumItems_();
        };

        // Required.
        DynamicItems.prototype.getItemAtIndex = function (index) {
            var pageNumber = Math.floor(index / this.PAGE_SIZE);
            var page = this.loadedPages[pageNumber];
            if (page) {
                return page[index % this.PAGE_SIZE];
            } else if (page !== null) {
                this.fetchPage_(pageNumber);
            }
        };

        // Required.
        DynamicItems.prototype.getLength = function () {
            return this.numItems;
        };

        DynamicItems.prototype.fetchPage_ = function (pageNumber) {
            // Set the page to null so we know it is already being fetched.
            this.loadedPages[pageNumber] = null;
            // For demo purposes, we simulate loading more items with a timed
            // promise. In real code, this function would likely contain an
            // $http request.
            /*新任务列表初始化*/
            $timeout(angular.noop, 100).then(angular.bind(this, function () {
                this.loadedPages[pageNumber] = [];
                var pageOffset = pageNumber * this.PAGE_SIZE;
                for (var i = pageOffset; i < pageOffset + this.PAGE_SIZE; i++) {
                    this.loadedPages[pageNumber].push(i);
                }
                if (pageNumber > 0) {
                    /*新任务列表初始化*/
                    $scope.transportListAll($scope.params.tableType, $scope.params.tableStatus, pageNumber + 1);
                }
            }));
        };

        DynamicItems.prototype.fetchNumItems_ = function () {
            // For demo purposes, we simulate loading the item count with a timed
            // promise. In real code, this function would likely contain an
            // $http request.
            $timeout(angular.noop, 100).then(angular.bind(this, function () {
                this.numItems = $scope.dataList.totalCount;
            }));
        };

        // 获取任务的接口
        // boo 为true也重新返回异步加载数据
        $scope.transportListAll = function (type, status, curPage, boo) {
            $scope.params.tableType = type;
            $scope.params.tableStatus = status;
            $http({
                method: 'GET',
                url: appConfig.apiPath + "/transport/list",
                params: {
                    type: type,
                    status: status,
                    curPage: curPage,
                    pageSize: appConfig.pageSize
                }
            }).then(function (resp) {
                // 如果需要重置的,同时也需要重新加载数据
                if (!$scope.dataList || !$scope.dataList.result || boo) {
                    $scope.dataList = resp.data;
                } else {
                    $scope.dataList.result = $scope.dataList.result.concat(resp.data.result)
                }
                // 初始化数据
                if (!$scope.dynamicItems || boo) {
                    $scope.dynamicItems = new DynamicItems();
                }
                // 判断当前任务的状态
            }, function (resp) {
            });
        }
        $scope.transportListAll("NEW", null, 1, true);

        //获取首页信息
        $scope.index = {};
        $http.get(appConfig.apiPath + '/index/indexData')
            .then(function (resp) {
                $scope.index = resp.data;
            });
    }
})();