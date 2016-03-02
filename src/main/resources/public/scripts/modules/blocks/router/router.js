/**
 * Módulo que establece algunas configuraciones importantes para el enrutamiento a través de estados.
 * 
 * @author Jorge Guerrero
 */
(function() {
    'use strict';

    angular
    	.module('blocks.router', ['ui.router', 'blocks.logger'])
        .provider('stateHelperConfig', stateHelperConfig)
        .factory('stateHelper', stateHelper);
    
    // Debe ser configurado vía stateHelperConfigProvider desde core.config (módulo: app.core)
    function stateHelperConfig() {
    	/* jshint validthis:true */
        this.config = {
            // Se deben establecer estas propiedades:
            // $stateProvider: undefined
            // docTitle: ''
            // resolveAlways: {ready: function(){ } }
        };

        this.$get = function() {
            return {
                config: this.config
            };
        };
    }
    
    stateHelper.$inject = ['$location', '$rootScope', '$state', 'logger', 'stateHelperConfig'];
    
    function stateHelper($location, $rootScope, $state, logger, stateHelperConfig) {
        var handlingRouteChangeError = false;
        var $stateProvider = stateHelperConfig.config.$stateProvider;
        
        var service = {
            configureStates: configureStates,
            backState: backState,
            reloadState: reloadState
        };

        init();

        return service;
        
        /**
         * Inicializa la factoría.
         */
        function init() {
            handleRoutingErrors();
            updateDocTitle();
        }

        /**
         * Evento que captura errores durante la transición de los estados.
         * Al producirse un error de enrutamiento redireccionamos al 'home'.
         * Ignora el error si ocurre 2 o más veces seguidas. 
         * Este evento está en la capacidad de detectar errores en los resolve del estado.
         */
        function handleRoutingErrors() {
            $rootScope.$on('$stateChangeError',
                function(event, toState, toParams, fromState, fromParams, error) {
                    if (handlingRouteChangeError) {
                        return;
                    }
                    handlingRouteChangeError = true;
                    var destination = (toState && 
                		(toState.data.pageTitle || toState.name || toState.templateUrl)) || 'destino desconocido';
                    var msg = 'Error de enrutamiento a ' + destination + '. ' + (error.msg || '');
                    logger.warning(msg, [toState]);
                    $location.path('/error/404');
                }
            );
        }

        /**
         * Evento que captura las transiciones entre estados y actualiza la directiva html <title>.
         * El estado debe tener configurado la propiedad pageTitle (en data) con el titulo
         * del estado. En caso de no existir esta propiedad se establece el nombre del estado.
         */
        function updateDocTitle() {
            $rootScope.$on('$stateChangeSuccess',
                function(event, toState, toParams, fromState, fromParams) {
                    handlingRouteChangeError = false;
                    var pageTitle = stateHelperConfig.config.docTitle + ' ' + (toState.data.pageTitle || toState.name);
                    $rootScope.pageTitle = pageTitle;
                    $rootScope.previousStateName = fromState.name;
                    $rootScope.previousStateParams = fromParams;
                }
            );
        }
        
        /**
         * Permite establecer y configurar los estados desde los distintos módulos de la aplicación.
         */
        function configureStates(states) {
            states.forEach(function(curState) {
            	/*
            	curState.config.resolve = angular.extend(curState.config.resolve || {}, 
            		stateHelperConfig.config.resolveAlways);
            	*/
                $stateProvider.state(curState.state, curState.config);
            });
        }
        
        /**
         * Retorna al estado anterior al actual.
         * Si el previo estado está activo o no existe enrutamos al 'home'
         */
        function backState() {
            if ($rootScope.previousStateName === 'activate' || $state.get($rootScope.previousStateName) === null) {
            	
            } else {
                $state.go($rootScope.previousStateName, $rootScope.previousStateParams);
            }
        }
        
        /**
         * Recarga el actual estado.
         */
        function reloadState() {
        	$state.reload();
        }
    }

})();
