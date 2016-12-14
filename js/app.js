var app = angular.module('bballapp', ['firebase']);

// Initialize Firebase
var config = {
  apiKey: "AIzaSyDqAwSD2Be4_V7a4LGqBbXyzEIIAs8gx2E",
  authDomain: "bballapp-91936.firebaseapp.com",
  databaseURL: "https://bballapp-91936.firebaseio.com",
  storageBucket: "bballapp-91936.appspot.com",
  messagingSenderId: "601954092918"
};
firebase.initializeApp(config);

app.controller('FirstController', function($scope, $firebaseObject, $firebaseArray){
	var ref = firebase.database().ref();
	$scope.data = $firebaseObject(ref);	
});