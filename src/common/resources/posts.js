angular.module('resources.posts',[])

.factory('PostService', ['$http', '$log', '$q', 'UserService', function ($http, $log, $q, UserService) {

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

	var CurrentUser = UserService.getUser();
	
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