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