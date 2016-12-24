app.controller('BallNightDetailController', ['$scope', '$firebaseArray', function($scope, $firebaseArray){
	$scope.bballnight = 'this is detail section'
	console.log($scope.ballnight.bball_date)

	var rosterRef = firebase.database().ref().child('roster').child($scope.ballnight.bball_date);
	var waitlistRef = firebase.database().ref().child('waitlist').child($scope.ballnight.bball_date);

	$scope.waitlist = $firebaseArray(waitlistRef)
	$scope.rosterlist = $firebaseArray(rosterRef)

	$scope.rosterlist.$watch(function(data) {
    	$scope.rostercount = $scope.rosterlist.length;
    });

	$scope.waitlist.$watch(function(data) {
    	$scope.waitlistcount = $scope.waitlist.length;
    });

}])