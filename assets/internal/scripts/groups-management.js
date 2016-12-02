var groupsManagement = function () {

    ////////// API URIs
    apiURL = '/api/';
    clientsURL = apiURL + 'clients/';
    // groups
    clientGroupsURL = clientsURL + 'groups/';
    // customers
    clientCustomerURL = clientsURL + 'reports/';

    var UIModals = function () {
        $('.draggable-modal').draggable({
            handle: ".modal-header"
        });
    }

    var handleGroups = function () {
        var form = $('#createGroupModal .modal-content form');

        var submitGroupForm = function () {

            $.post(clientGroupsURL, form.serialize())
                .done(function (response) {
                    $('#createGroupModal').modal('hide');
                    window.location.reload();
            });
        }

        form.validate({
            errorElement: 'span',
            errorClass: 'help-block',
            focusInvalid: true,
            rules: {
                name: {
                    required: true
                }
            },

            messages: {
                name: {
                    required: "Group name is required."
                }
            },

            invalidHandler: function(event, validator) {
                $('.alert-danger', form).show();
            },

            highlight: function(element) { // hightlight error inputs
                $(element)
                    .closest('.form-group').addClass('has-error'); // set error class to the control group
            },

            success: function(label) {
                label.closest('.form-group').removeClass('has-error');
                label.remove();
            },

            errorPlacement: function(error, element) {
                error.insertAfter(element.closest('.input-icon'));
            },

            submitHandler: function(form) {
                submitGroupForm(); // form validation success, call ajax form submit
            }
        });

        $('#createGroupModal .modal-content form input').keypress(function(e) {
            if (e.which == 13) {
                if (form.validate().form()) {
                    submitGroupForm(); //form validation success, call ajax form submit
                }
                return false;
            }
        });

    }

    return {
        //main function to initiate the module
        init: function () {
            UIModals();
            handleGroups();
        }
    }

}();

jQuery(document).ready(function() {    
   groupsManagement.init();
});