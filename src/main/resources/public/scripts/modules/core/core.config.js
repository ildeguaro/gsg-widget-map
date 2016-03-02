/**
 * Módulo de configuraciones globales de la aplicación.
 * 
 * @author Jorge Guerrero
 */
(function() {
    'use strict';

    var core = angular.module('app.core',[]);
    /**
     * Configuraciones para notificaciones, logger y exception.
     */
    core.config(notifConfig);
    
    notifConfig.$inject = ['$logProvider', 'exceptionHandlerProvider', 'toastr', 'CONFIG'];
    
    function notifConfig($logProvider, exceptionHandlerProvider, toastr, CONFIG) {
        // Configuraciones del módulo NO-Angular "toastr".
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
    	
    	// Configuración del proveedor de logs.
        if ($logProvider.debugEnabled) {
            $logProvider.debugEnabled(CONFIG.logDebugEnabled);
        }
        
        // Configuración del gestor de excepciones definido.
        exceptionHandlerProvider.configure(CONFIG.appErrorPrefix);
    }
    
    /**
     * Configuraciones para storage.
     */
    core.config(storageConfig);
    
    storageConfig.$inject = ['localStorageServiceProvider'];
    
    function storageConfig(localStorageServiceProvider) {
        // Configuración del Local Storage.
        localStorageServiceProvider
        	.setPrefix('gapp');
    }
    
    /**
     * Configuraciones del módulo Dashboard de ADF.
     */
    core.config(dashboardConfig);
    
    dashboardConfig.$inject = ['dashboardProvider'];
    
    function dashboardConfig(dashboardProvider) {
        // Definir la ruta base de los widgets.
        dashboardProvider.widgetsPath('scripts/modules/widgets/adf/');
        // Definir las estructuras del layout para el dashboard.
        dashboardProvider.structure('6-6', {
			rows : [ {
				columns : [ {
					styleClass : 'col-md-6'
				}, {
					styleClass : 'col-md-6'
				} ]
			} ]
		}).structure('4-8', {
			rows : [ {
				columns : [ {
					styleClass : 'col-md-4',
					widgets : []
				}, {
					styleClass : 'col-md-8',
					widgets : []
				} ]
			} ]
		}).structure('12/4-4-4', {
			rows : [ {
				columns : [ {
					styleClass : 'col-md-12'
				} ]
			}, {
				columns : [ {
					styleClass : 'col-md-4'
				}, {
					styleClass : 'col-md-4'
				}, {
					styleClass : 'col-md-4'
				} ]
			} ]
		}).structure('12/6-6', {
			rows : [ {
				columns : [ {
					styleClass : 'col-md-12'
				} ]
			}, {
				columns : [ {
					styleClass : 'col-md-6'
				}, {
					styleClass : 'col-md-6'
				} ]
			} ]
		}).structure('12/6-6/12', {
			rows : [ {
				columns : [ {
					styleClass : 'col-md-12'
				} ]
			}, {
				columns : [ {
					styleClass : 'col-md-6'
				}, {
					styleClass : 'col-md-6'
				} ]
			}, {
				columns : [ {
					styleClass : 'col-md-12'
				} ]
			} ]
		}).structure('3-9 (12/6-6)', {
			rows : [ {
				columns : [ {
					styleClass : 'col-md-3'
				}, {
					styleClass : 'col-md-9',
					rows : [ {
						columns : [ {
							styleClass : 'col-md-12'
						} ]
					}, {
						columns : [ {
							styleClass : 'col-md-6'
						}, {
							styleClass : 'col-md-6'
						} ]
					} ]
				} ]
			} ]
		});   	
    }
    
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
    
    /**
     * Application Run.
     */
    core.run(appRun);
    
    appRun.$inject = ['$rootScope', 'CONFIG'];
    
    function appRun($rootScope, CONFIG) {
    	// Estabelcer CONFIG a nivel de rootScope para que pueda ser accedido desde HTML.
        $rootScope.CONFIG = CONFIG;
    }
    

    
})();
