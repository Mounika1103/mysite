var QFIPerformanceOverTime = function () {

	//// INITIALIZE
	//
	var clusteredData,
		clusterClass,
		salesStage;

	var preparePlotData = function (opportunityId, dateList) {
		var data = [],
			subdata = [];

		// filter data by opportunity_id
		var opportunityData = $.grep(clusteredData, function (obj, index) {
			return obj.opportunity_id === opportunityId});

		// populate QFIs
		var qfiOverall=[], qfiWeb=[], qfiHd=[], qfiCrm=[], qfiSh=[], qfiSm=[];
		$.each(dateList, function (index, dateString) {
			// filter opportunity by pred_run_date
			var opportunity = $.grep(opportunityData, function (obj, index) {
				return obj.pred_run_date===dateString });

			if (opportunity.length > 0) {
				qfiOverall.push(opportunity[0].qfi_overall);
				qfiWeb.push(opportunity[0].qfi_web_intra);
				qfiHd.push(opportunity[0].qfi_hd_intra);
				qfiCrm.push(opportunity[0].qfi_crm_intra);
				qfiSh.push(opportunity[0].qfi_sh_intra);
				qfiSm.push(opportunity[0].qfi_sm_intra);
			} else {
				qfiOverall.push(0);
				qfiWeb.push(0);
				qfiHd.push(0);
				qfiCrm.push(0);
				qfiSh.push(0);
				qfiSm.push(0);
			}
		});

		// add to JSON
		data.push({'name': 'QFI OVERALL', 'data': qfiOverall});
		data.push({'name': 'QFI WEB', 'data': qfiWeb});
		data.push({'name': 'QFI HD', 'data': qfiHd});
		data.push({'name': 'QFI CRM', 'data': qfiCrm});
		data.push({'name': 'QFI SH', 'data': qfiSh});
		data.push({'name': 'QFI SM', 'data': qfiSm});

		return {'labels': dateList, 'data': data};
	}

	return {
		prepare: function (opportunityId, dateList) {
			clusteredData = clusteredInput.clustereddata();
			clusterClass  = clusteredInput.clusterclasses();
			salesStage 	  = clusteredInput.salesstages();

			var data = preparePlotData(opportunityId, dateList);
			return {
				data: data
			}
		}
	}

}();