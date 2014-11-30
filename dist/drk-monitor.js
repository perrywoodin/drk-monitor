/*! drk-monitor - v0.1.12 - 2014-11-30
 * http://drk.monitor.mn
 * Copyright (c) 2014 Perry Woodin <perrywoodin@gmail.com>;
 * Licensed 
 */
angular.module('app', [
	'ui.router',
	'ui.bootstrap',
	'angular-storage',
	'templates.app',
	'templates.common',
	// Application modules
	'masternode',
	'services'
]);


angular.module('app').config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function ($stateProvider, $urlRouterProvider, $locationProvider) {
	$locationProvider.html5Mode(false);
	$urlRouterProvider.otherwise('/masternodes/list'); 
}]);

angular.module('app').run(['$rootScope', '$log', '$location', '$state', '$stateParams', function($rootScope, $log, $location, $state, $stateParams) {

}]);

angular.module('app').controller('AppCtrl', ['$rootScope', '$scope', '$log', '$state', '$window', '$location', '$timeout', '$modal', function($rootScope, $scope, $log, $state, $window, $location, $timeout, $modal) {

	$scope.$state = $state; 

}]);
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

	
}])

.controller('MasternodeSearchModalCtrl', ['$scope', '$modalInstance', '$timeout', 'masternodes', 'MasternodeService', function ($scope, $modalInstance, $timeout, masternodes, MasternodeService) {
	
	$scope.masternodes = masternodes;

	$scope.cancel = function(){
		$modalInstance.close();	
	};

	$scope.addToMyList = function(node_key){
		MasternodeService.saveToMyMasterNodes(node_key);
	};

}])
;
angular.module('directives', []);

angular.module('resources', [ 
]);
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
angular.module('services', [ 
	'services.datetime'
]);
var jumboHeight = $('.jumbotron').outerHeight();
function parallax(){
    var scrolled = $(window).scrollTop();
    $('.bg').css('height', (jumboHeight-scrolled) + 'px');
}

$(window).scroll(function(e){
    parallax();
});
angular.module('templates.app', ['header.tpl.html', 'mn/masternodes-list.tpl.html', 'mn/masternodes.tpl.html', 'mn/masternodesSearch-modal.tpl.html']);

angular.module("header.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("header.tpl.html",
    "<nav class=\"navbar navbar-inverse navbar-fixed-top\" role=\"navigation\">\n" +
    "	<div class=\"container-fluid\">\n" +
    "		<div class=\"navbar-header\">\n" +
    "			<a href=\"#\" class=\"navbar-brand\">\n" +
    "				<img alt=\"DarkCoin MasterNode monitor\" src=\"img/darkcoin_logo_horizontal_lt_s.png\">\n" +
    "			</a>\n" +
    "		</div>\n" +
    "\n" +
    "		<p class=\"navbar-text pull-right hidden-xs\">MasterNode Monitor</p>\n" +
    "	</div>\n" +
    "</nav>");
}]);

angular.module("mn/masternodes-list.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("mn/masternodes-list.tpl.html",
    "<div class=\"container\">\n" +
    "\n" +
    "	<div class=\"alert alert-info\" role=\"alert\">\n" +
    "		<span class=\"pull-right\">({{myMasternodes.length}} of {{masternodes.length | number}} total MNs)</span>\n" +
    "		<span class=\"glyphicons server\"></span> <strong>My MasterNodes</strong>\n" +
    "	</div>\n" +
    "\n" +
    "	<table class=\"table table-condensed table-hover\">\n" +
    "		<thead>\n" +
    "			<tr>\n" +
    "				<th>IP Address</th>\n" +
    "				<th>Public Key</th>\n" +
    "				<th class=\"hidden-xs hidden-sm\">Next Check</th>\n" +
    "				<th class=\"hidden-xs hidden-sm\">Last Seen</th>\n" +
    "				<th>Received</th>\n" +
    "				<th></th>\n" +
    "			</tr>\n" +
    "		</thead>\n" +
    "\n" +
    "		<tbody>\n" +
    "			<tr ng-class=\"{danger:node.Portcheck.Result !== 'open'}\" ng-repeat=\"node in myMasternodes\">\n" +
    "				<td>{{node.MasternodeIP}}</td>\n" +
    "				<td>{{node.MNPubKey}}\n" +
    "					<span class=\"glyphicons circle_info\" ng-if=\"node.Portcheck.Result !== 'open'\" popover-placement=\"top\" popover=\"{{node.Portcheck.ErrorMessage}}\"></span></td>\n" +
    "				<td class=\"hidden-xs hidden-sm\">{{node.Portcheck.NextCheck}}</td>\n" +
    "				<td class=\"hidden-xs hidden-sm\">{{node.MNLastSeen}}</td>\n" +
    "				<td>{{node.Balance.Value | number:5}}</td>\n" +
    "				<td><button class=\"btn btn-default btn-xs\" ng-click=\"removeFromMyList(node)\"><span class=\"glyphicons circle_remove\" title=\"Remove from My Masternodes\"></span> Remove</button></td>\n" +
    "			</tr>\n" +
    "\n" +
    "		</tbody>\n" +
    "\n" +
    "	</table>	\n" +
    "\n" +
    "	<div>\n" +
    "		<button type=\"button\" class=\"btn btn-primary\" ng-click=\"showMasternodeSearchModal()\">Search MasterNodes</button>\n" +
    "	</div>\n" +
    "\n" +
    "</div>\n" +
    "");
}]);

angular.module("mn/masternodes.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("mn/masternodes.tpl.html",
    "<script>\n" +
    "	\n" +
    "var jumboHeight = $('.jumbotron').outerHeight();\n" +
    "function parallax(){\n" +
    "    var scrolled = $(window).scrollTop();\n" +
    "    $('.bg').css('height', (jumboHeight-scrolled) + 'px');\n" +
    "}\n" +
    "\n" +
    "$(window).scroll(function(e){\n" +
    "    parallax();\n" +
    "});\n" +
    "\n" +
    "</script>\n" +
    "\n" +
    "\n" +
    "<div class=\"bg\"></div>\n" +
    "<div class=\"jumbotron\">\n" +
    "\n" +
    "	<div class=\"jumbotron-input\">\n" +
    "		<div>\n" +
    "			<div>\n" +
    "				<label>Monitor By:</label>\n" +
    "				<input type=\"text\" placeholder=\"Public Key...\" class=\"quick-input\" ng-model=\"filter.node_key\" ng-keypress=\"($event.which === 13)?addToMyList(filter.node_key):0\"/>\n" +
    "			</div>\n" +
    "		</div>\n" +
    "	</div>\n" +
    "</div>\n" +
    "\n" +
    "<div ui-view></div>");
}]);

angular.module("mn/masternodesSearch-modal.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("mn/masternodesSearch-modal.tpl.html",
    "<div class=\"modal-header\">\n" +
    "	<h3 class=\"modal-title\">All MasterNodes</h3>\n" +
    "</div>\n" +
    "<div class=\"modal-body\">\n" +
    "\n" +
    "	<input type=\"text\" class=\"form-control input-sm\" placeholder=\"Filter MasterNodes...\" ng-model=\"filter.node_search\">\n" +
    "\n" +
    "	<table class=\"table table-condensed table-hover\">\n" +
    "	<thead>\n" +
    "		<tr>\n" +
    "			<th>IP Address</th>\n" +
    "			<th>Public Key</th>\n" +
    "			<th>Received</th>\n" +
    "			<th></th>\n" +
    "		</tr>\n" +
    "	</thead>\n" +
    "\n" +
    "	<tbody>\n" +
    "		<tr ng-class=\"{danger:node.Portcheck.Result !== 'open'}\" ng-repeat=\"node in (filteredNodes = (masternodes | filter: filter.node_search) | limitTo:10)\">\n" +
    "			<td>{{node.MasternodeIP}}</td>\n" +
    "			<td>{{node.MNPubKey}}</td>\n" +
    "			<td>{{node.Balance.Value | number:5}}</td>\n" +
    "			<td><button class=\"btn btn-default btn-xs\" ng-click=\"addToMyList(node.MNPubKey)\"><span class=\"glyphicons circle_plus\" title=\"Add to My Masternodes\"></span> Add</button></td>\n" +
    "		</tr>\n" +
    "	</tbody>\n" +
    "	</table>	\n" +
    "\n" +
    "	<div>\n" +
    "		Showing maximum 10 of {{masternodes.length | number}}. Use the Filter input above to find you node.\n" +
    "	</div>\n" +
    "\n" +
    "</div>\n" +
    "<div class=\"modal-footer\">\n" +
    "	<button class=\"btn btn-default\" ng-click=\"Close()\">Cancel</button>\n" +
    "</div>");
}]);

angular.module('templates.common', []);

