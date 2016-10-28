(function () {
    angular.module('q-wap-front')

        .config(['$urlMatcherFactoryProvider', function ($urlMatcherFactoryProvider) {
            $urlMatcherFactoryProvider.strictMode(false);
        }])

        .config(['$urlRouterProvider', function ($urlRouterProvider) {
            $urlRouterProvider.otherwise('/');
        }])

        // .config(['$mdThemingProvider', function ($mdThemingProvider) {
        //     $mdThemingProvider
        //         .theme('default')
        //         .primaryPalette('grey', {
        //             'default': '800'
        //         });
        // }])

        // 配置: $httpProvider
        // 使用 $http 相关方法是，可以额外传递以下选项
        // boolean skipGlobalErrorHandler ： 是否跳过全局异常处理
        // boolean notShowError : 如果进行了全局异常处理，则是否弹出错误消息提示
        // boolean showLoginError:当code为NOT_LOGINED时候，如果进行了全局异常处理，showLoginError为false的时候那么就是不弹出错误提示。(默认是false)
        .config(['$provide', '$httpProvider', function ($provide, $httpProvider) {
            $httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';

            $provide.factory('myHttpInterceptor', ['$log', '$q', 'errorService', function ($log, $q, errorService) {
                return {
                    // optional method
                    'response': function (response) {
                        // 配置禁止全局异常处理
                        if (response.config.skipGlobalErrorHandler) {
                            return response;
                        }

                        // 非JSON数据
                        var contentType = response.headers('Content-Type');
                        if (!contentType || contentType.indexOf('application/json') !== 0) {
                            return response;
                        }

                        // JSON 响应结果是成功的结果
                        var respData = response.data;
                        if (respData && respData.code && respData.code === 'SUCCESS'
                            || respData && respData.code && respData.raw === true) {
                            return response;
                        }

                        // 默认错误结果
                        var resultJson = {
                            msg: "服务器异常，请稍后重试",
                            raw: false,  // 始终为false
                            code: 'ERROR',
                            rawMsg: null
                        };

                        if (typeof respData.code === 'string' && respData.code) {
                            resultJson.code = respData.code;

                            if (respData.code !== 'SUCCESS') {
                                if (respData.raw) {
                                    if (respData.msg) {
                                        resultJson.rawMsg = respData.msg;
                                    }
                                } else {
                                    if (respData.msg) {
                                        resultJson.msg = respData.msg;
                                    }
                                }
                            }
                        }

                        //if (!response.config.notShowError) {
                        //    errorService.errors(resultJson.msg);
                        //}
                        //console.log(response)
                        //console.log(resultJson)
                        if (resultJson.code === 'NOT_LOGINED') {
                            if (!response.config.notShowError && response.config.showLoginError) {
                                errorService.errors(resultJson.msg);
                            }
                        } else {
                            if (!response.config.notShowError) {
                                errorService.errors(resultJson.msg);
                            } else if (resultJson.code === "ERROR") {
                                errorService.errors(resultJson.msg);
                            }
                        }

                        response.oldData = response.data;
                        response.data = resultJson;
                        return $q.reject(response);
                    },

                    // 401 404 500 等错误
                    'responseError': function (response) {
                        // 配置禁止全局异常处理
                        if (response.config.skipGlobalErrorHandler) {
                            console.log("!111")
                            return $q.reject(response);
                        }


                        // 默认错误结果
                        var resultJson = {
                            msg: "系统错误，请稍后重试",
                            raw: false,  // 始终为false
                            code: 'ERROR',
                            rawMsg: null
                        };

                        var contentType = response.headers('Content-Type');
                        if (contentType == null) {
                            resultJson.msg = "网络连接异常";
                            resultJson.code = "UNKNOWN";
                        } else if (contentType && (contentType.indexOf('application/json') === 0)) {
                            var respData = response.data;
                            if (typeof respData.code === 'string' && respData.code) {
                                resultJson.code = respData.code;
                            }
                            if (respData.raw) {
                                if (respData.msg) {
                                    resultJson.rawMsg = respData.msg;
                                }
                            } else {
                                if (respData.msg) {
                                    resultJson.msg = respData.msg;
                                }
                            }
                        }
                        if (resultJson.code === 'NOT_LOGINED') {
                            if (!response.config.notShowError && response.config.showLoginError) {
                                errorService.errors(resultJson.msg);
                            }
                        } else {
                            if (resultJson.code !== "UNKNOWN" && !response.config.notShowError) {
                                errorService.errors(resultJson.msg);
                            } else if (resultJson.code == "UNKNOWN") {
                                errorService.errors(resultJson.msg, true);
                            }
                        }
                        response.oldData = response.data;
                        response.data = resultJson;

                        return $q.reject(response);
                    }
                };
            }]);

            $httpProvider.interceptors.push('myHttpInterceptor');
        }])

        .run(['$rootScope', '$interval', '$state', '$stateParams', '$log', '$cacheFactory', 'errorService',
            function ($rootScope, $interval, $state, $stateParams, $log, $cacheFactory, errorService) {

                $rootScope.$state = $state;
                $rootScope.$stateParams = $stateParams;

                // 缓存商品的详情
                $rootScope.itemCache = $cacheFactory('itemCache');
                // 缓存网店详情
                $rootScope.agentCache = $cacheFactory('agentCache');
                // 缓存公司详情
                $rootScope.pageCache = $cacheFactory('pageCache');
                // 缓存活动详情
                $rootScope.activityCache = $cacheFactory('activityCache');
                // 缓存蚕丝被翻新添补各类的介绍详情
                $rootScope.serviceOrderCache = $cacheFactory('serviceOrderCache');
                // 服务承诺详情
                $rootScope.productCache = $cacheFactory('productCache');
                // 前端商品的活动后的商品进行的缓存
                $rootScope.activitySkuCache = $cacheFactory('activitySkuCache');


                $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
                    // $log.debug("$stateChangeStart : fromState = " + JSON.stringify(fromState.name) + ", toState = " + JSON.stringify(toState.name));
                    var url = window.location.href;
                    var ua = window.navigator.userAgent.toLowerCase();
                    if (!ua.match(/android/i) && !ua.match(/MicroMessenger/i) && !ua.match(/iphone/i)) {
                        // 检查url是否输入错误
                        // 查找url中的#
                        var o = url.indexOf("#");
                        var y = url.indexOf("?");
                        if (o > 0 && (y > o || y === -1)) {
                            // 替换新的url  重新刷新url
                            url = url.substr(0, o) + "?showwxpaytitle=1" + url.substr(o);
                            location.href = url;
                        }
                    }
                    $interval.cancel($rootScope.intervalStop);
                    $rootScope.intervalStop = null;
                    // if (window.cordova) {
                    //     if (cordova.platformId === 'ios') {
                    //         var toStates = ["main.center", "main.wallet", "main.wallet.balanceDetail", "main.user.codee"]; // #333333
                    //         for (var i = 0; i < toStates.length; i++) {
                    //             if (toStates[i] === toState.name) {
                    //                 window.StatusBar.backgroundColorByHexString("#333");
                    //                 window.StatusBar.styleLightContent();
                    //                 return;
                    //             }
                    //         }
                    //         window.StatusBar.backgroundColorByHexString("#FFF");
                    //         window.StatusBar.styleDefault();
                    //     }
                    // }
                });

                $rootScope.$on('$stateNotFound', function (event, unfoundState, fromState, fromParams) {
                    //$log.debug("$stateNotFound : fromState = " + JSON.stringify(fromState.name) + ", toState = " + JSON.stringify(unfoundState.name));
                });

                $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
                    $rootScope.errorsMsg = true;
                    //$log.debug("$stateChangeSuccess : fromState = " + JSON.stringify(fromState.name) + ", toState = " + JSON.stringify(toState.name));
                });
                $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
                    //$log.debug("$stateChangeError : fromState = " + JSON.stringify(fromState.name) + ", toState = " + JSON.stringify(toState.name) + ", error = ", error);
                    // 未登录
                    // https://github.com/angular-ui/ui-router/issues/42
                    if (error && error.data && error.data.code === 'NOT_LOGINED') {
                        //errorService.errors(error.data.msg ? error.data.msg : "请先登录", function () {
                        $rootScope._savedState = {
                            fromStateName: fromState.name,
                            fromStateParams: fromParams
                        };
                        $state.go("main.login", {backUrl: window.location.href});
                        //$state.go("main.login", {s:fromState.name,src: window.location.href});
                        //});
                    }
                });

                $rootScope.$on('$viewContentLoading', function (event, viewConfig) {
                });
                $rootScope.$on('$viewContentLoaded', function (event) {
                });
            }])

        .run(['$rootScope', '$state', '$stateParams', function ($rootScope, $state, $stateParams) {
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;
        }])

        // .run(['updateService', function (updateService) {
        //     updateService.init();
        // }])

        .run(['$mdDialog', '$state', function ($mdDialog, $state) {
            if (document.querySelector("html").classList.contains("js") && document.querySelector("html").classList.contains("flexbox") && document.querySelector("html").classList.contains("flexwrap")) {
                //  alert(document.querySelector("html").classList.contains("js")+'-----'+ document.querySelector("html").classList.contains("flexbox")+'-----'+document.querySelector("html").classList.contains("flexwrap"));
            } else {
                $mdDialog.show({
                    templateUrl: 'views/main/service/security/validate/chaxunDialog/index.root.html',
                    parent: angular.element(document.body).find('#qh-wap'),
                    targetEvent: null,
                    clickOutsideToClose: false,
                    fullscreen: false,
                    controller: ['$scope', '$mdDialog', '$state', 'urlbackService', function ($scope, $mdDialog, $state, urlbackService) {
                        var vm = this;
                        vm.msg = '暂不支持该浏览器,请下载火狐或谷歌浏览器!';
                        vm.title = '错误';
                        vm.rightButton = "前往下载";
                        vm.checkSubmit = function () {
                            //document.location.href("https://www.baidu.com");
                            urlbackService.urlBack("http://rj.baidu.com/soft/detail/14744.html?ald");
                        };

                    }],
                    controllerAs: "vm"
                }).then(function (answer) {

                }, function () {
                    alert('失败');
                });
            }

        }])
        .run(['updateService', function (updateService) {
            updateService.init();
        }])

})();
