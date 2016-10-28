angular.module('q-wap-front').factory('transportService', ['appConfig', '$mdDialog', '$q', 'alertService', function (appConfig, $mdDialog, $q, alertService) {
    /*抢单弹框*/
    function robOrder(transport) {
        var deferred = $q.defer(); //创建一个等待的意思 先后顺序
        $mdDialog.show({
            templateUrl: 'views/main/transport/tijiaoDailog/index.root.html',
            controller: DialogController
        }).then(function (selectedItem) {
            // if (selectedItem) {
            //     deferred.resolve(selectedItem);//这就是等待的结果
            // }
            deferred.resolve(selectedItem);//这就是等待的结果
        }, function () {
        });
        DialogController.$inject = ['$scope', '$mdDialog', '$httpParamSerializer', '$http', 'alertService'];
        function DialogController($scope, $mdDialog, $httpParamSerializer, $http, alertService) {
            // 进行接单
            $scope.submitDialog = function () {
                $http({
                    method: "POST",
                    url: appConfig.apiPath + '/transport/confirm',
                    data: $httpParamSerializer({
                        id: transport.id
                    }),
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    }
                }).success(function (data) {
                    $mdDialog.hide(true);
                }).error(function (data) {
                });
            }
            $scope.closeDialog = function () {
                $mdDialog.hide();
            };
        }

        return deferred.promise;
    };
    /*已取件弹框*/
    function takeShowlog(transport) {
        var deferred = $q.defer(); //创建一个等待的意思 先后顺序
        $mdDialog.show({
            templateUrl: 'views/main/transport/yiquhuoDailog/index.root.html',
            controller: DialogController
        }).then(function (result) {
            if (result) {
                deferred.resolve(result);//这就是等待的结果
            }
        });
        DialogController.$inject = ['$scope', '$mdDialog', '$httpParamSerializer', 'FileUploader', '$filter', '$http', 'alertService'];
        function DialogController($scope, $mdDialog, $httpParamSerializer, FileUploader, $filter, $http, alertService) {
            $scope.transport = transport;
            $scope.imgUrl = appConfig.imgUrl;
            $scope.closeDialog = function () {
                $mdDialog.hide();
            };
            //定义一个对象数组
            $scope.addQrCode = function (index) {
                if (window.cordova) {
                    cordova.plugins.barcodeScanner.scan(
                        function (result) {
                            if (result.text) {
                                $scope.arr[index].barcode = result.text;
                                $scope.$apply();
                            }
                        },
                        function (error) {
                            alertService.msgAlert(null, "扫码错误: " + error);
                        },
                        {
                            "preferFrontCamera": false, // iOS and Android
                            "showFlipCameraButton": true, // iOS and Android
                            "prompt": "Place a barcode inside the scan area", // supported on Android only
                            "formats": "QR_CODE,PDF_417,CODE_128", // default: all but PDF_417 and RSS_EXPANDED
                            "orientation": "landscape" // Android only (portrait|landscape), default unset so it rotates with the device
                        }
                    );
                } else {
                    // alertService.msgAlert(null, "请再app中使用");
                    alert("请在app中使用");
                }
            }
            /*
             * 元素结构:
             * {
             *     //_id:  "",    // 临时ID.  系统时间+随机字符串, 前端页面标识用的ID
             *     barcode : "" , //条形码
             * }
             */
            $scope.arr = [{barcode: ""}];
            /*增加一行*/
            $scope.addDiv = function () {
                var str = $filter("date")(new Date(), "yyyyMMddHHmmss");
                var random = Math.ceil(Math.random() * 1000);
                str = str + random;
                $scope.arr.push({
                    barcode: str
                });
            };
            /*删除一行*/
            $scope.jian = function (index) {
                if ($scope.arr.length >= index) {
                    $scope.arr.splice(index, 1);
                }
            };
            /*初始化行数*/
            // $scope.addDiv();
            $scope.imgs = [];
            // 代替图片上传的点击,隐藏自己的控件
            $scope.uploaderFiles = function () {
                if ($scope.imgs.length <= 3) {
                    angular.element("#uploaderFile").click();
                } else {
                    alertService.msgAlert("exclamation-circle", "最多上传3张");
                }
            };

            var uploader = $scope.uploader = new FileUploader({
                url: appConfig.apiPath + '/common/uploadImgS',
                autoUpload: true
            });

            // FILTERS
            uploader.filters.push({
                name: 'customFilter',
                fn: function () {
                    return this.queue.length < 30;
                }
            });

            uploader.onSuccessItem = function (fileItem, response) {
                var s = {};
                s.id = response.id;
                s.key = response.key;
                $scope.imgs.push(s);
            };

            // 删除图片
            $scope.removeOneImg = function (id) {
                for (var i = 0; i < $scope.imgs.length; i++) {
                    if ($scope.imgs[i].id === id) {
                        //从当前的这个i起 删除一个(也就是删除本身)
                        $scope.imgs.splice(i, 1);
                        return;
                    }
                }
            };
            //确定取货
            $scope.takePart = function () {
                // 上传的图片
                var imgs = [];
                // 上传的编码
                var arr = [];
                // 确定图片的地址
                for (var i = 0; i < $scope.imgs.length; i++) {
                    imgs.push($scope.imgs[i].id);
                }
                // 组装填写的编码
                for (var i = 0; i < $scope.arr.length; i++) {
                    if ($scope.arr[i].barcode) {
                        arr.push($scope.arr[i].barcode);
                    }
                }
                // 确认取件
                $http({
                    method: 'POST',
                    url: appConfig.apiPath + "/transport/goStatus",
                    data: $httpParamSerializer({
                        id: transport.id,
                        imgs: angular.toJson(imgs),
                        codes: angular.toJson(arr)
                    }),
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    }
                }).then(function (resp) {
                    $mdDialog.hide(true);
                }, function (resp) {

                });
            };
        }

        return deferred.promise;
    };
    /*已取件弹框*/
    function priceRepairShowlog(transport) {
        var deferred = $q.defer(); //创建一个等待的意思 先后顺序
        $mdDialog.show({
            templateUrl: 'views/main/transport/comDailog/index.root.html',
            controller: DialogController
        }).then(function (result) {
            if (result) {
                deferred.resolve(result);//这就是等待的结果
            }
        });
        DialogController.$inject = ['$scope', '$mdDialog', '$httpParamSerializer', 'FileUploader', '$filter', '$http', 'alertService', 'payService'];
        function DialogController($scope, $mdDialog, $httpParamSerializer, FileUploader, $filter, $http, alertService, payService) {
            $scope.imgUrl = appConfig.imgUrl;
            $scope.params = {update: true, title: "确认支付"};
            $scope.closeDialog = function () {
                $mdDialog.hide();
            };
            // 确认支付
            $scope.submitPrice = function () {
                if ($scope.params.update) {
                    if (!$scope.params.price || isNaN($scope.params.price)) {
                        return
                    }
                    $scope.params.update = false;
                    $scope.params.title = "更改金额";
                } else {
                    $scope.params.update = true;
                    $scope.params.title = "确认修改";
                }
            }
            /* 获取图片的传输 */
            $scope.imgs = [];
            // 代替图片上传的点击,隐藏自己的控件
            $scope.uploaderFiles = function () {
                if ($scope.imgs.length <= 3) {
                    angular.element("#uploaderFile").click();
                } else {
                    alertService.msgAlert("exclamation-circle", "最多上传3张");
                }
            };

            var uploader = $scope.uploader = new FileUploader({
                url: appConfig.apiPath + '/common/uploadImgS',
                autoUpload: true
            });

            // FILTERS
            uploader.filters.push({
                name: 'customFilter',
                fn: function () {
                    return this.queue.length < 30;
                }
            });

            uploader.onSuccessItem = function (fileItem, response) {
                var s = {};
                s.id = response.id;
                s.key = response.key;
                $scope.imgs.push(s);
            };

            // 删除图片
            $scope.removeOneImg = function (id) {
                for (var i = 0; i < $scope.imgs.length; i++) {
                    if ($scope.imgs[i].id === id) {
                        //从当前的这个i起 删除一个(也就是删除本身)
                        $scope.imgs.splice(i, 1);
                        return;
                    }
                }
            };
            // 确认生成支付的价格
            $scope.paymentUser = function (status) {
                // 选择不同的支付方式
                var payType = "ALIPAY";
                var type = "SCAN"
                if (status === 1) {
                    payType = "ALIPAY";
                    if (window.cordova) {
                        type = "APP";
                    } else {
                        type = "WAP";
                    }

                } else if (status === 2) {
                    payType = "WEIXIN";
                    if (window.cordova) {
                        type = "APP";
                    } else {
                        type = "qhPub";
                    }
                } else if (status === 3) {
                    payType = "ALIPAY";
                    type = "SCAN"
                } else {
                    payType = "WEIXIN";
                    type = "SCAN"
                }
                // 上传的图片
                var imgs = [];
                // 确定图片的地址
                for (var i = 0; i < $scope.imgs.length; i++) {
                    imgs.push($scope.imgs[i].id);
                }
                var price = $scope.params.price * 100;
                // 确认取件
                $http({
                    method: 'POST',
                    url: appConfig.apiPath + "/qhUserPay/compensate",
                    data: $httpParamSerializer({
                        id: transport.id,
                        imgs: angular.toJson(imgs),
                        price: price,
                        memo: $scope.params.memo,
                        payType: payType,
                        type: type
                    }),
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    }
                }).then(function (resp) {
                    // 扫一扫的时候,负责数据
                    if (type === 'SCAN') {
                        $scope.params.urlCode = true;
                        // 如果是二维码的,则返回二维码url。其他的则不返回
                        $scope.params.codeUrl = payService.pay(type, payType, resp.data);
                    } else {
                        var boo = payService.pay(type, payType, resp.data);
                    }

                }, function (resp) {

                });
            };
        }

        return deferred.promise;
    };
    return {
        robOrder: robOrder,
        takeShowlog: takeShowlog,
        priceRepairShowlog: priceRepairShowlog
    };

}]);