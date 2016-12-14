app.controller('RegistrationController', ['$scope', 'Authentication',
	function($scope, Authentication){
		$scope.register = function(){
			Authentication.register($scope.user);
		};
		$scope.login = function(){
			Authentication.login($scope.user);
		};
		$scope.logout = function(){
			Authentication.logout();
		};
	}]);