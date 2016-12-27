var app = angular.module('bballapp', ['ui.router','firebase']);

// Initialize Firebase
var config = {
  apiKey: "AIzaSyDqAwSD2Be4_V7a4LGqBbXyzEIIAs8gx2E",
  authDomain: "bballapp-91936.firebaseapp.com",
  databaseURL: "https://bballapp-91936.firebaseio.com",
  storageBucket: "bballapp-91936.appspot.com",
  messagingSenderId: "601954092918"
};
firebase.initializeApp(config);

app.run(['$rootScope', '$state', function($rootScope, $state) {
	$rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
		if (error=='AUTH_REQUIRED') {
        	$rootScope.message = 'Sorry, you must log in to access that page';
        	$state.go('login');
      	} // AUTH REQUIRED
    }); //event info
}]); //run

app.config(['$urlRouterProvider', '$stateProvider', function($urlRouterProvider, $stateProvider){
	
	$urlRouterProvider.otherwise('/dash')

	$stateProvider
		.state('login', {
			url: '/login',
			templateUrl: 'views/login.html',
			controller: 'RegistrationController'
		})
		.state('register', {
			url: '/register',
			templateUrl: 'views/register.html',
			controller: 'RegistrationController'
		})
		.state('dash', {
			url: '/dash',
			templateUrl: 'views/dash.html',
			controller: 'DashController',
			resolve: {
        		currentAuth: function(Authentication) {
          			return Authentication.requireAuth();
        		} //current Auth
      		} //resolve
		})
		.state('bballnightroster', {
			url: '/bballnight/:bballnightId/roster',
			templateUrl: 'views/roster.html',
			controller: 'RosterController'
		})
		.state('bballnights', {
			url: '/bballnights',
			templateUrl: 'views/bballnights.html',
			controller: 'BballnightsController'
		})
		.state('about', {
			url: '/about',
			templateUrl: 'views/about.html'
		})
		.state('contact', {
			url: '/contact',
			templateUrl: 'views/contact.html'
		})

	}
]);