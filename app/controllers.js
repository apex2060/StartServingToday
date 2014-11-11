var MainCtrl = app.controller('MainCtrl', function($rootScope, $scope, $routeParams, config, userService, projectService){
	$rootScope.rp = $routeParams;
	$rootScope.config = config;

	var rootTools = {
		user: userService,
		url:function(){
			if(!$routeParams.module)
				return 'views/'+$routeParams.view+'.html';
			else if(!$routeParams.view)
				return 'modules/'+$routeParams.module+'/main.html';
			else
				return 'modules/'+$routeParams.module+'/'+$routeParams.view+'/main.html';
		},
		init:function(){
			if(!$rootScope.temp){
				$rootScope.alerts = [];
				$rootScope.temp = {
					volunteer: {},
				};
				rootTools.projects.init();
				
				userService.user().then(function(){
					//Do things than need to be done once the user is authenticated.
				});
				$scope.$on('$viewContentLoaded', function(event) {
					// ga('send', 'pageview', $location.path());
				});
			}
		},
		alert:{
			add:function(type, message){
				var alert = {
					type: 'alert-'+type,
					message: message
				}
				$rootScope.alerts.push(alert)
				return alert;
			},
			dismiss:function(alert){
				var alertIndex = $rootScope.alerts.indexOf(alert);
				if(alertIndex != -1)
					$rootScope.alerts.splice(alertIndex, 1);
			}
		},
		projects:{
			init:function(){
				projectService.list().then(function(projectList){
					$rootScope.projects = projectList;
				})
			},
			load:function(){
				projectService.get($routeParams.id).then(function(project){
					$rootScope.temp.volunteer.project = project;
				})
			}
		}
	}
	$rootScope.alert = rootTools.alert.add;
	$rootScope.rootTools = rootTools;
	rootTools.init();
	it.MainCtrl=$scope;
});