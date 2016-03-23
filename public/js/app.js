'use strict';

// Declare app level module which depends on filters, and services
angular.module('rsmApp', [
    'ui.bootstrap',
    'ngRoute',
    'rsmApp.filters',
    'rsmApp.services',
    'rsmApp.directives',
    'rsmApp.controllers',
    'message.flash'])
    .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
        $routeProvider.when('/home', {
            templateUrl : 'partials/home.html',
            controller : 'HomeCtrl'
        });

        $routeProvider.when('/admin/login', {
            templateUrl : 'partials/admin/login.html',
            controller : 'AdminLoginCtrl'
        });

        $routeProvider.when('/admin/categories', {
            templateUrl : 'partials/admin/categories.html',
            controller : 'AdminCategoriesCtrl'
        });

        $routeProvider.when('/admin/add-edit-category/:id', {
            templateUrl : 'partials/admin/add-edit-category.html',
            controller : 'AdminEditCategoryCtrl'
        });

        $routeProvider.otherwise({
            redirectTo: '/home'
        });

        $locationProvider.html5Mode(true);
    }]);
