var advanceReports = function () {

    ////////// API URIs
    apiURL = '/api/';
    clientsURL = apiURL + 'clients/';
    // customers
    clientCustomerURL = clientsURL + 'reports/';

    var initTable = function () {
        var table = $('#reports-table');

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
                "info": "Showing _START_ to _END_ of _TOTAL_ records",
                "infoEmpty": "No records found",
                "infoFiltered": "(filtered from _MAX_ total records)",
                "lengthMenu": "_MENU_ entries",
                "search": "Search:",
                "zeroRecords": "No matching records found"
            },

            // setup rowreorder extension: http://datatables.net/extensions/fixedheader/
            fixedHeader: {
                header: true,
                headerOffset: fixedHeaderOffset
            },

            "order": [
                [0, 'asc'],
            ],
            
            // set the initial value
            "pageLength": 20,
            "bLengthChange": false,
            
            // Uncomment below line("dom" parameter) to fix the dropdown overflow issue in the datatable cells. The default datatable layout
            // setup uses scrollable div(table-scrollable) with overflow:auto to enable vertical scroll(see: assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.js). 
            // So when dropdowns used the scrollable div should be removed. 
            //"dom": "<'row' <'col-md-12'T>><'row'<'col-md-6 col-sm-12'l><'col-md-6 col-sm-12'f>r>t<'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>",
        });

        $('#reports-table_filter').hide();

        // PAGE LENGTH
        $('#pageLength').on('change', function () {
            var pageLength = parseInt($(this).val()),
                table = $('#reports-table').DataTable();

            table.page.len(pageLength).draw();

        });

        // DEFAULT SEARCH
        $('.record-filter-actions input[type=search]').keyup(function (e) {
            var searchItem = $(this).val(),
                columnOption = $('.record-filter-actions .record-column-option').val();
                table = $('#reports-table').DataTable();

            if (columnOption == "") {
                table.search(searchItem).draw();
            } else {
                oTable.fnFilter('^'+searchItem, parseInt(columnOption), true);
            }
        });

    }

    var loadReportsTable = function () {

        var table = $('#reports-table'),
            tbody = table.find('tbody');

        $.get(clientCustomerURL)
            .done(function (response) {
                var customerList = response;

                $.each(customerList, function (i, customer) {
                    var clientDetailURL = '/clients/reports/' + customer.id + '/';

                    var $tr = $('<tr>').append(
                        $('<td>').text(customer.id),
                        $('<td>').append($('<a>').prop('href', clientDetailURL).text(customer.customer_name)),
                        $('<td>').text(customer.opportunity_id),
                        $('<td>').text(customer.opportunity_value),
                        $('<td>').text(customer.opportunity_create_date),
                        $('<td>').text(customer.pred_run_date)
                    );
                    tbody.append($tr);
                });

                initTable(); // reload datatables component
            });
    }

    return {
        //main function to initiate the module
        init: function () {
            loadReportsTable();
        }
    }

}();

jQuery(document).ready(function() {    
   advanceReports.init();
});