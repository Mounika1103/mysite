var groupUsers = function () {

    ///////////// API URIs
    apiURL = '/api/';
    clientsURL = apiURL + 'clients/';
    // groups
    clientGroupsURL = clientsURL + 'groups/';
    clientGroupUsersURL = clientGroupsURL + 'users/';
    // client users
    clientUsersURL = clientsURL + 'users/';

    var initTable = function (groupList) {
        var table = $('#users-table');

        var fixedHeaderOffset = 0;
        if (App.getViewPort().width < App.getResponsiveBreakpoint('md')) {
            if ($('.page-header').hasClass('page-header-fixed-mobile')) {
                fixedHeaderOffset = $('.page-header').outerHeight(true);
            } 
        } else if ($('.page-header').hasClass('navbar-fixed-top')) {
            fixedHeaderOffset = $('.page-header').outerHeight(true);
        }

        var columDefs = []; start =1;
        while (start<= groupList.length) {
            columDefs.push(start++);
        }

        var oTable = table.dataTable({

            // Internationalisation. For more info refer to http://datatables.net/manual/i18n
            "language": {
                "aria": {
                    "sortAscending": ": activate to sort column ascending",
                    "sortDescending": ": activate to sort column descending"
                },
                "emptyTable": "No data available in table",
                "info": "Showing _START_ to _END_ of _TOTAL_ records",
                "infoEmpty": "No records found",
                "infoFiltered": "(filtered from _MAX_ total records)",
                "lengthMenu": "_MENU_ records",
                "search": "Search:",
                "zeroRecords": "No matching records found"
            },

            "columnDefs": [ { "targets": columDefs, "orderable": false } ],

            // Or you can use remote translation file
            //"language": {
            //   url: '//cdn.datatables.net/plug-ins/3cfcc339e89/i18n/Portuguese.json'
            //},
            "bProcessing": true,

            // setup rowreorder extension: http://datatables.net/extensions/fixedheader/
            fixedHeader: {
                header: true,
                headerOffset: fixedHeaderOffset
            },

            "order": [
                [0, 'asc'],
            ],
            
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

        $('#users-table_filter input[type=search]').keyup(function (e) {

            var searchItem = $(this).val();
            oTable.fnFilter('^'+searchItem, 0, true);

        });

        $('input[type=checkbox].select-all').click(function (e) {

            var _this = $(this);
            var groupId = _this.data('group-id');
            var checked = _this.prop('checked');
            var checkboxes = $('input[type=checkbox].group-item-'+groupId);
            // save
            var csrfToken = $('input[name=csrfmiddlewaretoken]').val(),
                form = $('<form>');

            form.push({name: 'csrfmiddlewaretoken', value: csrfToken});
            form.push({name: 'group_id', value: groupId});
            customerBucket = checked ? "added_ids": "removed_ids";

            $.each(checkboxes, function (e) {
                $(this).prop('checked', _this.prop('checked'));
                $(this).parent().prop('class', checked ? 'checked': '');
                form.push({name: customerBucket, value: $(this).data('user-id')})
            });

            $.post(clientGroupUsersURL, form)
                .done(function (response) {
                    var msg = "All " + checkboxes.length + " users has been "+ (checked ? "added to ": "removed from ") + response.group + " group.";
                    UIToastr.notify('success', 'Saved Successfully!', msg);
                });
        });

        // save checkbox
        oTable.$('input[type=checkbox]').click(function () {

            var csrfToken = $('input[name=csrfmiddlewaretoken]').val(),
                groupId = $(this).data('group-id'),
                userId = $(this).data('user-id'),
                isChecked = $(this).is(":checked");

            var form = $('<form>');
            form.push({name: 'csrfmiddlewaretoken', value: csrfToken});
            form.push({name: 'group_id', value: groupId});

            customerBucket = isChecked ? "added_ids" : "removed_ids";
            form.push({name: customerBucket, value: userId});

            $.post(clientGroupUsersURL, form)
                .done(function (response) {
                    var msg = response.name + " has been " + (isChecked ? "added to ": "removed from ") + response.group + " group.";
                    UIToastr.notify('success', 'Saved Successfully', msg);
                });
        });
    }

    var loadUserTable = function () {

        var table = $('#users-table');
        var thead = table.find('thead tr');
        var tbody = table.find('tbody');

        $.get(clientUsersURL)
            .done(function (response) {
                var usersList = response;

                $.get(clientGroupsURL)
                    .done(function (response) {
                        var groupList = response;

                        // groups list
                        if (groupList.length > 0) {
                            $.each(groupList, function (i, item) {

                                var $th = $('<th>').append(
                                    $('<input>').prop('type', 'checkbox').prop('class', 'select-all').data('group-id', item.id),
                                    " "+item.name
                                );
                                thead.append($th);

                            });
                        } else {
                            var $th = $('<th>').text('No Groups created');
                            thead.append($th);
                        }

                        // users list
                        $.each(usersList, function (i, user) {

                            var $tr = $('<tr>').append($('<td>').text(user.full_name));
                            //groups
                            if (groupList.length > 0) {
                                $.each(groupList, function (i, group) {
                                    var checked = ($.inArray(group.id, user.groups) != -1 ? true : false);

                                    $tr.append($('<td>').prop('class', 'td-checkbox').append(
                                        $('<input>').prop('type', 'checkbox').prop('name', 'customers').prop("checked", checked).data('group-id', group.id).data('user-id', user.id).prop('class', 'group-item-'+group.id),
                                        $('<span>').text(checked).prop('style', 'display: none;')
                                    ));
                                });
                                tbody.append($tr);
                            } else {
                                $tr.append($('<td>'));
                                tbody.append($tr);
                            }

                        });

                        initTable(groupList); // reload datatables component
                        App.initComponents(); // reload UI components
                    });
            });
    }

    return  {
        //main function to initiate the module
        init: function () {
            loadUserTable();
        }
    }

}();

jQuery(document).ready(function() {    
   groupUsers.init();
});