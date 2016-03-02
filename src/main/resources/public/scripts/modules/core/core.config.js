/**
 * Módulo de configuraciones globales de la aplicación.
 * 
 * @author Jorge Guerrero
 */
(function() {
    'use strict';

    var core = angular.module('app.core',[]);
    
    core.config(toastrConfig);

    /**
     * Configuraciones del módulo NO-Angular "toastr".
     * Inyecta toastr el cual fue definido en core.constants.js
     */
    toastrConfig.$inject = ['toastr'];
    
    function toastrConfig(toastr) {
    	toastr.options.closeButton = true;
    	toastr.options.newestOnTop = true;
    	toastr.options.progressBar = true;
    	// Clase CSS que establece la posición en la pantalla de la ventana de notificación.
    	toastr.options.positionClass = 'toast-top-right';
    	toastr.options.showDuration = 300;
    	toastr.options.hideDuration = 1000;
    	// Tiempo (en ms.) que debe trabscurrir antes de que desaparezca la ventana de notificación.
    	toastr.options.timeOut = 5000;
    	toastr.options.extendedTimeOut = 1000;
    	toastr.options.showEasing = 'swing';
    	toastr.options.hideEasing = 'linear';
    	toastr.options.showMethod = 'fadeIn';
    	toastr.options.hideMethod = 'fadeOut';
    }

    // Demas configuraciones globales
    
    /**
     * Configuraciones para comunicaciones.
     */
    core.config(commConfig);
    
    commConfig.$inject = ['$stateProvider', '$urlRouterProvider', 'stateHelperConfigProvider'];
    
    function commConfig($stateProvider, $urlRouterProvider, stateHelperConfigProvider) {
        
        // Configuración del proveedor común de enrutamiento por stado
        stateHelperConfigProvider.config.$stateProvider = $stateProvider;
        stateHelperConfigProvider.config.docTitle = 'GAPP -';
        
        // Configuración de ruta por defecto.
        $urlRouterProvider.otherwise('/');
        
    }
    

    
})();
