var MainCtrl = app.controller('MainCtrl', function($rootScope, $scope, $routeParams, config, userService, storyService){
	$rootScope.rp = $routeParams;
	$rootScope.config = config;

	var Volunteer = Parse.Object.extend("Volunteer");

	var rootTools = {
		user: userService,
		url:function(){

			if($routeParams.module == 'admin')
				if($routeParams.view)
					return 'modules/admin/'+$routeParams.view+'/main.html';
				else
					return 'views/404.html';
			else if($routeParams.module && $routeParams.view)
				return 'modules/'+$routeParams.module+'/'+$routeParams.view+'.html';
			else
				return 'views/'+$routeParams.view+'.html';
		},
		init:function(){
			if(!$rootScope.temp){
				$rootScope.alerts = [];
				$rootScope.featureFilter = {featured:true};
				$rootScope.temp = {
					volunteer: {},
				};
				rootTools.stories.init();
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
				rootTools.page.layout();
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
			},
			layout:function(){
				var col = [4,3,6];
				var rev = [3,4,2];
				function nextIndex(){
					var i = rev.indexOf(L.matrix);
					console.log(i)
					if(i==(rev.length-1))
						return 0;
					else
						return ++i;
				}
				var L = $rootScope.layout;
				if(!L)
					L = {
						col: 	'col-md-'+col[0],
						matrix: 	rev[0],
					}
				else
					L = {
						col: 'col-md-'+col[nextIndex()],
						matrix: rev[nextIndex()],
					}
				storyService.list().then(function(storyList){
					var featured = storyList.filter('featured');
					$rootScope.featured = featured.matrix(L.matrix);
					$rootScope.layout = L;
				})
			}
		},
		stories:{
			init:function(){
				storyService.list().then(function(storyList){
					$rootScope.stories = storyList;
				})
			}
		},
		volunteer:{
			signup:function(user){
				user = angular.copy(user);
				user.story = user.story.objectId;
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