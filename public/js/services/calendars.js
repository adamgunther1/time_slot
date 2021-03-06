angular.module('calendarService', [])

    .factory('Calendars', ['$http', function($http) {
        return {
            getUser : function() {
                return $http.get('/api/v1/current-user');
            },
            getCalendar : function(user) {
                return $http({
                            method : 'GET',
                            url : `https://www.googleapis.com/calendar/v3/calendars/${user.userEmail}/events`,
                            params : { 'maxResults' : 9999},
                            headers : {
                                Authorization : `Bearer ${user.userToken}` 
                            }
                })
            },
            // getCalendarNextPage : function (user, nextPageToken) {
            //     return $http({
            //                 method : 'GET',
            //                 url : `https://www.googleapis.com/calendar/v3/calendars/${user.userEmail}/events`,
            //                 params : { 'pageToken' : nextPageToken},
            //                 headers : {
            //                     Authorization : `Bearer ${user.userToken}` 
            //                 }

            //     })
            // },
            updateEvent : function (user, eventData) {
                return $http({
                    method : 'PUT',
                    url : `https://www.googleapis.com/calendar/v3/calendars/${user.userEmail}/events/${eventData.id}`,
                    headers : {
                        Authorization : `Bearer ${user.userToken}`
                    },
                    data : eventData
                })
            },
            updateUser : function(user) {
                return $http.put(`/api/v1/current-user`, user);
            },
            deleteCalendarEvent : function(user, id) {
                return $http({
                    method : 'DELETE',
                    url : `https://www.googleapis.com/calendar/v3/calendars/${user.userEmail}/events/${id}`,
                    headers : {
                        Authorization : `Bearer ${user.userToken}`
                    }
                })
            },
            createCalendarEvent : function(user, eventData) {
                return $http({
                    method : 'POST',
                    url : `https://www.googleapis.com/calendar/v3/calendars/${user.userEmail}/events`,
                    headers : {
                        Authorization : `Bearer ${user.userToken}`
                    },
                    data : eventData
                });
            }
        }
    }]);