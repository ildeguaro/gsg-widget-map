/**
 * @author Jorge Guerrero
 */
(function() {
    'use strict';

    angular
    	.module('app.dashboard')
    	.controller('DashboardController', DashboardController);
    
    DashboardController.$inject = ['$scope', 'localStorageService'];
    
    function DashboardController($scope, localStorageService) {
    	var vm = this;
    	vm.name = 'gapp-dash';
		vm.model = localStorageService.get(vm.name);
		if (!vm.model) {
	    	vm.model = {
				title : 'Dashboard',
				structure : '4-8',
				rows : [{
			        columns: [
	                  	{
							styleClass: 'col-md-4',
							widgets: []
	                  	},
	                  	{
							styleClass: 'col-md-8',
							widgets: []
	                  	}
                  	]
				}]
			};
		}
    	vm.collapsible = true;
    	vm.maximizable = true;

    	$scope.$on('adfDashboardChanged', function(event, name, model) {
			localStorageService.set(name, model);
		});
    	

	   $scope.$on('adfWidgetAdded', function(event, name, model, widget) {
			widget.titleTemplateUrl = "scripts/modules/dashboard/custom-widget-title.html";
		});

    }
    
})();