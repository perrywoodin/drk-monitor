angular.module('user', [])

.config(['$stateProvider', function ($stateProvider) {
	$stateProvider.state('user', {
		url: '/user',
		templateUrl:'user/user.tpl.html',
		controller:'UserCtrl',
	});
}])

.controller('UserCtrl', ['$scope', '$log', '$state', 'UserService', function ($scope, $log, $state, UserService) {

	$scope.CurrentUser = UserService.getUser();

	$scope.save = function(){
		UserService.saveUser($scope.CurrentUser);
		// For purpose of the code review: 
		// Dump the CurrentUser so we can see the udpates.
		$log.info(UserService.getUser());
		$scope.form.$setPristine();
	};

}]); 