/*jshint es5: true, browser: true, undef:true, unused:true, indent: 4 */
/*global Andamio, $ */

Andamio.page = (function () {

    function doAjaxRequest(url, expiration, callback) {

        // Cachebuster
        var requestUrl = url + ((/\?/).test(url) ? "&" : "?") + (new Date()).getTime();

        $.ajax({
            "url": requestUrl,
            "timeout": 0,
            "headers": {
                "X-PJAX": true,
                "X-Requested-With": "XMLHttpRequest"
            },

            error: function (xhr, type) {

                // type is one of: "timeout", "error", "abort", "parsererror"
                var status = xhr.status,
                    errorMessage = '<a href="javascript:void(0)" class="action-refresh">' + Andamio.i18n.ajaxGeneralError + '<br>' + type + " " + status + '<br>' + Andamio.i18n.ajaxRetry + '</a>';

                if (type === "timeout") {
                    Andamio.connection.goOffline();
                } else {
                    if (Andamio.connection.status) {
                        Andamio.alert.show(errorMessage);
                    }
                }
            },

            success: function (response) {
                Andamio.connection.goOnline();
                Andamio.cache.set(url, response, expiration);
                callback(response);
            }
        });
    }

    return {
        load: function (url, expiration, callback) {

            if (url && $.isFunction(callback)) {

                var cachedContent = Andamio.cache.get(url);

                if (cachedContent) {

                    callback(cachedContent);

                } else {

                    doAjaxRequest(url, expiration, function (response) {
                        callback(response);
                    });
                }
            }
        },

        refresh: function (url, expiration, callback) {

            Andamio.cache.delete(url);
            this.load(url, expiration, callback);
        }
    };

})();
