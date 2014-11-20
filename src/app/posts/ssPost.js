angular.module('posts.ssPost',['ngSanitize'])

.directive('ssPost',function(){
	return {
		restrict:'EA',
		scope:{
			post:'=',
			like:'&',
			reply:'&',
			replies:'&',
			showPhoto:'&'
		},
		templateUrl:'posts/ssPost.tpl.html',
		controller: function($scope, $log, $sce, $timeout){

			// I am the incoming post. 
			var post = $scope.post;

			var focusInput = function(){
				// Focus the cursor on the input
				$('.reply-form-input').focus();
			};

			// I am a reply to the post.
			$scope.replyPost = {};

			// I hold info useful to a post.
			$scope.postAttrs = {
				expanded:false,
				showReply: false,
				time:null
			};

			// I get replies to the parent post from the service layer
			var getReplies = function(){
				$scope.replies()(post);
				// Format the timestrig for a reply
				post.replies.forEach(function(reply){
					reply['time'] = getPostTime(reply);
				});
			};

			// Show / Hide any replies
			// The replies need to be retrieved based on the parent post. 
			$scope.toggleReplies = function(){
				if(!post.replies){
					getReplies();
				}
				$scope.postAttrs['expanded'] = !$scope.postAttrs['expanded'];
			};

			// Show or Hide the reply input
			$scope.toggleReply = function(){
				$scope.postAttrs['showReply'] = !$scope.postAttrs['showReply'];
				
				if($scope.postAttrs['showReply']){
					$timeout(function(){
						focusInput();
					}, 250);
				}
			};

			// Toggle the post as liked
			$scope.likePost = function(){
				$scope.like()(post);
			};

			// Send the photo to controller for display.
			$scope.enlargePhoto = function(post){
				$scope.showPhoto()(post);
			};

			// Save reply
			$scope.saveReply = function(parentPost){
				// Pass in the reply and reply's parent (i.e. post)
				$scope.reply()($scope.replyPost,parentPost);
				$scope.postAttrs['expanded'] = true;
				$scope.replyPost = {};

				// Refresh the list of replies. 
				getReplies();
			};




			// Format the datetime and update the display
			var getPostTime = function(post){
				var timestring;
				var now = new Date();
				var seconds = Math.floor((Date.parse(now) - post.datetime)/1000);
				var minutes = Math.floor(seconds/60);
				var hours = Math.floor(minutes/60);
				var days = Math.floor(hours/24);

				hours = hours-(days*24);
				minutes = minutes-(days*24*60)-(hours*60);
				seconds = seconds-(days*24*60*60)-(hours*60*60)-(minutes*60);

				if(minutes < 1){
					timestring = seconds + 's';
				}

				if(minutes >= 1){
					timestring = minutes + 'm';
				}

				if(hours >= 1){
					timestring = hours + 'h';
				}

				return timestring;
			};

			var setPostTime = function(post){
				var timestring = getPostTime(post);
				$scope.post['time'] = timestring;
			};

			setPostTime(post);

			refreshPostTime = setInterval(function(){
				setPostTime(post);
				$scope.$apply();
			},12000);
	

		}
	};
});