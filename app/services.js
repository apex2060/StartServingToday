app.factory('userService', function ($rootScope, $http, $q, config) {
	var userService = {
		user:function(){
			var deferred = $q.defer();
			if($rootScope.user)
				deferred.resolve($rootScope.user);
			else{
				userService.init();
				$rootScope.$on('authenticated', function(event,user) {
					deferred.resolve(user);
				});
			}
			return deferred.promise;
		},
 		init:function(){
 			if(localStorage.user){
				var localUser = angular.fromJson(localStorage.user);
				Parse.User.become(localUser.sessionToken)
				$http.defaults.headers.common['X-Parse-Session-Token'] = localUser.sessionToken;
			}
 			$http.get(config.parseRoot+'users/me').success(function(data){
 				//Add a weird hack because /me does not return all information stored in the user object.
 				$http.get(config.parseRoot+'users/'+data.objectId).success(function(data){
 					$rootScope.user=data;
	 				$rootScope.$broadcast('authenticated', data);
 				});
 			}).error(function(){
				//Prompt for login
			});
 		},
 		login:function(user, signup){
 			var login = {
 				username:user.username,
 				password:user.password
 			}
 			$http.get(config.parseRoot+"login", {params: login}).success(function(data){
 				Parse.User.become(data.sessionToken);
 				$http.defaults.headers.common['X-Parse-Session-Token'] = data.sessionToken;
 				localStorage.user=angular.toJson(data);
 				$rootScope.user=data;
				$rootScope.$broadcast('authenticated', data);
				if(!signup)
				window.location.hash='#/dashboard/main';
 			}).error(function(error){
 				$rootScope.alert('error', error)
 				$rootScope.error = error;
			});
 		},
 		signup:function(user){
 			if(user){
	 			user.fullName = user.firstName + ' ' + user.lastName
	 			if(user.password!=user.password2){
	 				$rootScope.alert('error', 'Your passwords do not match.')
	 			}else{
	 				$rootScope.error = null;
	 				delete user.password2;
	 				$http.post(config.parseRoot+'users', user).success(function(data){
	 					userService.login(user, true);
	 					window.location.hash='#/main/welcome'
	 				}).error(function(error){
	 					$rootScope.alert('error', error)
	 					$rootScope.error = error;
	 				});
	 			}
	 		}else{
	 			$rootScope.alert('error', 'Please enter your information.')
	 		}
 		},
 		logout:function(){
 			localStorage.clear();
 			$rootScope.user=null;
 			Parse.User.logOut()
 		}
 	}
	it.userService = userService;
	return userService;
});






app.factory('storyService', function ($rootScope, $http, $q, config, fileService) {
	var Story = Parse.Object.extend("Story");

	var PS = {
		list:function(){
			// var deferred = $q.defer();
			// if(localStorage.storyList){
			// 	deferred.resolve(angular.fromJson(localStorage.storyList));
			// }else{
			// 	PS.refresh().then(function(storyList){
			// 		deferred.resolve(storyList);
			// 	});
			// }
			// return deferred.promise;
			return PS.refresh();
		},
		refresh:function(){
			var deferred = $q.defer();
			$http.get(config.parseRoot+'classes/Story').success(function(data){
				localStorage.setItem('storyList', angular.toJson(data.results));
				deferred.resolve(data.results);
			}).error(function(error){
				console.log(error);
			})
			return deferred.promise;
		},
		
		update:function(){
			PS.refresh().then(function(storyList){
				$rootScope.stories = storyList;
			})
		},
		get:function(objectId){
			var deferred = $q.defer();
			PS.list().then(function(storyList){
				for(var i=0; i<storyList.length; i++)
					if(storyList[i].objectId == objectId)
						deferred.resolve(storyList[i]);
			})
			return  deferred.promise;
		},
		clear:function(){
			$rootScope.temp.story = {};
		},
		submit:function(story){
			if(story && story.objectId)
				PS.save(story)
			else
				PS.create(story);
		},
		create:function(story){
			$http.post(config.parseRoot+'classes/Story', story)
			.success(function(result){
				PS.clear();
				PS.update();
				$rootScope.alert('success', 'Story created')
			}).error(function(error){
				console.log(error)
			})
		},
		edit:function(story){
			$rootScope.temp.story = story;
		},
		save:function(story){
			var toSave = angular.copy(story)
			delete toSave.objectId;
			delete toSave.createdAt;
			
			$http.put(config.parseRoot+'classes/Story/'+story.objectId, toSave)
			.success(function(result){
				PS.clear();
				PS.update();
				$rootScope.alert('success', 'Story saved')
			}).error(function(error){
				console.log(error)
			})
		},
		delete:function(story){
			if(confirm('Are you sure you want to delete this story?')){
				$http.delete(config.parseRoot + 'classes/Story/' + story.objectId)
					.success(function(result) {
						PS.clear();
						PS.update();
						$rootScope.alert('success', 'Story deleted')
					}).error(function(error) {
						console.log(error)
					})
			}
		},
		toggleFeatured:function(story){
			story.featured = !!!story.featured;
			PS.save(story);
		},
		toggleApproved:function(story){
			story.approved = !!!story.approved;
			PS.save(story);
		},
		uploadPic:function(details, src){
			if(!$rootScope.temp.story)
				$rootScope.temp.story = {};
			$rootScope.temp.story.pic = {
				temp: true,
				status: 'uploading',
				class: 'grayscale',
				name: 'Image Uploading...',
				src: src
			}

			fileService.upload(details,src).then(function(data){
				$rootScope.temp.story.pic = {
					name: data.name(),
					src: data.url()
				}
			});
		}
	}
	
	return PS;
})


// app.factory('directoryService', function ($rootScope, $http, $q, config, userService) {
// 	var directory = false;
// 	var directoryService = {
// 		init:function(){
// 			var deferred = $q.defer();
// 			userService.user().then(function(){
// 				if(localStorage.directory){
// 					directory = angular.fromJson(localStorage.directory)
// 					deferred.resolve(directory);
// 				}else{
// 					$http.get(config.parseRoot+'classes/Family?limit=900')
// 					.success(function(data){
// 						directory = data.results;
// 						localStorage.directory = angular.toJson(directory)
// 						deferred.resolve(directory);
// 					})
// 				}
// 			})
// 			return deferred.promise;
// 		},
// 		reload:function(){
// 			var deferred = $q.defer();
// 			userService.user().then(function(){
// 				$http.get(config.parseRoot+'classes/Family?limit=900')
// 				.success(function(data){
// 					directory = data.results;
// 					localStorage.directory = angular.toJson(directory)
// 					deferred.resolve(directory);
// 				})
// 			});
// 			return deferred.promise;
// 		},
// 		list:function(){
// 			return directoryService.init();
// 		}
// 	}
// 	it.directoryService = directoryService;
// 	return directoryService;
// });













app.factory('fileService', function ($http, $q, config) {
	var fileService = {
		upload:function(details,b64,successCallback,errorCallback){
			var deferred = $q.defer();
			var file = new Parse.File(details.name, { base64: b64});
			file.save().then(function(data) {
				console.log('save success',data)
				deferred.resolve(data);
			}, function(error) {
				console.log('save error',error)
				deferred.reject(error);
			});
			return deferred.promise;
		}
	}

	it.fileService = fileService;
	return fileService;
});



app.factory('qrService', function () {
	var qrService = {
		create:function(text, size){
			if(!size)
				size = 256;
			return 'https://api.qrserver.com/v1/create-qr-code/?size='+size+'x'+size+'&data='+text
			// return 'https://chart.googleapis.com/chart?'+
		}
	}

	it.qrService = qrService;
	return qrService;
});



