/**
 * Widget para ADF.
 * Map.
 * 
 * @author Ildemaro Medina
 */
(function() {
    'use strict';

    angular
    	.module('app.widgets',['openlayers-directive','ngMap'])
    	.config(configure)
    	.constant('providers',[ { 
			    				  id: 1, 
								  name:'googlemaps', 
						 		  title:'Google Maps',
						 		  zoom:5, 
						 		  center: {lat: 10.061949, lng:-69.3979532}},
					            { 
						 		  id: 2,
						 	      name:'openlayers',
								  title:'OpenLayers 3', 
								  center: {lat: 10.061949, lon: -69.3979532, zoom:6},
								  
					           }])
	    .controller('MapController', MapController);
    
    configure.$inject = ['dashboardProvider','providers'];
    
    function configure(dashboardProvider,providers) {
    	dashboardProvider.widget('map', {
			title : 'Map',
			description : 'Displays a map of GoogleMaps or OpenLayers 3',
			templateUrl : '{widgetsPath}/map/view.html',
			controller : 'MapController',
			controllerAs : 'vm',
			config : {									
	    			providerSelect:null,
	    			providersList:providers
			},
			edit : {
				templateUrl : '{widgetsPath}/map/edit.html'
			}
		});
    }
    
    MapController.$inject = ['$scope','config','providers'];
    
    function MapController($scope, config, providers) {
    	var vm = this;    	
    	vm.providerSelect = config.providerSelect;
    	
   }   
    
})();