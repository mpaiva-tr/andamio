/**
 * Module for page navigation
 */
APP.nav = (function () {

    // Variables
    var html,
        body,
        pageNav,
        pageNavToggle,
        pageNavItems,
        pageNavActive,
        navigationHeight,
        windowHeight,
        pageView;


    /**
     * Sets height of content based on height of navigation
     */
    function setPageHeight(height) {

        // if navigation is enabled, set the page height to navigation height
        body.height(height);
        pageView.height(height);
    }

    /**
     * Shows the navigation
     */
    function show() {

        html.addClass("has-navigation");
        pageNavToggle.addClass("active");

        if (!$.supports.webapp) {
            setPageHeight(navigationHeight);
        }
    }

    /**
     * Hides the navigation
     */
    function hide() {

        html.removeClass("has-navigation");
        pageNavToggle.removeClass("active");

        if (!$.supports.webapp) {
            setPageHeight("");
        }
    }

    /**
     * Returns the status of the navigation
     */
    function status() {

        return html.hasClass("has-navigation") ? true : false;
    }

    /**
     * Attach event listeners
     */
    function attachListeners() {

        /*** Menu button ***/
        APP.events.attachClickHandler(".action-open-nav", function () {

            show();
        });

        /*** Hide menu when it's open ***/
        APP.events.attachClickHandler(".action-hide-nav", function () {

            hide();
        });

        /*** TODO - page navigation stub ***/
        APP.events.attachClickHandler(".action-nav-item", function (event) {

            var target = $(event.target).closest(".action-nav-item"),
                url = APP.util.getUrl(target),
                title = target.text();

            if (url) {

                // set active class
                pageNavActive.removeClass("navigation-item-active");
                pageNavActive = target.addClass("navigation-item-active");

                hide();

                // set page title
                APP.views.parentView().find(".js-title").text(title);
                APP.open.page(url, APP.views.parentView());
            }
        });
    }

    /***
     * Initialize capabilities and attach listeners
     */
    function init() {

        windowHeight = $(window).height();
        navigationHeight = $("#page-navigation").height();

        body = $("body");
        pageView = $("#page-view");
        html = $("html");

        pageNav = $("#page-navigation");
        pageNavToggle = $(".action-open-nav");
        pageNavItems = pageNav.find(".action-nav-item");
        pageNavActive = pageNav.find(".navigation-item-active");

        // make sure the navigation is as high as the page
        if (windowHeight > navigationHeight) {
            navigationHeight = windowHeight;
            pageNav.height(navigationHeight);
        }

        attachListeners();
    }

    return {
        "init": init,
        "show": show,
        "hide": hide,
        "status": status
    };

})();
