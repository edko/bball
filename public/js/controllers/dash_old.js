app.controller('DashController', ['$scope', '$firebaseObject', '$firebaseArray', function($scope, $firebaseObject, $firebaseArray) {
	$scope.message = 'this is your dash';

	var ref = firebase.database().ref(); //rootRef
	var ballnightsRef = firebase.database().ref('bballnights');
	var ballnights  = $firebaseArray(ballnightsRef);

	$scope.data = ballnights;

	console.log($scope.data);

	ballnights.$loaded().then(function(data) {
		$scope.count = ballnights.length;
	}); //Make data is loaded before getting count

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

	var addBaller =  (bballnight, baller, location='roster') => {
		// function should add baller to either roster or waitlist and to user myroster and mywaitlist

		let mylocation = 'mybballnights';
		if(location == 'waitlist') mylocation = 'mywaitlists';
		ref.child('bballnights').child(bballnight.bball_date).child(location).child(baller.first_name + ' ' + baller.last_name).set({
			// first_name: baller.first_name,
			// last_name: baller.last_name,
			// email: baller.email,
			date: firebase.database.ServerValue.TIMESTAMP
		});
		// add bballnight to users node
		ref.child('users').child(baller.$id).child(mylocation).child(bballnight.bball_date).set({
			bball_date: bballnight.bball_date
		});

		// add 1 to counter
		if(location == 'roster') {
			ref.child('bballnights').child(bballnight.bball_date).child('counter').transaction(function(counter) {
				if(counter == 0 || counter < 16) {
					counter = counter + 1;
				}
				return counter;
			});
		} else if (location =='waitlist') {
			ref.child('bballnights').child(bballnight.bball_date).child('waitcounter').transaction(function(counter) {
				if(counter == 0 || counter < 16) {
					counter = counter + 1;
				}
				return counter;
			});
		}

	};

	var removeBaller =  (bballnight, baller, location='roster') => {
		refDel = ref.child('bballnights').child(bballnight.bball_date).child(location).child(baller.$id);
		$firebaseObject(refDel).$remove();
		
		// need to remove bballnight from user too
		if(location == 'roster'){
			mybballnightRef =ref.child('users').child(baller.$id).child('mybballnights').child(bballnight.bball_date);
			$firebaseObject(mybballnightRef).$remove();
			//remove 1 from counter
			ref.child('bballnights').child(bballnight.bball_date).child('counter').transaction(function(counter) {
				if(counter > 0 && counter <= 16) {
					counter = counter - 1;
				}
				return counter;
			});
		} else if (location == 'waitlist'){
			mybballnightRef =ref.child('users').child(baller.$id).child('mywaitlist').child(bballnight.bball_date);
			$firebaseObject(mybballnightRef).$remove();
			//remove 1 from counter
			ref.child('bballnights').child(bballnight.bball_date).child('waitcounter').transaction(function(counter) {
				if(counter > 0 && counter <= 16) {
					counter = counter - 1;
				}
				return counter;
			});
		}

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

	// removes user from the roster
	// todo: need to add user to roster when there is a waitlist
	$scope.checkout = function(bballnight, baller){
		// ref.child('bballnights').child(bballnight.bball_date).child('roster').child(baller.$id).once('value', function(snapshot) {
		// 	var exists = (snapshot.val() !== null);
		// 	if(exists){
		// 		refDel = ref.child('bballnights').child(bballnight.bball_date).child('roster').child(baller.$id);
		// 		$firebaseObject(refDel).$remove();
				
		// 		// need to remove bballnight from user too
		// 		mybballnightRef =ref.child('users').child(baller.$id).child('mybballnights').child(bballnight.bball_date);
		// 		$firebaseObject(mybballnightRef).$remove();
				
		// 		//remove 1 from counter
		// 		ref.child('bballnights').child(bballnight.bball_date).child('counter').transaction(function(counter) {
		// 			if(counter > 0 && counter <= 16) {
		// 				counter = counter - 1;
		// 			}
		// 			return counter;
		// 		});
		// 	}
		// });

		// if there is waitlist need to add first person to the roster
		// and delete the baller from the waitlist


	}; // checkout

	// add currentuser to waitlist, identical to checkin except saves in waitlist node
	// need to check if user is already in the roster or waitlist too
	$scope.waitlist =  function(bballnight, baller){
		//check if baller is already there before proceeding
		isBallerInRoster(bballnight,baller,'waitlist').then(function(success){
			return addBaller(bballnight,baller,'waitlist');
			console.log(success);
		}).catch(function(error){
			console.log(error);
		});

	}; //waitlist



	$scope.checkwaitlist = function(bballnight, baller, size=16) {
		// need to check if roster has reached the max or not
		// ref.child('bballnights').child(bballnight.bball_date).child('roster').child(baller.$id).once('value', function(snapshot) {
		// 	$scope.ballerInRoster = (snapshot.val() !== null);
		// });
		// ref.child('bballnights').child(bballnight.bball_date).child('waitlist').child(baller.$id).once('value', function(snapshot) {
		// 	$scope.ballerInWaitlist = (snapshot.val() !== null);
		// });
		 
		//if((!$scope.ballerInRoster && !$scope.ballerInWaitlist) && $scope.counter == 16){
		// if(bballnight.counter < 16 && !$scope.ballerInRoster){ 
		// 	if(!$scope.ballerInWaitlist){ 
		// 		return false;	
		// 	} 
		// };

		if(bballnight.counter == size) {
			return false;
		}	else if (bballnight.counter < 16) {
			return true;
		}
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

app.filter('toArray', function () {
   'use strict';

   return function (obj) {
        if (!(obj instanceof Object)) {
            return obj;
        }
        var result = [];
        angular.forEach(obj, function(obj, key) {
            obj.$key = key;
            result.push(obj);
        });
        return result;
    }
});