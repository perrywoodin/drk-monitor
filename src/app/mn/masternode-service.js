angular.module('service.masternode',['angular-storage'])

.factory('MasternodeService', ['$http', '$log', '$q', 'store', function ($http, $log, $q, store) {

	var MasterNodes = [];
	var myMasterNodes = [];
	var MasterNode = {};

	var containsMasterNode = function(ipaddress){
		var hasNode = false;
		myMasterNodes.forEach(function(mn){
			if(mn === ipaddress){
				hasNode = true;
				return hasNode;
			}
		});
		return hasNode;
	};
	
	var Service = {
		
		getMasterNodes: function(){
			var request = $http.get('https://drk.mn/api/masternodes?balance=1');
			return request.then(function(response){
				MasterNodes = response.data.data;
				return MasterNodes;
			});
			
		},

		getMyMasterNodes: function(){
			var storedMasternodes = store.get('mns');
			
			if(storedMasternodes){
				myMasterNodes = storedMasternodes;
			}
			
			var deferred = $q.defer();
			deferred.resolve(myMasterNodes);

			return deferred.promise;
		},

		saveToMyMasterNodes: function(ipaddress){
			
			// UI may supply a list of IP addresses.
			// Split the incoming ipaddress on , ; or [space]
			var myFilter = ipaddress.split(/[ ,;]+/);

			// Loop through myFilter and add to myMasterNodes
			// if it doesn't already exist.
			myFilter.forEach(function(ipaddress){
				if(!containsMasterNode(ipaddress)){
					myMasterNodes.push(ipaddress);
				}
			});

			// Put in local storage.
			store.set('mns',myMasterNodes);
		},

		deleteFromMyMasterNodes: function(ipaddress){
			var ipIndex = myMasterNodes.indexOf(ipaddress);

			myMasterNodes.splice(ipIndex,1);

			// Put in local storage.
			store.set('mns',myMasterNodes);
		}

	};

	return Service;
}]);