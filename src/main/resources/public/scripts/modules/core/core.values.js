(function() {
'use strict';
// ADVERTENCIA!! NO EDITE DIRECTAMENTE ESTE ARCHIVO, EDITE LA TAREA GRUNT NGCONSTANT PARA GENERAR ESTE ARCHIVO.
angular.module('app.core')

.constant('CONFIG', {
	env: 'prod',
	version: '0.1.0-SNAPSHOT',
	debug: false,
	logDebugEnabled: false,
	appErrorPrefix: '[Error GAPP] ',
	appTitle: 'GAPP - Services Portal',
	defaultState: 'task',
	pageSize: 20,
	xdAdminServerUrl: 'http://127.0.0.1:9393'
})

;

})();