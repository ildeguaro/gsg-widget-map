/**
 * @author Jorge Guerrero
 */
(function() {
    'use strict';

    angular
        .module('app.main')
        .run(appRun);

    appRun.$inject = ['stateHelper'];

    function appRun(stateHelper) {
    	stateHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'home',
                config: {
		            url: '/',
		            data: { pageTitle: 'Services Portal' },
		            views: {
		                'content@': {
		                    templateUrl: 'scripts/modules/main/main.view.html'
		                }
		            }
                }
            }
        ];
    }
})();