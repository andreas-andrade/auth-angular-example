﻿'use strict';

// declare modules
angular.module('Authentication', []);
angular.module('Home', []);

angular.module('BasicHttpAuthExample', [
    'Authentication',
    'Home',
    'ngRoute',
    'ngCookies'
]).config(['$routeProvider',
    function($routeProvider) {
        $routeProvider
            .when('/login', {
                controller: 'LoginController',
                templateUrl: 'modules/authentication/views/login.html'
            })
            .when('/', {
                controller: 'HomeController',
                templateUrl: 'modules/home/views/home.html'
            })
            .otherwise({
                redirectTo: '/login'
            });
    }
])

.run(['$rootScope', '$location', '$cookies', '$http',
    function($rootScope, $location, $cookies, $http) {
        // keep user logged in after page refresh

        // tenta obter o cookie globals e coloca numa variável global do rootScope
        $rootScope.globals = $cookies.get('globals') || {};
        if ($rootScope.globals.currentUser) {
            $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
        }

        // captura a mudança de página e checa se o usuário está logado.
        // Caso não esteja, redireciona para a página de login
        $rootScope.$on('$locationChangeStart', function(event, next, current) {
            // redirect to login page if not logged in
            if ($location.path() !== '/login' && !$rootScope.globals.currentUser) {
                $location.path('/login');
            }
        });
    }
]);