var usersList = function () {

    ///// API URIs
    apiURL = '/api/';
    clientsURL = apiURL + 'clients/';
    // users
    clientUsersURL = clientsURL + 'users/';

    var initTable = function () {
        var table = $('#users-table');

        var fixedHeaderOffset = 0;
        if (App.getViewPort().width < App.getResponsiveBreakpoint('md')) {
            if ($('.page-header').hasClass('page-header-fixed-mobile')) {
                fixedHeaderOffset = $('.page-header').outerHeight(true);
            }
        } else if ($('.page-header').hasClass('navbar-fixed-top')) {
            fixedHeaderOffset = $('.page-header').outerHeight(true);
        }

        var oTable = table.dataTable({

            // Internationalisation. For more info refer to http://datatables.net/manual/i18n
            "language": {
                "aria": {
                    "sortAscending": ": activate to sort column ascending",
                    "sortDescending": ": activate to sort column descending"
                },
                "emptyTable": "No data available in table",
                "info": "Showing _START_ to _END_ of _TOTAL_ entries",
                "infoEmpty": "No entries found",
                "infoFiltered": "(filtered1 from _MAX_ total entries)",
                "lengthMenu": "_MENU_ entries",
                "search": "Search:",
                "zeroRecords": "No matching records found"
            },

            // Or you can use remote translation file
            //"language": {
            //   url: '//cdn.datatables.net/plug-ins/3cfcc339e89/i18n/Portuguese.json'
            //},

            // setup rowreorder extension: http://datatables.net/extensions/fixedheader/
            fixedHeader: {
                header: true,
                headerOffset: fixedHeaderOffset
            },

            "lengthMenu": [
                [5, 10, 15, 20, -1],
                [5, 10, 15, 20, "All"] // change per page values here
            ],
            // set the initial value
            "pageLength": 20,

            // Uncomment below line("dom" parameter) to fix the dropdown overflow issue in the datatable cells. The default datatable layout
            // setup uses scrollable div(table-scrollable) with overflow:auto to enable vertical scroll(see: assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.js).
            // So when dropdowns used the scrollable div should be removed.
            //"dom": "<'row' <'col-md-12'T>><'row'<'col-md-6 col-sm-12'l><'col-md-6 col-sm-12'f>r>t<'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>",
        });


        oTable.$('tr').on('click', function () {
            var userId = $(this).data('user-id');

            $.get(clientUsersURL + userId + '/')
                .done(function (response) {

                    $.each(response, function(key, value) {
                        var $container = $('.edit-user-form .form-group[data-field='+ key +']');
                        if (key == 'role') {
                            $container.find('select').val(value);
                        } else if (value !== "") {
                            $container.find('input').addClass('edited');
                            $container.find('input').val(value);
                        }
                    });

                    $('.edit-user-form').data('user-id', userId);
                    $('#editUserModal').modal('show');
                });
        });

    }

    var loadUsersTable = function () {
        var table = $('#users-table'),
            tbody = table.find('tbody');

        $.get(clientUsersURL)
            .done(function (response) {

                $.each(response, function (i, user) {

                    tbody.append($('<tr>').data('user-id', user.id).append(
                        $('<td>').text(user.first_name),
                        $('<td>').text(user.last_name),
                        $('<td>').text(user.email),
                        $('<td>').text(user.job_title),
                        $('<td>').text(user.manager),
                        $('<td>').text(user.phone),
                        $('<td>').append(
                            $('<span>').prop('class', 'label label-sm '+ (user.role=='admin' ? 'label-warning': 'label-info')).text(user.role)
                        )
                    ));
                });
                initTable();
            });
    }

    $('#add-user-submit-btn').on('click', function () {

        if (
          $('input[name="password"]').val() == $('input[name="confirm-password"]').val()
        )
        {
          var form = $('.add-user-form').serialize();
          $.post(clientUsersURL, form)
            .done(function (data, statusText, xhr) {

              if (xhr.status == 201) {
                alert("User" + data.email + "is successfully created");
                $('#addUserModal').modal('hide');
                window.location.reload();
              } else {

                // reset
                $('.add-user-form .form-group').each(function () {

                  var $container = $(this);
                  $container.removeClass('has-error');
                  $container.find('.help-block').show();
                  $container.find('.help-block-error').text("").prop('style', 'opacity:0;');

                });

                $.each(data, function (key, value) {
                  var $container = $('.add-user-form .form-group[data-field=' + key + ']');
                  $container.addClass('has-error'); // add error color
                  $container.find('.help-block').hide();
                  $container.find('.help-block-error').text("* " + value).prop('style', 'opacity:1;');
                });
              }

            });
        }
        else {
          alert("Passwords do not match")
        }
    });

    $('#edit-user-submit-btn').on('click', function () {

        var form = $('.edit-user-form'),
            userId = form.data('user-id'),
            userURL = clientUsersURL + userId + '/';

        $.post(userURL, form.serialize())
            .done(function (data, statusText, xhr) {

                if (xhr.status == 204) {
                    $('#editUserModal').modal('hide');
                    window.location.reload();
                } else {

                    // reset
                    $('.edit-user-form .form-group').each(function () {

                        var $container = $(this);
                        $container.removeClass('has-error');
                        $container.find('.help-block').show();
                        $container.find('.help-block-error').text("").prop('style', 'opacity:0;');

                    });

                    $.each(data, function(key, value) {
                        var $container = $('.edit-user-form .form-group[data-field='+ key +']');
                        $container.addClass('has-error'); // add error color
                        $container.find('.help-block').hide();
                        $container.find('.help-block-error').text("* " + value).prop('style', 'opacity:1;');
                    });

                }

            });
    });


    return {
        //main function to initiate the module
        init: function () {
            loadUsersTable();
        }
    }

}();


jQuery(document).ready(function() {
   usersList.init();
});
