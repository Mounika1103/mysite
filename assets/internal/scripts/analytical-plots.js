var mapChart = function () {

    var w = "100%",
    h = "700px";

    var projection = d3.geo.azimuthal()
        .mode("equidistant")
        .origin([-98, 38])
        .scale(1400)
        .translate([580, 360]);

    var path = d3.geo.path()
        .projection(projection);

    var svg = d3.select("#chart-container8").insert("svg:svg", "h2")
        .attr("width", w)
        .attr("height", h);

    var tooltip = d3.select("#chart-container8").append("div")    
        .attr("class", "tooltip")               
        .style("opacity", 0);

    var states = svg.append("svg:g")
        .attr("id", "states");

    var circles = svg.append("svg:g")
        .attr("id", "circles");

    var cells = svg.append("svg:g")
        .attr("id", "cells");

    d3.json("/static/us-states.json", function(collection) {
      states.selectAll("path")
          .data(collection.features)
        .enter().append("svg:path")
          .attr("d", path);
    });

    d3.csv("/static/airports.csv", function (airports) {
        var locationByAirport = {};
        var positions = [];

        airports.forEach(function (airport) {
            var location = [+airport.longitude, +airport.latitude];
            locationByAirport[airport.iata] = location;
            positions.push(projection(location));
            return true;
        });

        var polygons = d3.geom.voronoi(positions);

        var g = cells.selectAll("g")
            .data(airports)
            .enter().append("svg:g")
            .on("mouseover", function(d) {
                console.log($(this).css('fill'));
                tooltip.transition()        
                    .duration(200)     
                    .style("opacity", .9);      
                tooltip.html("<span>"+d.name+", "+d.iata+"</span>")  
                    .style("left", (d3.event.pageX) + "px")     
                    .style("top", (d3.event.pageY - 28) + "px"); 
                })
                .on("mouseout", function(d) {
                    tooltip.transition()        
                        .duration(500)      
                        .style("opacity", .9);
                });

        g.append("svg:path")
            .attr("class", "cell")
            .attr("d", function(d, i) { return "M" + polygons[i].join("L") + "Z"; })
            .on("mouseover", function(d, i) { return d3.select("h2 span").text(d.name) });

        var colors = ['#7cb5ec', '#434348', '#90ed7d', '#f7a35c', '#8085e9'];

        circles.selectAll("circle")
            .data(airports)
            .enter().append("svg:circle")
                .style("fill", function(d, i) { return colors[Math.floor(Math.random()*colors.length)]; })
                .attr("cx", function(d, i) { return positions[i][0]; })
                .attr("cy", function(d, i) { return positions[i][1]; })
                .attr("r", function(d, i) { return 5; });

    });
};

$(function () {

    $('#chart-container1').highcharts({
        credits: false,
        chart: {
            type: 'scatter',
            zoomType: 'xy'
        },
        title: {
            text: 'Cluster Result'
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
        series: [{
            name: 'Prediction1',
            color: 'rgba(223, 83, 83, .5)',
            data: [[-23, -45], [-90, 138], [161.2, 51.6], [167.5, 59.0], [159.5, 49.2], [157.0, 63.0], [155.8, 53.6],
                [170.0, 59.0], [159.1, 47.6], [166.0, 69.8], [176.2, 66.8], [160.2, 75.2],
                [172.5, 55.2], [170.9, 54.2], [172.9, 62.5], [153.4, 42.0], [160.0, 50.0],
                [147.2, 49.8], [168.2, 49.2], [175.0, 73.2], [157.0, 47.8], [167.6, 68.8],
                [159.5, 50.6], [175.0, 82.5], [166.8, 57.2], [176.5, 87.8], [170.2, 72.8],
                [174.0, 54.5], [173.0, 59.8], [179.9, 67.3], [170.5, 67.8], [160.0, 47.0],
                [154.4, 46.2], [162.0, 55.0], [176.5, 83.0], [160.0, 54.4], [152.0, 45.8],
                [162.1, 53.6], [170.0, 73.2], [160.2, 52.1], [161.3, 67.9], [166.4, 56.6],
                [168.9, 62.3], [163.8, 58.5], [167.6, 54.5], [160.0, 50.2], [161.3, 60.3],
                [167.6, 58.3], [165.1, 56.2], [160.0, 50.2], [170.0, 72.9], [157.5, 59.8],
                [167.6, 61.0], [160.7, 69.1], [163.2, 55.9], [152.4, 46.5], [157.5, 54.3],
                [168.3, 54.8], [180.3, 60.7], [165.5, 60.0], [165.0, 62.0], [164.5, 60.3],
                [156.0, 52.7], [160.0, 74.3], [163.0, 62.0], [165.7, 73.1], [161.0, 80.0],
                [162.0, 54.7], [166.0, 53.2], [174.0, 75.7], [172.7, 61.1], [167.6, 55.7],
                [151.1, 48.7], [164.5, 52.3], [163.5, 50.0], [152.0, 59.3], [169.0, 62.5],
                [164.0, 55.7], [161.2, 54.8], [155.0, 45.9], [170.0, 70.6], [176.2, 67.2],
                [170.0, 69.4], [162.5, 58.2], [170.3, 64.8], [164.1, 71.6], [169.5, 52.8],
                [163.2, 59.8], [154.5, 49.0], [159.8, 50.0], [173.2, 69.2], [170.0, 55.9],
                [161.4, 63.4], [169.0, 58.2], [166.2, 58.6], [159.4, 45.7], [162.5, 52.2],
                [159.0, 48.6], [162.8, 57.8], [159.0, 55.6], [179.8, 66.8], [162.9, 59.4],
                [161.0, 53.6], [151.1, 73.2], [168.2, 53.4], [168.9, 69.0], [173.2, 58.4],
                [171.8, 56.2], [178.0, 70.6], [164.3, 59.8], [163.0, 72.0], [168.5, 65.2],
                [166.8, 56.6], [172.7, 105.2], [163.5, 51.8], [169.4, 63.4], [167.8, 59.0],
                [159.5, 47.6], [167.6, 63.0], [161.2, 55.2], [160.0, 45.0], [163.2, 54.0],
                [162.2, 50.2], [161.3, 60.2], [149.5, 44.8], [157.5, 58.8], [163.2, 56.4],
                [172.7, 62.0], [155.0, 49.2], [156.5, 67.2], [164.0, 53.8], [160.9, 54.4],
                [162.8, 58.0], [167.0, 59.8], [160.0, 54.8], [160.0, 43.2], [168.9, 60.5],
                [158.2, 46.4], [156.0, 64.4], [160.0, 48.8], [167.1, 62.2], [158.0, 55.5],
                [167.6, 57.8], [156.0, 54.6], [162.1, 59.2], [173.4, 52.7], [159.8, 53.2],
                [170.5, 64.5], [159.2, 51.8], [157.5, 56.0], [161.3, 63.6], [162.6, 63.2],
                [160.0, 59.5], [168.9, 56.8], [165.1, 64.1], [162.6, 50.0], [165.1, 72.3],
                [166.4, 55.0], [160.0, 55.9], [152.4, 60.4], [170.2, 69.1], [162.6, 84.5],
                [170.2, 55.9], [158.8, 55.5], [172.7, 69.5], [167.6, 76.4], [162.6, 61.4],
                [167.6, 65.9], [156.2, 58.6], [175.2, 66.8], [172.1, 56.6], [162.6, 58.6],
                [160.0, 55.9], [165.1, 59.1], [182.9, 81.8], [166.4, 70.7], [165.1, 56.8],
                [177.8, 60.0], [165.1, 58.2], [175.3, 72.7], [154.9, 54.1], [158.8, 49.1],
                [172.7, 75.9], [168.9, 55.0], [161.3, 57.3], [167.6, 55.0], [165.1, 65.5],
                [175.3, 65.5], [157.5, 48.6], [163.8, 58.6], [167.6, 63.6], [165.1, 55.2],
                [165.1, 62.7], [168.9, 56.6], [162.6, 53.9], [164.5, 63.2], [176.5, 73.6],
                [168.9, 62.0], [175.3, 63.6], [159.4, 53.2], [160.0, 53.4], [170.2, 55.0],
                [162.6, 70.5], [167.6, 54.5], [162.6, 54.5], [160.7, 55.9], [160.0, 59.0],
                [157.5, 63.6], [162.6, 54.5], [152.4, 47.3], [170.2, 67.7], [165.1, 80.9],
                [172.7, 70.5], [165.1, 60.9], [170.2, 63.6], [170.2, 54.5], [170.2, 59.1],
                [161.3, 70.5], [167.6, 52.7], [167.6, 62.7], [165.1, 86.3], [162.6, 66.4],
                [152.4, 67.3], [168.9, 63.0], [170.2, 73.6], [175.2, 62.3], [175.2, 57.7],
                [160.0, 55.4], [165.1, 104.1], [174.0, 55.5], [170.2, 77.3], [160.0, 80.5],
                [167.6, 64.5], [167.6, 72.3], [167.6, 61.4], [154.9, 58.2], [162.6, 81.8],
                [175.3, 63.6], [171.4, 53.4], [157.5, 54.5], [165.1, 53.6], [160.0, 60.0],
                [174.0, 73.6], [162.6, 61.4], [174.0, 55.5], [162.6, 63.6], [161.3, 60.9],
                [156.2, 60.0], [149.9, 46.8], [169.5, 57.3], [160.0, 64.1], [175.3, 63.6],
                [169.5, 67.3], [160.0, 75.5], [172.7, 68.2], [162.6, 61.4], [157.5, 76.8],
                [176.5, 71.8], [164.4, 55.5], [160.7, 48.6], [174.0, 66.4], [163.8, 67.3]]

        }, {
            name: 'Prediction2',
            color: 'rgba(119, 152, 191, .5)',
            data: [[-23, -65], [-90, 128], [174.0, 65.6], [175.3, 71.8], [193.5, 80.7], [186.5, 72.6], [187.2, 78.8],
                [181.5, 74.8], [184.0, 86.4], [184.5, 78.4], [175.0, 62.0], [184.0, 81.6],
                [180.0, 76.6], [177.8, 83.6], [192.0, 90.0], [176.0, 74.6], [174.0, 71.0],
                [184.0, 79.6], [192.7, 93.8], [171.5, 70.0], [173.0, 72.4], [176.0, 85.9],
                [176.0, 78.8], [180.5, 77.8], [172.7, 66.2], [176.0, 86.4], [173.5, 81.8],
                [178.0, 89.6], [180.3, 82.8], [180.3, 76.4], [164.5, 63.2], [173.0, 60.9],
                [183.5, 74.8], [175.5, 70.0], [188.0, 72.4], [189.2, 84.1], [172.8, 69.1],
                [170.0, 59.5], [182.0, 67.2], [170.0, 61.3], [177.8, 68.6], [184.2, 80.1],
                [186.7, 87.8], [171.4, 84.7], [172.7, 73.4], [175.3, 72.1], [180.3, 82.6],
                [182.9, 88.7], [188.0, 84.1], [177.2, 94.1], [172.1, 74.9], [167.0, 59.1],
                [169.5, 75.6], [174.0, 86.2], [172.7, 75.3], [182.2, 87.1], [164.1, 55.2],
                [163.0, 57.0], [171.5, 61.4], [184.2, 76.8], [174.0, 86.8], [174.0, 72.2],
                [177.0, 71.6], [186.0, 84.8], [167.0, 68.2], [171.8, 66.1], [182.0, 72.0],
                [167.0, 64.6], [177.8, 74.8], [164.5, 70.0], [192.0, 101.6], [175.5, 63.2],
                [171.2, 79.1], [181.6, 78.9], [167.4, 67.7], [181.1, 66.0], [177.0, 68.2],
                [174.5, 63.9], [177.5, 72.0], [170.5, 56.8], [182.4, 74.5], [197.1, 90.9],
                [180.1, 93.0], [175.5, 80.9], [180.6, 72.7], [184.4, 68.0], [175.5, 70.9],
                [180.6, 72.5], [177.0, 72.5], [177.1, 83.4], [181.6, 75.5], [176.5, 73.0],
                [175.0, 70.2], [174.0, 73.4], [165.1, 70.5], [177.0, 68.9], [192.0, 102.3],
                [176.5, 68.4], [169.4, 65.9], [182.1, 75.7], [179.8, 84.5], [175.3, 87.7],
                [184.9, 86.4], [177.3, 73.2], [167.4, 53.9], [178.1, 72.0], [168.9, 55.5],
                [157.2, 58.4], [180.3, 83.2], [170.2, 72.7], [177.8, 64.1], [172.7, 72.3],
                [165.1, 65.0], [186.7, 86.4], [165.1, 65.0], [174.0, 88.6], [175.3, 84.1],
                [185.4, 66.8], [177.8, 75.5], [180.3, 93.2], [180.3, 82.7], [177.8, 58.0],
                [177.8, 79.5], [177.8, 78.6], [177.8, 71.8], [177.8, 116.4], [163.8, 72.2],
                [188.0, 83.6], [198.1, 85.5], [175.3, 90.9], [166.4, 85.9], [190.5, 89.1],
                [166.4, 75.0], [177.8, 77.7], [179.7, 86.4], [172.7, 90.9], [190.5, 73.6],
                [185.4, 76.4], [168.9, 69.1], [167.6, 84.5], [175.3, 64.5], [170.2, 69.1],
                [190.5, 108.6], [177.8, 86.4], [190.5, 80.9], [177.8, 87.7], [184.2, 94.5],
                [176.5, 80.2], [177.8, 72.0], [180.3, 71.4], [171.4, 72.7], [172.7, 84.1],
                [172.7, 76.8], [177.8, 63.6], [177.8, 80.9], [182.9, 80.9], [170.2, 85.5],
                [167.6, 68.6], [175.3, 67.7], [165.1, 66.4], [185.4, 102.3], [181.6, 70.5],
                [172.7, 95.9], [190.5, 84.1], [179.1, 87.3], [175.3, 71.8], [170.2, 65.9],
                [193.0, 95.9], [171.4, 91.4], [177.8, 81.8], [177.8, 96.8], [167.6, 69.1],
                [167.6, 82.7], [180.3, 75.5], [182.9, 79.5], [176.5, 73.6], [186.7, 91.8],
                [188.0, 84.1], [188.0, 85.9], [177.8, 81.8], [174.0, 82.5], [177.8, 80.5],
                [171.4, 70.0], [185.4, 81.8], [185.4, 84.1], [188.0, 90.5], [188.0, 91.4],
                [182.9, 89.1], [176.5, 85.0], [175.3, 69.1], [175.3, 73.6], [188.0, 80.5],
                [188.0, 82.7], [175.3, 86.4], [170.5, 67.7], [179.1, 92.7], [177.8, 93.6],
                [175.3, 70.9], [182.9, 75.0], [170.8, 93.2], [188.0, 93.2], [180.3, 77.7],
                [177.8, 61.4], [185.4, 94.1], [168.9, 75.0], [185.4, 83.6], [180.3, 85.5],
                [174.0, 73.9], [167.6, 66.8], [182.9, 87.3], [160.0, 72.3], [180.3, 88.6],
                [167.6, 75.5], [186.7, 101.4], [175.3, 91.1], [175.3, 67.3], [175.9, 77.7],
                [175.3, 81.8], [179.1, 75.5], [181.6, 84.5], [177.8, 76.6], [182.9, 85.0],
                [177.8, 102.5], [184.2, 77.3], [179.1, 71.8], [176.5, 87.9], [188.0, 94.3],
                [174.0, 70.9], [167.6, 64.5], [170.2, 77.3], [167.6, 72.3], [188.0, 87.3],
                [174.0, 80.0], [176.5, 82.3], [180.3, 73.6], [167.6, 74.1], [188.0, 85.9],
                [180.3, 73.2], [167.6, 76.3], [183.0, 65.9], [183.0, 90.9], [179.1, 89.1],
                [170.2, 62.3], [177.8, 82.7], [179.1, 79.1], [190.5, 98.2], [177.8, 84.1],
                [180.3, 83.2], [180.3, 83.2]]
        }]
    });

    // CIRCLE CHARTS
    $('#chart-container2').highcharts({
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
            text: 'Prediction Run (Report 2)'
        },

        xAxis: {
            gridLineWidth: 1,
            title: {
                text: 'Classification'
            },
            labels: {
                format: '{value}'
            },
            minRange: 1,
            allowDecimals: false,
            min:0,
            max: 1
        },

        yAxis: {
            startOnTick: true,
            endOnTick: true,
            title: {
                text: 'Sales Stage'
            },
            labels: {
                format: '{value}'
            },
            maxPadding: 1,
            minRange: 1,
            allowDecimals: false,
            min:0,
            max: 6
        },

        tooltip: {
            useHTML: true,
            headerFormat: '<table>',
            pointFormat: '<tr><th colspan="2"><h3>${point.name}</h3></th></tr>' +
                '<tr><th>Classification:</th><td>{point.x}g</td></tr>' +
                '<tr><th>Sales Stage:</th><td>{point.y}g</td></tr>' +
                '<tr><th>Percentage:</th><td>{point.z}%</td></tr>',
            footerFormat: '</table>',
            followPointer: true
        },

        plotOptions: {
            series: {
                dataLabels: {
                    enabled: true,
                    format: '{point.name}'
                }
            }
        },

        series: [{
            data: [
                { x: 1, y: 4, z: 13.8, name: '100,000'},
                { x: 3, y: 2, z: 14.7, name: '233,023'},
                { x: 2, y: 3, z: 15.8, name: '124,890'},
                { x: 2, y: 1, z: 12, name: '124,890'},
                { x: 5, y: 5, z: 11.8, name: '124,890'},
                { x: 1, y: 3, z: 16.6, name: '114,890'},
                { x: 4, y: 4, z: 14.5, name: '124,890'},
                { x: 3, y: 3, z: 10, name: '21,890'},
                { x: 2, y: 2, z: 24.7, name: '178,670'},
                { x: 4, y: 2, z: 10.4, name: '367,891'},
                { x: 5, y: 4, z: 16, name: '178,898'},
                { x: 5, y: 5, z: 35.3, name: '450,895'}
            ]
        }]

    });


    // -- PIE CHARTS
    $('#chart-container3').highcharts({
        credits: false,
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
        },
        title: {
            text: 'Total Opportunity Value By Classification (Report 3)'
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>${point.name}</b> {point.percentage:.1f} %',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    }
                }
            }
        },
        series: [{
            name: 'Percentage',
            colorByPoint: true,
            data: [{
                name: '210,032',
                y: 56.33
            }, {
                name: '138,680',
                y: 24.03,
                sliced: true,
                selected: true
            }, {
                name: '153,897',
                y: 10.38
            }, {
                name: '124,780',
                y: 4.77
            }, {
                name: '145,000',
                y: 0.91
            }, {
                name: '123,789',
                y: 0.2
            }]
        }]
    });


    // -- LINE CHARTS
    $('#chart-container4').highcharts({
        credits: false,
        chart: {
            type: 'column'
        },
        title: {
            text: 'QFI Comparatives'
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
        series: [{
            name: 'qfi_web_inter',
            data: [49, 71, 100, 87, 54]

        }, {
            name: 'qfi_sh_inter',
            data: [83, 78, 98, 93, 100]

        }, {
            name: 'qfi_overall',
            data: [48, 38, 39, 41, 47]

        }, {
            name: 'qfi_hd_inter',
            data: [42, 33, 34, 39, 52]

        }, {
            name: 'qfi_sm_inter',
            data: [57, 23, 86, 98, 10]
        }]
    });

    $('#chart-container5').highcharts({
        credits: false,
        title: {
            text: 'QFI Performance Over Time',
            x: -20 //center
        },
        xAxis: {
            categories: ['7/1/2015', '7/2/2015', '7/3/2015', '7/4/2015', '7/5/2015', '7/6/2015']
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
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            borderWidth: 0
        },
        series: [{
            name: 'QFI1',
            data: [7, 33, 40, 14, 18, 21]
        }, {
            name: 'QFI2',
            data: [5, 30, 63, 11, 78, 100]
        }, {
            name: 'QFI3',
            data: [9, 34, 35, 84, 72, 17]
        }, {
            name: 'QFI4',
            data: [39, 32, 5, 8, 11, 15]
        }]
    });

    $('#chart-container6').highcharts({
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
            data: [{
                name: 'Opp1',
                y: 3,
                total: 5,
                drilldown: 'Opportunity 1'
            }, {
                name: 'Opp2',
                y: 2,
                total: 2,
                drilldown: 'Opportunity 2'
            }, {
                name: 'Opp3',
                y: 0,
                total: 4,
                drilldown: 'Opportunity 3'
            }, {
                name: 'Opp4',
                y: -2,
                total: 2,
                drilldown: 'Opportunity 4'
            }, {
                name: 'Opp5',
                y: -3,
                total: 2,
                drilldown: 'Opportunity 5'
            }, {
                name: 'Opp6',
                y: 2,
                total: 1,
                drilldown: null
            }]
        }],
        drilldown: {
            series: [{
                name: 'Opportunity 1',
                id: 'Opportunity 1',
                color: '#90ed7d',
                negativeColor: '#FF0000',
                data: [
                    {
                        name: '7/1/15',
                        y:4,
                        total: 4
                    },
                    {
                        name: '7/2/15',
                        y: 3,
                        total: 3
                    },
                    {
                        name: '7/3/15',
                        y: -2,
                        total: -2
                    },
                    {
                        name: '7/4/15',
                        y: -1,
                        total: -2,
                    },
                    {
                        name: '7/5/15',
                        y: 4,
                        total: 3
                    },
                    {
                        name: '7/6/15',
                        y: -1,
                        total: 2
                    },
                    {
                        name: '7/7/15',
                        y: 2,
                        total: 3
                    },
                    {
                        name: '7/8/15',
                        y: 5,
                        total: 3
                    }
                ]
            }, {
                name: 'Opportunity 2',
                id: 'Opportunity 2',
                color: '#90ed7d',
                negativeColor: '#FF0000',
                data: [
                    {
                        name: '7/1/15',
                        y:4,
                        total: 4
                    },
                    {
                        name: '7/2/15',
                        y: 3,
                        total: 3
                    },
                    {
                        name: '7/3/15',
                        y: -2,
                        total: -2
                    },
                    {
                        name: '7/4/15',
                        y: -1,
                        total: -2,
                    },
                    {
                        name: '7/5/15',
                        y: 4,
                        total: 3
                    },
                    {
                        name: '7/6/15',
                        y: -1,
                        total: 2
                    },
                    {
                        name: '7/7/15',
                        y: 2,
                        total: 3
                    },
                    {
                        name: '7/8/15',
                        y: 5,
                        total: 3
                    }
                ]
            }, {
                name: 'Opportunity 3',
                id: 'Opportunity 3',
                color: '#90ed7d',
                negativeColor: '#FF0000',
                data: [
                    {
                        name: '7/1/15',
                        y:4,
                        total: 4
                    },
                    {
                        name: '7/2/15',
                        y: 3,
                        total: 3
                    },
                    {
                        name: '7/3/15',
                        y: -2,
                        total: -2
                    },
                    {
                        name: '7/4/15',
                        y: -1,
                        total: -2,
                    },
                    {
                        name: '7/5/15',
                        y: 4,
                        total: 3
                    },
                    {
                        name: '7/6/15',
                        y: -1,
                        total: 2
                    },
                    {
                        name: '7/7/15',
                        y: 2,
                        total: 3
                    },
                    {
                        name: '7/8/15',
                        y: 5,
                        total: 3
                    }
                ]
            }, {
                name: 'Opportunity 4',
                id: 'Opportunity 4',
                color: '#90ed7d',
                negativeColor: '#FF0000',
                data: [
                    {
                        name: '7/1/15',
                        y:4,
                        total: 4
                    },
                    {
                        name: '7/2/15',
                        y: 3,
                        total: 3
                    },
                    {
                        name: '7/3/15',
                        y: -2,
                        total: -2
                    },
                    {
                        name: '7/4/15',
                        y: -1,
                        total: -2,
                    },
                    {
                        name: '7/5/15',
                        y: 4,
                        total: 3
                    },
                    {
                        name: '7/6/15',
                        y: -1,
                        total: 2
                    },
                    {
                        name: '7/7/15',
                        y: 2,
                        total: 3
                    },
                    {
                        name: '7/8/15',
                        y: 5,
                        total: 3
                    }
                ]
            }, {
                name: 'Opportunity 5',
                id: 'Opportunity 5',
                color: '#90ed7d',
                negativeColor: '#FF0000',
                data: [
                    {
                        name: '7/1/15',
                        y:4,
                        total: 4
                    },
                    {
                        name: '7/2/15',
                        y: 3,
                        total: 3
                    },
                    {
                        name: '7/3/15',
                        y: -2,
                        total: -2
                    },
                    {
                        name: '7/4/15',
                        y: -1,
                        total: -2,
                    },
                    {
                        name: '7/5/15',
                        y: 4,
                        total: 3
                    },
                    {
                        name: '7/6/15',
                        y: -1,
                        total: 2
                    },
                    {
                        name: '7/7/15',
                        y: 2,
                        total: 3
                    },
                    {
                        name: '7/8/15',
                        y: 5,
                        total: 3
                    }
                ]
            }]
        }
    });


    $('#chart-container7').highcharts({
        credits: false,
        chart: {
            type: 'column'
        },
        title: {
            text: 'Monthly Average Rainfall'
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
        series: [{
            name: 'qfi_web_inter',
            data: [49, 71, 100, 87, 54]

        }, {
            name: 'qfi_sh_inter',
            data: [83, 78, 98, 93, 100]

        }, {
            name: 'qfi_overall',
            data: [48, 38, 39, 41, 47]

        }, {
            name: 'qfi_hd_inter',
            data: [42, 33, 34, 39, 52]

        }, {
            name: 'qfi_sm_inter',
            data: [57, 23, 86, 98, 10]
        }]
    });

    mapChart();

    var categories = ['0-4', '5-9'];
    $('#chart-container9').highcharts({
            chart: {
                type: 'bar'
            },
            title: {
                text: 'Population pyramid for Germany, 2015'
            },
            subtitle: {
                text: 'Source: <a href="http://populationpyramid.net/germany/2015/">Population Pyramids of the World from 1950 to 2100</a>'
            },
            xAxis: [{
                categories: categories,
                reversed: false,
                labels: {
                    step: 1
                }
            }],
            yAxis: {
                title: {
                    text: null
                },
                labels: {
                    formatter: function () {
                        return Math.abs(this.value) + '%';
                    }
                }
            },

            plotOptions: {
                series: {
                    stacking: 'normal'
                }
            },

            tooltip: {
                formatter: function () {
                    return '<b>' + this.series.name + ', age ' + this.point.category + '</b><br/>' +
                        'Population: ' + Highcharts.numberFormat(Math.abs(this.point.y), 0);
                }
            },

            series: [{
                name: 'Male',
                data: [-2.2, -2.2, 1,2]
            }, {
                name: 'Female',
                data: [2.1, 2.0, -3, 3]
            }]
        });

});