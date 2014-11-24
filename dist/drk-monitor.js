/*! drk-monitor - v - 2014-11-24
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
	// Resources interact with the API
	'resources',
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
angular.module('templates.app', ['header.tpl.html', 'mn/masternodes.tpl.html']);

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
    "		<p class=\"navbar-text pull-right\">MasterNode Monitor</p>\n" +
    "	</div>\n" +
    "</nav>");
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
    "\n" +
    "\n" +
    "<div ui-view></div>");
}]);

angular.module('templates.common', []);

