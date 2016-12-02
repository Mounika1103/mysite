function statusChecker (task_id, statusContainer) {

    $.get('/vs/api/clients/get_status/'+ task_id +'/')
        .done(function (response) {
            var container = $(statusContainer);

            // success status
            if (response.state == 'SUCCESS') {
                container.text('Completed');
                container.toggleClass("label-warning label-success");

            } else if (response.state == 'PENDING' && response.task_id !== "null") {
                setTimeout(function () {
                    statusChecker(task_id, statusContainer);
                }, 3000);
            } else {
                container.text('Failed');
                container.toggleClass("label-warning label-danger");
            }
        });

}


$(document).ready(function () {

    $('#create-client-btn').on('click', function (e) {
        e.preventDefault();
        var form = $('#clientForm').serialize();
        $('#create-client-btn').prop('disabled', true);
        $.post('/vs/api/clients/', form)
            .done(function (response) {
                // console.log(response);
                if(response.status == 'created') {
                    $('#clientCreationStatus').modal('show');
                    // client creation task
                    statusChecker(response.client_task, '#create-client-status');
                    // vectorflow task
                    statusChecker(response.vector_task, '#vector-status');
                    // analytics_task
                    statusChecker(response.analytics_task, '#analytics-status');

                } else {
                    $('#clientForm .form-group').each(function () {
                        var formgroup = $(this);
                        formgroup.removeClass('has-error');
                        formgroup.find('.help-block').text('');
                    });

                    // render errors
                    $.each(response, function (field, error) {
                        var formgroup = $('#clientForm .' + field);
                        formgroup.addClass('has-error');
                        formgroup.find('.help-block').text(error);
                    });
                }
                $('#create-client-btn').prop('disabled', false);

            });
    });
    $('#cancel-client-btn').on('click', function (e) {
        e.preventDefault();
        $('#clientForm input').val('');
        $('#create-client-btn').prop('disabled', false);
      });

});
