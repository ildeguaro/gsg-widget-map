/**
 * @author Jorge Guerrero
 */
(function() {
    'use strict';

    angular
    	.module('app', [
            /*
             * Módulos con contenido global y accesibles por todos los demás módulos.
             */
    	   'app.core',
    	   'app.widgets',
    	    /*
    	     * Módulos de Areas de Funciones (Feature areas).
    	     */
           
            /*
             * Módulos Angular.
             */           
            
            'app.dashboard'
            
            
            
        ]);
  
})();