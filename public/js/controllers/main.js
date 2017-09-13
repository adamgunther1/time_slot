angular.module('mainCtrl', [])

  .controller('mainController', function($scope, $http, Todos) {
    $scope.formData = {};

    Todos.getUser()
        .success(function(user){
            if (user !== '0') {
                $scope.loggedIn = true;
                Todos.getCalendar(user)
                    .success(function (calendar) {
                        user.calendar.kind = calendar.kind;
                        user.calendar.etag = calendar.etag;
                        user.calendar.summary = calendar.summary;
                        user.calendar.timeZone = calendar.timeZone;
                        user.calendar.accessRole = calendar.accessRole;
                        user.calendar.nextSyncToken = calendar.nextSyncToken;
                        calendar.items.forEach(function (item, i) {
                            user.calendar.items[i] = {  kind : '',
                                                        etag : '',
                                                        id : '',
                                                        htmlLink : '',
                                                        created : '',
                                                        updated : '',
                                                        summary : '',
                                                        description : '',
                                                        location : '',
                                                        creatorEmail : '',
                                                        organizerEmail : '',
                                                        startTime : '',
                                                        endTime : '',
                                                        iCalUID : '',
                                                        sequence : 0,
                                                        // attendees : [
                                                        //     {
                                                        //         email : '',
                                                        //         displayName : '',
                                                        //         optional : true,
                                                        //         responseStatus : ''
                                                        //     }
                                                        // ],
                                                        hangoutLink : '',
                                                        // reminders : {
                                                        //     useDefault : false
                                                        // }
                                                    }
                            user.calendar.items[i].kind = calendar.items[i].kind;
                            user.calendar.items[i].etag = calendar.items[i].etag;
                            user.calendar.items[i].id = calendar.items[i].id;
                            user.calendar.items[i].htmlLink = calendar.items[i].htmlLink;
                            user.calendar.items[i].created = Date.parse(calendar.items[i].created);
                            user.calendar.items[i].updated = Date.parse(calendar.items[i].updated);
                            user.calendar.items[i].summary = calendar.items[i].summary;
                            user.calendar.items[i].description = calendar.items[i].description;
                            user.calendar.items[i].location = calendar.items[i].location;
                            user.calendar.items[i].creatorEmail = calendar.items[i].creator.email;
                            // user.calendar.items[i].creator.displayName = calendar.items[i].creator.displayName;
                            user.calendar.items[i].organizerEmail = calendar.items[i].organizer.email;
                            user.calendar.items[i].startTime = Date.parse(calendar.items[i].start.dateTime);
                            user.calendar.items[i].endTime = Date.parse(calendar.items[i].end.dateTime);
                            user.calendar.items[i].iCalUID = calendar.items[i].iCalUID;
                            user.calendar.items[i].sequence = calendar.items[i].sequence;
                            
                            user.calendar.items[i].attendees = [];
                            calendar.items[i].attendees.forEach(function (attendee, j) {
                                user.calendar.items[i].attendees[j] = attendee; 
                            })

                            // user.calendar.items[i].attendees.email = calendar.items[i].attendees.email;
                            // user.calendar.items[i].attendees.displayName = calendar.items[i].attendees.displayName;
                            // user.calendar.items[i].attendees.optional = calendar.items[i].attendees.optional;
                            // user.calendar.items[i].attendees.responseStatus = calendar.items[i].attendees.responseStatus;
                           
                            user.calendar.items[i].hangoutLink = calendar.items[i].hangoutLink;
                            // user.calendar.items[i].reminders.useDefault = calendar.items[i].reminders.useDefault;
                        });
                        console.log(user)
                        Todos.updateUser(user)
                    });
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