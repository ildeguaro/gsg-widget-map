/**
 * @author Jorge Guerrero
 */
(function() {
    'use strict';

    angular.module('app.core', [
        /*
         * Módulos Angular.
         */
        'ngResource',
        /*
         * Módulos reusables (Blocks).
         */
        'blocks.header', 'blocks.exception', 'blocks.logger', 'blocks.router',
        /*
         * Módulos Angular de terceros.
         */
        'ui.router','adf', 'LocalStorageModule'
    ]);
    
})();
