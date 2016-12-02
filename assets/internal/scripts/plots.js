/* PLOTS JS
 * @desc   : contains the library for the
 *           different types of charts
 */

var VSCharts = function () {

    var plotScatter = function (container, title, data) {
        $(container).highcharts({
            credits: false,
            chart: {
                type: 'scatter',
                zoomType: 'xy'
            },
            title: {
                text: title
            },
            xAxis: {
                startOnTick: true,
                endOnTick: true,
                showLastLabel: true,
                plotLines: [{
                    color: 'black',
                    dashStyle: 'ShortDash',
                    width: 2,
                    value: 0,
                    zIndex: 3
                }]
            },
            yAxis: {
                plotLines: [{
                    color: 'black',
                    dashStyle: 'ShortDash',
                    width: 2,
                    value: 0,
                    zIndex: 3
                }]
            },
            legend: {
                layout: 'vertical',
                align: 'left',
                verticalAlign: 'top',
                x: 100,
                y: 70,
                floating: true,
                backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF',
                borderWidth: 1
            },
            plotOptions: {
                scatter: {
                    marker: {
                        symbol: 'circle',
                        radius: 5,
                        states: {
                            hover: {
                                enabled: true,
                                lineColor: 'rgb(100,100,100)'
                            }
                        }
                    },
                    states: {
                        hover: {
                            marker: {
                                enabled: false
                            }
                        }
                    },
                    tooltip: {
                        headerFormat: '<b>{series.name}</b><br>',
                        pointFormat: '{point.x}, {point.y}'
                    }
                }
            },
            series: data
        });
    }

    var plotBubble = function (container, title, data) {
        var yCategories = ["", "Prospecting", "Qualification", "Needs Analysis", "Value Proposition", "Decision Makers", "Perception Analysis", "Proposal/Price Quote", "Negotiation/Review"];
        var xCategories = ["IDEAL", "SOMEWHAT UNLIKELY", "MOST LIKELY", "SWING", "MOST UNLIKELY", "SOMEWHAT LIKELY"];

        $(container).highcharts({
            credits: false,
            chart: {
                type: 'bubble',
                plotBorderWidth: 1,
                zoomType: 'xy'
            },

            legend: {
                enabled: false
            },

            title: {
                text: title,
                align: 'center'
            },

            xAxis: {
                //gridLineWidth: 1,
                type: 'category',
                title: {
                    text: 'Classification'
                },
                categories: xCategories,
                labels: {
                    format: '{value}'
                }
            },

            yAxis: {
                tickInterval: 1,
                min: 0,
                max: 9,
                title: {
                    text: 'Sales Stage'
                },
                labels: {
                    //format: '{value}',
                    //rotation: -45,
                    align: 'right',
                    formatter: function(){
                        return yCategories[this.value]; 
                    },
                    style: {
                        fontFamily: 'Verdana, sans-serif'
                    }
                }
            },

            tooltip: {
                useHTML: true,
                formatter: function () {
                    return "<h3>" + this.key + "</h3><h5>Sales Stage:&nbsp;&nbsp;" + yCategories[this.y] + "</h5><h5>Classification:&nbsp;&nbsp;" + this.x + "</h5>";
                },
                followPointer: true
            },

            plotOptions: {
                series: {
                    dataLabels: {
                        enabled: true,
                        format: '{point.name}'
                    },
                    point: {
                        events: {
                            click: function () {
                                var modalContainer = "#" + this.modal.container;
                                ClassificationResultPlot.load_datalist(this.ssdata, modalContainer);

                                // save for back button
                                prevValue.push({
                                    'data':this.ssdata,
                                    'key': this.download_key,
                                    'value': this.download_value,
                                    'cluster_class': this.cluster_class,
                                    'pred_run_date': this.pred_run_date
                                });
                            }
                        }
                    }
                }
            },

            series: [{
                data: data
            }]

        });
    }

    var plotPie = function (container, title, data, drilldowndata) {

        $(container).highcharts({
        	credits: false,
	        chart: {
	            type: 'pie'
	        },
	        title: {
	            text: title
	        },
	        subtitle: {
	            text: 'Click the slices to view the drill down.'
	        },
	        plotOptions: {
	            series: {
	                dataLabels: {
	                    enabled: true,
	                    format: '<b>{point.name}</b> ${point.value}',
	                },
                    point: {
                        events: {
                            click: function () {
                                if (this.modal != null) {
                                    var modalContainer = '#' + this.modal.container;
                                    ClassificationOppValue.load_datalist(this.ssdata, modalContainer);

                                    // save for back button
                                    prevValue.push({
                                        'data':this.ssdata,
                                        'key': this.download_key,
                                        'value': this.download_value,
                                        'cluster_class': this.cluster_class,
                                        'pred_run_date': this.pred_run_date
                                    });

                                    // set download key
                                    var downloadURL = '/clients/analytics/plots/classification/download/';
                                    $(modalContainer+' #download-key').attr('href', downloadURL + '?key=' + this.download_key + '&value=' + this.download_value + '&date=' + this.pred_run_date + '&cluster=' + this.cluster_class);
                                    $(modalContainer).modal('show');
                                }
                            }
                        }
                    }
	            }
	        },
	        tooltip: {
	            headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
	            pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> of total<br/>'
	        },
	        series: [{
	            name: 'Opportunity Value',
	            colorByPoint: true,
	            data: data
	        }],
	        drilldown: {
	            series: drilldowndata,
	        }
	    });
    }

    var plotBar = function (container, title, data) {
        $(container).highcharts({
            credits: false,
            chart: {
                type: 'column'
            },
            title: {
                text: title
            },
            xAxis: {
                categories: [
                    'QFI1',
                    'QFI2',
                    'QFI3',
                    'QFI4',
                    'QFI5',
                ],
                crosshair: true
            },
            yAxis: {
                allowDecimals: false,
                min:0,
                max: 100,
                title: {
                    text: 'Prediction Values'
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                    '<td style="padding:0"><b>{point.y}</b></td></tr>',
                footerFormat: '</table>',
                shared: true,
                useHTML: true
            },
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0
                }
            },
            series: data
        });
    }

    var plotBar3 = function (container, title, categories, data, ymax=100) {
        $(container).highcharts({
            credits: false,
            chart: {
                type: 'column'
                },
            title: {
                text: title
                },
            xAxis: {
                categories: categories
                },
            yAxis: {
                min: 0,
                max: ymax
            },
            series: data
        });
    }

    var plotLine = function (container, title, data) {
        $(container).highcharts({
            credits: false,
            title: {
                text: title,
                x: -20 //center
            },
            xAxis: {
                categories: data.labels
            },
            yAxis: {
                min: 0,
                max: 100,
                title: {
                    text: 'Prediction Values'
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            tooltip: {
                valueSuffix: ''
            },
            // legend: {
            //     layout: 'vertical',
            //     align: 'right',
            //     verticalAlign: 'middle',
            //     borderWidth: 0
            // },
            series: data.data
        });
    }

    var plotBar2 = function (container, title, data) {

        $(container).highcharts({
            credits: false,
            chart: {
                type: 'column'
            },
            title: {
                text: 'Change in Classification from 07/01/15 - 07/08/15'
            },
            subtitle: {
                text: 'Click the Bar graph to see history'
            },
            xAxis: {
                type: 'category'
            },
            yAxis: {
                title: {
                    text: 'Opportunity Values'
                }

            },
            legend: {
                enabled: false
            },
            plotOptions: {
                series: {
                    borderWidth: 0,
                    dataLabels: {
                        enabled: true,
                        format: '<span style="font-size: 14px">{point.total}</span>'
                    }
                }
            },

            tooltip: {
                headerFormat: '',
                pointFormat: '<span style="color:{point.color}">{point.name}</span><br>Change:<b>{point.y}</b><br/>'
            },

            series: [{
                name: 'Opportunities',
                colorByPoint: false,
                color: '#90ed7d',
                negativeColor: '#FF0000',
                data: data.total
            }],
            drilldown: {
                series: data.drilldown
            }
        });

    }

    var plotMatrix = function (container, title, data) {
        var tbody = $(container).find('table > tbody');

        $.each(data, function (i, item) {
            var correct = $('<span>').prop('class', 'pred-point badge predicted-true');
            var incorrect = $('<span>').prop('class', 'pred-point badge predicted-false');
            var toBeDetermine = $('<span>').prop('class', 'pred-point badge to-be-determine');

            var $tr = $('<tr>');
            $tr.append(
                $('<td>').text(item.opportunity),
                $('<td>').html(item.p == 'win' ? correct : ''),
                $('<td>').html(item.p == 'tbd' ? toBeDetermine : ''),
                $('<td>').html(item.p == 'loss' ? incorrect : ''),
                $('<td>').html(item.n == 'win' ? correct : ''),
                $('<td>').html(item.n == 'tbd' ? toBeDetermine : ''),
                $('<td>').html(item.n == 'loss' ? incorrect : '')
            );
            tbody.append($tr);
        });

    }

    return {
        scatter: function (container, title, data) {
            plotScatter(container, title, data);
        },
        bubble: function (container, title, data) {
            plotBubble(container, title, data);
        },
        pie: function (container, title, data, drilldown) {
            plotPie(container, title, data, drilldown);
        },
        bar: function (container, title, data) {
            plotBar(container, title, data);
        },
        line: function (container, title, data) {
            plotLine(container, title, data);
        },
        bar2: function (container, title, data) {
            plotBar2(container, title, data);
        },
        bar3: function (container, title, categories, data, ymax=100) {
            plotBar3(container, title, categories, data, ymax);
        },
        matrix: function (container, title, data) {
            plotMatrix(container, title, data);
        }
    }

}();