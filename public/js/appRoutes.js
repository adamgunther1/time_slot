angular.module('appRoutes', [])

  .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

    $routeProvider

      .when('/', {
        templateUrl: 'views/index.html',
        controller: 'MainController'
      })

      // .when('/todos', {
      //   templateUrl: 'sample code',
      //   controller: 'sample code'
      // })

    $locationProvider.html5Mode(true)
    
  }])