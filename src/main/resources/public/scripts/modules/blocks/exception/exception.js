/**
 * Módulo que provee un mecanismo completo para controlar todas las excepciones
 * no capturadas en la aplicación.
 * IMPORTANTE!! Se debe excluir de los unit test.
 * 
 * @author Jorge Guerrero
 */
(function() {
    'use strict';

    angular
    	.module('blocks.exception', ['blocks.logger'])
        .provider('exceptionHandler', exceptionHandlerProvider)
        .config(config)
        .factory('exception', exception);
    
    /**
     * Proveedor para controlar excepciones.
     */
    function exceptionHandlerProvider() {
    	/* jshint validthis:true */
        this.config = {
            appErrorPrefix: undefined
        };

        this.configure = function (appErrorPrefix) {
            this.config.appErrorPrefix = appErrorPrefix;
        };

        this.$get = function() {
            return {config: this.config};
        };
    }
    
    /**
     * Configuración del módulo para extender el gestor de excepciones 
     * por defecto de angular, el cual es representado por el servicio $exceptionHandler.
     */
    config.$inject = ['$provide'];
    function config($provide) {
    	// Intercepta la creación del servicio $exceptionHandler y cambiamos su 
    	// comportamiento original sustituyendolo por nuestro propio gestor.
        $provide.decorator('$exceptionHandler', extendExceptionHandler);
    }
    
    /**
     * Extensión del gestor de excepciones por defecto, donde se manipula 
     * el mensaje de error recibido y se envía luego al componente logger.
     */
    extendExceptionHandler.$inject = ['$delegate', 'exceptionHandler', 'logger'];
    function extendExceptionHandler($delegate, exceptionHandler, logger) {
        return function(exception, cause) {
            var appErrorPrefix = exceptionHandler.config.appErrorPrefix || '';
            var errorData = {exception: exception, cause: cause};
            exception.message = appErrorPrefix + exception.message;
            // Delegamos la ejecución al servicio original.
            $delegate(exception, cause);
            logger.error(exception.message, errorData);
        };
    }
    
    /**
     * Servicio que sirve para lanzar por logger una excepción capturada.
     */
    exception.$inject = ['logger'];
    function exception(logger) {
        var service = {
            catcher: catcher
        };
        return service;

        function catcher(message) {
            return function(reason) {
                logger.log(message, reason);
            };
        }
    }
    
})();