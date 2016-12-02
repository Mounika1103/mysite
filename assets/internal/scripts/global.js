/* GLOBAL SCRIPT
 * desc     : contains events used around the whole app
 */

////////// API URIs
loginURL = '/login/';


///////////////// LOGIN
function loginUser () {

    var form = $('body.login form.login-form').serialize();
        $.post(loginURL, form)
            .done(function (response) {

                if (response.user_is_authenticated == true) {
                    window.location.href=response.redirect_url;
                } else {

                    var errorContainer = $('body.login form.login-form div.alert');
                    errorContainer.find('span').text(response.errors);
                    errorContainer.show();
                }

            });

}


var UIToastr = function () {

    var showNotification = function (typeGroup, title, msg) {

                toastr.options = {
                    closeButton: true,
                    debug: false,
                    positionClass: "toast-top-right",
                    onclick: null,
                    showDuration: "1000",
                    hideDuration: "1000",
                    timeOut: "5000",
                    extendedTimeOut: "1000",
                    showEasing: "swing",
                    hideEasing: "linear",
                    showMethod: "fadeIn",
                    hideMethod: "fadeOut"
                }
                toastr[typeGroup](msg, title);
            }


    return  {
        notify: showNotification
    }

}();

jQuery(document).ready(function() {
});