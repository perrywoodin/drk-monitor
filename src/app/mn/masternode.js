angular.module('masternode', ['service.masternode'])

.config(['$stateProvider', function ($stateProvider) {
	$stateProvider.state('masternodes', {
		url: '/masternodes',
		templateUrl:'mn/masternodes.tpl.html',
		controller:'MasterNodesCtrl',
	})

		.state('masternodes.list',{
			url: '/list',
			template:'mn/masternodes-list.tpl.html'
		})
		
	;
}])


.controller('MasterNodesCtrl', ['$scope', '$log', '$state', '$modal', 'MasternodeService', function ($scope, $log, $state, $modal, MasternodeService) {

	var focusInput = function(){
		// Focus the cursor on the jumbotron input
		$('.quick-input').focus();
	};

	focusInput();

	$scope.filter = {
		ipaddress:null
	};

	$scope.masternodes = MasternodeService.getMasterNodes().then(function(response){
		$log.log(response);
	});

	$scope.myMasternodes = MasternodeService.getMyMasterNodes().then(function(response){
		$log.log(response);
	});

	$scope.addToMyList = function(){
		var ipaddress = $scope.filter['ipaddress'];

		MasternodeService.saveToMyMasterNodes(ipaddress);

		$scope.filter['ipaddress'] = null;
	};

	
}])

;