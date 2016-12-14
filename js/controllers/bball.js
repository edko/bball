app.controller('BballnightsController', ['$scope', '$rootScope', '$firebaseAuth','$firebaseArray',
	function($scope, $rootScope, $firebaseAuth, $firebaseArray) {

		var auth = $firebaseAuth();

		auth.$onAuthStateChanged(function(authUser) {
			if(authUser) {
				var bballRef = firebase.database().ref('bballnights');
				var bballInfo = $firebaseArray(bballRef);

				$scope.ballnights = bballInfo;

				bballInfo.$loaded().then(function(data){
					$rootScope.howManyBballNights = bballInfo.length;
				});

				bballInfo.$watch(function(data){
					$rootScope.howManyBballNights = bballInfo.length;
				});

				$scope.addBballNight = function(){ 
					balldate = $scope.bballdate.getTime();
					bballRef.child(balldate).set({
						bball_date: balldate,
						timestamp: firebase.database.ServerValue.TIMESTAMP
					}).then(function(){
						$scope.bballdate = '';
					});
				};

				$scope.deleteBballNight = function(key){
					bballInfo.$remove(key);
				};
			}
		});
	
}]);