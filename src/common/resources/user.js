angular.module('resources.user',[])

.factory('UserService', ['$http', '$log', function ($http, $log) {

	var Users = [];

	var User = {
		id:99,
		full_name:"Jessica Tuan",
		avatar:"jessica.png",
		email:"jessica@mail.com",
		password:"somepassword",
		notifications:{
			favorite:true,
			mention:true,
			reply:true,
			follow:true
		},
		privacy:{
			tag_anyone:true,
			tag_follow:false,
			tag_deny:false,
			locations_add:true,
			findbyemail:true,
			tailor_ads:true
		}
	};

	var Service = {

		getUser: function(){
			return User;
		},

		saveUser: function(user){
			User = user;
			return User;
		}

	};

	return Service;
}]);