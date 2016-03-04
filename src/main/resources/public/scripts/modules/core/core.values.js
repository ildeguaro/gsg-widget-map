(function() {
'use strict';
// ADVERTENCIA!! NO EDITE DIRECTAMENTE ESTE ARCHIVO, EDITE LA TAREA GRUNT NGCONSTANT PARA GENERAR ESTE ARCHIVO.
angular.module('app.core')

.constant('CONFIG', {
	env: 'dev',
	version: '1.0.0-SNAPSHOT',
	debug: true,
	logDebugEnabled: true,
	appErrorPrefix: '[Error GAPP] ',
	appTitle: 'GAPP - Services Portal',
	defaultState: 'task',
	pageSize: 20,
	xdAdminServerUrl: 'http://127.0.0.1:9393'
})

;

})();