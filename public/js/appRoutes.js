angular.module('appRoutes', [])

  .config(['$routeProvider', '$locationProvider', '$httpProvider', function($routeProvider, $locationProvider, $httpProvider) {

    // Check if the user is connected
    //================================================
    var checkLoggedin = function($q, $timeout, $http, $location, $rootScope){
      // Initialize a new promise
      var deferred = $q.defer();

      // Make an AJAX call to check if the user is logged in
      $http.get('/loggedin').success(function(user){
        // Authenticated
        if (user !== '0')
          /*$timeout(deferred.resolve, 0);*/
          deferred.resolve();

        // Not Authenticated
        else {
          $rootScope.message = 'You need to log in.';
          //$timeout(function(){deferred.reject();}, 0);
          deferred.reject();
          $location.url('/login');
        }
      });

      return deferred.promise;
    };

    $routeProvider

      .when('/', {
        templateUrl: 'views/calendar.html',
        controller: 'calendarCtrl',
        resolve: {
          loggedin: checkLoggedin
        }
      })
      
      .when('/login', {
        templateUrl: 'views/login.html',
      })
      
      .otherwise({
        redirectTo: '/'
      })

    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    });

  }])

  .run(function($rootScope, $http){
    $rootScope.message = '';

    // Logout function is available in any pages
    $rootScope.logout = function(){
      $rootScope.message = 'Logged out.';
      $http.post('/logout');
    };
  });

var isLoggedIn = function(req, res, next) {
    
    if (req.isAuthenticated())
        return next();

    res.redirect('/login');
}