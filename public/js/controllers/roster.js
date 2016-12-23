// get roster list for the night
// add/delete current user to the roster

app.controller('RosterController', ['$scope', '$rootScope', '$firebaseArray', '$firebaseObject', '$routeParams',
	function($scope, $rootScope, $firebaseArray, $firebaseObject, $routeParams){


		$scope.whichBballNight = $routeParams.bballnightId;

		var rosterRef = firebase.database().ref().child('roster').child($scope.whichBballNight);
		var waitlistRef = firebase.database().ref().child('waitlist').child($scope.whichBballNight);
		var userRef = firebase.database().ref().child('users')

		var ballnightsRef = firebase.database().ref('bballnights');
		$scope.ballnights  = $firebaseArray(ballnightsRef);


		$scope.waitlist = $firebaseArray(waitlistRef)
		$scope.roster = $firebaseArray(rosterRef)

		
		$scope.roster.$loaded().then(function(data) {
			$scope.rostercount = $scope.roster.length;
		}); //

		$scope.roster.$watch(function(data) {
        	$scope.rostercount = $scope.roster.length;
        });

        $scope.waitlist.$loaded().then(function(data) {
			$scope.waitlistcount = $scope.waitlist.length;
		}); //

		$scope.waitlist.$watch(function(data) {
        	$scope.waitlistcount = $scope.waitlist.length;
        });

	
		rosterRef.orderByChild("email").on("child_added", function(snapshot) {
  			console.log(snapshot.key + " was " + snapshot.val().email + " m tall");
		});


		$scope.checkin = () => {
			//perform checks before adding baller to the bballnight
			console.log($scope.whichBballNight);
			isBallerInRoster($rootScope.currentUser).then(function(ref){
				addBaller(ref);
			}).catch(function(error){
				console.log(error);
			});
		}; //checkin

		$scope.checkout = () => {
			removeBaller($rootScope.currentUser);
		}

		$scope.addwaitlist = () => {
			isBallerInRoster().
				then(function(){
					isBallerInWaitlist()
				}).
				then(function(){
					addBallerToWaitlist()
				}).
				catch((error) => {
					console.log(error)
				})
		}

		$scope.removewaitlist = () => {
			removeBallerFromWaitlist();
		}

		$scope.checkRosterFull = () => {
			// return true if roster is 16

		}

		$scope.addFirstWaitlistToRoster = () => {
			addWaitlistToRoster()
		}

		var addWaitlistToRoster = () => {

			waitlistRef.orderByChild('date').limitToFirst(1).on('child_added', function(snapshot){
				key = snapshot.getKey()
			})    
			// copies waitlist to roster, then deletes waitlist node
			waitlistRef.child(key).once('value', function(snap){
				rosterRef.child(key).set(snap.val(), function(error){
					if(!error){
						rosterRef.child(key).update({
							date: firebase.database.ServerValue.TIMESTAMP
						})
						waitlistRef.child(key).remove(); 
					} else if(typeof(console) !== 'undefined' && console.error ) {
						console.error(error); 
					}
				});
			});
		}

		var addBallerToWaitlist = () => {
			var userData = {
				first_name: $rootScope.currentUser.first_name,
				last_name: $rootScope.currentUser.last_name,
				email: $rootScope.currentUser.email,
				date: firebase.database.ServerValue.TIMESTAMP
			}
			waitlistRef.child($rootScope.currentUser.$id).set(userData)
		}

		var removeBallerFromWaitlist = () => {
			waitDelRef = waitlistRef.child($rootScope.currentUser.$id);
			$firebaseObject(waitDelRef).$remove()
		}

		var isBallerInRoster = () => {
			return new Promise((resolve, reject) => {
				//check if baller is in the roster or not
				rosterRef.child($rootScope.currentUser.$id).once('value').then(function(snapshot){
					var exists = (snapshot.val() !== null);
					exists ? reject('baller in in the roster') : resolve($rootScope.currentUser)
				});
			});
		};

		var isBallerInWaitlist = () => {
			return new Promise((resolve, reject) => {
				waitlistRef.child($rootScope.currentUser.$id).once('value').then(function(snapshot){
					var exists = (snapshot.val() !== null);
					exists ? reject('baller in waitlist already') : resolve($rootScope.currentUser)
				})
			})
		}

		var addBaller =  (baller) => {
			// function should add baller to either roster or waitlist and to user myroster and mywaitlist
			var userData = {
				first_name: baller.first_name,
				last_name: baller.last_name,
				email: baller.email,
				date: firebase.database.ServerValue.TIMESTAMP
			}
			return new Promise((resolve,reject) => {
				rosterRef.child(baller.$id).set(userData);
				userRef.child(baller.$id).child('mybballnights').child($scope.whichBballNight).set({
					value: true
				});
			});
		};

		var removeBaller =  (baller) => {
			refDel = rosterRef.child(baller.$id);
			userDelRef = userRef.child(baller.$id).child('mybballnights').child($scope.whichBballNight);
			$firebaseObject(refDel).$remove().then(() => {
				$firebaseObject(userDelRef).$remove();
			}).catch((error) => {
				console.log(error);
			});
			if ($scope.rostercount < 4) {
				console.log($scope.rostercount)
				addWaitlistToRoster()
			}
			
			// need to check if count is 15, if yes, then add waitlist to roster

		}
		
	}]);