/**
 * @author Jorge Guerrero
 */
(function() {
    'use strict';

    angular
    	.module('app.main')
    	.controller('MainController', MainController);
    
    /**
     * Controlador que se encarga de gestionar el ViewModel de la página principal 
     * de la aplicación.
     */
    MainController.$inject = ['$window', '$state', '$http', 'CONFIG', 'logger', 'userService', 'taskService'];
    function MainController($window, $state, $http, CONFIG, logger, userService, taskService) {
    	var vm = this;
    	vm.appTitle = CONFIG.appTitle;
    	vm.taskCount = 0;
    	vm.stateActive = stateActive;
    	vm.logout = logout;
    	vm.reload = reload;
    	    	
    	activate();

        function activate() {
			logger.info('Bienvenido a ' + vm.appTitle);
			getTaskCountAssigned();
		}
        
        function getTaskCountAssigned() {
            return taskService.getTaskCountAssigned().then(function(data) {
            	vm.taskCount = data;
                return vm.taskCount;
            });
        }
        
        function stateActive(state) {
            return $state.includes(state) ? 'active' : '';
        }
        
        function logout() {
            return userService.logout().then(function(data) {
            	reload();
            });
		}
        
        function reload() {
        	$window.location.reload();
        }
        
    }
    
})();