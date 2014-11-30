angular.module('service.masternode',['angular-storage'])

.factory('MasternodeService', ['$http', '$log', '$q', 'store', 'DateTimeService', function ($http, $log, $q, store, DateTimeService) {

	// Array of all masternodes
	var MasterNodes = [];
	// Detailed array of my masternodes
	var myMasterNodes = [];
	// Array of my masternode key
	var storeMasterNodeKeys = [];

	var MasterNode = {};

	var containsMasterNode = function(node_key){
		var hasNode = false;
		storeMasterNodeKeys.forEach(function(mn){
			if(mn === node_key){
				hasNode = true;
				return hasNode;
			}
		});
		return hasNode;
	};
	
	var Service = {
		
		// Get all the Masternodes from an API
		getMasterNodes: function(){
			// curl -o masternodes.json https://drk.mn/api/masternodes?balance=1&portcheck=1
			// json/masternodes.json
			// https://drk.mn/api/masternodes?balance=1&portcheck=1 
			var request = $http.get('https://drk.mn/api/masternodes?balance=1&portcheck=1');
			return request.then(function(response){
				MasterNodes = response.data.data;

				MasterNodes.forEach(function(node){
					node.MNLastSeen = DateTimeService.deltaTimeStampHR(node.MNLastSeen,DateTimeService.currenttimestamp());

					node.Portcheck.NextCheck = DateTimeService.deltaTimeStampHR(node.Portcheck.NextCheck,DateTimeService.currenttimestamp());

					node.Balance.Value = node.Balance.Value - 1000;
				});

				return MasterNodes;
			});
		},

		// Get a subset of all the masternodes.
		getMyMasterNodes: function(){
			var localStoreageMasterNodes = store.get('mns');
			
			if(localStoreageMasterNodes){
				storeMasterNodeKeys = localStoreageMasterNodes;
			}

			myMasterNodes = [];

			MasterNodes.forEach(function(node){
				if(storeMasterNodeKeys.indexOf(node.MasternodeIP) !== -1 || storeMasterNodeKeys.indexOf(node.MNPubKey) !== -1){
					myMasterNodes.push(node);
				}
			});
			
			var deferred = $q.defer();
			deferred.resolve(myMasterNodes);

			return deferred.promise;
		},

		// Save a masternode key to local storage.
		saveToMyMasterNodes: function(node_key){			
			// UI may supply a list of node_keys.
			// Split the incoming node_key on , ; or [space]
			var myFilter = node_key.split(/[ ,;]+/);

			// Loop through myFilter and add to myMasterNodes
			// if it doesn't already exist.
			myFilter.forEach(function(node_key){
				if(!containsMasterNode(node_key)){
					storeMasterNodeKeys.push(node_key);
				}
			});

			// Put in local storage.
			store.set('mns',storeMasterNodeKeys);
		},

		// Remove a masternode key from local storage.
		deleteFromMyMasterNodes: function(node_key){
			var nodeIndex = storeMasterNodeKeys.indexOf(node_key);

			if(nodeIndex !== -1){
				storeMasterNodeKeys.splice(nodeIndex,1);

				// Put in local storage.
				store.set('mns',storeMasterNodeKeys);
			}
		}

	};

	return Service;
}]);