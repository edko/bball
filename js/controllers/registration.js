app.controller('RegistrationController', ['$scope', 'Authentication', '$firebaseObject',
	function($scope, Authentication, $firebaseObject){
		$scope.register = function(){
			Authentication.register($scope.user);
		};
		$scope.login = function(){
			Authentication.login($scope.user);
		};
		$scope.logout = function(){
			Authentication.logout();
		};

		var ref = firebase.database().ref();
		$scope.data = $firebaseObject(ref);	

		$scope.addUser = function(){
			ref.child('users').child('edisonko').set({
				firstname: 'Edison',
				lastname: 'Ko',
				email: 'test@email.com'
			});
		};
	}]);