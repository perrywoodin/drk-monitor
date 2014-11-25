angular.module('services.datetime',[])

.factory('DateTimeService', ['$log', function ($log) {
	
	var diffHR = function(diff) {
		var s = Math.floor( diff % 60 );
		var m = Math.floor( diff / 60 % 60 );
		var h = Math.floor( diff / 3600 % 24 );
		var d = Math.floor( diff / 86400 % 7 );
		var w = Math.floor( diff / 604800 );
		var rtxt = '';
		if (w > 0) {
		rtxt += w+'w';
		}
		if (d > 0) {
		rtxt += d+'d';
		}
		if (h > 0) {
		rtxt += h+'h';
		}
		if (m > 0) {
		rtxt += m+'m';
		}
		if (s > 0) {
		rtxt += s+'s';
		}
		return rtxt;
	};

	var Service = {

		currenttimestamp: function() {
			return Math.round(new Date().getTime() / 1000);
		}, 

		deltaTimeStampHR: function(ts1,ts2) {
			var diff = Math.abs( ts2 - ts1 );
			return diffHR(diff);
		}

	};

	return Service;
}]);