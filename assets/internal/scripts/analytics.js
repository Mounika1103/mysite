var clusteredData = function () {
  var clusteredFiles,
      clusterClass,
      salesStage;

  var getClusteredFiles = function () {
    var result;

    $.ajax({
      url: '/api/clients/analytics/classification/clustered_files/',
      async: false,
      type: 'GET',
      success: function (response) {
        result = response;
      }
    });

    return result;
  }

  var getClusterClass = function () {
    var result;

    $.ajax({
      url: '/api/clients/analytics/classification/cluster_class/',
      async: false,
      type: 'GET',
      success: function (response) {
          result = response;
      }
    });

    return result;
  }

  var getSalesStage = function () {
    return [1,2,3,4,5];
  }

  var getDate = function (date_string) {
    return new Date(date_string);
  }

  /////////////////// OPPORTUNITY VALUES
  //
  var getOpportunityValues = function () {
    var result = [],
        drilldown = [],
        totalOppValues = 0;

    $.each(clusterClass, function (i, cluster) {
      // filter clustered files by cluster class
      var files = $.grep(clusteredFiles, function (obj, i) { return obj.cluster_class===cluster.id; });

      // calculate total opp values
      var oppValue = 0, totalPrice = 0;
      $.each(files, function (i, file) { return oppValue += parseInt(file.opportunity_value); });
      result.push({'name': cluster.cluster_class_name, 'value': oppValue, 'drilldown': cluster.cluster_class_name});
      var drill = {'data':[], 'name': cluster.cluster_class_name, 'id': cluster.cluster_class_name};

      // percentage of each file.
      $.each(files, function (i, file) {
        drill['data'].push([file.opportunity_id, (parseInt(file.opportunity_value) / oppValue) * 100]);
      });

      drilldown.push(drill);

      // sum all opp value for percentage calculation
      totalOppValues += oppValue;
    });

    $.each(result, function (i, item) {
      $.extend(item, {'y': (parseInt(item.value)/totalOppValues) * 100});
    });

    return {
      result: result,
      drilldown: drilldown
    };
  }

  //////////////////// PERFORMANCE
  //
  var _calculateAverageQFI = function (clusterdata) {
    var length = clusterdata.length;

    // web
    qfiWebObj = $.map(clusterdata, function (data, index) { return data.qfi_web_intra; });
    qfiweb = qfiWebObj.reduce(function(a, b) {return a+b}, 0) / length;
    
    // hd
    qfiHdObj = $.map(clusterdata, function (data, index) { return data.qfi_hd_intra; });
    qfihd = qfiHdObj.reduce(function(a, b) {return a+b}, 0) / length;

    // crm
    qfiCrmObj = $.map(clusterdata, function (data, index) { return data.qfi_crm_intra; });
    qficrm = qfiCrmObj.reduce(function(a, b) {return a+b}, 0) / length;

    // sh
    qfiShObj = $.map(clusterdata, function (data, index) { return data.qfi_sh_intra }); 
    qfish = qfiShObj.reduce(function(a, b) {return a+b}, 0) / length;

    // sm
    qfiSmObj = $.map(clusterdata, function (data, index) { return data.qfi_sm_intra; });
    qfism = qfiSmObj.reduce(function(a, b) {return a+b}, 0) / length;

    return {'qfi_web': qfiweb, 'qfi_hd': qfihd, 'qfi_crm': qficrm, 'qfi_sh': qfish, 'qfi_sm': qfism};
  }

  var getDateInterval = function (startDate, endDate, interval) {

    addFn = Date.prototype.addDays;
    interval = interval || 1;

    var retVal = [];
    var current = new Date(startDate);

    while (current <= endDate) {
      retVal.push(new Date(current));
      current = addFn.call(current, interval);
    }

    return retVal;
  }

  var getPerformance = function (opportunity_id, date_from, date_to) {
    var result = [];
    
    console.log(getDateInterval(date_from, date_to, null, 1));

    // TODO: set labels dynamically based on the date range
    var labels = ['2015-10-01', '2015-10-08', '2015-10-15', '2015-10-22',
      '2015-10-29', '2015-11-05', '2015-11-12', '2015-11-19'];

    var QFILabels = ['qfi_web', 'qfi_hd', 'qfi_crm', 'qfi_sh', 'qfi_sm'];

    var qfis = {
      'qfi_web':[],
      'qfi_hd':[],
      'qfi_crm':[],
      'qfi_sh':[],
      'qfi_sm':[]
    }

    $.each(labels, function (i, label) {
      var _clusterdata = $.grep(clusteredFiles, function (obj, i) {
        return obj.pred_run_date===label && obj.opportunity_id===opportunity_id;
      });
      //console.log(_clusterdata);
      var qfisData = _calculateAverageQFI(_clusterdata);

      $.each(QFILabels, function(i, qfi) {
        qfis[qfi].push(qfisData[qfi]);
      });
    });

    $.each(QFILabels, function (i, qfi) {
      result.push({
          'name': qfi,
          'data': qfis[qfi],
      });
    });

    return {'labels': labels, 'data': result};
  }

  //////////////////////////// CLUSTER CLASSIFICATION PLOT
  //
  // get the average price for each combination of salestage and
  // opportunity_value
  var getClassificationPlot = function (date_from, date_to) {
    var result = [], oppValue = {};
    //var runDate = '2015-10-01';

    var _from = getDate(date_from),
        _to = getDate(date_to);

    var _clusterdata = $.grep(clusteredFiles, function(obj, i) {
      var runDate = getDate(obj.pred_run_date);
      return runDate >= _from && runDate <= _to;
    });

    var totalPriceObj = $.map(_clusterdata, function (data, index) { return data.opportunity_value; });
    var totalPrice = totalPriceObj.reduce(function (a, b) {return a+b}, 0);

    var combo = [];
    $.each(_clusterdata, function(i, data) {
      var key = data.cluster_class_by_stage + "_" + data.cluster_class;
      var key_check = $.inArray(key, combo);

      if (key_check !== 0) {
        oppValue[key] = [parseFloat(data.opportunity_value)];
        combo.push(key);
      } else {
        oppValue[key].push(parseFloat(data.opportunity_value));
      }
    });

    $.each(oppValue, function (key, value) {
      var total = value.reduce(function (a,b) {return a+b;}, 0);
      var coordinates = key.split('_');

      result.push({
        'z': (total/totalPrice) * 100,
        'y': parseInt(coordinates[0]),
        'x': parseInt(coordinates[1]),
        'name': total.toLocaleString()
      });

    });

    return result;

  }

  /////////////////////////// QFI Comparatives
  //
  var qfiComparativePlot = function (pred_run_date) {
    var result = [];
    var categories = ['qfi_web', 'qfi_hd', 'qfi_crm', 'qfi_sh', 'qfi_sm'];
    var labels = [''];

    // categories
    pred_run_date = '2015-10-01';
    var _clusterdata = $.grep(clusteredFiles, function (obj, i) {
        return obj.pred_run_date===pred_run_date;
      });
    console.log(_clusterdata);
    
    $.each(categories, function (index, category) {


    });

  }

  return {
    init: function () {
      clusteredFiles = getClusteredFiles();
      clusterClass = getClusterClass();
      salesStage = getSalesStage();
    },
    totalOppValues: function (date_from, date_to) {
      return getOpportunityValues();
    },
    performance: function (opportunity_id, date_from, date_to) {
      return getPerformance(opportunity_id);
    },
    classificationPlot: function (date_from, date_to) {
      return getClassificationPlot(date_from, date_to);
    },
    qfiComparativePlot: function (pred_run_date) {
      return qfiComparativePlot(pred_run_date);
    }
  }

}();


$(document).ready(function () {
  clusteredData.init();

  // initial date range
  var now = new Date();
  today = now.toISOString().substring(0, 10);
  $('#date-from').val(today);
  $('#date-to').val(today);
  $('#select-opportunity').hide();

  function loadPlot(plot, date_from, date_to) {
    var container = $('#chart-container');

    // hide the opportunity option list
    $('#select-opportunity').hide();

    switch (plot) {
      case "cluster_result_a":
        break;
      case "cluster_result_b":
        var data = clusteredData.classificationPlot(date_from, date_to);
        VSCharts.bubble('#chart-container', 'Cluster Classification Plot', data);
        break;
      case "opportunity_value":
        var data = clusteredData.totalOppValues();
        VSCharts.pie('#chart-container', "Total Opportunity Value By Classification", data.result, data.drilldown);
        break;
      case "performance":
        $('#select-opportunity').show();
        var opportunity_id = $('#select-opportunity').find(':selected').val();
        var data = clusteredData.performance(opportunity_id, date_from, date_to);

        VSCharts.line('#chart-container', "Performance", data);
        break;
      case "prediction_accuracy":
      case "prediction_value":
      case "total_value":
        break;
    }

  }

  $('#select-plot').change(function () {
    var plot = $(this).val();
    loadPlot(plot, today, today);
  });

  var getDate = function (date_string) {
    return new Date(date_string);
  }

  $('.daterange').on('change', function () {
    var plot = $('#select-plot').find(":selected").val(),
      _from = $('.daterange[name=from]').val(),
      _to = $('.daterange[name=to]').val();

    loadPlot(plot, _from, _to);
  });

  $('#select-opportunity').on('change', function () {
    var plot = $('#select-plot').find(":selected").val(),
      opportunity_id = $(this).val(),
      _from = $('.daterange[name=from]').val(),
      _to = $('.daterange[name=to]').val();

      loadPlot(plot, _from, _to);
  });

});
