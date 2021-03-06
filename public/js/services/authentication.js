app.factory('Authentication', ['$rootScope', '$firebaseAuth', '$firebaseObject', '$state',
	function($rootScope, $firebaseAuth, $firebaseObject, $state){
		var auth = $firebaseAuth();
		var ref = firebase.database().ref();

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
						$state.go('dash');
					}).catch(function(error){
						$rootScope.message = error.message;
					});
			},
			logout: function(){
				auth.$signOut();
			},
			requireAuth: function() {
				return auth.$requireSignIn();
			}, //require Authentication
			register: function(user){
				auth.$createUserWithEmailAndPassword(user.email, user.password).
					then(function(regUser){
						var regRef = firebase.database().ref('users').child(regUser.uid).set({
							regUser: regUser.uid,
							first_name: user.firstname,
							last_name: user.lastname,
							email: user.email,
							date: firebase.database.ServerValue.TIMESTAMP
						});
						myObject.login(user);
					}).catch(function(error){
						$rootScope.message = error.message;
					});
			}
		};

		return myObject;

	}]);