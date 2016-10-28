/**
 * Module : xxx
 */
(function () {
    angular.module('q-wap-front')
        .config(['$stateProvider', function ($stateProvider) {

            $stateProvider.state("main.personal", {
                url: "/personal",
                resolve: {
                    curUser: ['userService', function (userService) {
                        return userService.getCurUser(true, true);
                    }]
                },
                views: {
                    "@": {
                        templateUrl: 'views/main/personal/index.root.html',
                        controller: personalController
                    }
                }
            });
        }]);


    // ----------------------------------------------------------------------------
    personalController.$inject = ['$scope', '$state', '$httpParamSerializer', '$http',
        'appConfig', 'curUser', 'imgService', '$timeout', 'FileUploader', 'alertService', '$filter'];
    function personalController($scope, $state, $httpParamSerializer, $http,
                                appConfig, curUser, imgService, $timeout, FileUploader, alertService, $filter) {
        //用户的基本信息
        $scope.imgUrl = appConfig.imgUrl;
        $scope.simpleImg = imgService.simpleImg;
        $scope.slideImg = imgService.slideImg;
        $scope.baseInfo = curUser.data.userInfo;
        $scope.birth = "";
        $scope.backshow = false;
        $scope.months = [];
        $scope.days = [];
        $scope.staff = $scope.baseInfo;
        //生日随机数
        /*$scope.randomBirth = function () {
            for (var i = 1; i <= 31; i++) {
                if (i < 10) {
                    $scope.months.push("0" + i);
                    $scope.days.push("0" + i);
                } else if (i < 13) {
                    $scope.months.push("" + i);
                    $scope.days.push("" + i);
                } else {
                    $scope.days.push("" + i);
                }
            }
        };*/
        //$scope.randomBirth();
        /*$scope.setBirth = function () {
            $scope.setMonth = $scope.staff.month;
            $scope.setDay = $scope.staff.day;
            $scope.updateUserInfo();
        };*/
        /*if ($scope.baseInfo.birthday) {
            $scope.staff.month = $filter('date')($scope.baseInfo.birthday, 'MM');
            $scope.staff.day = $filter('date')($scope.baseInfo.birthday, 'dd');
        }*/

        $scope.fallbackPage = function () {
            if (history.length === 1) {
                $state.go("main.index", null, {reload: true});
            } else {
                history.back();
            }
        };
        $scope.backOpen = function (num) {
            $scope.backshow = !$scope.backshow;
            $scope.isPhoto = false;
            $scope.isNick = false;
            if (num === 1) {
                $scope.isPhoto = true;
            } else if (num === 2) {
                $scope.isNick = true;
            }
        };
        //更新头像
        $scope.uploaderFile = function () {
            $timeout(function () {
                angular.element("#uploaderFile").click();
            });
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
            $scope.myPhoto = response.key;
            $scope.staff.myPhId = response.id;
            $scope.updateUserInfo();
        };

        //修改昵称
        $scope.updateNick = function () {
            if ($scope.staff.myNewNick) {
                $scope.updateUserInfo();
            } else {
                $scope.backOpen();
                alertService.msgAlert("cancle", "不能为空!");
            }
        };
        //修改性别
        $scope.changeGender = function () {
            // console.log($scope.staff.gender);
            $scope.updateUserInfo();
        };


        /**
         * 更新用户的信息
         */
        $scope.updateUserInfo = function () {
           /* var birthday = '';
            if ($scope.setMonth && $scope.setDay) {
                birthday = "2016-" + $scope.setMonth + "-" + $scope.setDay
            }*/
            $http({
                method: "POST",
                url: appConfig.apiPath + '/user/modifyUserInfo',
                data: $httpParamSerializer({
                    avatar: $scope.staff.myPhId,
                    gender: $scope.staff.gender,
                    nickName: $scope.staff.myNewNick,
                    /* birthDay: birthday*/
                    zodiac: $scope.staff.zodiac
                }),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            }).then(function () {
                $state.reload();
            });
        };

        // 获取枚举值的key和value
        $scope.ZodiacEnums = {};

        $http.get(appConfig.apiPath + "/common/enumCodes?enumType=ZodiacEnum")
            .success(function (data) {
                $scope.ZodiacEnums = data.data.ZodiacEnum;
            });

        // 获取枚举值的key和value
        $scope.GenderEnums = {};

        $http.get(appConfig.apiPath + "/common/enumCodes?enumType=GenderEnum")
            .success(function (data) {
                $scope.GenderEnums = data.data.GenderEnum;
            });


    }
})();