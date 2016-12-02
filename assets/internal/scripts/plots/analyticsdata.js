/* ANALYTICS DATA JS
   @desc     : contains the endpoints for
   			   retrieving analytics data.
 */

var clusteredInput = function () {

	////// INITIALIZE DATA
	var clusteredDATA,
		clusterCLASSES,
		salesSTAGES;

	////// ANALYTICAL PLOTS ENDPOINTS
	var analyticalPlotsEndpoint = '/api/clients/analytics/classification/';
	var clusteredDataAPI        = analyticalPlotsEndpoint + 'clustered_files/',
		clusterClassesAPI       = analyticalPlotsEndpoint + 'cluster_class/',
		salesStagesAPI          = analyticalPlotsEndpoint + 'sales_stage/';

	//// CLUSTERED FILES
	// get the clustered data from the server via
	// ajax request.
	var getClusteredData = function () {
		var result;
		$.ajax({
			url    : clusteredDataAPI,
			async  : false,
			type   : 'GET',
			success: function (data) { result=data; }
		});
		return result;
	}

	//// CLUSTER CLASSES
	// get the cluster classes from the server via
	// ajax request.
	var getClusterClasses = function () {
		var result;
		$.ajax({
			url    : clusterClassesAPI,
			async  : false,
			type   : 'GET',
			success: function (data) { result=data; }
		});
		return result;
	}

	//// SALES STAGES
	// get the sale stages from the server via
	// ajax request.
	var getSalesStages = function () {
		var result;
		$.ajax({
			url    : salesStagesAPI,
			async  : false,
			type   : 'GET',
			success: function (data) { result=data; }
		});
		return result;
	}

	return {
		init: function () {
			clusteredDATA = getClusteredData();
			clusterCLASSES = getClusterClasses();
			salesSTAGES = getSalesStages();
		},
		clustereddata: function () { return clusteredDATA; },
		clusterclasses: function () { return clusterCLASSES; },
		salesstages: function () { return salesSTAGES; }
	}
}();