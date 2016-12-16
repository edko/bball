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

app.run(['$rootScope', '$location', function($rootScope, $location) {
  $rootScope.$on('$routeChangeError',
    function(event, next, previous, error) {
      if (error=='AUTH_REQUIRED') {
        $rootScope.message = 'Sorry, you must log in to access that page';
        $location.path('/login');
      } // AUTH REQUIRED
    }); //event info
}]); //run

app.config(['$routeProvider', function($routeProvider){
	$routeProvider.
		when('/', {
			redirectTo: '/dash'
		}).
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
		when('/bballnight/:bballnightId/roster', {
			templateUrl: 'views/roster.html',
			controller: 'RosterController'
		}).
		when('/dash', {
			templateUrl: 'views/dash.html',
			controller: 'DashController',
			resolve: {
        currentAuth: function(Authentication) {
          return Authentication.requireAuth();
        } //current Auth
      } //resolve
		}).
		otherwise({
			redirectTo: '/login'
		});
}]);

app.controller('FirstController', function($scope, $firebaseObject, $firebaseArray){
	
});