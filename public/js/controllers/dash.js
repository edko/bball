app.controller('DashController', ['$scope', '$firebaseObject', '$firebaseArray', function($scope, $firebaseObject, $firebaseArray) {
	$scope.message = 'this is your dash';

	var ref = firebase.database().ref(); //rootRef
	var ballnightsRef = firebase.database().ref('bballnights');
	var ballnights  = $firebaseArray(ballnightsRef);

	$scope.data = ballnights;

	ballnights.$loaded().then(function(data) {
		$scope.count = ballnights.length;
	}); //Make data is loaded before getting count

	// function to checkin the currentUser to the bballnight
	$scope.checkin =  function(bballnight, baller){
		//check if baller is already there before proceeding
		ref.child('bballnights').child(bballnight.bball_date).child('roster').child(baller.$id).once('value', function(snapshot) {
			var exists = (snapshot.val() !== null);
			if(!exists){
				ref.child('bballnights').child(bballnight.bball_date).child('roster').child(baller.$id).set({
					first_name: baller.first_name,
					last_name: baller.last_name,
					email: baller.email,
					date: firebase.database.ServerValue.TIMESTAMP
				});

				// add bballnight to users node
				ref.child('users').child(baller.$id).child('mybballnights').child(bballnight.bball_date).set({
					bball_date: bballnight.bball_date
				});

				// add 1 to counter
				ref.child('bballnights').child(bballnight.bball_date).child('counter').transaction(function(counter) {
					if(counter == 0 || counter < 16) {
						counter = counter + 1;
					}
					return counter;
				});
			}
		});
	}; //checkin

	// removes user from the roster
	// todo: need to update count when baller is removed
	$scope.checkout = function(bballnight, baller){
		ref.child('bballnights').child(bballnight.bball_date).child('roster').child(baller.$id).once('value', function(snapshot) {
			var exists = (snapshot.val() !== null);
			if(exists){
				refDel = ref.child('bballnights').child(bballnight.bball_date).child('roster').child(baller.$id);
				$firebaseObject(refDel).$remove();
				
				// need to remove bballnight from user too
				mybballnightRef =ref.child('users').child(baller.$id).child('mybballnights').child(bballnight.bball_date);
				$firebaseObject(mybballnightRef).$remove();
				
				//remove 1 from counter
				ref.child('bballnights').child(bballnight.bball_date).child('counter').transaction(function(counter) {
					if(counter > 0 && counter <= 16) {
						counter = counter - 1;
					}
					return counter;
				});
			}
		});
	}; // checkout

	// add currentuser to waitlist, identical to checkin except saves in waitlist node
	// need to check if user is already in the roster or waitlist too
	$scope.waitlist =  function(bballnight, baller){
		//check if baller is already there before proceeding
		ref.child('bballnights').child(bballnight.bball_date).child('roster').child(baller.$id).once('value', function(snapshot) {
			var exists = (snapshot.val() !== null);
			if(!exists){
				ref.child(bballnight.bball_date).child('waitlist').child(baller.$id).once('value', function(snapshot) {
					var exists = (snapshot.val() !== null);
					if(!exists){
						ref.child('bballnights').child(bballnight.bball_date).child('waitlist').child(baller.$id).set({
							first_name: baller.first_name,
							last_name: baller.last_name,
							email: baller.email,
							date: firebase.database.ServerValue.TIMESTAMP
						});

						// add bballnight to users node
						ref.child('users').child(baller.$id).child('mywaitlists').child(bballnight.bball_date).set({
							bball_date: bballnight.bball_date
						});

						// add 1 to counter
						ref.child('bballnights').child(bballnight.bball_date).child('waitcounter').transaction(function(counter) {
							if(counter == 0 || counter < 16) {
								counter = counter + 1;
							}
							return counter;
						});
					}
				});
			}
		});
	}; //waitlist

	$scope.checkwaitlist = function(bballnight, baller) {
		ref.child('bballnights').child(bballnight.bball_date).child('roster').child(baller.$id).once('value', function(snapshot) {
			$scope.ballerInRoster = (snapshot.val() !== null);
		});
		ref.child('bballnights').child(bballnight.bball_date).child('waitlist').child(baller.$id).once('value', function(snapshot) {
			$scope.ballerInWaitlist = (snapshot.val() !== null);
		});
		 
		//if((!$scope.ballerInRoster && !$scope.ballerInWaitlist) && $scope.counter == 16){
		if(bballnight.counter < 16 && !$scope.ballerInRoster){ 
			if(!$scope.ballerInWaitlist){ 
				return false;	
			} 
		};
	};

	// removes user from the waitlist
	// todo: need to update count when baller is removed
	$scope.removewaitlist = function(bballnight, baller){
		ref.child('bballnights').child(bballnight.bball_date).child('waitlist').child(baller.$id).once('value', function(snapshot) {
			var exists = (snapshot.val() !== null);
			if(exists){
				// remove from wailist
				refDel = ref.child('bballnights').child(bballnight.bball_date).child('waitlist').child(baller.$id);
				$firebaseObject(refDel).$remove();
				
				// need to remove bballnight from user too
				mybballnightRef =ref.child('users').child(baller.$id).child('mywaitlists').child(bballnight.bball_date);
				$firebaseObject(mybballnightRef).$remove();
				
				//remove 1 from counter
				ref.child('bballnights').child(bballnight.bball_date).child('waitcounter').transaction(function(counter) {
					if(counter > 0 && counter <= 16) {
						counter = counter - 1;
					}
					return counter;
				});
			}
		});
	}; // checkout

}]);