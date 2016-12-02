var ClassificationResultPlot = function () {

	//// INITIALIZE
	//
	var clusteredData,
		clusterClass,
		salesStage;

	var preparePlotData = function (pred_run_date) {
		var data = [],
			subdata = [];

		var _clusterdata = $.grep(clusteredData, function (obj, i) {
			return obj.pred_run_date===pred_run_date;
		});

		$.each(clusterClass, function (index, cluster) {
			var cdata = $.grep(_clusterdata, function (obj, i) {
				return obj.cluster_class===cluster.id });

			// filter by sales stage.
			// get the sum
			$.each(salesStage, function (index, ss) {
				var item = {};
				var sdata = $.grep(cdata, function (obj, i) { return obj.StageSort===ss.id });
				
				// get opportunity value
				var opportunityValue = 0.00;
				$.each(sdata, function (index, obj) { opportunityValue+=parseInt(obj.opportunity_value); });

				item['x'] = cluster.id;
				item['y'] = ss.id;
				item['z'] = opportunityValue;
				item['name'] = "$" + opportunityValue.toLocaleString();
				item['modal'] = {'container': 'basic'};
				item['ssdata'] = sdata;

				// add to the result data
				if (opportunityValue > 0) { data.push(item); };
			});
		});

		return data;
	}

	var loadDataList = function (data, modalContainer) {

		// load header
        var $thead = $(modalContainer + " .modal-body table > thead");
        $thead.empty();
        var tr = $('<tr>');

        var header =  ['Opportunity ID', 'Customer Name', 'Total'];
        $.each(header, function (i, item) {
            tr.append($('<td>').text(item));
        });
        $thead.append(tr);

        // get data by sale stage
        var $tbody = $(modalContainer + " .modal-body table > tbody");
        $tbody.empty();
        $.each(data, function (i, item) {
            var tr = $('<tr>').append(
                $('<td>').append(
                	$('<a>').prop('href', '#').data('key', 'opportunity_id').attr('class', 'dataitem').text(item.opportunity_id)
                ),
                $('<td>').append(
                	$('<a>').prop('href', '#').data('key', 'customer_name').attr('class', 'dataitem').text(item.customer_name)
                ),
                $('<td>').text("$" + item.opportunity_value)
            );
            $tbody.append(tr);
        });
	};

	return {
		prepare: function (pred_run_date) {
			clusteredData = clusteredInput.clustereddata();
			clusterClass  = clusteredInput.clusterclasses();
			salesStage 	  = clusteredInput.salesstages();

			var data = preparePlotData(pred_run_date);
			return {
				data: data
			}
		},
		load_datalist: function (data, modalContainer) {
			loadDataList(data, modalContainer);
		},
		data: function () { return clusteredData; }
	}

}();