var recordList = function () {

    ///////// API URIs
    apiURL = '/api/';
    clientsURL = apiURL + 'clients/';
    recordsURL = clientsURL + 'records/';
    // customers
    clientCustomerURL = clientsURL + 'reports/';

    var initTable = function () {
        var table = $('#records-table');

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

        // save changes
        oTable.$('input').bind("change keyup", function () {

            var record_id = $(this).data('record-id'),
                csrfToken = $('input[name=csrfmiddlewaretoken]').val();

            var $tr = $('.record-item[data='+ record_id +']');

            var CRM_account_name = oTable.$('input.CRM_account_name_'+ record_id).val();
            var crm_domain = oTable.$('input.crm_domain_'+record_id).val();
            var crm_address = oTable.$('input.crm_address_'+record_id).val();
            var matched_status = oTable.$('input[type=radio][name=match_status_'+ record_id +']:checked').val();

            var form = $('<form>');
            form.push({name: 'csrfmiddlewaretoken', value: csrfToken});
            form.push({name: 'CRM_account_name', value: CRM_account_name});
            form.push({name: 'crm_domain', value: crm_domain});
            form.push({name: 'crm_address', value: crm_address});
            form.push({name: 'matched_status', value: matched_status});

            recordDetailURL = recordsURL + record_id + '/';
            $.post(recordDetailURL, form)
                .done(function (response) {
                    oTable.$('.CRM_name_' + record_id).text(CRM_account_name);
                    console.log(response);
                });
        });

        $('.crm-name-lookup').click(function (e) {
            e.preventDefault();
            $('#modalRecordId').val($(this).data('record-id'));

        });
    }

    var loadRecordsTable = function () {

        var table = $('#records-table'),
            tbody = table.find('tbody');

        $.get(recordsURL)
            .done(function (response) {
                var recordList = response;

                $.each(recordList, function (i, record) {

                    // crm account name
                    var $accountName_td = $('<td>').append(
                        $('<input>').prop('type', 'text').prop('class', 'CRM_account_name_'+ record.matching_key).val(record.crm_account_name).data('record-id', record.matching_key).prop('style', 'width: 88%; margin-right: 5px;'),
                        $('<a>').attr('data-toggle', 'modal').prop('class', 'crm-name-lookup').prop('href', '#createGroupModal').data('record-id', record.matching_key).append(
                            $('<i>').prop('class', 'icon-magnifier')
                        ),
                        $('<span>').prop('class', 'hide CRM_name_'+record.matching_key).text(record.crm_account_name)
                    );

                    // match status
                    var $matchStatus_id = $('<td>').append(
                        $('<div>').prop('class', 'td-radio').append(
                            $('<input>').prop('type', 'radio').data('record-id', record.matching_key).prop('name', 'match_status_'+record.matching_key).val('Match').prop('checked', record.matched_status == 'Match' ? true : false),
                            " Matched"
                        ),
                        $('<div>').prop('class', 'td-radio').append(
                            $('<input>').prop('type', 'radio').data('record-id', record.matching_key).prop('name', 'match_status_'+record.matching_key).val('Unmatch').prop('checked', record.matched_status == 'Unmatch' ? true : false),
                            " Not Matched"
                        ),
                        $('<div>').prop('class', 'td-radio').append(
                            $('<input>').prop('type', 'radio').data('record-id', record.matching_key).prop('name', 'match_status_'+record.matching_key).val('Likely Match').prop('checked', record.matched_status == 'Likely Match' ? true : false),
                            " Likely Matched"
                        ),
                        $('<span>').prop('class', 'hide').text(record.matched_status)
                    );

                    var $tr = $('<tr>').prop('class', 'record-item').attr('data-record-id', record.matching_key).append(
                        $('<td>').text(record.matching_key),
                        $matchStatus_id,
                        $('<td>').text(record.web_domain),
                        $('<td>').text(record.web_isp),
                        $('<td>').text(record.web_address),
                        $('<td>').prop('class', 'crm-domain-container-'+record.matching_key).append(
                            $('<input>').prop('type', 'hidden').prop('class', 'crm_domain_'+record.matching_key).val(record.crm_domain),
                            $('<span>').text(record.crm_domain)
                        ),
                        $accountName_td,
                        $('<td>').prop('class', 'crm-address-container-'+record.matching_key).append(
                            $('<input>').prop('type', 'hidden').prop('class', 'crm_address_'+record.matching_key).val(record.crm_address),
                            $('<span>').text(record.crm_address)
                        ),
                        $('<td>').text(record.web_visit_date)
                    )
                    tbody.append($tr);
                });

                initTable();
            });
    }

    //////////// CUSTOMER RECORDS
    var customerTable = function () {
        var table = $('#customer-table');

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
            //"columnDefs": [ { "targets": 0, "orderable": false } ],

            "bLengthChange": false,

            "order": [
                [0, 'asc'],
            ],
            
            // "lengthMenu": [
            //     [5, 10, 15, 20, -1],
            //     [5, 10, 15, 20, "All"] // change per page values here
            // ],
            // set the initial value
            "pageLength": 10,
            
            // Uncomment below line("dom" parameter) to fix the dropdown overflow issue in the datatable cells. The default datatable layout
            // setup uses scrollable div(table-scrollable) with overflow:auto to enable vertical scroll(see: assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.js). 
            // So when dropdowns used the scrollable div should be removed. 
            //"dom": "<'row' <'col-md-12'T>><'row'<'col-md-6 col-sm-12'l><'col-md-6 col-sm-12'f>r>t<'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>",
        });

        oTable.$('.customer-item').click(function (e) {
            e.preventDefault();

            var recordId = $('#modalRecordId').val(),
                customerName = $(this).text(),
                matchingKey = $(this).data('matching-key');

            var tr = $('.customer-'+matchingKey);
            var crm_domain = tr.find('.crm-domain').text();
            var crm_address = tr.find('.crm-address').text();

            $('.CRM_account_name_'+recordId).val(customerName);

            $('.crm_domain_'+recordId).val(crm_domain);
            $('.crm-domain-container-'+recordId+' span').text(crm_domain);

            $('.crm_address_'+recordId).val(crm_address);
            $('.crm-address-container-'+recordId+' span').text(crm_address);
            $('.CRM_account_name_'+recordId).change();
        });
    }

    var loadCustomersTable = function () {
        var table = $('#customer-table'),
            tbody = table.find('tbody'),
            recordId = $('#modalRecordId').val();

            $.get(recordsURL)
                .done(function (response) {

                    $.each(response, function (i, customer) {

                        tbody.append($('<tr>').append(
                            $('<td>').append(
                                $('<a>').prop('href', '#').prop('class', 'customer-item').data('matching-key', customer.matching_key).text(customer.crm_account_name)
                            ),
                            $('<td>').prop('class', 'crm-domain').text(customer.crm_domain),
                            $('<td>').prop('class', 'crm-address').text(customer.crm_address)    
                        ).prop('class', 'customer-'+customer.matching_key));
                    });
                    customerTable();
                });

    }

    return {
        //main function to initiate the module
        init: function () {
            loadRecordsTable();
            loadCustomersTable();
        }
    } 

}();

jQuery(document).ready(function() {    
   recordList.init();
});