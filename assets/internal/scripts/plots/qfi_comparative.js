var QFIComparativePlot = function () {

	//// INITIALIZE
	//
	var clusteredData,
		clusterClass,
		salesStage;

	var preparePlotData = function (pred_run_date, opportunity_id) {
		var data = [],
			subdata = [];

	    // data filtered by pred_run_date
	    var _clusterdata = $.grep(clusteredData, function (obj, i) {
	        return obj.pred_run_date===pred_run_date;
	      });

	    var a1001 = {'name': 'Chosen Opportunity', 'data': []},
	    	a1002 = {'name': 'Best in Salestage 3', 'data': []},
	    	a1003 = {'name': 'Best in all Opportunities', 'data': []};

	    if (_clusterdata < 1) {
	    	data.push(a1001);
	    	data.push(a1002);
	    	data.push(a1003);
	    	return data;
	    }
    	// A1001 is the opportunity to be compared. Assume this is in Sales Stage3
		var opp = $.grep(_clusterdata, function (obj, i) { return obj.opportunity_id === opportunity_id})[0];	
		a1001['data'] = [{
				'name': opp.opportunity_id,
				'y': opp.qfi_web_intra
			}, {
				'name': opp.opportunity_id,
				'y': opp.qfi_hd_intra
			}, {
				'name': opp.opportunity_id,
				'y': opp.qfi_crm_intra
			}, {
				'name': opp.opportunity_id,
				'y': opp.qfi_sh_intra
			}, {
				'name': opp.opportunity_id,
				'y': opp.qfi_sm_intra
			}];
		data.push(a1001);

		// A1002 is the best in class in Sales Stage 3
		var _clusterStage3 = $.grep(_clusterdata, function (obj, i) { return obj.StageSort === 3});

		var maxSS3web = Math.max.apply(Math, $.map(_clusterStage3, function (obj, index) { return obj.qfi_web_intra }));
		var maxSS3webName = $.map(_clusterStage3, function (obj, index) {
			if (obj.qfi_web_intra === maxSS3web) {
				return obj.opportunity_id;
			}
		}).join();

		var maxSS3hd = Math.max.apply(Math, $.map(_clusterStage3, function (obj, index) { return obj.qfi_hd_intra }));
		var maxSS3hdName = $.map(_clusterStage3, function (obj, index) {
			if (obj.qfi_hd_intra === maxSS3hd) {
				return obj.opportunity_id;
			}
		}).join();

		var maxSS3crm = Math.max.apply(Math, $.map(_clusterStage3, function (obj, index) { return obj.qfi_crm_intra }));
		var maxSS3crmName = $.map(_clusterStage3, function (obj, index) {
			if (obj.qfi_crm_intra === maxSS3crm) {
				return obj.opportunity_id;
			}
		}).join();

		var maxSS3sh = Math.max.apply(Math, $.map(_clusterStage3, function (obj, index) { return obj.qfi_sh_intra }));
		var maxSS3shName = $.map(_clusterStage3, function (obj, index) {
			if (obj.qfi_sh_intra === maxSS3sh) {
				return obj.opportunity_id;
			}
		}).join();

		var maxSS3sm = Math.max.apply(Math, $.map(_clusterStage3, function (obj, index) { return obj.qfi_sm_intra }));
		var maxSS3smName = $.map(_clusterStage3, function (obj, index) {
			if (obj.qfi_sm_intra === maxSS3sm) {
				return obj.opportunity_id;
			}
		}).join();

		a1002['data'] = [{
				'name': maxSS3webName,
				'y': maxSS3web
			}, {
				'name': maxSS3hdName,
				'y': maxSS3hd
			}, {
				'name': maxSS3crmName,
				'y': maxSS3crm
			}, {
				'name': maxSS3shName,
				'y': maxSS3sh
			}, {
				'name': maxSS3smName,
				'y': maxSS3sm
		}];
		data.push(a1002);

		// A1003 is the best in class across all opportunities.
		var maxweb = Math.max.apply(Math, $.map(_clusterdata, function (obj, index) { return obj.qfi_web_intra; }));
		var maxwebName = $.map(_clusterdata, function (obj, index) {
			if (obj.qfi_web_intra === maxweb) {
				return obj.opportunity_id;
			}
		}).join('<br>');

		var maxhd = Math.max.apply(Math, $.map(_clusterdata, function (obj, index) { return obj.qfi_hd_intra; }));
		var maxhdName = $.map(_clusterdata, function (obj, index) {
			if (obj.qfi_hd_intra === maxhd) {
				return obj.opportunity_id;
			}
		}).join('<br>');

		var maxcrm = Math.max.apply(Math, $.map(_clusterdata, function (obj, index) { return obj.qfi_crm_intra; }));
		var maxcrmName = $.map(_clusterdata, function (obj, index) {
			if (obj.qfi_crm_intra === maxcrm) {
				return obj.opportunity_id;
			}
		}).join('<br>');

		var maxsh = Math.max.apply(Math, $.map(_clusterdata, function (obj, index) { return obj.qfi_sh_intra; }));
		var maxshName = $.map(_clusterdata, function (obj, index) {
			if (obj.qfi_sh_intra === maxsh) {
				return obj.opportunity_id;
			}
		}).join('<br>');

		var maxsm = Math.max.apply(Math, $.map(_clusterdata, function (obj, index) { return obj.qfi_sm_intra; }));
		var maxsmName = $.map(_clusterdata, function (obj, index) {
			if (obj.qfi_sm_intra === maxsm) {
				return obj.opportunity_id;
			}
		}).join('<br>');

		a1003['data'] = [{
				'name': maxwebName,
				'y': maxweb
			}, {
				'name': maxhdName,
				'y': maxhd
			}, {
				'name': maxcrmName,
				'y': maxcrm
			}, {
				'name': maxshName,
				'y': maxsh
			}, {
				'name': maxsmName,
				'y': maxsm
		}];
		data.push(a1003);

		return data;
	}

	return {
		prepare: function (pred_run_date, opportunity_id) {
			clusteredData = clusteredInput.clustereddata();
			clusterClass  = clusteredInput.clusterclasses();
			salesStage 	  = clusteredInput.salesstages();

			var data = preparePlotData(pred_run_date, opportunity_id);
			return {
				data: data
			}
		}
	}

}();