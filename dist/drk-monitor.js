/*! drk-monitor - v0.0.4 - 2014-11-25
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
	'masternode'
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
		
		if($scope.myMasternodes.indexOf(node.MasternodeIP) !== -1){
			return true;
		}
		
	};

	$scope.addToMyList = function(){
		var ipaddress = $scope.filter['ipaddress'];

		MasternodeService.saveToMyMasterNodes(ipaddress);

		$scope.filter['showAll'] = false;
		$scope.filter['ipaddress'] = null;
	};

	$scope.removeFromMyList = function(ipaddress){
		MasternodeService.deleteFromMyMasterNodes(ipaddress);
	};

	
}])

;
angular.module('directives', []);

angular.module('resources', [ 
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
    "<div class=\"container row\">\n" +
    "\n" +
    "	<div class=\"col-sm-3\">\n" +
    "\n" +
    "		<button class=\"btn btn-default btn-xs\" ng-click=\"toggleFilter()\">\n" +
    "			<span ng-if=\"!filter.showAll\">Show All</span>\n" +
    "			<span ng-if=\"filter.showAll\">Filter Mine</span>\n" +
    "		</button>\n" +
    "		\n" +
    "		<h5>My MasterNodes</h5>\n" +
    "\n" +
    "\n" +
    "		<div ng-class=\"{'text-muted':filter.showAll}\" ng-repeat=\"node in myMasternodes\">\n" +
    "			<a class=\"pull-right\" title=\"Remove {{node}}\" href=\"#\" ng-click=\"removeFromMyList(node)\"><span class=\"glyphicons bin\"></span></a>\n" +
    "			{{node}}\n" +
    "		</div>\n" +
    "	</div>\n" +
    "\n" +
    "	<div class=\"col-sm-9\">\n" +
    "\n" +
    "		<table class=\"table table-condensed table-hover\">\n" +
    "		<thead>\n" +
    "			<tr>\n" +
    "				<th>IP Address</th>\n" +
    "				<th>Public Key</th>\n" +
    "				<th>Balance</th>\n" +
    "			</tr>\n" +
    "		</thead>		\n" +
    "		<tbody>\n" +
    "			<tr ng-repeat=\"node in masternodes | filter: filterMNs\">\n" +
    "				<td>{{node.MasternodeIP}}:{{node.MasternodePort}}</td>\n" +
    "				<td>{{node.MNPubKey}}</td>\n" +
    "				<td>{{node.Balance.Value}}</td>\n" +
    "			</tr>\n" +
    "		</tbody>\n" +
    "\n" +
    "		</table>		\n" +
    "\n" +
    "	</div>\n" +
    "</div>\n" +
    "\n" +
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
    "				<input type=\"text\" placeholder=\"IP Address...\" class=\"quick-input\" ng-model=\"filter.ipaddress\" ng-keypress=\"($event.which === 13)?addToMyList():0\"/>\n" +
    "			</div>\n" +
    "		</div>\n" +
    "	</div>\n" +
    "</div>\n" +
    "\n" +
    "<div ui-view></div>");
}]);

angular.module('templates.common', []);

