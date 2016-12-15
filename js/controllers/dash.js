app.controller('DashController', ['$scope', '$firebaseObject', '$firebaseArray', function($scope, $firebaseObject, $firebaseArray) {
	$scope.message = 'this is your dash';

	var ref = firebase.database().ref('bballnights');
	var ballnights  = $firebaseArray(ref);

	$scope.data = ballnights;

	ballnights.$loaded().then(function(data) {
		$scope.count = ballnights.length;
	}); //Make data is loaded before getting count

	// function to checkin the currentUser to the bballnight
	// need to implement count on the roster
	$scope.checkin =  function(bballnight, baller){
		ref.child(bballnight.bball_date).child('roster').child(baller.$id).set({
			first_name: baller.first_name,
			last_name: baller.last_name,
			email: baller.email,
			date: firebase.database.ServerValue.TIMESTAMP
		});
		ref.child(bballnight.bball_date).child('counter').transaction(function(counter) {
			if(counter == 0 || counter < 16) {
				counter = counter + 1;
			}
			return counter;
		});
	};
	// removes user from the roster
	// todo: need to update count when baller is removed
	$scope.checkout = function(bballnight, baller){
		refDel = ref.child(bballnight.bball_date).child('roster').child(baller.$id);
		$firebaseObject(refDel).$remove();
		ref.child(bballnight.bball_date).child('counter').transaction(function(counter) {
			if(counter > 0 && counter < 16) {
				counter = counter - 1;
			}
			return counter;
		});
	};

}]);