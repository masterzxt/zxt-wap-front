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
            'zengsong': '&#xe908;',
            'qiyong': '&#xe90a;',
            'tishi': '&#xe909;',
            'logo': '&#xe907;',
            'barcode': '&#xe900;',
            'bullhorn': '&#xe901;',
            'database': '&#xe902;',
            'retweet': '&#xe903;',
            'wrench': '&#xe904;',
            'search': '&#xf002;',
            'star': '&#xf005;',
            'star-o': '&#xf006;',
            'user': '&#xf007;',
            'close': '&#xf00d;',
            'cog': '&#xf013;',
            'trash': '&#xf014;',
            'clock': '&#xf017;',
            'to lead': '&#xf019;',
            'inbox': '&#xf01c;',
            'lock': '&#xf023;',
            'tags': '&#xf02c;',
            'pront': '&#xf02f;',
            'list': '&#xf03a;',
            'edit': '&#xf044;',
            'plus-circle': '&#xf055;',
            'minus-circle': '&#xf056;',
            'check-circle': '&#xf058;',
            'question-circle': '&#xf059;',
            'ban': '&#xf05e;',
            'plus': '&#xf068;',
            'exclamation': '&#xf06a;',
            'eye': '&#xf06e;',
            'eye-slash': '&#xf070;',
            'shopping-cart': '&#xf07a;',
            'bar-chart': '&#xf080;',
            'sign-out': '&#xf08b;',
            'sign-in': '&#xf090;',
            'hand-o-right': '&#xf0a4;',
            'users': '&#xf0c0;',
            'copy': '&#xf0c5;',
            'save': '&#xf0c7;',
            'truck': '&#xf0d1;',
            'sort-up': '&#xf0d8;',
            'sort-down': '&#xf0dd;',
            'comments-o': '&#xf0e6;',
            'file-text': '&#xf0f6;',
            'smile-o': '&#xf118;',
            'unlock-alt': '&#xf13e;',
            'cny': '&#xf157;',
            'long-arrow-down': '&#xf177;',
            'long-arrow-up': '&#xf178;',
            'wechat': '&#xf1d8;',
            'calculator': '&#xf1ec;',
            'pie-chart': '&#xf200;',
            'calendr-plus': '&#xf271;',
            '': '&#xf274;',
            'calendr-check': '&#xf274;',
            'accessible': '&#xe905;',
            'near_me': '&#xe90b;',
            'jinyong': '&#xe90c;',
            'subdirectory_arrow_right': '&#xe906;',
            'check': '&#xf00c;',
            'plus': '&#xf067;',
            'download': '&#xf0ed;',
            'daochu': '&#xf0ee;',
            'sentiment': '&#xf119;',
            'fasong': '&#x10ffff;',
            'long-arrow-up': '&#xf176;',
            'wechat': '&#xf1d7;',
            'shengcheng': '&#xf252;',
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
                if (/ks-admin-font/.test(classes)) {
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
