var groupUsers = function () {

  var table = $('#users-table');

  ///////////// API URIs
  apiURL = '/api/';
  clientsURL = apiURL + 'clients/';
  // groups
  clientGroupsURL = clientsURL + 'groups/';
  clientGroupUsersURL = clientGroupsURL + 'users/';
  // client users
  clientUsersURL = clientsURL + 'users/';

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
        "info": "Showing _START_ to _END_ of _TOTAL_ records",
        "infoEmpty": "No records found",
        "infoFiltered": "(filtered from _MAX_ total records)",
        "lengthMenu": "_MENU_ records",
        "search": "Search:",
        "zeroRecords": "No matching records found"
      },

      "columnDefs": [ { "targets": 1, "orderable": false, "width":"70%" } ],

      // Or you can use remote translation file
      //"language": {
      //   url: '//cdn.datatables.net/plug-ins/3cfcc339e89/i18n/Portuguese.json'
      //},
      //"bProcessing": true,

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
      "bLengthChange": false,
      "pageLength": -1,
      
      // Uncomment below line("dom" parameter) to fix the dropdown overflow issue in the datatable cells. The default datatable layout
      // setup uses scrollable div(table-scrollable) with overflow:auto to enable vertical scroll(see: assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.js). 
      // So when dropdowns used the scrollable div should be removed. 
      //"dom": "<'row' <'col-md-12'T>><'row'<'col-md-6 col-sm-12'l><'col-md-6 col-sm-12'f>r>t<'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>",

    });


  }

  // var loadUsers = function () {

  //   var tbody = table.find('tbody');
  //   $.get(clientUsersURL)
  //     .done(function (response) {
  //       var usersList = response;

  //       $.get(clientGroupsURL)
  //         .done(function (response) {
  //           var groupsList = response;

  //           $.each(usersList, function (i, user) {

  //             var groupSelect = $('<select>').prop('class', 'form-control select2-multiple').attr('multiple', true);
  //             $.each(groupsList, function (i, group) {
  //               var groupSelected = ($.inArray(group.id, user.groups) != -1? true: false);

  //               groupSelect.append(
  //                 $('<option>').val(group.id).text(group.name).prop('selected', groupSelected)
  //               );
  //             });

  //             var tr = $('<tr>').append(
  //               $('<td>').append(
  //                 $('<input>').prop('type', 'checkbox'),
  //                 $('<span>').text(user.full_name)
  //               ),
  //               $('<td>').append(
  //                 $('<div>').prop('class', 'form-group').append(groupSelect)
  //               )
  //             );

  //             tbody.append(tr); // add to the table
  //         });

  //         initTable();
  //         App.initComponents(); // reload UI components

  //       });

  //     });

  // }

  return {
    init: function () {
      initTable();
    }
  }

}();

jQuery(document).ready(function() {
  groupUsers.init();

  // SEARCH
  $('#search-panel input').on('keyup', function () {
    var searchItem = $(this).val();
    var table = $('#users-table').DataTable();
    table.search(searchItem).draw();

  });

  // CREATE NEW GROUP
  $('#addGroupModal #create-group-submit-btn').on('click', function () {
    var form = $('#add-group-form').serialize();

    $.post(clientGroupsURL, form)
      .done(function (response) {
        window.location.reload();
      });
  });

  // UPDATE GROUPS
  $('#users-form select').on('change', function () {
    var userId = $(this).data('user-id');
    var groups = $(this).val();

    var url = clientUsersURL + userId + '/join/';
    $.get(url, {'groups': groups})
      .done(function (response) {

        msg = "User\'s groups has been updated.";
        UIToastr.notify('success', 'Saved Successfully!', msg);
      });

  });

  // ADD USER TO GROUP
  $('#addUserToGroupModal #add-customer-group-submit-btn').on('click', function () {
    var form = $('#user-group-form').serialize();

    $.post(clientGroupUsersURL, form)
      .done(function (response) {
        window.location.reload();

      });
  });

});