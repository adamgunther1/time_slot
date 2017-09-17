angular.module('mwl.calendar.docs', [])

  .controller('calendarCtrl', function($scope, $route, moment, calendarConfig, Calendars) {
      $scope.eventsLoaded = false;

      var userAuth = { userToken : '', userEmail : '' };

      var vm = this;
      //These variables MUST be set as a minimum for the calendar to work
      vm.calendarView = 'week';
      vm.viewDate = new Date();
      var actions = [
        {
          label: '<i class=\'glyphicon glyphicon-remove\'></i>',
          onClick: function(args) {
            var eventID = args.calendarEvent.id;
            var eventIndex = vm.events.indexOf(args.calendarEvent);
            vm.events.splice(eventIndex, 1);

            Calendars.deleteCalendarEvent(userAuth, eventID)
          }
        }];

      var getDatesInRange = function(user, t1, t2, interval) {
        var dates = {};
        while ( t1.isBefore(t2) ) {
          if ( t1.format().includes('00:00:00') ) {
            t1.add(8, 'hours')
          }
          if ( t1.format().includes('18:00:00') ) {
            t1.add(14, 'hours')
          }
          dates[t1.format()] = 'free';
          t1.add(interval, "hours");
        }

        user.freeTime = dates;
        blockOffTimes(user);
      };

      var blockOffTimes = function (user) {
        user.calendar.items.forEach(function (event) {
          let startTime = moment(event.startTime).startOf('hour');
          let endTime = moment(event.endTime).startOf('hour');
          let busyHours = moment(endTime).diff(moment(startTime), 'hours');

// fix logic to get start and end from event object and make busy

          // debugger;
          for ( var i=0; i < busyHours; i++ ) {
            user.freeTime[startTime.format()] = 'busy';
            startTime = startTime.add(1, 'hours');
          }
        })  
        Calendars.updateUser(user);
      };
      

      var getEvents = function () {
        return Calendars.getUser()
        .success(function (user) {
          userAuth.userToken = user.google.token;
          userAuth.userEmail = user.google.email;
          user.calendar.items = [];
          Calendars.getCalendar(userAuth)
          .success(function (calendar) {
              calendar.items.forEach(function (item, i) {
                  // user.calendar.items = [];
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
                                              hangoutLink : '',
                                              // attendees : [ { email : '', displayName : '', optional : true, responseStatus : '' } ],
                                              // reminders : { useDefault : false }
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
                  user.calendar.items[i].organizerEmail = calendar.items[i].organizer.email;
                  user.calendar.items[i].startTime = Date.parse(calendar.items[i].start.dateTime);
                  user.calendar.items[i].endTime = Date.parse(calendar.items[i].end.dateTime);
                  user.calendar.items[i].iCalUID = calendar.items[i].iCalUID;
                  user.calendar.items[i].sequence = calendar.items[i].sequence;
                  user.calendar.items[i].hangoutLink = calendar.items[i].hangoutLink;
                  // user.calendar.items[i].attendees = [];
                  // calendar.items[i].attendees.forEach(function (attendee, j) {
                  //     user.calendar.items[i].attendees[j] = attendee; 
                  // })
              });

                let formattedCalendarEvents = user.calendar.items.map(function (event, index) {
                  return createEvent(event);
                })
                vm.events = formattedCalendarEvents;
                $scope.projects = user.projects;
                $scope.eventsLoaded = true;  
                getDatesInRange(user, moment().add(1, 'days').startOf('day'), moment().add(1, "year"), 1);
        });
      });
    }

      var postEvent = function (eventData) {
          Calendars.createCalendarEvent(userAuth, eventData)
          .success(function (event) {
            let newEvent = {
              id: event.id,
              title: event.summary,
              color: calendarConfig.colorTypes.info,
              startsAt: moment(event.start.dateTime).toDate(),
              endsAt: moment(event.end.dateTime).toDate(),
              draggable: true,
              resizable: true,
              actions: actions
            }
          vm.events[vm.events.length] = newEvent;


          })
      };

      var createEvent = function (event) {
        return {
          id: event.id,
          title: event.summary,
          color: calendarConfig.colorTypes.info,
          startsAt: moment(event.startTime).toDate(),
          endsAt: moment(event.endTime).toDate(),
          draggable: true,
          resizable: true,
          actions: actions
        }
      };

      getEvents();

      $scope.projectData = {};

      $scope.smartScheduler = function () {
        let hours = $scope.projectData.hours;
        let schedulePreference = $scope.projectData.schedulePreference;
        let startTime = $scope.projectData.startTime;
        let endTime = $scope.projectData.endTime;
        let title = $scope.projectData.title;
        let description = $scope.projectData.description;

        
        if (schedulePreference === 'spreadOut') {
          distributeEventsEvenly(hours, startTime, endTime, title, description);
        } else if (schedulePreference === 'asap') {
          distributeEventsASAP(hours, startTime, endTime, title, description)
        }
      };

      var distributeEventsASAP = function (hours, startTime, endTime, title, description) {
        let workHoursBeforeAvailabityCheck = Math.floor(moment(endTime).diff(moment(startTime), 'hours') * (10/24));
        getEvents();
        Calendars.getUser()
        .success(function (user) {
          let availability = user.freeTime;
          let availableHours = [];

// figure out how to add onto correct days / hours . Get index maybe?

          let iterator = 0;
          let i = 0;
          do {
            let hour = Object.keys(availability)[iterator];
            if ( availability[hour] === 'free' ) {
              availableHours.push(hour);
              // user.freeTime[hour] = 'busy';
              i++;
              iterator++;
            } else {
              iterator++;
            }
          } while ( i < hours );

          let workHoursToSpare = moment(endTime).diff(moment(availableHours.slice(-1)[0]), 'hours') * (10/24);
          if ( (hours < workHoursBeforeAvailabityCheck) && (workHoursToSpare > 0 ) ) {
            availableHours.forEach(function (hour) {
              let endHour = moment(hour).add(1, 'hours').format();
              let eventData = {
                "start" : {
                  "dateTime" : hour
                },
                "end" : {
                  "dateTime" : endHour
                },
                "summary" : title,
                "description" : description
              };
              postEvent(eventData);
              // Calendars.updateUser(user);
            })
            $route.reload();
            // $scope.events <<--- could be the key to return after postEvent
          }
        })
      };

      var distributeEventsEvenly = function (hours, startTime, endTime, title, description) {

      };

      // var getProjects = function () {
      //   return Calendars.getUser()
      //   .success(function (user) {
      //     $scope.projects = user.projects;
      //   })
      // };

      var postProject = function (projectData) {
        return Calendars.getUser()
        .success(function (user) {
            let newProject = createProject(projectData);
            let updatedUser = user.projects.push(newProject);
            $scope.projects.push(newProject);
            Calendars.updateUser(updatedUser);
        })
      };

      var createProject = function (project) {
        return {
          title : project.title,
          description : project.description,
          client : project.client,
          // color : project.color,
          jobID : project.jobID,
          hours : project.hours,
          startTime : project.startTime,
          endTime : project.endTime,
          schedulePreference : project.schedulePreference,
          events : project.events
        }
      };

      // getProjects();
  
      vm.cellIsOpen = true;
  
      // vm.addEvent = function() {
      //   $scope.events.push({
      //     title: 'New event',
      //     color: calendarConfig.colorTypes.important,
      //     startsAt: moment().startOf('day').toDate(),
      //     endsAt: moment().endOf('day').toDate(),
      //     draggable: true,
      //     resizable: true,
      //     actions: actions
      //   });
      // };
  
      vm.eventClicked = function(event) {
      };
  
      vm.eventEdited = function(event) {
      };
  
      vm.eventDeleted = function(event) {
      };
  
      vm.eventTimesChanged = function(event) {
      };
  
      vm.toggle = function($event, field, event) {
        $event.preventDefault();
        $event.stopPropagation();
        event[field] = !event[field];
      };
  
      vm.timespanClicked = function(date, cell) {
  
        if (vm.calendarView === 'month') {
          if ((vm.cellIsOpen && moment(date).startOf('day').isSame(moment(vm.viewDate).startOf('day'))) || cell.events.length === 0 || !cell.inMonth) {
            vm.cellIsOpen = false;
          } else {
            vm.cellIsOpen = true;
            vm.viewDate = date;
          }
        } else if (vm.calendarView === 'year') {
          if ((vm.cellIsOpen && moment(date).startOf('month').isSame(moment(vm.viewDate).startOf('month'))) || cell.events.length === 0) {
            vm.cellIsOpen = false;
          } else {
            vm.cellIsOpen = true;
            vm.viewDate = date;
          }
        }
  
      };

  });