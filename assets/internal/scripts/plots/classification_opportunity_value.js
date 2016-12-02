var ClassificationOppValue = function () {

	//// INITIALIZE DATA
	//
	var clusteredData,
		clusterClass,
		salesStage;

	var getDate = function (dateString) { return new Date(dateString); }

	var preparePlotData = function (dateString) {
		var data = [],
			subdata = [],
			TOTALOpportunityValues = 0;

		var dateFilter = getDate(dateString);
		///// SHOW DATA BY OPPORTUNITY_VALUE
		//
		$.each(clusterClass, function (index, cluster) {

			// filter clustered data by cluster class
			var cdata = $.grep(clusteredData, function (obj, index) {
				var runDate = getDate(obj.pred_run_date);
				return obj.cluster_class===cluster.id && runDate.getTime() === dateFilter.getTime();
			});

			// calculate total opportunity_value per cluster class
			var opportunityValues = 0;
			$.each(cdata, function (index, item) {
				return opportunityValues += parseInt(item.opportunity_value); });

			// add the cluster to the payload
			data.push({
				'name'     : cluster.cluster_class_name,
				'drilldown': cluster.cluster_class_name,
				'value'    : opportunityValues,
			});

			////////// FILTER SUB DATA
			//
			var ddData = {
				'name': cluster.cluster_class_name,
				'id'  : cluster.cluster_class_name,
				'data': []
			};

			// cluster sub data per sales stage
			$.each(salesStage, function (index, ss) {

				// filter data by sales stage
				var ssdata = $.grep(cdata, function (obj, index) { return obj.StageSort===ss.id });
				var ssOpportunityValues = 0;
				$.each(ssdata, function (index, item) { return ssOpportunityValues += parseInt(item.opportunity_value) });
				// add to drilldown data
				percentage = (parseFloat(ssOpportunityValues) / parseFloat(opportunityValues));
				ddData['data'].push({
					'name': ss.name,
					'download_key': 'StageSort',
					'download_value': ss.id,
					'pred_run_date': dateString,
					'cluster_class': cluster.id,
					'y':percentage,
					'value': ssOpportunityValues.toLocaleString(),
					'ssdata': ssdata,
					'modal': {
						'container': 'basic',
					}});
			});
			subdata.push(ddData);

			TOTALOpportunityValues += opportunityValues;
		});

		// Assign percentage for the main PIE
		$.each(data, function (index, item) {
			$.extend(item, {'y': (parseFloat(item.value) / TOTALOpportunityValues) * 100});
			item['value'] = item['value'].toLocaleString();
		});

		return {
			data: data,
			subdata: subdata
		};
	};

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
		prepare: function (dateString) {
			clusteredData = clusteredInput.clustereddata();
			clusterClass  = clusteredInput.clusterclasses();
			salesStage 	  = clusteredInput.salesstages();

			var data = preparePlotData(dateString);
			return {
				data: data.data,
				subdata: data.subdata
			}
		},
		load_datalist: function (data, container) {
			return loadDataList(data, container);
		},
		data: function () { return clusteredData; }
	}

}();