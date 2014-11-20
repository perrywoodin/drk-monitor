angular.module('app', [
	'ui.router',
	'ui.bootstrap',
	'templates.app',
	'templates.common',
	// Controller modules
	'posts',
	'user',
	// Resources interact with the API
	// For the code challenge there is not a persistence layer. 
	'resources',
]);


angular.module('app').config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function ($stateProvider, $urlRouterProvider, $locationProvider) {
	$locationProvider.html5Mode(false);
	$urlRouterProvider.otherwise('/posts/all'); 
}]);

angular.module('app').run(['$rootScope', '$log', '$location', '$state', '$stateParams', function($rootScope, $log, $location, $state, $stateParams) {

}]);

angular.module('app').controller('AppCtrl', ['$rootScope', '$scope', '$log', '$state', '$window', '$location', '$timeout', '$modal', 'UserService', function($rootScope, $scope, $log, $state, $window, $location, $timeout, $modal, UserService) {

	$scope.$state = $state;

}]);