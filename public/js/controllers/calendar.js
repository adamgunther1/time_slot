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

          
          var getEvents = function () {
            return Todos.getUser()
            .success(function (user) {
              let calendarEvents = user.calendar.items;
              let formattedCalendarEvents = calendarEvents.map(function (event, index) {
                // return {
                //   id: event.id,
                //   title: event.summary,
                //   color: calendarConfig.colorTypes.info,
                //   startsAt: moment(event.startTime).toDate(),
                //   endsAt: moment(event.endTime).toDate(),
                //   draggable: true,
                //   resizable: true,
                //   actions: actions
                // }
                return createEvent(event, index);
              })
              $scope.events = formattedCalendarEvents;
              $scope.eventsLoaded = true;

              let projects = user.projects
        
            });
          };

          var createEvent = function (event, index) {
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
          }

          getEvents();

          var getProjects = function () {

          };

          var createProject = function (project, events) {
            return {
              title : project.title,
              description : project.description,
              client : project.client,
              color : project.color,
              jobID : project.jobID,
              hours : project.hours,
              startTime : project.startTime,
              endTime : project.endTime,
              schedulePreference : project.schedulePreference,
              events : events
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
              resizable: true
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