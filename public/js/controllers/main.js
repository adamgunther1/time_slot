angular.module('mainCtrl', [])

  .controller('mainController', function($scope, $http, Calendars) {

    Calendars.getUser()
        .success(function(user){
            if (user !== '0') {
                $scope.loggedIn = true;
            } else {
                $scope.loggedIn = false;
            };
        });
    
  });