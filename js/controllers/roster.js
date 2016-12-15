app.controller('RosterController', ['$scope', '$firebaseArray', '$routeParams',
	function($scope, $firebaseArray, $routeParams){
		$scope.message = "this is the roster page";

		$scope.whichBballNight = $routeParams.bballnightId;

		var rosterRef = firebase.database().ref().child('bballnights').child($scope.whichBballNight).child('roster');

		var ballers = $firebaseArray(rosterRef);

		$scope.ballers = ballers;
	}]);