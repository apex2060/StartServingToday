app.factory('config', function ($rootScope, $http) {
	var config = {
		parseRoot: 			'https://api.parse.com/1/',
	 	parseAppId: 		'YpT1uaX3QZJ2FXU08eKP5eEE6sAOqy4AVmIYhPUC',
	 	parseJsKey: 		'z2Pb9wrwQN0uXHbWy242snEJfzAzA6EoGvdDr9t0',
	 	parseRestApiKey: 	'tDqdS2lxMe48F2TXzCMoemAgJf1IO4ySSXCtfmbo',
	 	googleApiKey: 		'AIzaSyC0WyOGqP4zLaN9AgKjZHqiWgtmFBbjw7Y',
	};

	Parse.initialize(config.parseAppId, config.parseJsKey);
	$http.defaults.headers.common['X-Parse-Application-Id'] = config.parseAppId;
	$http.defaults.headers.common['X-Parse-REST-API-Key'] = config.parseRestApiKey;
	$http.defaults.headers.common['Content-Type'] = 'application/json';

	return config;
});