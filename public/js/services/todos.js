angular.module('todoService', [])

    // super simple service
    // each function returns a promise object 
    .factory('Todos', ['$http', function($http) {
        return {
            get : function() {
                return $http.get('/api/v1/todos');
            },
            create : function(todoData) {
                return $http.post('/api/v1/todos', todoData);
            },
            delete : function(id) {
                return $http.delete('/api/v1/todos/' + id);
            },
            getUser : function() {
                return $http.get('/api/v1/current-user');
            },
            getCalendar : function(user) {
                return $http({
                            method : 'GET',
                            url : `https://www.googleapis.com/calendar/v3/calendars/${user.google.email}/events`,
                            headers : {
                                Authorization : `Bearer ${user.google.token}` 
                            }
                })
            }
        }
    }]);