/**
 * @author Jorge Guerrero
 */
(function() {
    'use strict';

    angular
        .module('app.dashboard')
        .run(appRun);

    appRun.$inject = ['stateHelper'];

    function appRun(stateHelper) {
    	stateHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'dashboard',
                config: {
		            url: '/dashboard',
		            data: { pageTitle: 'Dashboard' },
		            views: {
		                'content@': {
		                    templateUrl: 'scripts/modules/dashboard/dashboard.view.html',
		                    controller: 'DashboardController as vm'
		                }
		            }
                }
            }
        ];
    }
})();