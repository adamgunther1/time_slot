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
            }//,
            // getCalendar : function() {
            //     return $http.get('https://www.googleapis.com/calendar/v3/calendars/adamgunther1@gmail.com/events&access_token=ya29.GlvABEktelDjDHJs2E9nKaqooL9epLrhARkgbi--WYCi1KcVt9797kLqM9--tD9VTx4M_acyMcplvCYu5mt7shpyvGaVRP2N1uhTa-ESDw0S2EscL1lPw_b9thp5')
            // }
        }
    }]);