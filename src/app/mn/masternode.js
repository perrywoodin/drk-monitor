angular.module('masternode', ['service.masternode'])

.config(['$stateProvider', function ($stateProvider) {
	$stateProvider.state('masternodes', {
		url: '/masternodes',
		templateUrl:'mn/masternodes.tpl.html',
		controller:'MasterNodesCtrl',
	})

		.state('masternodes.list',{
			url: '/list',
			templateUrl:'mn/masternodes-list.tpl.html'
		})
		
	;
}])


.controller('MasterNodesCtrl', ['$scope', '$log', '$state', '$modal', '$timeout', 'MasternodeService', function ($scope, $log, $state, $modal, $timeout, MasternodeService) {

	var focusInput = function(){
		// Focus the cursor on the jumbotron input
		$('.quick-input').focus();
	};

	focusInput();

	$scope.filter = {
		node_key:null,
		showAll: true
	};

	MasternodeService.getMyMasterNodes().then(function(response){
		// If My Masternodes is populated, 
		// default to showing only my nodes.
		if(response.length){
			$scope.filter['showAll'] = false;
		}
		$scope.myMasternodes = response;
	});

	var getMasterNodes = function(){
		return MasternodeService.getMasterNodes().then(function(response){
			$scope.masternodes = response;
		});
	};

	var requestTimeout = null;
	var reloadMasterNodes = function(){
		requestTimeout = $timeout(function(){
			loadMasterNodes();
		}, 300000);	// 5minutes	
	}; 

	var loadMasterNodes = function(){
		getMasterNodes()
			.then(reloadMasterNodes);
	};

	loadMasterNodes();

	$scope.toggleFilter = function(){
		$scope.filter['showAll'] = !$scope.filter['showAll'];
	};

	$scope.filterMNs = function(node){
		if($scope.filter.showAll){
			return true;
		}
		
		if($scope.myMasternodes.indexOf(node.MasternodeIP) === -1 || $scope.myMasternodes.indexOf(node.MNPubKey) === -1){
			return true;
		}
		
	};

	$scope.filterMyMasterNodes = function(node){
		if($scope.myMasternodes.indexOf(node.MasternodeIP) !== -1 || $scope.myMasternodes.indexOf(node.MNPubKey) !== -1){
			return true;
		}
	};

	$scope.addToMyList = function(node_key){
		MasternodeService.saveToMyMasterNodes(node_key);

		$scope.filter['showAll'] = false;
		$scope.filter['node_key'] = null;
	};

	$scope.removeFromMyList = function(node_key){
		MasternodeService.deleteFromMyMasterNodes(node_key);
	};

	
}])

;