var predictionChart = function () {

    ///////////// API URIs
    apiURL = '/api/';
    clientsURL = apiURL + 'clients/';
    // report details
    reportsURL = clientsURL + 'reports/';

    var loadChart = function (opportunityId, valueFields) {

        var reportDetailURL = reportsURL + opportunityId + '/';
        $.get(reportDetailURL, {'value_fields': valueFields})
            .done(function (response) {


                var options = {
                    chart : {
                        style: {
                            fontFamily: 'Open Sans'
                        }
                    },
                    title : {
                        text: response.customer_name,
                        x: -20
                    },
                    subtitle: {
                        text: opportunityId
                    },
                    xAxis: {
                        categories: response.categories
                    },
                    yAxis: {
                        title: {
                            text: 'Prediction Values'
                        },
                        plotLines: [{
                            value: 0,
                            width: 1,
                            color: '#808080'
                        }]
                    },
                    legend: {
                        layout: 'horizontal',
                        align: 'center',
                        verticalAlign: 'bottom',
                        borderWidth: 0
                    },
                    credits: {
                        enabled: false
                    },
                }

                series = [];
                $.each(response.data, function(key, value) {
                    series.push({name: key, 'data': value});
                });
                options['series'] = series;
                $('#prediction-chart').highcharts(options);
        });
    };

    $('.value-fields').on('change', function () {

        var valueFields = $('.value-fields:checked').map(function() {
            return $(this).val();
        }).get();

        var opportunityId = $('#opportunity-id').text();
        loadChart(opportunityId, valueFields);
    });


    return {
        init: function () {
            var valueFields = $('.value-fields:checked').map(function() {
                return $(this).val();
            }).get();
            loadChart($('#opportunity-id').text(), valueFields);
        }
    }

}();


jQuery(document).ready(function() {
    predictionChart.init();
});