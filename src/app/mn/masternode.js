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
		node_search:null
	};

	// Get all masternodes
	var getMasterNodes = function(){
		return MasternodeService.getMasterNodes().then(function(response){
			$scope.masternodes = response;
		});
	};

	// Get masternodes that have been saved to local storage.
	var getMyMasterNodes = function(){
		MasternodeService.getMyMasterNodes().then(function(response){
			$scope.myMasternodes = response;
			$scope.balanceTotal = MasternodeService.getMyMasterNodesBalanceTotal();
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
			.then(getMyMasterNodes)
			.then(reloadMasterNodes);
	};

	loadMasterNodes();

	$scope.filterMNs = function(node){
		if($scope.filter.showAll){
			return true;
		}
		
		if($scope.myMasternodes.indexOf(node.MasternodeIP) === -1 || $scope.myMasternodes.indexOf(node.MNPubKey) === -1){
			return true;
		}
		
	};

	$scope.addToMyList = function(node_key){
		MasternodeService.saveToMyMasterNodes(node_key);
		getMyMasterNodes();
		$scope.filter['node_key'] = null;
	};

	$scope.removeFromMyList = function(node){
		// For the time being, support IP Address or PubKey.
		// In the future, only the PubKey will be supported.
		MasternodeService.deleteFromMyMasterNodes(node.MasternodeIP);
		MasternodeService.deleteFromMyMasterNodes(node.MNPubKey);
		getMyMasterNodes();
	};


	// !!!!!!!!!!!!!!!!!!!! 
	// MasternodeSearch Modal
	// !!!!!!!!!!!!!!!!!!!! 
	var masternodeSearchModalOpen = false;
	var masternodeSearchModal = function(){
		if(!masternodeSearchModalOpen){
			masternodeSearchModalOpen = true;
			$scope.modalInstance = $modal.open({
				templateUrl: 'mn/masternodesSearch-modal.tpl.html',
				controller: 'MasternodeSearchModalCtrl',
				resolve:{
					masternodes: function(){
						return $scope.masternodes;
					}
				}
			}); 
			
			$scope.modalInstance.result.then(function() {
				masternodeSearchModalOpen = false;
			}, function() {
				// cancelled
			})['finally'](function(){
				// unset modalInstance to prevent double close of modal when $routeChangeStart
				$scope.modalInstance = undefined;
				getMyMasterNodes();
			});
		}
	};

	$scope.showMasternodeSearchModal = function(){
		masternodeSearchModal();
	};

	// Listen for addToMyList which may come from the Modal
	$scope.$on('addToMyList',function(event,node_key){
		$scope.addToMyList(node_key);
	});

	
}])

.controller('MasternodeSearchModalCtrl', ['$rootScope', '$scope', '$modalInstance', '$timeout', 'masternodes', 'MasternodeService', function ($rootScope, $scope, $modalInstance, $timeout, masternodes, MasternodeService) {
	
	$scope.masternodes = masternodes;

	$scope.cancel = function(){
		$modalInstance.close();	
	};

	$scope.addToMyList = function(node_key){
		$rootScope.$broadcast('addToMyList',node_key);
	};

}])
;