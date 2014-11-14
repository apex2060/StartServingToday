var StoryCtrl = app.lazy.controller('StoryCtrl', function($rootScope, $scope, $routeParams, $q, config, storyService){
	
	var tools = {
		init:function(colCt){
			storyService.list().then(function(storyList){
				var approved = storyList.filter('approved');
				$scope.approved = approved.matrix(colCt);
			});
		},
		initStory:function(){
			storyService.get($routeParams.id).then(function(story){
				$rootScope.temp.story = story;
			})
		},
		initSignup:function(){
			storyService.get($routeParams.id).then(function(story){
				$rootScope.temp.volunteer = {story:story};
			})
		}
	}
	
	$scope.tools = angular.extend(tools, storyService);
	it.StoryCtrl=$scope;
	
});