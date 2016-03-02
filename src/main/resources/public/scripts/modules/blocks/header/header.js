/**
 * @author Jorge Guerrero
 */
(function() {
    'use strict';

    angular
        .module('blocks.header', ['blocks.exception'])
        .service('header', header);

    header.$inject = ['exception'];
    function header(exception) {
        var service = {
    		parseLinks : parseLinks,
        };
        return service;

        function parseLinks(header) {
            if (header.length === 0) {
            	exception.catcher('La cabecera no puede estar en blanco.');
            }
            var parts = header.split(',');
            var links = {};
            angular.forEach(parts, function (p) {
                var section = p.split(';');
                if (section.length !== 2) {
                	exception.catcher('Sección (' + p + ') no puede separse en \';\'');
                }
                var url = section[0].replace(/<(.*)>/, '$1').trim();
                var queryString = {};
                url.replace(
                    new RegExp('([^?=&]+)(=([^&]*))?', 'g'),
                    function($0, $1, $2, $3) { queryString[$1] = $3; }
                );
                var page = queryString['page'];
                var name = section[1].replace(/rel="(.*)"/, '$1').trim();
                links[name] = page;
            });
            return links;
        }
    }
    
}());
