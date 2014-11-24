angular.module('service.masternode',['angular-storage'])

.factory('MasternodeService', ['$http', '$log', '$q', 'store', function ($http, $log, $q, store) {

	var MasterNodes = [];
	var myMasterNodes = [1,2,3];
	var MasterNode = {};
	
	var Service = {
		
		getMasterNodes: function(){
			var request = $http.get('json/masternodes.json');
			return request.then(function(response){
				MasterNodes = response.data.data;
				return MasterNodes;
			});
			
		},

		getMyMasterNodes: function(){
			var storedMasternodes = store.get('mns');
			myMasterNodes = storedMasternodes;
			var deferred = $q.defer();
			deferred.resolve(myMasterNodes);
			return deferred.promise;
		},

		saveToMyMasterNodes: function(ipaddress){
			store.set('mns',myMasterNodes);
		},

		deleteFromMyMasterNodes: function(){

		}

	};

	return Service;
}]);