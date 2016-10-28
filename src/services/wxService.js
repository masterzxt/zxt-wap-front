angular.module('q-wap-front').factory('wxService', ['$http', '$q', "$timeout", 'errorService', 'appConfig', 'userService', 'alertService',
    function ($http, $q, $timeout, errorService, appConfig, userService, alertService) {
        /**
         * 初始化微信
         */
        function init() {
            var deferred = $q.defer();
            var ua = window.navigator.userAgent.toLowerCase();
            if (ua.match(/MicroMessenger/i) && !ua.match(/windows/i)) {
                $http.get(appConfig.apiPath + '/weiXin/jsSdkConf', {
                    params: {
                        url: location.href.split('#')[0]
                    }
                }).then(function (resp) {
                    resp.data.jsApiConf.debug = false;
                    console.info("已经获取了微信JS SDK 的配置对象", resp.data.jsApiConf);
                    //$scope.wxReady = true;
                    wx.config(resp.data.jsApiConf);
                    wx.isConfig = false;
                    wx.error(function (res) {
                        console.info("微信调用出错了 ", res);
                    });
                    deferred.resolve(true);
                });
            } else {
                deferred.resolve(false);
            }
            return deferred.promise;
        }

        // 分享到朋友圈
        function shareRing(url, title, imgUrl) {
            var payWXWay = false;
            var ua = window.navigator.userAgent.toLowerCase();
            if (ua.match(/MicroMessenger/i) && !ua.match(/windows/i)) {
                // 处于微信浏览器，打开微信支付
                payWXWay = true;
            }
            if (payWXWay) {
                if (url) {
                    url = encodeURIComponent(url);
                } else {
                    url = "";
                }
                wx.onMenuShareTimeline({
                    title: title, // 分享标题
                    desc: title,
                    link: url, // 分享链接，后台配置时，以&或？结尾
                    //link: 'http://kingsilk.net/qh/mall/local/?_ddnsPort=16500#/share?inviterId=' + id + "&backUrl=" + url, // 分享链接
                    //imgUrl: 'http://img.kingsilk.net/43100c3436bad4f1cf263149d0a50435?imageView2/2/w/200/h/200', // 分享图标
                    //type: '', // 分享类型,music、video或link，不填默认为link
                    //dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                    imgUrl: imgUrl, // 分享图标
                    success: function () {
                        // 用户确认分享后执行的回调函数
                        alertService.msgAlert('exclamation-circle', "分享成功");
                    },
                    cancel: function () {
                        // 用户取消分享后执行的回调函数
                        alertService.msgAlert('exclamation-circle', "分享失败");
                    }
                });
            } else {
                alertService.msgAlert('exclamation-circle', "请使用微信分享哦");
            }
        }

        // 发送给朋友
        function shareFriend(url, title, imgUrl) {
            var payWXWay = false;
            var ua = window.navigator.userAgent.toLowerCase();
            if (ua.match(/MicroMessenger/i) && !ua.match(/windows/i)) {
                // 处于微信浏览器，打开微信支付
                payWXWay = true;
            }
            if (payWXWay) {
                if (url) {
                    url = encodeURIComponent(url);
                } else {
                    url = "";
                }
                wx.onMenuShareAppMessage({
                    title: title, // 分享标题
                    desc: title,
                    link: url, // 分享链接，后台配置时，以&或？结尾
                    //link: 'http://kingsilk.net/qh/mall/local/?_ddnsPort=16500#/share?inviterId=' + id + "&backUrl=" + url, // 分享链接
                    //imgUrl: 'http://img.kingsilk.net/43100c3436bad4f1cf263149d0a50435?imageView2/2/w/200/h/200', // 分享图标
                    //type: '', // 分享类型,music、video或link，不填默认为link
                    //dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                    imgUrl: imgUrl, // 分享图标
                    success: function () {
                        // 用户确认分享后执行的回调函数
                        alertService.msgAlert('exclamation-circle', "分享成功");
                    },
                    cancel: function () {
                        // 用户取消分享后执行的回调函数
                        alertService.msgAlert('exclamation-circle', "分享失败");
                    }
                });
            } else {
                alertService.msgAlert('exclamation-circle', "请使用微信分享哦");
            }
        }

        // 微信上传图片
        function wxUploadImg() {
            var deferred = $q.defer();
            wx.chooseImage({
                count: 1, // 默认9
                sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                success: function (res) {
                    var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                    if (res.localIds.length === 1) {
                        wx.uploadImage({
                            localId: localIds[0], // 需要上传的图片的本地ID，由chooseImage接口获得
                            isShowProgressTips: 1, // 默认为1，显示进度提示
                            success: function (res) {
                                var serverId = res.serverId; // 返回图片的服务器端ID
                                $http.get(appConfig.apiPath + '/common/uploadImage', {
                                    params: {
                                        media_id: serverId
                                    }
                                }).then(function (resp) {
                                    deferred.resolve(resp.data);
                                    //console.log("上传图片成功");
                                });
                            }
                        });
                    }
                }
            });
            return deferred.promise;
        }

        function initShareOnStart(url, title, imgUrl) {
            init().then(function (data) {
                if (data) {
                    shareRing(url, title, imgUrl);
                    shareFriend(url, title, imgUrl);
                }
            });
        }

        return {
            init: init,
            shareFriend: shareFriend,
            shareRing: shareRing,
            wxUploadImg: wxUploadImg,
            initShareOnStart: initShareOnStart
        };
    }]);