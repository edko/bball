var app = angular.module('bballapp', ['ngRoute','firebase']);

// Initialize Firebase
var config = {
  apiKey: "AIzaSyDqAwSD2Be4_V7a4LGqBbXyzEIIAs8gx2E",
  authDomain: "bballapp-91936.firebaseapp.com",
  databaseURL: "https://bballapp-91936.firebaseio.com",
  storageBucket: "bballapp-91936.appspot.com",
  messagingSenderId: "601954092918"
};
firebase.initializeApp(config);

app.config(['$routeProvider', function($routeProvider){
	$routeProvider.
		when('/login', {
			templateUrl: 'views/login.html',
			controller: 'RegistrationController'
		}).
		when('/register', {
			templateUrl: 'views/register.html',
			controller: 'RegistrationController'
		}).
		when('/about', {
			templateUrl: 'views/about.html'
		}).
		when('/contact', {
			templateUrl: 'views/contact.html'
		}).
		when('/bballnights', {
			templateUrl: 'views/bballnights.html',
			controller: 'BballnightsController'
		}).
		otherwise({
			templateUrl: 'views/home.html',
			controller: 'HomeController'
		});
}]);

app.controller('FirstController', function($scope, $firebaseObject, $firebaseArray){
	
});