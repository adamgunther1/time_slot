angular.module('mwl.calendar.docs', [])

  .controller('calendarCtrl', function($scope, $route, moment, calendarConfig, Calendars) {
      // $scope.eventsLoaded = false;
      $scope.eventsLoaded = true;

      var userAuth = { userToken : '', userEmail : '' };

      var vm = this;
      //These variables MUST be set as a minimum for the calendar to work
      vm.calendarView = 'month';
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

          for ( var i=0; i < busyHours; i++ ) {
            user.freeTime[startTime.format()] = 'busy';
            startTime = startTime.add(1, 'hours');
          }
        })  
        Calendars.updateUser(user)
        .success(function (user) {
          console.log('user updated')
        })
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
                      user.calendar.items[i].colorId = calendar.items[i].colorId
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

      var projectColors = {'1' : {  primary: '#a4bdfc', secondary: '#a4bdfc' },
                           '2' : {  primary: '#7ae7bf', secondary: '#7ae7bf' },
                           '3' : {  primary: '#dbadff', secondary: '#dbadff' },
                           '4' : {  primary: '#ff887c', secondary: '#ff887c' },
                           '5' : {  primary: '#fbd75b', secondary: '#fbd75b' },
                           '6' : {  primary: '#ffb878', secondary: '#ffb878' },
                           '7' : {  primary: '#46d6db', secondary: '#46d6db' },
                           '8' : {  primary: '#e1e1e1', secondary: '#e1e1e1' },
                           '9' : {  primary: '#5484ed', secondary: '#5484ed' },
                           '10' : {  primary: '#51b749', secondary: '#51b749' },
                           '11' : {  primary: '#dc2127', secondary: '#dc2127' },  
                          };

      var postEvent = function (eventData) {
          Calendars.createCalendarEvent(userAuth, eventData)
          .success(function (event) {
            let newEvent = {
              id: event.id,
              title: event.summary,
              // color: calendarConfig.colorTypes.info,
              color: projectColors[event.colorId],
              startsAt: moment(event.start.dateTime).toDate(),
              endsAt: moment(event.end.dateTime).toDate(),
              draggable: true,
              resizable: false,
              actions: actions
            }
          vm.events.push(newEvent)
          })
      };

      var createEvent = function (event) {
        return {
          id: event.id,
          title: event.summary,
          // color: calendarConfig.colorTypes.info,
          // color: {  primary: '#e3bc08', secondary: '#fdf1ba' },
          color: projectColors[event.colorId],
          startsAt: moment(event.startTime).toDate(),
          endsAt: moment(event.endTime).toDate(),
          draggable: true,
          resizable: false,
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
        let totalWorkHoursDuringProjectTimeLine = Math.floor(moment(endTime).diff(moment(startTime), 'hours') * (10/24));
        getEvents();
        Calendars.getUser()
        .success(function (user) {
          let availability = user.freeTime;
          let availableHours = [];

          let iterator = 0;
          let i = 0;
          do {
            let hour = Object.keys(availability)[iterator];
            if ( availability[hour] === 'free' && moment(hour).diff(moment(startTime), 'hours') > 0 ) {
              availableHours.push(hour);
              i++;
              iterator++;
            } else {
              iterator++;
            }
          } while ( i < hours );

          let workHoursToSpare = moment(endTime).diff(moment(availableHours.slice(-1)[0]), 'hours') * (10/24);
          if ( (hours < totalWorkHoursDuringProjectTimeLine) && (workHoursToSpare > 0 ) ) {
            let colorChoices = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11']
            let randomColor = colorChoices[Math.floor(Math.random() * colorChoices.length)];
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
                "description" : description, 
                "colorId" : randomColor
              };
              postEvent(eventData);
              // $route.reload();
            })
          }
        })
      };

      var distributeEventsEvenly = function (hours, startTime, endTime, title, description) {
        let totalWorkHoursDuringProjectTimeLine = Math.floor(moment(endTime).diff(moment(startTime), 'hours') * (10/24));
        getEvents();
        Calendars.getUser() 
        .success(function (user) {
          let availability = user.freeTime;
          let availableHours = [];   
          
          let iterator = 0;
          let i = 0;
          let hour = Object.keys(availability)[iterator];
          do {
            hour = Object.keys(availability)[iterator];
            if ( availability[hour] === 'free' && moment(hour).diff(moment(startTime), 'hours') > 0 && moment(hour).diff(moment(endTime), 'hours') < 0 ) {
              availableHours.push(hour);
              i++;
              iterator++;
            } else {
              iterator++;
            }
          } while ( moment(hour).diff(moment(endTime), 'hours') < 0 );

          let totalSlots = availableHours.length;
          let interval = hours / totalSlots;
          let intervalSummed = 0;
          let indexTracker = 0;
          let intervalsBooked = [0];
          let availableHoursToBook = [];
          do {
            intervalSummed = intervalSummed + interval;
            if (intervalsBooked.includes( Math.round(intervalSummed)) === false ) {
              intervalsBooked.push(Math.round(intervalSummed));
              availableHoursToBook.push(availableHours[indexTracker]);
            }
            indexTracker++;
          } while ( availableHoursToBook.length < hours )

          let workHoursToSpare = moment(endTime).diff(moment(availableHoursToBook.slice(-1)[0]), 'hours') * (10/24);
          if ( (hours < totalWorkHoursDuringProjectTimeLine) && (workHoursToSpare > 0 ) ) {
            let colorChoices = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11']
            let randomColor = colorChoices[Math.floor(Math.random() * colorChoices.length)];
            availableHoursToBook.forEach(function (hour) {
              let endHour = moment(hour).add(1, 'hours').format();
              let eventData = {
                "start" : {
                  "dateTime" : hour
                },
                "end" : {
                  "dateTime" : endHour
                },
                "summary" : title,
                "description" : description,
                "colorId" : randomColor
              };
              postEvent(eventData);
              // $route.reload();
            })
          }
        })  
      };

      // var getProjects = function () {
      //   return Calendars.getUser()
      //   .success(function (user) {
      //     $scope.projects = user.projects;
      //   })
      // };

      // var postProject = function (projectData) {
      //   return Calendars.getUser()
      //   .success(function (user) {
      //       let newProject = createProject(projectData);
      //       let updatedUser = user.projects.push(newProject);
      //       $scope.projects.push(newProject);
      //       Calendars.updateUser(updatedUser);
      //   })
      // };

      // var createProject = function (project) {
      //   return {
      //     title : project.title,
      //     description : project.description,
      //     client : project.client,
      //     // color : project.color,
      //     jobID : project.jobID,
      //     hours : project.hours,
      //     startTime : project.startTime,
      //     endTime : project.endTime,
      //     schedulePreference : project.schedulePreference,
      //     events : project.events
      //   }
      // };

      // getProjects();
  
      vm.cellIsOpen = true;
  
      vm.eventClicked = function(event) {
      };
  
      vm.eventEdited = function(event) {
      };
  
      vm.eventDeleted = function(event) {
      };
  
      vm.eventTimesChanged = function(event) {
        let eventData = {
          "id" : event.id,
          "start" : {
            "dateTime" : moment(event.startsAt).format()
          },
          "end" : {
            "dateTime" : moment(event.endsAt).format()
          },
          "summary" : event.title
        };
        Calendars.updateEvent(userAuth, eventData);

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