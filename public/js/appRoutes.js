angular.module('appRoutes', [])

  .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

    $routeProvider

      // .when('/', {
      //   templateUrl: 'views/home.html',
      //   controller: 'MainController'
      // })

      .when('/todos', {
        templateUrl: 'views/todos.html',
        controller: 'mainController'
      })

      // .when('/login', {
      //   templateUrl: 'view/login.html',
      //   controller: 'loginController'
      // })

    $locationProvider.html5Mode(true)

  }])