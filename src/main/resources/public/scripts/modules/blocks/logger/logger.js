/**
 * Módulo que implementa un servicio para visualizar logs por consola 
 * (utilizando el servicio $log de angular). Tambien despliega el log en 
 * pantalla a través de ventanas de notificación (por medio del módulo toastr).
 * 
 * @author Jorge Guerrero
 */
(function() {
    'use strict';

    angular
        .module('blocks.logger', [])
        .factory('logger', logger);

    logger.$inject = ['$log', 'toastr'];
    function logger($log, toastr) {
        var service = {
            showToasts: true,
            error   : error,
            info    : info,
            success : success,
            warning : warning,
            log     : $log.log
        };
        return service;

        function error(message, data, title) {
        	if (service.showToasts) {
        		toastr.error(message, title);
        	}
            $log.error('Error: ' + message, data);
        }

        function info(message, data, title) {
        	if (service.showToasts) {
        		toastr.info(message, title);
        	}
            $log.info('Info: ' + message, data);
        }

        function success(message, data, title) {
        	if (service.showToasts) {
        		toastr.success(message, title);
        	}
            $log.info('OK: ' + message, data);
        }

        function warning(message, data, title) {
        	if (service.showToasts) {
        		toastr.warning(message, title);
        	}
            $log.warn('Advertencia: ' + message, data);
        }
    }
    
}());
