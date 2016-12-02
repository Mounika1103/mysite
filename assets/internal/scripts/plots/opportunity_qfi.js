var OpportunityQFI = function () {

	//// INITIALIZE DATA
	//
	var clusteredData,
		clusterClass,
		salesStage;

	var preparePlotData = function (pred_run_date, opportunities) {
		var data = [],
			subdata = [];

		var filteredData = $.grep(clusteredData, function (obj, i) {
			return obj.pred_run_date===pred_run_date; });

		var qfiOverall = {'name': 'OVERALL', 'data': []},
			qfiWebInter = {'name': 'WEB INTER', 'data': []},
			qfiHdInter = {'name': 'HD INTER', 'data': []},
			qfiCrmInter = {'name': 'CRM INTER', 'data': []},
			qfiShInter = {'name': 'SH INTER', 'data': []},
			qfiSmInter = {'name': 'SM INTER', 'data': []};

		$.each(opportunities, function (i, opportunity_id) {

			var opportunity = $.grep(filteredData, function (obj, i) { return obj.opportunity_id === opportunity_id })[0];
			// populate
			qfiOverall['data'].push(opportunity.qfi_overall);
			qfiWebInter['data'].push(opportunity.qfi_web_inter);
			qfiHdInter['data'].push(opportunity.qfi_hd_inter);
			qfiCrmInter['data'].push(opportunity.qfi_crm_inter);
			qfiShInter['data'].push(opportunity.qfi_sh_inter);
			qfiSmInter['data'].push(opportunity.qfi_sm_inter);

		});

		data.push(qfiOverall);
		data.push(qfiWebInter);
		data.push(qfiHdInter);
		data.push(qfiCrmInter);
		data.push(qfiShInter);
		data.push(qfiSmInter);

		return data;
	};

	return {
		prepare: function (pred_run_date, opportunities) {
			clusteredData = clusteredInput.clustereddata();
			clusterClass  = clusteredInput.clusterclasses();
			salesStage 	  = clusteredInput.salesstages();

			var data = preparePlotData(pred_run_date, opportunities);
			return {
				data: data
			}
		}
	}

}();
