/**
 * Module : xxx
 */
(function () {
    angular.module('q-wap-front')
        .config(['$stateProvider', function ($stateProvider) {

            $stateProvider.state("main.apply", {
                url: "/apply",
                views: {
                    "@": {
                        templateUrl: 'views/main/apply/index.root.html',
                        controller: applyController
                    }
                }
            });
        }]);


    // ----------------------------------------------------------------------------
    applyController.$inject = ['$scope', '$state', '$http', 'appConfig',
        '$httpParamSerializer', 'FileUploader', 'imgService','$timeout','alertService','$interval'];
    function applyController($scope, $state, $http, appConfig, $httpParamSerializer, FileUploader, imgService,$timeout,alertService,$interval) {
        $scope.staff = {};
        $scope.idJustKey = "";
        $scope.idBackKey = "";
        $scope.select = true;
        $scope.imgService = imgService;
        $scope.appConfig = appConfig;
        $scope.changeSelect = function () {
            $scope.select = !$scope.select;
        };
        // 回退页面
        $scope.fallbackPage = function () {
            if (history.length === 1) {
                $state.go("main.index", null, {reload: true});
            } else {
                history.back();
            }
        };

        $scope.activated = true;
        $scope.determinateValue = 30;

        // Iterate every 100ms, non-stop and increment
        // the Determinate loader.
        $interval(function() {

            $scope.determinateValue += 1;
            if ($scope.determinateValue > 100) {
                $scope.determinateValue = 30;
            }

        }, 100);

        $scope.submit = function () {
            if($scope.select){
                if($scope.staff.idNumber.length===18){
                    //提交申请
                    $http({
                        method: "POST",
                        url: appConfig.apiPath + '/staff/applyStaff',
                        data: $httpParamSerializer($scope.staff),
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                        }
                    }).then(function () {
                        $state.go("main.apply.applySuccess");
                    });
                }else{
                    alertService.msgAlert("exclamation-circle", "请输入18位身份证号");
                }
            }else{
                alertService.msgAlert("exclamation-circle", "同意协议才能注册");
            }
        };
        // 代替图片上传的点击,隐藏自己的控件
        $scope.uploaderFile = function (num) {
            if(num===1) {
                $timeout(function () {
                    angular.element("#uploaderFile").click();
                });
            }else if(num===2){
                $timeout(function () {
                    angular.element("#uploaderFile1").click();
                });
            }
        };
        var uploader = $scope.uploader = new FileUploader({
            url: appConfig.apiPath + '/common/uploadImgS',
            autoUpload: true
        });

        // FILTERS 1
        uploader.filters.push({
            name: 'customFilter',
            fn: function () {
                return this.queue.length < 30;
            }
        });

        uploader.onSuccessItem = function (fileItem, response) {
            $scope.idJustKey = response.key;
            $scope.staff.idJust = response.id;
        };

        var uploader1 = $scope.uploader1 = new FileUploader({
            url: appConfig.apiPath + '/common/uploadImgS',
            autoUpload: true
        });

        // FILTERS 2
        uploader1.filters.push({
            name: 'customFilter',
            fn: function () {
                return this.queue.length < 30;
            }
        });

        uploader1.onSuccessItem = function (fileItem, response) {
            $scope.idBackKey = response.key;
            $scope.staff.idBack = response.id;
        };

        $scope.remove = function (nums) {
            if(nums===1){
                $scope.idJustKey = "";
                $scope.staff.idJust = "";
            }else if(nums===2){
                $scope.idBackKey = "";
                $scope.staff.idBack = "";
            }
        };


        $scope.getLocation = function () {
            var myCity = new BMap.LocalCity();
            myCity.get($scope.location);
        };
        $scope.location = function (result) {
            $scope.staff.cityName = result.name;
            //通知scope作用域
            $scope.$apply($scope.staff);
        };
        //获取地理地址
        $scope.getLocation();

        /**
         * 劳动协议
         */
        $scope.goRentPage = function () {
            $http({
                method: "GET",
                url: appConfig.apiPath + '/common/agreement',
                params:{
                    type:'Q_USER'
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