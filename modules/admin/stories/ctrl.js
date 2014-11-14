var AdminStory = app.lazy.controller('AdminStory', function($rootScope, $scope, $http, $q, config, storyService){
	
	var tools = {
		
	}
	
	$scope.tools = angular.extend(tools, storyService);
	it.AdminStory=$scope;
	
});
