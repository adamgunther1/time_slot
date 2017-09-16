angular.module('mwl.calendar.docs', [])

  .controller('calendarCtrl', function($scope, moment, calendarConfig, Todos) {
      $scope.eventsLoaded = false;

      var vm = this;
      //These variables MUST be set as a minimum for the calendar to work
      vm.calendarView = 'week';
      vm.viewDate = new Date();
      var actions = [
        // {
        // label: '<i class=\'glyphicon glyphicon-pencil\'></i>',
        // onClick: function(args) {
        //   // alert.show('Edited', args.calendarEvent);
        // }
        // }, 
        {
          label: '<i class=\'glyphicon glyphicon-remove\'></i>',
          onClick: function(args) {
            var eventID = args.calendarEvent.id;
            var eventIndex = $scope.events.indexOf(args.calendarEvent);
            $scope.events.splice(eventIndex, 1);
            Todos.getUser()
            .success(function (user) {
              Todos.deleteCalendarEvent(user, eventID)
              .success(function(event) {
                alert('deleted successfully');
              })
              .error(function(err) {
                alert('event failed to delete');
              })
            });

          }
        }];

      var getDatesInRange = function(t1, t2, interval) {
        Todos.getUser()
        .success(function (user) {

          var dates = {};
          while ( t1.isBefore(t2) ) {
            if ( t1.format().includes('18:00:00') ) {
              t1.add(14, 'hours')
            }
            dates[t1.format()] = 'free';
            t1.add(interval, "hours");
          }
          user.freeTime = dates;
          Todos.updateUser(user)
          .success(function (user) {
            blockOffTimes();
          })
        })
      };

      var blockOffTimes = function() {
        Todos.getUser()
        .success(function (user) {
          let busyTimes = user.calendar.items.map(function (event) {
            let startTime = moment(event.startTime).startOf('hour');
            let endTime = moment(event.endTime).startOf('hour');
            let busyHours = moment(endTime).diff(moment(startTime), 'hours');

            for ( var i=0; i < busyHours; i++ ) {
              user.freeTime[startTime.format()] = 'busy';
              startTime = startTime.add(1, 'hours');
            }
            Todos.updateUser(user);
          })
        })            
      };
      
      getDatesInRange(moment().add(1, 'days').startOf('day'), moment().add(1, "year"), 1);

      var getEvents = function () {
        return Todos.getUser()
        .success(function (user) {
          let calendarEvents = user.calendar.items;
          let formattedCalendarEvents = calendarEvents.map(function (event, index) {
            return createEvent(event);
          })
          $scope.events = formattedCalendarEvents;
          $scope.eventsLoaded = true;

          let projects = user.projects
    
        });
      };

      var postEvent = function (eventData) {
        return Todos.getUser()
        .success(function (user) {
          Todos.createCalendarEvent(user, eventData)
          .success(function (user) {
            let newEvent = createEvent(eventData);
            $scope.events.push(newEvent);
          })
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

      var smartScheduler = function () {
        console.log('--------PROJECT DATA --------');
        console.log($scope.projectData);
        let hours = $scope.projectData.hours;
        let schedulePreference = $scope.projectData.schedulePreference;
        let startTime = $scope.projectData.startTime;
        let endTime = $scope.projectData.endTime;
        debugger;
        
        if (schedulePreference === 'spreadOut') {
          distributeEventsEvenly(hours, startTime, endTime);
        } else if (schedulePreference === 'asap') {
          distributeEventsASAP(hours, startTime, endTime)
        }
      };

      var distributeEventsASAP = function (hours, startTime, endTime) {
        debugger;
      };

      var getProjects = function () {
        return Todos.getUser()
        .success(function (user) {
          $scope.projects = user.projects;
        })
      };

      var postProject = function (projectData) {
        return Todos.getUser()
        .success(function (user) {
            let newProject = createProject(projectData);
            let updatedUser = user.projects.push(newProject);
            $scope.projects.push(newProject);
            Todos.updateUser(updatedUser);
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

      getProjects();
  
      vm.cellIsOpen = true;
  
      vm.addEvent = function() {
        $scope.events.push({
          title: 'New event',
          color: calendarConfig.colorTypes.important,
          startsAt: moment().startOf('day').toDate(),
          endsAt: moment().endOf('day').toDate(),
          draggable: true,
          resizable: true,
          actions: actions
        });
      };
  
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