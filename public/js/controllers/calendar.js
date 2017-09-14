angular.module('mwl.calendar.docs', [])

  .controller('calendarCtrl', function($scope, moment, calendarConfig, Todos) {
      $scope.eventsLoaded = false;

      var vm = this;
          //These variables MUST be set as a minimum for the calendar to work
          vm.calendarView = 'week';
          vm.viewDate = new Date();
          var actions = [{
            label: '<i class=\'glyphicon glyphicon-pencil\'></i>',
            onClick: function(args) {
              // alert.show('Edited', args.calendarEvent);
            }
          }, {
            label: '<i class=\'glyphicon glyphicon-remove\'></i>',
            onClick: function(args) {
              debugger;
              var eventID = args.calendarEvent.id;
              $scope.events.splice(eventID, 1);
              // $scope.deleteEvent = function(id) {
              //   User.findOne({ _id: id }, function(err, user) {
              //   });
              // }
            }
          }];

          
          var getEvents = function () {
            return Todos.getUser()
            .success(function (user) {
              let calendarEvents = user.calendar.items;
              let formattedCalendarEvents = calendarEvents.map(function (event, index) {
                return {
                  id: index,
                  title: event.summary,
                  color: calendarConfig.colorTypes.info,
                  startsAt: moment(event.startTime).toDate(),
                  endsAt: moment(event.endTime).toDate(),
                  draggable: true,
                  resizable: true,
                  actions: actions
                }
              })
              $scope.events = formattedCalendarEvents;
              $scope.eventsLoaded = true;
        
            });
          };
          
          getEvents();
      
          vm.cellIsOpen = true;
      
          vm.addEvent = function() {
            vm.events.push({
              title: 'New event',
              startsAt: moment().startOf('day').toDate(),
              endsAt: moment().endOf('day').toDate(),
              color: calendarConfig.colorTypes.important,
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