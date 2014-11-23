/*! drk-monitor - v - 2014-11-23
 * Copyright (c) 2014 Perry Woodin <perrywoodin@gmail.com>;
 * Licensed 
 */
angular.module('app', [
	'ui.router',
	'ui.bootstrap',
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
angular.module('service.masternode',[])

.factory('MasternodeService', ['$http', '$log', '$q', function ($http, $log, $q) {

	var allPosts = [];
	var Posts = [];
	var Post = {
		id: null,
		parent:null,
		post:null,
		type:null,
		datetime:null,
		like:false,
		response:[],
		image:null,
		user:null
	};
	
	var Service = {

		getPost: function(){
			var newPost = angular.copy(Post);
			return newPost;
		},
		
		getPosts: function(){
			// If Posts are already loaded, don't get 
			// them from the json file. Instead, return
			// the existing posts as a promise. This is 
			// a little workaround since we don't have a 
			// persistence layer. 
			if(Posts.length){
				var deferred = $q.defer();
				deferred.resolve(Posts);
				return deferred.promise;
			} else {
				var request = $http.get('json/posts.json');
				return request.then(function(response){
					allPosts = response.data.posts;
					allPosts.forEach(function(post){
						if(!post.parent){
							Posts.push(post);
						}
					});
					return Posts;
				});
			}
		},

		getReplies: function(id){
			var Replies = [];
			allPosts.forEach(function(post){
				if(post.parent === id){
					Replies.push(post);
				}
			});
			return Replies;
		},

		add:function(post){
			if(!post.post){
				return;
			}
			var newPost = angular.copy(Post);
			var Today = new Date();
			var id = Math.random().toString(36).substring(7);

			
			newPost['id'] = id;
			newPost['user'] = UserService.getUser();
			newPost['datetime'] = Date.parse(Today);
			newPost['post'] = post.post;

			Posts.unshift(newPost);
		},

		reply:function(post,replyto_post){
			var newPost = angular.copy(Post);
			var Today = new Date();
			var id = Math.random().toString(36).substring(7);
			var parentPost = replyto_post;

			newPost['id'] = id;
			newPost['post'] = post.post;
			newPost['parent'] = parentPost.id;
			newPost['user'] = UserService.getUser();
			newPost['datetime'] = Date.parse(Today);
			// We don't have a persistence layer, so
			// put this new post into the allPosts array.
			allPosts.unshift(newPost);
			return newPost;
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
}]);

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
    "<!-- \n" +
    "	!!!!!!!!!!!!!!!!!!!! \n" +
    "	I am the top of each post page. \n" +
    "	All Posts || Photos || Vidoes\n" +
    "\n" +
    "	I contain the JumboTron and quick post input box.\n" +
    "	!!!!!!!!!!!!!!!!!!!! \n" +
    "-->\n" +
    "<div class=\"bg\"></div>\n" +
    "<div class=\"jumbotron\">\n" +
    "\n" +
    "	<div class=\"jumbotron-input\">\n" +
    "		<div>\n" +
    "			<div>\n" +
    "				<label>Filter By:</label>\n" +
    "				<input type=\"text\" placeholder=\"IP Address...\" class=\"quick-input\" ng-model=\"newPost.post\" ng-keypress=\"($event.which === 13)?quickPost():0\"/>\n" +
    "			</div>\n" +
    "		</div>\n" +
    "	</div>\n" +
    "\n" +
    "\n" +
    "<div ui-view></div>");
}]);

angular.module('templates.common', []);

