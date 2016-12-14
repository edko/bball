app.factory('Authentication', ['$rootScope', '$firebaseAuth', '$firebaseObject', '$location',
	function($rootScope, $firebaseAuth, $firebaseObject, $location){
		var auth = $firebaseAuth();

		auth.$onAuthStateChanged(function(authUser){
			if(authUser){
				var userRef = firebase.database().ref('users/' + authUser.uid);
				var userObj = $firebaseObject(userRef);
				$rootScope.currentUser = userObj;
			} else {
				$rootScope.currentUser = '';
			}
		});


		var myObject =  {
			login: function(user){
				auth.$signInWithEmailAndPassword(user.email, user.password).
					then(function(regUser){
						$location.path('/');
					}).catch(function(error){
						$rootScope.message = error.message;
					});
			},
			logout: function(){
				auth.$signOut();
			},
			register: function(user){
				auth.$createUserWithEmailAndPassword(user.email, user.password).
					then(function(regUser){
						var regRef = firebase.database().ref('users').child(regUser.uid).set({
							regUser: regUser.uid,
							first_name: user.firstname,
							last_name: user.lastname,
							email: user.email,
							mobile: user.mobile,
							date: firebase.database.ServerValue.TIMESTAMP
						});
					}).catch(function(error){
						$rootScope.message = error.message;
					});
			}
		};

		return myObject;

	}]);