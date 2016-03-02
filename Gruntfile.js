/**
 * @author Jorge Guerrero
 */
'use strict';

var fs = require('fs');

var parseString = require('xml2js').parseString;
// Retorna el número de versión del POM del proyecto maven (si no tiene toma la del parent)
var parseVersionFromPomXml = function() {
	var version;
	var pomXml = fs.readFileSync('pom.xml', 'utf8');
	parseString(pomXml, function(err, result) {
		if (result.project.version && result.project.version[0]) {
			version = result.project.version[0];
		} else if (result.project.parent && result.project.parent[0] && 
				result.project.parent[0].version && result.project.parent[0].version[0]) {
			version = result.project.parent[0].version[0];
		} else {
			throw new Error('pom.xml tiene un formato incorrecto. No está definida la versión.');
		}
	});
	return version;
};

// Step personalizado para usemin
var useminAutoprefixer = {
	name: 'autoprefixer',
	createConfig: function(context, block) {
		if (block.src.length === 0) {
			return {};
		} else {
			return require('grunt-usemin/lib/config/cssmin')
				.createConfig(context, block); // Reusar createConfig de cssmin
		}
	}
};

module.exports = function(grunt) {

	// Carga las tareas grunt de forma automática.
	require('load-grunt-tasks')(grunt);

	// Muestra el tiempo de ejecución de las tareas.
	require('time-grunt')(grunt);

	// Configuración de la app.
	var appConfig = {
		app: require('./bower.json').appPath || 'app',
		test: 'src/test/javascript',
		dist: 'src/main/resources/dist',
		pkg: grunt.file.readJSON('package.json'),
		version: parseVersionFromPomXml(),
	    scripts: [
			// Archivos JS a ser incluidos por la tarea includeSource en el index.html
			'scripts/main.js',
			'scripts/app.module.js',
			'scripts/components/**/*.js',
			'scripts/modules/**/*.js'
		]
	};

	// Configuración de las tareas grunt.
	grunt.initConfig({

		// Propiedades del Proyecto. 
		gapp: appConfig,
		
	    /**
	     * Bower (gestor de paquetes)
	     */
		bower: {
			options: {
				targetDir: '<%= gapp.app %>/lib',
				install: true,
				copy: false,
				verbose: true
			},
			install: {
				// Ejecuta 'grunt bower:install' y descarga o actualiza los paquetes bower en el directorio targetDir.
			}
		},

		/**
		 * Observador de cambios de archivos y ejecutar tareas sobre la base de los archivos modificados.
		 */
		watch: {
			/*
            bower: {
                files: ['bower.json'],
                tasks: ['wiredep']
            },
            */
			includeSource: {
				// Monitorea los scripts agregados y eliminados con el fin de actualizar index.html
	            files: '<%= gapp.app %>/scripts/**/*.js',
	            tasks: ['includeSource'],
	            options: {
	                event: ['added', 'deleted']
	            }
			},
			ngconstant: {
				files: ['Gruntfile.js', 'pom.xml'],
				tasks: ['ngconstant:dev']
			},
	        styles: {
	            files: ['<%= gapp.app %>/assets/styles/**/*.css']
	        },
			less: {
				files: ['<%= gapp.app %>/assets/less/**/*.less'],
				tasks: ['less']
			}
		},

		/** 
		 * Analiza CSS y agrega prefijos de proveedores (vendor) para reglas CSS utilizando
		 * la base de datos de "Can I Use" (http://caniuse.com/).
		 * 
		 * NOTA: src y dest son configurados en una sub-tarea llamada "generated" en usemin
		 */
		autoprefixer: {

		},
		
		/**
		 * Generar de forma automática las referencias css y js en el index.html a partir de las
		 * referencias bower definidas en el bower.json.
		 */
	     
        wiredep: {
            target: {
                src: '<%= gapp.app %>/index.html',
                ignorePath: '<%= gapp.app %>'
            }
        },

       
		
		/*
		 * BrowserSync: https://www.browsersync.io/
		 * 
		 * Abre el navegador web con recarga en vivo. Detecta cualquier modificación de 
		 * recursos HTML/CSS/JavaScript y refresca automáticamente el navegador. Al momento 
		 * de testear la aplicación, en diferentes navegadores o máquinas, cualquier 
		 * operación realizada sobre las pantalla se sincronizará automáticamente en todas 
		 * las pantallas. Se utiliza un proxy que enruta las llamadas REST al enpoint del 
		 * backend que procesa dicho servicios (localhost:8080).
		 * URL: http://localhost:3000
		 * URL Admin: http://localhost:3001
		 */
        browserSync : {
			dev : {
				bsFiles : {
					src : [
						'<%= gapp.app %>/*.html',
						'<%= gapp.app %>/**/*.json',
						'<%= gapp.app %>/assets/styles/**/*.{css,png,jpg,jpeg,gif}',
						'<%= gapp.app %>/scripts/**/*.{js,html}',
						'<%= gapp.app %>/assets/images/**/*.{png,jpg,jpeg,gif,webp,svg}',
						'.tmp/**/*.{css,js}' 
					]
				}
			},
			options : {
				watchTask : true,
				server: {
					baseDir: '<%= gapp.app %>'
				}
				/*
				proxy : {
					target : 'localhost:8080',
					proxyOptions : {
						xfwd : true
					}
				}
				*/
			}
		},
		
		/**
		 * Limpieza de carpetas temporales y de distribución.
		 */
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '.tmp',
                        '<%= gapp.dist %>/*',
                        '!<%= gapp.dist %>/.git*'
                    ]
                }]
            },
            server: '.tmp'
        },
        
        /**
         * Análisis de JavaScript. Para detectar errores y problemas potenciales en el código javascript.
         */
        jshint: {
            options: {
            	reporter: require('jshint-stylish'),
            	jshintrc: '.jshintrc'
            },
            all: [
                'Gruntfile.js',
                '<%= gapp.app %>/scripts/*.js',
                '<%= gapp.app %>/scripts/modules/**/*.js',
                '<%= gapp.app %>/scripts/components/**/*.js'
            ]
        },
        
        /**
         * Permite insertar banners en archivos.
         */
        usebanner: {
        	taskName: {
        		options: {
					position: 'top',
					banner: '/*!\n* <%= gapp.pkg.name %>  v<%= gapp.version %> ' + 
							'- <%= grunt.template.today("yyyy-mm-dd") %>\n* <%= gapp.pkg.description %>\n' +
							'* (c) GSG Tech <%= gapp.pkg.homepage %>\n* <%= gapp.pkg.author %>\n*/',
					linebreak: true
        		},
        		files: {
        			src: [ 
	                    '<%= gapp.dist %>/scripts/**/*.js',
	                    '<%= gapp.dist %>/assets/styles/**/*.css',
					]
        		}
        	}
        },
        
		/** 
		 * Compilar less a css
		 */
        less: {
			dev: {
				options: {
					compress: true,
					optimization: 2
				},
				files: {
					'<%= gapp.app %>/assets/styles/main.css': '<%= gapp.app %>/assets/less/style.less'
				}
			}
        },
        
        /** 
         * Concatenar archivos.
         * 
         * NOTA: src y dest son configurados en una sub-tarea llamada "generated" en usemin
         */
        concat: {
        	
        },
        
        /** 
         * Versionado (fingerprint) de archivos estáticos a través de un hash generado 
         * a partir de su contenido. Esto es con fines de almacenamiento en caché del navegador. 
         * Al cambiar el contenido del archivo se genera un nuevo hash el cuale permite que el 
         * navegador ignore la versión guardada en cache y tome la nueva versión.
         */
		rev: {
			options: {
				algorithm: 'md5',
				length: 8
			},
			dist: {
				src: [
                    '<%= gapp.dist %>/scripts/**/*.js',
                    '<%= gapp.dist %>/assets/styles/**/*.css',
                    '<%= gapp.dist %>/assets/images/**/*.{png,jpg,jpeg,gif,webp,svg}',
                    '<%= gapp.dist %>/assets/fonts/*'
				]
			}
		},
		
		/**
		 * Reemplazar referencias non-optimized de scripts o stylesheets en index.html. 
		 * Genera concat.generated y cssmin.generated.
		 */
        useminPrepare: {
            html: '<%= gapp.app %>/*.html',
            options: {
                dest: '<%= gapp.dist %>',
                flow: {
                    html: {
                        steps: {
                            js: ['concat', 'uglify'],
                            // cssmin concatena archivos según sus paths relativos de fonts e imagenes.
                            css: ['cssmin', useminAutoprefixer] 
                        },
                        post: {
                        }
                    }
                }
            }
        },
        
        usemin: {
            html: ['<%= gapp.dist %>/**/*.html'],
            css: ['<%= gapp.dist %>/assets/styles/**/*.css'],
            js: ['<%= gapp.dist %>/scripts/**/*.js'],
            options: {
                assetsDirs: [
					'<%= gapp.dist %>', 
					'<%= gapp.dist %>/assets/styles', 
					'<%= gapp.dist %>/assets/images', 
					'<%= gapp.dist %>/assets/fonts'
				],
                patterns: {
                    js: [
                        [/(assets\/images\/.*?\.(?:gif|jpeg|jpg|png|webp|svg))/gm, 
                        'Update the JS to reference our revved images']
                    ]
                },
                dirs: ['<%= gapp.dist %>']
            }
        },
        
        /**
         * Minificar archivos de imágenes.
         * 
         * NOTA: Optimización de archivos PNG no funciona en Linux. 
         * En este caso, sacar de la lista de src la extensión png.
         */
        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= gapp.app %>/assets/images',
                    src: '**/*.{png,jpg,jpeg}', 
                    dest: '<%= gapp.dist %>/assets/images'
                }]
            }
        },
        
        /** 
         * Minificar archivos SVG.
         */
        svgmin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= gapp.app %>/assets/images',
                    src: '**/*.svg',
                    dest: '<%= gapp.dist %>/assets/images'
                }]
            }
        },
        
		/**
		 * Minificar archivos CSS. 
         * 
         * NOTA: src y dest son configurados en una sub-tarea llamada "generated" en usemin
		 */
		cssmin: {
			options: {
				debug: true,
				root: '<%= gapp.app %>', // Reemplazar las rutas relativas de los recursos estáticos con rutas absolutas
				keepSpecialComments: 0	 // Elimina todos los comentarios.
			}
		},
        
        /**
         * Minificar archivos JavaScript.
         * 
         * IMPORTANTE: Para activar uglify se requiere que el código de angular sea basado 
         * en sintaxis string-injection. Por ejemplo, ésta es la sintaxis normal: 
         * function exampleCtrl ($scope, $rootScope, $location, $http){}
         * Y la sintaxis basada en string-injection es: 
         * ['$scope', '$rootScope', '$location', '$http', function exampleCtrl ($scope, $rootScope, $location, $http){}]
         * 
         * NOTA: src y dest son configurados en una sub-tarea llamada "generated" en usemin
         */
		uglify: {
			options: {
				mangle: false
			}
        },
        
		/**
		 * Minificar archivos HTML.
		 */
        htmlmin: {
            dist: {
                options: {
					removeComments: true,
                    removeCommentsFromCDATA: true,
                    collapseWhitespace: true,
                    collapseBooleanAttributes: true,
                    conservativeCollapse: true,
                    removeAttributeQuotes: true,
                    removeRedundantAttributes: true,
                    useShortDoctype: true,
                    removeEmptyAttributes: true,
                    keepClosingSlash: true
                },
                files: [{
                    expand: true,
                    cwd: '<%= gapp.dist %>',
                    src: ['*.html'],
                    dest: '<%= gapp.dist %>'
                }]
            }
        },
        
        /** 
         * Copiar los archivos restantes (no manipulados en otras tareas).
         */
        copy: {
            fonts: {
                files: [
                    {
                    	// Fonts de Bootstrap
	                    expand: true,
	                    dot: true,
	                    cwd: '<%= gapp.app %>/lib/bootstrap',
	                    src: ['fonts/*.*'],
	                    dest: '<%= gapp.dist %>/assets'
                    },
                	{
                    	// Fonts de Fontawesome
						expand: true,
						dot: true,
						cwd: '<%= gapp.app %>/lib/fontawesome',
						src: ['fonts/*.*'],
    					dest: '<%= gapp.dist %>/assets'
    				}
                ]
            },
            dist: {
                files: [
                    {
	                    expand: true,
	                    dot: true,
	                    cwd: '<%= gapp.app %>',
	                    dest: '<%= gapp.dist %>',
	                    src: [
	                        '*.html',
    						'*.{ico,png,txt}',
	                        'scripts/**/*.html',
	                        'assets/images/**/*.{png,gif,webp,jpg,jpeg,svg}',
	                        'assets/fonts/*',
	                        '.htaccess'
	                    ]
                    }, 
                    {
	                    expand: true,
	                    cwd: '.tmp/assets/images',
	                    dest: '<%= gapp.dist %>/assets/images',
	                    src: ['generated/*']
                    }
                ]
            }
        },
        
        /**
         * Automatizar las tareas de control de versiones para el código generado del proyecto. 
         * Mantener el código generado en sincronía con el código fuente, manteniendo varias ramas (branches)
         * del código generado, commit con mensajes automáticos, y push a los repositorios remotos.
         */
        buildcontrol: {
            options: {
                commit: true,
                push: false,
                connectCommits: false,
                message: 'Built %sourceName% from commit %sourceCommit% on branch %sourceBranch%'
            }
        },
        
        /**
         * Insertar archivos JS en index.html.
         */
        includeSource: {
            options: {
                basePath: '<%= gapp.app %>',
                baseUrl: '',
                ordering: 'top-down'
            },
            app: {
                files: {
                    '<%= gapp.app %>/index.html': '<%= gapp.app %>/index.html'
                }
            }
        },
        
        concurrent: {
            server: [
                'less',
                'imagemin',
                'svgmin'
            ],
            test: [],
            dist: [
                'less',
                'imagemin',
                'svgmin'
            ]
        },
        
        /**
         * Test Runner para JavaScript.
         */
        karma: {
            unit: {
                configFile: '<%= gapp.test %>/karma.conf.js',
                singleRun: true
            }
        },
        
        /*
        cdnify: {
            dist: {
                html: ['<%= gapp.dist %>/*.html']
            }
        },
        */
        
        /** 
         * Concatena y registra las plantillas AngularJS (*.html) en el $templateCache.
         * Esto permite rapidez en applicaciones AngularJS ya que automáticamente minimiza, 
         * combina y mete en cache las plantillas HTML con $templateCache.
         */
        ngtemplates: {
            dist: {
                cwd: '<%= gapp.app %>',
                src: ['scripts/modules/**/*.html', 'scripts/components/**/*.html',],
                dest: '.tmp/templates/templates.js',
                options: {
                    module: 'app',
                    usemin: 'scripts/app.js',
                    htmlmin: '<%= htmlmin.dist.options %>'
                }
            }
        },
        
        /** 
         * Procesa anotaciones de inyección de dependencias en AngularJS.
         */
        ngAnnotate: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '.tmp/concat/scripts',
                    src: '*.js',
                    dest: '.tmp/concat/scripts'
                }]
            }
        },
        
        /**
         * Generación dinámica de módulo de constantes para AngularJS.
         */
        ngconstant: {
            options: {
                name: 'app.core',
                deps: false,
                serializerOptions: {
                	indent: '\t',
                	no_trailing_comma: true	// jshint ignore:line
                },
                dest: '<%= gapp.app %>/scripts/modules/core/core.values.js',
                wrap: '(function() {\n\'use strict\';\n// ' + 
                	'ADVERTENCIA!! NO EDITE DIRECTAMENTE ESTE ARCHIVO, EDITE LA TAREA GRUNT NGCONSTANT ' + 
                	'PARA GENERAR ESTE ARCHIVO.\n{%= __ngModule %}\n\n})();'
            },
            dev: {
            	constants: {
                	CONFIG: {
                		env: 'dev',
                		version: '<%= gapp.version %>',
            			debug: true,
            	    	logDebugEnabled: true,
            			appErrorPrefix: '[Error GAPP] ',
            			appTitle: 'GAPP - Services Portal',
            			defaultState: 'task',
            			pageSize: 20,
            			xdAdminServerUrl: 'http://127.0.0.1:9393'
                	}
                }
            },
            prod: {
            	constants: {
            		CONFIG: {
                		env: 'prod',
                		version: '<%= gapp.version %>',
            			debug: false,
            	    	logDebugEnabled: false,
            			appErrorPrefix: '[Error GAPP] ',
            			appTitle: 'GAPP - Services Portal',
            			defaultState: 'task',
            			pageSize: 20,
            			xdAdminServerUrl: 'http://127.0.0.1:9393'
                	}
                }
            }
        },
        
        /**
         * Desplegar dist en AWS S3.
         */
		aws_s3: {	// jshint ignore:line
			options: {
				awsProfile: 'jguerrero',
				bucket: 'console.gsgtech.com',
				region: 'us-east-1',
				progress: 'progressBar',
				uploadConcurrency: 3
			},
			prod: {
				files: [
			        {
			        	expand: true, 
			        	cwd: '<%= gapp.dist %>', 
			        	src: '**/*', 
			        	dest: 'console/'
			        }
		        ]
			}
		}

	});
	
	// Tareas a ejecutar en la versión server ($ grunt server)
	grunt.registerTask('server', [
		'clean:server',
		'bower:install',
		//'wiredep',
		'includeSource',
		'ngconstant:dev',
		'concurrent:server',
		'browserSync',
		'watch'
	]);

	// Tareas a ejecutar las unit test ($ grunt test)
	grunt.registerTask('test', [
		'clean:server',
		//'wiredep:test',
		'includeSource',
		'ngconstant:dev',
		'concurrent:test',
		'karma'
	]);

	// Tareas a ejecutar generar la versión para producción ($ grunt build)
	grunt.registerTask('build', [
		'clean:dist',
		'bower:install',
		//'wiredep:app',
		'includeSource',
		'ngconstant:prod',
		'useminPrepare',
		'concurrent:dist',
		'concat',
		'copy:fonts',
		'copy:dist',
		'ngAnnotate',
		'cssmin',
		'autoprefixer',
		'uglify',
		'rev',
		'usebanner',
		'usemin',
		'htmlmin'
	]);

	// Tarea por defecto (server)
	grunt.registerTask('default', ['server']);

};