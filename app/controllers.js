var MainCtrl = app.controller('MainCtrl', function($rootScope, $scope, $routeParams, config, userService){
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
				$rootScope.temp = {};
				$rootScope.page = {
					featured: [
						{
							title: "Power To Become",
							description: "Help build a well in Africa.",
							url: "/assets/img/featured/wells.jpg"
						},
						{
							title: "LDS",
							description: "Helping Hands",
							url: "https://www.lds.org/bc/content/ldsorg/content/images/hs_whatchurchdoing_helpinghands.jpg"
						},
						{
							title: "You",
							description: "Share your story with the world",
							url: "/assets/img/featured/helpers.jpg"
						},
					]
				}
				userService.user().then(function(){
					//Do things than need to be done once the user is authenticated.
					// family.init();
					// tag.init();
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
		}
	}
	$rootScope.alert = rootTools.alert.add;
	$rootScope.rootTools = rootTools;
	rootTools.init();
	it.MainCtrl=$scope;
});