var MainCtrl = app.controller('MainCtrl', function($rootScope, $scope, $routeParams, config, userService, projectService){
	$rootScope.rp = $routeParams;
	$rootScope.config = config;

	var Volunteer = Parse.Object.extend("Volunteer");

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
				$rootScope.featureFilter = {featured:true};
				$rootScope.temp = {
					volunteer: {},
				};
				rootTools.projects.init();
				rootTools.page.init();
				
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
		page:{
			init:function(){
				$rootScope.banners = [
					{
						title: 'All Supplies Provided',
						pic: {src: 'http://www.staples-3p.com/s7/is/image/Staples/s0659238_sc7?$splssku$'},
						objectId: ''
					},{
						title: 'Quote From Holland',
						pic: {src: 'https://www.lds.org/bc/content/shared/content/images/leaders/jeffrey-r-holland-large.jpg'},
						objectId: ''
					},{
						title: 'Large-Impact Service',
						pic: {src: 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcRGeC8Vl-r2mjUYxwPrvbtoIOk78_gRllbnxG0WirPhxZi2QvZT'},
						objectId: ''
					},
				]
			}
		},
		projects:{
			init:function(){
				projectService.list().then(function(projectList){
					$rootScope.projects = projectList;
					$rootScope.featured = projectList.matrix(3);
				})
			},
			byId:function(){
				projectService.get($routeParams.id).then(function(project){
					$rootScope.temp.project = project;
				})
			},
			volunteer:function(){
				projectService.get($routeParams.id).then(function(project){
					$rootScope.temp.volunteer = {project:project};
				})
			}
		},
		volunteer:{
			signup:function(user){
				user = angular.copy(user);
				user.project = user.project.objectId;
				var volunteer = new Volunteer();
				volunteer.save(user, {
					success:function(response){
						$rootScope.alert('success', 'Thanks for your interest, we will contact you shortly!');
						$rootScope.$apply();
					},
					error:function(e){
						console.log(e);
						it.e = e;
						$rootScope.alert('error', e);
						$rootScope.$apply();
					}
				})
			}
		}
	}
	$rootScope.alert = rootTools.alert.add;
	$rootScope.rootTools = rootTools;
	rootTools.init();
	it.MainCtrl=$scope;
});