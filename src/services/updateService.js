(function () {
    "use strict";

    /**
     * 关于自动更新的相关代码
     * 参考： https://github.com/Microsoft/cordova-plugin-code-push
     */
    angular.module('q-wap-front')
        .factory('updateService', upgradeService);
    upgradeService.$inject = ['$q', '$window', '$timeout', 'appConfig', 'errorService', '$mdDialog', 'alertService', '$http'];
    function upgradeService($q, $window, $timeout, appConfig, errorService, $mdDialog, alertService, $http) {

        return {
            init: init,
            userHandled: false
        };
        function codePushUpdate() {
            // 检查更新包
            window.codePush.checkForUpdate(onUpdateCheck, function (err) {
                alertService.msgAlert('exclamation-circle', "检查更新包失败:" + err);
            });
        }

        /**
         * 1 apk强制升级
         * 2 apk普通升级
         * 3 codePush强制升级
         * 4 codePush普通升级
         * data app升级的数据
         * remotePackage codepush升级的数据
         */
        function commenUpdate(number, title, msg, leftButton, rightButton, data, remotePackage) {
            // 检查更新包
            $mdDialog.show({
                templateUrl: 'views/common/index.root.html',
                parent: angular.element(document.body).find('#qh-wap'),
                targetEvent: null,
                clickOutsideToClose: false,
                fullscreen: false,
                controller: onUpdateCheckController,
                controllerAs: "vm"
            }).then(function (answer) {
            }, function () {
            });
            // -------------------------------
            onUpdateCheckController.$inject = ["$mdDialog", "$scope"];
            function onUpdateCheckController($mdDialog, $scope) {
                var vm = this;
                vm.title = title;
                vm.msg = msg;
                vm.leftButton = leftButton;
                vm.rightButton = rightButton;
                vm.checkSubmit = function () {
                    // $mdDialog.hide(true);
                    if (number === 1) {
                        var ref = window.cordova.InAppBrowser.open(data.url, '_system', 'location=yes');
                    } else if (number === 2) {
                        var ref = window.cordova.InAppBrowser.open(data.url, '_system', 'location=yes');
                        $mdDialog.hide(true);
                    } else if (number === 3) {
                        $mdDialog.hide(true);
                        doUpgrade(remotePackage);
                    } else if (number === 4) {
                        $mdDialog.hide(true);
                        doUpgrade(remotePackage);
                    }
                };
                vm.cancel = function () {
                    if (number === 2) {
                        codePushUpdate();
                        $mdDialog.hide(true);
                    } else if (number === 4) {
                        $mdDialog.hide(true);
                    }
                };
            }
        }

        /** 检查是否有cordova, 并绑定相应的事件函数 */
        function init() {
            if ($window.cordova) {
                $window.document.addEventListener('deviceready', function () {
                    // 第一次安装apk后用
                    $window.codePush.notifyApplicationReady();
                    if (cordova.platformId === 'ios') {
                        window.baidupush.startWork("FH4ZHQc4K5rlUgCOj2T6RsBE", function (info) {
                            console.log(info.toJSONString());
                        });
                    } else {
                        window.baidupush.startWork(appConfig.baidupushAndroid, function (info) {
                            console.log(info.toJSONString());
                        });
                    }
                    /* window.cordova.getAppVersion.getVersionNumber(function (version) {
                     $http({
                     method: 'GET',
                     url: appConfig.apiPath + '/appVersion/app?version=' + version + '&platform=' + window.cordova.platformId
                     }).then(function (resp) {
                     var data = resp.data;
                     if (data.master) {
                     // 当前版本,直接检测codepush
                     codePushUpdate();
                     } else {
                     var msg = "本次版本需要立即更新,建议wifi下下载。";
                     if (data.msg) {
                     msg = data.msg;
                     }
                     if (data.update === 1) {
                     // 强制更新
                     commenUpdate(1, "发现新版本", msg, null, "立即更新", data, null);
                     } else if (data.update === 0) {
                     // 普通更新
                     commenUpdate(2, "发现新版本", msg, "取消", "立即更新", data, null);
                     } else {
                     // 不需要更新
                     codePushUpdate();
                     }
                     }
                     }, function () {
                     // 查询失败 直接查询code push
                     codePushUpdate();
                     });
                     });*/
                }, false);
            }
            // commenUpdate(4, "发现新版本","12", "取消", "立即更新", {url: "wwww.baidu.com"}, null);
            /* else {
             //TODO 测试代码
             doUpgradeTest();
             }*/
        }

        /**
         * 有新更新包时的事件处理函数。
         */
        function onUpdateCheck(remotePackage) {
            if (!remotePackage) {
                return;
            }
            // 强制更新的话，则不提示用户
            if (remotePackage.isMandatory) {
                commenUpdate(3, "发现新版本", '本次版本涉及重大更新,建议wifi下更新', null, "立即更新", null, remotePackage);
                // 非强制更新则让用户选择是否更新
                /*  $window.navigator.notification.confirm(
                 '本次版本涉及重大更新,建议wifi下更新',
                 function (btnIndex) {
                 switch (btnIndex) {
                 case 1:
                 doUpgrade(remotePackage);
                 break;
                 default:
                 if (!cordova.platformId === 'ios') {
                 window.navigator.app.exitApp();
                 }
                 break;
                 }
                 },
                 '提示',
                 ['立即更新', '取消']);*/
                // doUpgrade(remotePackage);
                return;
            }
            commenUpdate(4, "发现新版本", '有新的更新是否安装,建议wifi下更新', "取消", "立即更新", null, remotePackage);
            // 非强制更新则让用户选择是否更新
            /*  $window.navigator.notification.confirm(
             '有新的更新是否安装',
             function (btnIndex) {
             switch (btnIndex) {
             case 1:
             doUpgrade(remotePackage);
             break;
             default:
             }
             },
             '提示',
             ['立即更新', '取消']);*/
        }

        /**
         * 下载并更新
         */
        function doUpgrade(remotePackage) {
            /*   $modal.open({
             templateUrl: 'views/updateApp/index.root.html',
             //scope: $scope,
             backdrop: false,
             keyboard: false,
             controller: updateProgressController,
             controllerAs: "vm",
             size: 'lg'
             //resolve: {
             //    remotePackage: function () {
             //        return remotePackage;
             //    }
             //}
             });*/
            $mdDialog.show({
                templateUrl: 'views/main-app/updateApp/index.root.html',
                parent: angular.element(document.body).find('#qh-wap'),
                targetEvent: null,
                clickOutsideToClose: false,
                fullscreen: false,
                controller: updateProgressController,
                controllerAs: "vm"
            })
                .then(function (answer) {
                    $window.navigator.notification.alert(
                        '马上可以用上新版本啦!',  // message
                        function () {

                        },         // callback
                        '更新完成',            // title
                        '确定'                  // buttonName
                    );
                }, function () {
                });

            // -------------------------------
            updateProgressController.$inject = ["$mdDialog", "$scope"];
            function updateProgressController($mdDialog, $scope) {
                /* jshint validthis: true */
                var vm = this;
                vm.dynamic = 0;
                //$scope.dynamic = 0;
                remotePackage.download(onDownloadSuccess, onDownloadError, onDownloadProgress);

                function onDownloadSuccess(localPackage) {
                    localPackage.install(onInstallSuccess,
                        onInstallError,
                        {installMode: $window.InstallMode.IMMEDIATE});
                }

                function onDownloadError(error) {
                    alertService.msgAlert('exclamation-circle', "下载失败:" + error);
                }

                function onDownloadProgress(downloadProgress) {
                    vm.dynamic = parseInt((downloadProgress.receivedBytes / downloadProgress.totalBytes) * 100);
                    $scope.$apply();
                }

                function onInstallSuccess() {
                    alertService.msgAlert('exclamation-circle', "更新完成");
                    $mdDialog.hide(true);
                }

                function onInstallError(error) {
                    alertService.msgAlert('exclamation-circle', "更新失败:" + error);
                }
            }
        }

        // TODO 测试代码 请勿删除
        /*function doUpgradeTest() {
         $mdDialog.show({
         templateUrl: 'views/updateApp/index.root.html',
         parent: angular.element(document.body).find('#qh-wap'),
         targetEvent: null,
         clickOutsideToClose: false,
         fullscreen: false,
         controller: TestController,
         controllerAs: "vm"
         })
         .then(function (answer) {
         ;
         $mdDialog
         .show($mdDialog.alert({
         title: 'Attention',
         textContent: 'This is an example of how easy dialogs can be!',
         ok: 'Close'
         }));
         }, function () {
         });

         // -------------------------------
         TestController.$inject = ["$mdDialog", "$scope", "$interval", "$rootScope"];
         function TestController($mdDialog, $scope, $interval, $rootScope) {
         /!* jshint validthis: true *!/
         var vm = this;
         vm.dynamic = 0;
         var i = 1;
         console.log("333333333333")
         vm.intervalStop = $interval(function () {
         console.log("1111111")
         vm.dynamic = i
         i++;
         if (i >= 10) {
         $interval.cancel(vm.intervalStop);//解除计时器
         vm.intervalStop = null;
         $mdDialog.hide(true);
         }
         }, 500);
         }
         }*/
    }
})();
