/**
 * Widget para ADF.
 * Map.
 * 
 * @author Ildemaro Medina
 */
(function() {
    'use strict';

    angular
    	.module('app.widgets',[])
    	.config(configure)
    	.controller('MapController', MapController);
    
    configure.$inject = ['dashboardProvider'];
    
    function configure(dashboardProvider) {
    	dashboardProvider.widget('map', {
			title : 'Map',
			description : 'Displays a map of GoogleMaps or OpenLayers 3',
			templateUrl : '{widgetsPath}/map/view.html',
			controller : 'MapController',
			controllerAs : 'vm',
			config : {	        	
	            center: {lat: 10.061949, lon: -69.3979532, zoom:9},
	        	markerdefault: {
	        	      lat: 0,
	        	      lon: 0,
	        	      label: {
	        	          show: true
	        	      }
	        	    }
				
			},
			edit : {
				templateUrl : '{widgetsPath}/map/edit.html'
			}
		});
    }
    
    MapController.$inject = ['$scope','config'];
    
    function MapController($scope, config) {
    	var vm = this;
    	config.markerdefault.lat = config.center.lat;
        config.markerdefault.lon = config.center.lon;
        $scope.config = config;    
    }
    
})();