/* A polyfill for browsers that don't support ligatures. */
/* The script tag referring to this file must be placed before the ending body tag. */

/* To provide support for elements dynamically added, this script adds
   method 'icomoonLiga' to the window object. You can pass element references to this method.
*/
(function () {
    'use strict';
    function supportsProperty(p) {
        var prefixes = ['Webkit', 'Moz', 'O', 'ms'],
            i,
            div = document.createElement('div'),
            ret = p in div.style;
        if (!ret) {
            p = p.charAt(0).toUpperCase() + p.substr(1);
            for (i = 0; i < prefixes.length; i += 1) {
                ret = prefixes[i] + p in div.style;
                if (ret) {
                    break;
                }
            }
        }
        return ret;
    }
    var icons;
    if (!supportsProperty('fontFeatureSettings')) {
        icons = {
            'wallet': '&#xe922;',
            'wallet-o': '&#xe917;',
            'angle-left': '&#xe900;',
            'arrow-right': '&#xe902;',
            'angle-right': '&#xe901;',
            'minus-circle': '&#xe905;',
            'times-circle': '&#xe906;',
            'remove': '&#xe911;',
            'camera-plus': '&#xe907;',
            'camera-o': '&#xe908;',
            'map-marker': '&#xe909;',
            'crosshairs': '&#xe90a;',
            'download': '&#xe903;',
            'share': '&#xe904;',
            'envelope': '&#xe90b;',
            'commenting': '&#xe90c;',
            'logo': '&#xe90d;',
            'plus': '&#xe90e;',
            'minus': '&#xe90f;',
            'edit': '&#xe910;',
            'truck': '&#xe912;',
            'gear': '&#xe913;',
            'check-circle-o': '&#xe914;',
            'phone': '&#xe915;',
            'chain': '&#xe916;',
            'credit-card': '&#xe918;',
            'user': '&#xe919;',
            'scanning': '&#xe91a;',
            'clock': '&#xe91b;',
            'signal-tower': '&#xe91c;',
            'wechat': '&#xe91d;',
            'alipay': '&#xe91e;',
            'qrcode': '&#xe91f;',
            'question-circle': '&#xe920;',
            'navicon': '&#xe921;',
          '0': 0
        };
        delete icons['0'];
        window.icomoonLiga = function (els) {
            var classes,
                el,
                i,
                innerHTML,
                key;
            els = els || document.getElementsByTagName('*');
            if (!els.length) {
                els = [els];
            }
            for (i = 0; ; i += 1) {
                el = els[i];
                if (!el) {
                    break;
                }
                classes = el.className;
                if (/lq-icon/.test(classes)) {
                    innerHTML = el.innerHTML;
                    if (innerHTML && innerHTML.length > 1) {
                        for (key in icons) {
                            if (icons.hasOwnProperty(key)) {
                                innerHTML = innerHTML.replace(new RegExp(key, 'g'), icons[key]);
                            }
                        }
                        el.innerHTML = innerHTML;
                    }
                }
            }
        };
        window.icomoonLiga();
    }
}());
