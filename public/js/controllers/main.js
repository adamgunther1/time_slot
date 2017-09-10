angular.module('mainCtrl', [])

  .controller('mainController', function($scope, $http, Todos) {
    $scope.formData = {};

    Todos.getUser()
        .success(function(user){
            if (user !== 0) {
                $scope.loggedIn = true;
            } else {
                $scope.loggedIn = false;
            };
        });
    
    // when landing on the page, get all todos and show them
    Todos.get()
        .success(function(data) {
            $scope.todos = data;
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

    // when submitting the add form, send the text to the node API
    $scope.createTodo = function() {

        // validate the formData to make sure that something is there
        // if form is empty, nothing will happen
        // people can't just hold enter to keep adding the same to-do anymore
        if (!$.isEmptyObject($scope.formData)) {
        
        // call the create function from our service (returns a promise object)
        Todos.create($scope.formData)
            .success(function(data) {
                $scope.formData = {}; // clear the form so our user is ready to enter another
                $scope.todos = data;  // assign our new list of todos
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
        }
    };

    // delete a todo after checking it
    $scope.deleteTodo = function(id) {
        Todos.delete(id)
            .success(function(data) {
                $scope.todos = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };
    
  });