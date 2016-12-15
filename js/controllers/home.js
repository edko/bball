app.controller('HomeController', ['$scope', 'Authentication','$rootScope', '$firebaseAuth','$firebaseArray', '$firebaseObject',
	function($scope, $rootScope, Authentication, $firebaseAuth, $firebaseArray, $firebaseObject) {

		var auth = $firebaseAuth();
		

		// auth.$onAuthStateChanged(function(authUser) {
			// if(authUser) {
				var userRef = firebase.database().ref('users/' + authUser.uid);
				var userObj = $firebaseObject(userRef);
				var currentUser = userObj;

				var bballRef = firebase.database().ref('bballnights');
				var bballInfo = $firebaseArray(bballRef);

				$scope.ballnights = bballInfo;

				bballInfo.$loaded().then(function(data){
					$rootScope.howManyBballNights = bballInfo.length;
					console.log('# of bballnights is ' + $rootScope.howManyBballNights);
				});

				bballInfo.$watch(function(data){
					$rootScope.howManyBballNights = bballInfo.length;
				});

				$scope.checkin = function(date){
					var ref = firebase.database().ref().child('bballnights/' + date);
					var bballRef = firebase.database().ref('bballnights');
					var bbalInfo = $firebaseObject(bballRef);
					// $scope.data = $firebaseArray(ref);
					// $scope.data.$add({
					baller = currentUser.first_name + '-' + currentUser.last_name;
					ref.child('roster').child(baller).set({	
						first_name: currentUser.first_name,
						last_name: currentUser.last_name,
						email: currentUser.email,
						date: firebase.database.ServerValue.TIMESTAMP
					});

					var databaseRef = ref.child('counter');
					databaseRef.transaction(function(counter) {
					if (counter == 0 || counter < 16) {
						counter = counter + 1;
					}
						return counter;
					});
				};

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
			// }
		// });
	
}]);