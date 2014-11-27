/*! drk-monitor - v0.1.9 - 2014-11-27
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
angular.module('templates.app', ['header.tpl.html', 'mn/masternodes-list.tpl.html', 'mn/masternodes.tpl.html']);

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
    "	<table class=\"table table-condensed table-hover\">\n" +
    "		<thead>\n" +
    "			<tr>\n" +
    "				<th>IP Address</th>\n" +
    "				<th>Public Key</th>\n" +
    "				<th class=\"hidden-xs hidden-sm\">Next Check</th>\n" +
    "				<th class=\"hidden-xs hidden-sm\">Last Seen</th>\n" +
    "				<th>Balance</th>\n" +
    "			</tr>\n" +
    "		</thead>\n" +
    "\n" +
    "		<tbody>\n" +
    "			<tr ng-if=\"myMasternodes.length\">\n" +
    "				<td colspan=\"100%\" class=\"info\">\n" +
    "					My MasterNodes\n" +
    "				</td>\n" +
    "			</tr>\n" +
    "			<tr ng-class=\"{danger:node.Portcheck.Result !== 'open'}\" ng-repeat=\"node in masternodes | filter: filterMyMasterNodes\">\n" +
    "				<td>{{node.MasternodeIP}}:{{node.MasternodePort}}</td>\n" +
    "				<td>{{node.MNPubKey}}</td>\n" +
    "				<td class=\"hidden-xs hidden-sm\">{{node.Portcheck.NextCheck}}</td>\n" +
    "				<td class=\"hidden-xs hidden-sm\">{{node.MNLastSeen}}</td>\n" +
    "				<td>{{node.Balance.Value | number:5}}</td>\n" +
    "				<td><button class=\"btn btn-default btn-xs\" ng-click=\"removeFromMyList(node)\"><span class=\"glyphicons circle_remove\" title=\"Remove from My Masternodes\"></span> Remove</button></td>\n" +
    "			</tr>\n" +
    "\n" +
    "			<tr>\n" +
    "				<td colspan=\"100%\" class=\"info\">\n" +
    "					All MasterNodes\n" +
    "				</td>\n" +
    "			</tr>\n" +
    "			<tr ng-class=\"{danger:node.Portcheck.Result !== 'open'}\" ng-repeat=\"node in masternodes | filter: filterMNs\">\n" +
    "				<td>{{node.MasternodeIP}}:{{node.MasternodePort}}</td>\n" +
    "				<td>{{node.MNPubKey}}</td>\n" +
    "				<td class=\"hidden-xs hidden-sm\">{{node.Portcheck.NextCheck}}</td>\n" +
    "				<td class=\"hidden-xs hidden-sm\">{{node.MNLastSeen}}</td>\n" +
    "				<td>{{node.Balance.Value | number:5}}</td>\n" +
    "				<td><button class=\"btn btn-default btn-xs\" ng-click=\"addToMyList(node.MNPubKey)\"><span class=\"glyphicons circle_plus\" title=\"Add to My Masternodes\"></span> Add</button></td>\n" +
    "			</tr>\n" +
    "		</tbody>\n" +
    "\n" +
    "	</table>	\n" +
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
    "				<label>Filter By:</label>\n" +
    "				<input type=\"text\" placeholder=\"Public Key or IP Address...\" class=\"quick-input\" ng-model=\"filter.node_key\" ng-keypress=\"($event.which === 13)?addToMyList(filter.node_key):0\"/>\n" +
    "			</div>\n" +
    "		</div>\n" +
    "	</div>\n" +
    "</div>\n" +
    "\n" +
    "<div ui-view></div>");
}]);

angular.module('templates.common', []);

