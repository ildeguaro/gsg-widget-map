/**
 * Widget para ADF.
 * Reloj.
 * 
 * @author Jorge Guerrero
 */
(function() {
    'use strict';

    angular
    	.module('app.widgets')
    	.config(configure)
    	.controller('ClockController', ClockController);
    
    configure.$inject = ['dashboardProvider'];
    
    function configure(dashboardProvider) {
    	dashboardProvider.widget('clock', {
			title : 'Clock',
			description : 'Displays date and time',
			templateUrl : '{widgetsPath}/clock/view.html',
			controller : 'ClockController',
			controllerAs : 'vm',
			config : {
				timePattern : 'hh:mm:ss A',
				datePattern : 'DD-MM-YYYY'
			},
			edit : {
				templateUrl : '{widgetsPath}/clock/edit.html'
			}
		});
    }
    
    ClockController.$inject = ['$scope', '$interval', 'moment', 'config'];
    
    function ClockController($scope, $interval, moment, config) {
    	var vm = this;
    
    	setDateAndTime();

    	// Refrescar cada segundo.
		var promise = $interval(setDateAndTime, 1000);

		// Cancelar interval cuando se destruye el scope.
		$scope.$on('$destroy', function() {
			$interval.cancel(promise);
		});
		
    	function setDateAndTime() {
			var d = moment();
			vm.time = d.format(config.timePattern);
			vm.date = d.format(config.datePattern);
		}
    }
    
})();