var AdminStory = app.lazy.controller('AdminStory', function($rootScope, $scope, $http, $q, config, storyService){
	
	$scope.tools = storyService;
	it.AdminStory=$scope;
	
});
