var msg = "Records has been updated.";

var recordList = function () {

  table = $('#records-table');
  atable = $('#crm-accounts-table');

  ///////// API URIs
  apiURL = '/api/';
  clientsURL = apiURL + 'clients/';
  recordsURL = clientsURL + 'records/';
  crmAccountsURL = clientsURL + 'records/crm/accounts/';

  var saveRecord = function (recordId) {

    var csrfToken = $('input[name=csrfmiddlewaretoken]').val(),
      $tr = table.find('tbody tr.record-item[data-record-id='+recordId+']');

    var form = $('<form>');
      form.push({name: 'csrfmiddlewaretoken', value: csrfToken});
      form.push({name: 'matched_status', value: $tr.find('select[name=matched_status]').val()});
      form.push({name: 'crm_domain', value: $tr.find('input[name=crm_domain]').val()});
      form.push({name: 'crm_account_name', value: $tr.find('input[name=crm_account_name]').val()});
      form.push({name: 'crm_address', value: $tr.find('input[name=crm_address]').val()});

      var recordURL = recordsURL + recordId + '/';
      $.post(recordURL, form);
  }

  var initTable = function () {

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

        // setup rowreorder extension: http://datatables.net/extensions/fixedheader/
        fixedHeader: {
            header: true,
            headerOffset: fixedHeaderOffset
        },

        "columnDefs": [
          {"targets": [1,2,3,4,5,6,7], "orderable": false, "width": "12.5%"},
          {"targets": 0, "orderable": false, "width": "16%"},
        ],

        // set the initial value
        "bLengthChange": false,
        "pageLength": 40,
    });

    oTable.$('.account-modal-btn').on('click', function (e) {
      e.preventDefault();
      $('#modal-record-id').val($(this).data('record-id'));
    });

    oTable.$('select').on('change', function (e) {
      var record = $(this).parent().parent(),
          matchedStatus = $(this).val();

      record.find('input[name=matched_status]').val(matchedStatus);
      record.find('span').text(matchedStatus);

      saveRecord(record.data('record-id'));
      UIToastr.notify('success', 'Saved Successfully!', msg);
    });

  }

  var loadData = function () {

    var tbody = table.find('tbody');

    $.get(recordsURL)
      .done(function (response) {
        var data = response;

        $.each(data, function (i, record) {

          // build matched status
          var $matchedStatus = $('<td>').append(
            $('<span>').text(record.matched_status).prop('class', 'hide'),
            $('<input>').prop('type', 'checkbox').prop('class', 'select-matched-status').data('record-id', record.matching_key),
            $('<select>').prop('class', 'form-control input-sm').prop('name', 'matched_status').append(
              $('<option>').val('Match').text('Match').prop('selected', record.matched_status=='Match'? true:false),
              $('<option>').val('Unmatch').text('Unmatch').prop('selected', record.matched_status=='Unmatch'? true:false),
              $('<option>').val('Likely Match').text('Likely Match').prop('selected', record.matched_status=='Likely Match'? true:false)
            )
          );

          // build CRM domain
          var $CRMDomain = $('<td>').append(
            $('<input>').prop('type', 'hidden').prop('name', 'crm_domain').val(record.crm_domain),
            $('<span>').prop('class', 'crm-domain-text').text(record.crm_domain)
          );

          // build CRM Account Name
          var $CRMAccountName = $('<td>').append(
            $('<div>').prop('class', 'input-group input-group-sm').append(
              $('<input>').prop('type', 'text').prop('class', 'form-control').prop('name', 'crm_account_name').prop('placeholder', 'Search for Account...').val(record.crm_account_name),
              $('<span>').prop('class', 'input-group-btn').append(
                $('<button>').prop('class', 'btn grey-silver account-modal-btn').prop('type', 'button').data('record-id', record.matching_key).attr('data-toggle', 'modal').attr('data-target', '#CRMAccountModal').append(
                  $('<i>').prop('class', 'fa fa-search')
                )
              )
            )
          );

          // build CRM address
          var $CRMAddress = $('<td>').append(
            $('<input>').prop('type', 'hidden').prop('name', 'crm_address').val(record.crm_address),
            $('<span>').prop('class', 'crm-address-text').text(record.crm_address)
          );

          // Add the record to the list
          var $tr = $('<tr>').prop('class', 'record-item').attr('data-record-id', record.matching_key).append(
            $matchedStatus,
            $('<td>').text(record.web_domain),
            $('<td>').text(record.web_isp),
            $('<td>').text(record.web_address),
            $CRMDomain,
            $CRMAccountName,
            $CRMAddress,
            $('<td>').text(record.web_visit_date)
          );
          tbody.append($tr);

        }); // end of populating the TDs
        //App.initComponents();
        initTable();

      });
  }

  var initAccountTable = function () {
    var tbody = atable.find('tbody');

    var oTable = atable.dataTable({

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

      "columnDefs": [
        {"targets": [1,2], "orderable": false, "width": "33.33%"},
        {"targets": 0, "width": "33.33%"},
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

    // modify CRM fields
    oTable.$('.crm-account-item').on('click', function (e) {
      e.preventDefault();

      var recordId = $('#modal-record-id').val(),
        _this = $(this);

      var crmAccountName = _this.find('.crm-account-name').text();
      var crmDomain = _this.find('.crm-domain').text();
      var crmAddress = _this.find('.crm-address').text();

      var destTr = table.find('tr.record-item[data-record-id='+recordId+']');

      // assign new value
      destTr.find('input[name=crm_account_name]').val(crmAccountName);

      destTr.find('input[name=crm_domain]').val(crmDomain);
      destTr.find('span.crm-domain-text').text(crmDomain);

      destTr.find('input[name=crm_address]').val(crmAddress);
      destTr.find('span.crm-address-text').text(crmAddress);

      $('#CRMAccountModal').modal('hide');

      saveRecord(recordId);
      UIToastr.notify('success', 'Saved Successfully!', msg);
    });

  }

  var loadCRMAccountList = function () {

    var tbody = atable.find('tbody');

    $.get(crmAccountsURL)
      .done(function (response) {
        var accounts = response.data;

        $.each(accounts, function (i, account) {

          var $tr = $('<tr>').prop('class', 'crm-account-item').append(
            $('<td>').prop('class', 'crm-account-name').text(account.crm_account_name),
            $('<td>').prop('class', 'crm-domain').text(account.crm_domain),
            $('<td>').prop('class', 'crm-address').text(account.crm_address)
          );
          tbody.append($tr);

        });
        initAccountTable();

      });

  }

  return {
    init: function () {
      loadData();
      loadCRMAccountList();
    },
    save: function (recordId) {
      saveRecord(recordId);
    }
  }

}();

jQuery(document).ready(function () {

  recordList.init();

  $('#filter-panel .dropdown-menu').on('click', function (e) {
    e.stopPropagation();
  });

  // SELECT/DESELECT ALL
  $('.action-btn .checker').on('click', function (e) {
    // toggle select all
    var _this = $(this);
    _this.find('span').toggleClass('checked');

    var isChecked = _this.find('span').hasClass('checked');
    // update hidden checkbox
    _this.find('span input[type=checkbox]').prop('checked', isChecked);

    var selectall = _this.find('span input[type=checkbox]').prop('checked');
    $('.select-matched-status').each(function () {
      $(this).prop('checked', selectall);
    });

  });

  // MATCH STATUS CHANGE
  $('#records-table tbody tr td select').on('change', function () {

    console.log($(this).val());

  });

  // BULK MATCH STATUS CHANGE
  $('.action-btn ul > li > a').on('click', function (e) {
    var match_status = $(this).data('match-status');

    // get all selected records
    $('.select-matched-status:checked').each(function () {
      var $td = $(this).parent();
      $td.find('select').val(match_status);

      recordList.save($td.parent().data('record-id'));
      UIToastr.notify('success', 'Saved Successfully!', msg);
    });

  });

  // FILTER MATCH STATUS
  $('#filterForm select[name=matched_status]').on('change', function() {
    var status = $(this).val();

    // reset records
    $.fn.dataTableExt.afnFiltering.length = 0;
    // filter records
    $.fn.dataTable.ext.search.push(
      function( settings, data, dataIndex) {
        var recordStatus = data[0] || "";

        if (status == "") {
          return true;
        } else if (status.charAt(0) == recordStatus.charAt(0)) {
          return true;
        } else {
          return false;
        }
      });

    var table = $('#records-table').DataTable();
    table.draw();

  });

  // FILTER DATE OF VISIT
  // converts date strings to a Date object, then normalized into a YYYYMMMDD format (ex: 20131220). Makes comparing dates easier. ex: 20131220 > 20121220
  var normalizeDate = function(dateString) {
    var date = new Date(dateString);
    var normalized = date.getFullYear() + '' + (("0" + (date.getMonth() + 1)).slice(-2)) + '' + ("0" + date.getDate()).slice(-2);
    return normalized;
  }

  $('#filterForm input').on('change', function () {

    var startDate = $('#filterForm input[name=date_from]').val();
    var endDate = $('#filterForm input[name=date_to]').val();

    // reset records
    $.fn.dataTableExt.afnFiltering.length = 0;
    // filter records
    $.fn.dataTable.ext.search.push(
      function( settings, data, dataIndex) {

        var rowDate = normalizeDate(data[7]),
              start = normalizeDate(startDate),
                end = normalizeDate(endDate);

          // If our date from the row is between the start and end
          if (start <= rowDate && rowDate <= end) {
            return true;
          } else if (rowDate >= start && end === '' && start !== ''){
            return true;
          } else if (rowDate <= end && start === '' && end !== ''){
            return true;
          } else {
            return false;
          }

      });

    var table = $('#records-table').DataTable();
    table.draw();

  });

  // SEARCH
  $('#search-panel input').on('keyup', function () {
    var searchItem = $(this).val();
    var table = $('#records-table').DataTable();
    table.search(searchItem).draw();

  });
});

