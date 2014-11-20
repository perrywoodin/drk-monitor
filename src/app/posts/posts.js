angular.module('posts', ['posts.ssPost'])

.config(['$stateProvider', function ($stateProvider) {
	$stateProvider.state('posts', {
		url: '/posts',
		templateUrl:'posts/posts.tpl.html',
		controller:'PostsCtrl',
	})

		.state('posts.all',{
			url: '/all',
			templateUrl:'posts/posts-all.tpl.html'
		})
		
		.state('posts.photos',{
			url: '/photos',
			templateUrl:'posts/posts-photos.tpl.html'
		})

		.state('posts.videos',{
			url: '/videos',
			templateUrl:'posts/posts-videos.tpl.html'
		})
	;
}])

.controller('PostsCtrl', ['$scope', '$log', '$state', '$modal', 'PostService', function ($scope, $log, $state, $modal, PostService) {

	var focusInput = function(){
		// Focus the cursor on the jumbotron input
		$('.quick-input').focus();
	};

	focusInput();

	// !!!!!!!!!!!!!!!!!!!! 
	// Get all parent posts (not replies) for display on the page.
	// !!!!!!!!!!!!!!!!!!!! 
	PostService.getPosts().then(function(posts){
		$scope.Posts = posts;	
	});


	// !!!!!!!!!!!!!!!!!!!! 
	// Get a Post model (this will be empty)
	// !!!!!!!!!!!!!!!!!!!! 
	$scope.newPost = PostService.getPost();


	// !!!!!!!!!!!!!!!!!!!! 
	// Function to handle manipulating a post.
	// save post, get replies, save reply, like post
	// !!!!!!!!!!!!!!!!!!!! 
	// Save the post.
	$scope.quickPost = function(){
		var post = $scope.newPost;
		
		PostService.add(post);

		// Get a new empty Post so we can start again.
		$scope.newPost = PostService.getPost();
		focusInput();
	};

	$scope.getReplies = function(post){
		var Replies = PostService.getReplies(post.id);
		post.replies = Replies;
	};

	$scope.toggleLike = function(post){
		post['like'] = !post['like'];
		// Since we aren't persisting the data, simply log to console 
		// so we can see that like has indeed changed.
		$log.info('Post id: ' + post['id'] +  ' Like: ' + !!post['like']);
	};

	$scope.replyToPost = function(replyPost,parentPost){
		// Get the existing replies for the parentPost.
		var Replies = PostService.getReplies(parentPost.id);
		// Put the existing replies into the parent. 
		parentPost['replies'] = Replies;

		// Now create the reply.
		var newReply = PostService.reply(replyPost,parentPost);

		parentPost['replies'].unshift(newReply);
		parentPost['response'].unshift(newReply.id);
	};



	// !!!!!!!!!!!!!!!!!!!! 
	// Photo Modal
	// !!!!!!!!!!!!!!!!!!!! 
	var photoModalOpen = false;
	var showPhotosModal = function(post){
		if(!photoModalOpen){
			photoModalOpen = true;
			$scope.modalInstance = $modal.open({
				templateUrl: 'posts/photo-modal.tpl.html',
				controller: 'PhotoModalCtrl',
				resolve:{
					post: function(){
						return post;
					}
				}
			}); 
			
			$scope.modalInstance.result.then(function() {
				photoModalOpen = false;
			}, function() {
				// cancelled
			})['finally'](function(){
				// unset modalInstance to prevent double close of modal when $routeChangeStart
				$scope.modalInstance = undefined;
				focusInput();
			});
		}
	};

	$scope.showPhotosModal = function(post){
		showPhotosModal(post);
	};

	
}])

.controller('PostModalCtrl', ['$scope', '$modalInstance', '$timeout', 'PostService', function ($scope, $modalInstance, $timeout, PostService) {

	var focusInput = function(){
		// Focus the cursor on the input
		$('.modal-input').focus();
	};

	$timeout(function(){
		focusInput();
	}, 500);
	

	// Get an Post model (this will be empty)
	$scope.newPost = PostService.getPost();

	$scope.save = function(){	
		var post = $scope.newPost;
		PostService.add(post);
		$modalInstance.close();	
	};

	$scope.cancel = function(){
		$modalInstance.close();	
	};

}])

.controller('PhotoModalCtrl', ['$scope', '$modalInstance', '$log', 'PostService', 'post', function ($scope, $modalInstance, $log, PostService, post) {

	$scope.post = post;

	$scope.cancel = function(){
		$modalInstance.close();	
	};

	$scope.saveReply = function(parentPost){
		var replyPost = $scope.replyPost;
		// Get the existing replies for the parentPost.
		var Replies = PostService.getReplies(parentPost.id);
		// Put the existing replies into the parent. 
		parentPost['replies'] = Replies;

		// Now create the reply.
		var newReply = PostService.reply(replyPost,parentPost);

		parentPost['replies'].unshift(newReply);
		parentPost['response'].unshift(newReply.id);
		$scope.replyPost.post = '';
	};

}]); 