/**
 * @author Jorge Guerrero
 */
(function() {
    'use strict';

    angular.module('app.core', [
        /*
         * Módulos Angular.
         */
        'ngResource', 'ngSanitize', 'ngAnimate', 'ngCookies',
        /*
         * Módulos reusables (Blocks).
         */
        'blocks.header', 'blocks.exception', 'blocks.logger', 'blocks.router',
        /*
         * Módulos Angular de terceros.
         */
        'ui.router', 'ui.bootstrap', 'adf', 'LocalStorageModule'
    ]);
    
})();
