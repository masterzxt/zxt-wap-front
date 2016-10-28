angular.module('q-wap-front').factory('imgService', ['appConfig', function (appConfig) {
    /**
     * 主页轮播图图片
     */
    function slideImg() {
        var dpr = window.devicePixelRatio;
        var containerWidth = document.body.clientWidth;
        // 防止无法获取宽度
        if (containerWidth < 1) {
            containerWidth = 640;
        }
        var img = {
            w: parseInt((containerWidth > 640 ? 640 : containerWidth) * dpr)
        };
        img.h = parseInt(img.w / 2);
        return img;
    }

    /**
     * 主页热搜
     */
    function hotImg() {
        var dpr = window.devicePixelRatio / 2;
        var containerWidth = document.body.clientWidth;
        // 防止无法获取宽度
        if (containerWidth < 1) {
            containerWidth = 640;
        }
        var img = {
            w: parseInt((containerWidth > 640 ? 640 : containerWidth) * dpr)
        };

        img.h = parseInt(img.w / 2 * 3); //高度等于宽度除2成3
        return img;
    }

    /**
     * 主页下面的图片
     */
    function indexBelowImg() {
        var dpr = window.devicePixelRatio;
        var containerWidth = document.body.clientWidth;
        // 防止无法获取宽度
        if (containerWidth < 1) {
            containerWidth = 640;
        }
        var img = {
            w: parseInt((containerWidth > 640 ? 640 : containerWidth) * dpr)
        };

        img.h = parseInt(img.w / 3 * 2);
        return img;
    }

    /**
     * 商品主图类图片
     * @returns {{w: Number}}
     */
    function itemImg() {
        var dpr = window.devicePixelRatio;
        var containerWidth = document.body.clientWidth;
        // 防止无法获取宽度
        if (containerWidth < 1) {
            containerWidth = 640;
        }
        var img = {
            w: parseInt((containerWidth > 1200 ? 1200 : containerWidth) * dpr)
        };
        img.h = parseInt(img.w);

        return img;
    }

    // 缩略图类,购物车,用户头像
    function simpleImg() {
        var dpr = window.devicePixelRatio;
        var containerWidth = document.body.clientWidth;
        // 防止无法获取宽度
        if (containerWidth < 1) {
            containerWidth = 640;
        }
        console.log(dpr + "     " + containerWidth);
        var img = {
            w: parseInt((containerWidth > 200 ? 200 : containerWidth) * dpr)
        };
        //img.h = img.w;
        img.h = parseInt(img.w);
        return img;
    }

    return {
        hotImg: hotImg(),
        slideImg: slideImg(),
        indexBelowImg: indexBelowImg(),
        itemImg: itemImg(),
        simpleImg: simpleImg()
    };

}]);