angular.module('q-wap-front').factory('errorService', ['$log', '$injector', "$rootScope", function ($log, $injector, $rootScope) {

    return {
        error: error,
        errors: errors
    };

    /**
     * 弹出错误消息提示
     */
    function error(msg, onCloseFn) {

        var $mdToast = $injector.get('$mdToast');
        $mdToast.show($mdToast.simple()
            .textContent(msg)
            .position("top center")
            .hideDelay(1500)
        );
        //
        // $log.log("~!!!!!!!!!!!!");
        // var $ = jQuery;
        // $.notifyClose(); // 先关闭之前所有的消息
        // $.notify({
        //     message: msg
        // }, {
        //     type: 'error',
        //     position:'fixed',
        //     z_index: 2000,
        //     animate: {
        //         enter: 'animated fadeInDown',
        //         exit: 'animated fadeOutUp'
        //     },
        //     placement: {
        //         from: "top",
        //         align: "center"
        //     },
        //     allow_dismiss: false,
        //     newest_on_top: true,
        //     delay: 500, //延迟
        //     timer: 1500,  //定时器
        //     onClose: function () {
        //         if (onCloseFn) {
        //             onCloseFn();
        //         }
        //     }
        // });
    }

    /**
     * 弹出错误消息提示
     * 超时一类的才来进行判断
     */
    function errors(msg, boo) {
        if (boo) {
            if (!$rootScope.errorsMsg) {
                return;
            }
            $rootScope.errorsMsg = !$rootScope.errorsMsg;
        }
        var $mdDialog = $injector.get('$mdDialog');
        //加入购物车成功
        var intervalStop = undefined;
        $mdDialog.show({
            templateUrl: 'views/common/alert/index.root.html',
            controllerAs: "vm",
            clickOutsideToClose: true,
            fullscreen: false,
            controller: ['$scope', '$rootScope', "$interval", function ($scope, $rootScope, $interval) {
                var vm = this;
                vm.status = "ks-cancle";
                vm.msg = msg;
                if (msg.indexOf('成功') >= 0) {
                    //避免遗漏的情况
                    vm.status = 'ks-success';
                }
                vm.cancel = function () {
                    $mdDialog.cancel();
                };
                var i = 1;
                intervalStop = $interval(function () {
                    if (i <= 0) {
                        vm.cancel();
                        var bb = $interval.cancel(intervalStop);//解除计时器
                        // console.log("-----------------" + bb);
                        intervalStop = undefined;
                    }
                    i--;
                }, 800);
            }],
            parent: '.ks-main '

        }).then(function (clickedItem) {
        }, function () {
        });
    }
}]);