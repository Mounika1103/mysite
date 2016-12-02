$(document).ready(function () {

    $('.chart-select select').on('change', function () {
        var cluster = $(this).val();

        if (cluster == '0') {
            // Cluster Classification Plot
            $.get('/api/clients/analytics/classification/scatter/')
            .done(function (response) {
                VSCharts.scatter('#chart-container', "Cluster Classification Plot", response);
            });

        } else if (cluster == '1') {
            $('#chart-container').empty();
        } else if (cluster == '2') {

        } else if (cluster == '3') {

        } else if (cluster == '4') {

        } else if (cluster == '5') {

        } else if (cluster == '6') {

        } else if (cluster == '7') {

        } else if (cluster == '8') {

        }

    });
});