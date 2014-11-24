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
		ipaddress:null,
		showAll: true
	};

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

	MasternodeService.getMyMasterNodes().then(function(response){
		$scope.myMasternodes = response;
	});

	$scope.toggleFilter = function(){
		$scope.filter['showAll'] = !$scope.filter['showAll'];
	};

	$scope.filterMNs = function(node){
		if($scope.filter.showAll){
			return true;
		}
		
		if($scope.myMasternodes.indexOf(node.MasternodeIP) !== -1){
			return true;
		}
		
	};

	$scope.addToMyList = function(){
		var ipaddress = $scope.filter['ipaddress'];

		MasternodeService.saveToMyMasterNodes(ipaddress);

		$scope.filter['ipaddress'] = null;
	};

	$scope.removeFromMyList = function(ipaddress){
		MasternodeService.deleteFromMyMasterNodes(ipaddress);
	};

	
}])

;