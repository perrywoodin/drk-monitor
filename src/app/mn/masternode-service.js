angular.module('service.masternode',['angular-storage'])

.factory('MasternodeService', ['$http', '$log', '$q', 'store', 'DateTimeService', function ($http, $log, $q, store, DateTimeService) {

	var MasterNodes = [];
	var myMasterNodes = [];
	var MasterNode = {};

	var containsMasterNode = function(node_key){
		var hasNode = false;
		myMasterNodes.forEach(function(mn){
			if(mn === node_key){
				hasNode = true;
				return hasNode;
			}
		});
		return hasNode;
	};
	
	var Service = {
		
		getMasterNodes: function(){
			//json/masternodes.json
			var request = $http.get('https://drk.mn/api/masternodes?balance=1&portcheck=1');
			return request.then(function(response){
				MasterNodes = response.data.data;

				MasterNodes.forEach(function(node){
					node.MNLastSeen = DateTimeService.deltaTimeStampHR(node.MNLastSeen,DateTimeService.currenttimestamp());

					node.Portcheck.NextCheck = DateTimeService.deltaTimeStampHR(node.Portcheck.NextCheck,DateTimeService.currenttimestamp());
				});

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

		saveToMyMasterNodes: function(node_key){			
			// UI may supply a list of node_keys.
			// Split the incoming node_key on , ; or [space]
			var myFilter = node_key.split(/[ ,;]+/);

			// Loop through myFilter and add to myMasterNodes
			// if it doesn't already exist.
			myFilter.forEach(function(node_key){
				if(!containsMasterNode(node_key)){
					myMasterNodes.push(node_key);
				}
			});

			// Put in local storage.
			store.set('mns',myMasterNodes);
		},

		deleteFromMyMasterNodes: function(node_key){
			var nodeIndex = myMasterNodes.indexOf(node_key);

			myMasterNodes.splice(nodeIndex,1);

			// Put in local storage.
			store.set('mns',myMasterNodes);
		}

	};

	return Service;
}]);