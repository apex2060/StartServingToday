var ProjectCtrl = app.lazy.controller('ProjectCtrl', function($rootScope, $scope, $http, $q, config, projectService){
	
	$scope.tools = projectService;
	it.ProjectCtrl=$scope;
	
});
