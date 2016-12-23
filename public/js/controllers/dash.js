app.controller('DashController', ['$scope', '$firebaseObject', '$firebaseArray', function($scope, $firebaseObject, $firebaseArray) {
	$scope.message = 'this is your dash';

	var ref = firebase.database().ref(); //rootRef
	var ballnightsRef = firebase.database().ref('bballnights');
	var ballnights  = $firebaseArray(ballnightsRef);

	$scope.data = ballnights

	var addBaller =  (bballnight, baller, location='roster') => {
		// function should add baller to either roster or waitlist and to user myroster and mywaitlist

		let mylocation = 'mybballnights';
		if(location == 'waitlist') mylocation = 'mywaitlists';
		ref.child('roster').child(bballnight.bball_date).child(baller.$id).set({
			first_name: baller.first_name,
			last_name: baller.last_name,
			email: baller.email,
			date: firebase.database.ServerValue.TIMESTAMP
		});
		// // add bballnight to users node
		// ref.child('users').child(baller.$id).child(mylocation).child(bballnight.bball_date).set({
		// 	bball_date: bballnight.bball_date
		// });

		// // add 1 to counter
		// if(location == 'roster') {
		// 	ref.child('bballnights').child(bballnight.bball_date).child('counter').transaction(function(counter) {
		// 		if(counter == 0 || counter < 16) {
		// 			counter = counter + 1;
		// 		}
		// 		return counter;
		// 	});
		// } else if (location =='waitlist') {
		// 	ref.child('bballnights').child(bballnight.bball_date).child('waitcounter').transaction(function(counter) {
		// 		if(counter == 0 || counter < 16) {
		// 			counter = counter + 1;
		// 		}
		// 		return counter;
		// 	});
		// }

	};

	var isRosterFull = (bballnight, size =16, location='counter') => {
		return new Promise((resolve,reject) => {
			ref.child('bballnights').child(bballnight.bball_date).child(location).once('value').then(function(snapshot){
				var count = snapshot.val();
				if(count < size){
					resolve('there is still room') // can add
				} else
					reject('roster is full') // cannot add need to waitlist
			});
		});
	};

	var isBallerInRoster = (bballnight, baller, location='roster') => {
		// write this function as a promise
		return new Promise((resolve, reject) => {
		//check if baller is in the roster or not
			ref.child('bballnights').child(bballnight.bball_date).child(location).child(baller.$id).once('value').then(function(snapshot){
				var exists = (snapshot.val() !== null);
				if(exists){
					reject('baller in in the roster');
				} else {
					resolve('baller is not in the' + location);
				}
			});
		});
	};

	// function to checkin the currentUser to the bballnight
	$scope.checkin = function(bballnight, baller){
		//check if baller is already there before proceeding

		// Can checkin if the following conditions are met:
		// 1. baller is not already in the list
		// 2. roster is less than 16

		isRosterFull(bballnight).  // check if roster is full or not
			then(function(success){
				//console.log(success);
				return isBallerInRoster(bballnight,baller);
			}).
			then(function(){
				return addBaller(bballnight,baller);
			}).	
			catch(function(error){
				console.log(error);
		});
	}; //checkin
}]);