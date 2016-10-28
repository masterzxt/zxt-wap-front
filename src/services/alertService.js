angular.module('q-wap-front').factory('alertService', ['$q', 'appConfig', '$mdDialog', '$mdMedia', function ($q, appConfig, $mdDialog, $mdMedia) {
    function confirm(ev, msg, title, leftButton, rightButton) {
        var deferred = $q.defer(); //创建一个等待的意思 先后顺序
        $mdDialog.show({
            templateUrl: 'views/common/index.root.html',
            parent: angular.element(document.body).find('#q-wap'),
            targetEvent: ev,
            clickOutsideToClose: true,
            fullscreen: false,
            controller: ['$scope', '$mdDialog', function ($scope, $mdDialog) {
                var vm = this;
                vm.msg = msg;
                vm.title = title;
                vm.leftButton = leftButton ? leftButton : "取消";
                vm.rightButton = rightButton ? rightButton : "确定";
                vm.checkSubmit = function () {
                    $mdDialog.hide(true);
                };
                vm.cancel = function () {
                    $mdDialog.cancel();
                };
            }],
            controllerAs: "vm"
        })
            .then(function (answer) {
                deferred.resolve(answer);//这就是等待的结果
            }, function () {
                deferred.resolve(false);//这就是等待的结果
            });
        return deferred.promise;
    }


    function msgAlert(status, msg) {
        var deferred = $q.defer(); //创建一个等待的意思 先后顺序
        //加入购物车成功
        var intervalStop = undefined;
        $mdDialog.show({
            templateUrl: 'views/common/alert/index.root.html',
            controllerAs: "vm",
            controller: ['$scope', '$mdDialog', '$rootScope', "$interval", function ($scope, $mdDialog, $rootScope, $interval) {
                var vm = this;
                vm.status = status;
                if (status === 'cancle') {
                    vm.status = 'lq-cancle';
                }
                if (status === 'success') {
                    vm.status = 'lq-success';
                }
                if (status === 'exclamation-circle') {
                    vm.status = 'lq-exclamation-circle';
                }
                vm.msg = msg;
                if (msg.indexOf('成功') >= 0) {
                    //避免遗漏的情况
                    vm.status = 'lq-success';
                }
                vm.cancel = function () {
                    $mdDialog.cancel();
                };
                var i = 1;
                intervalStop = $interval(function () {
                    if (i <= 0) {
                        //$mdDialog.cancel();
                        vm.cancel()
                        var bb = $interval.cancel(intervalStop);//解除计时器
                        intervalStop = undefined;
                    }
                    i--;
                }, 800);
            }],
            parent: '.ks-main '

        }).then(function (clickedItem) {
            deferred.resolve(true);//这就是等待的结果
        }, function () {
            deferred.resolve(true);//这就是等待的结果
        });
        return deferred.promise;
    }

    function alert(msg, title, button) {
        if (!button) {
            button = "确定";
        }
        $mdDialog.show(
            $mdDialog.alert()
                .parent(angular.element(document.body).find('#q-wap'))
                .clickOutsideToClose(true)
                .title(title)
                .textContent(msg)
                .ariaLabel('Alert Dialog Demo')
                .ok(button)
            //.targetEvent(ev)
        );
    }

    /* /!**
     * 弹出错误消息提示
     *!/
     function confirm(msg, scope, title) {
     var deferred = $q.defer(); //创建一个等待的意思 先后顺序
     var modalInstance = $uibModal.open({
     templateUrl: 'views/common/index.root.html',
     scope: scope,
     controller: ['$scope', '$uibModalInstance', 'msg', function ($scope, $uibModalInstance, msg) {
     $scope.msg = msg;
     $scope.title = title;
     $scope.checkSubmit = function () {
     $modalInstance.close(true);
     };
     $scope.cancel = function () {
     $modalInstance.close(false);
     };
     }],
     size: 'sm',
     resolve: {
     msg: function () {
     return msg;
     }
     }
     });

     modalInstance.result.then(
     function (selectedItem) {
     deferred.resolve(selectedItem);//这就是等待的结果
     }
     );

     return deferred.promise;
     }*/

    return {
        confirm: confirm,
        alert: alert,
        msgAlert: msgAlert,
        isUpdateApp: true
    };
    ///////////////另外一种写法！！！！！！！
    //var factory={};
    //factory.confirm=function(msg, scope){
    //    var deferred = $q.defer(); //创建一个等待的意思 先后顺序
    //    var modalInstance = $modal.open({
    //        templateUrl: 'views/common/index.root.html',
    //        scope: scope,
    //        controller: ['orderService', '$scope', '$modalInstance', 'msg', function (orderService, $scope, $modalInstance, msg) {
    //            $scope.msg = msg;
    //            $scope.checkSubmit = function () {
    //                $modalInstance.close(true);
    //            };
    //            $scope.cancel = function () {
    //                $modalInstance.close(false);
    //            };
    //        }],
    //        size: 'sm',
    //        resolve: {
    //            msg: function () {
    //                return msg;
    //            }
    //        }
    //    });
    //
    //    modalInstance.result.then(
    //        function (selectedItem) {
    //            deferred.resolve(selectedItem);//这就是等待的结果
    //        }
    //    );
    //
    //    return deferred.promise;
    //};
    //return factory;
}]);