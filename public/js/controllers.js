'use strict';

/* Controllers */

angular.module('rsmApp.controllers', [])
    .controller('HomeCtrl', ['$scope', '$log', 'categoriesFactory',
        function($scope, $log, categoriesFactory) {
            var baseUrl = 'http://lorempixel.com/960/450';
            var currIndex = 0;

            $scope.noWrapSlides = false;
            $scope.active = 0;
            $scope.myInterval = 5000;

            $scope.allSlides = [
                {
                    title : 'Best Electrician',
                    image : baseUrl + '/abstract',
                    text : 'Best electrician till date',
                    id : currIndex++
                },
                {
                    title : 'Best Plumber',
                    image : baseUrl + '/business',
                    text : 'Best plumber till date',
                    id : currIndex++
                },
                {
                    title : 'Home Worker',
                    image : baseUrl + '/nightlife',
                    text : 'Best home worker till date',
                    id : currIndex++
                },
                {
                    title : 'Cook',
                    image : baseUrl + '/food',
                    text : 'Best cook',
                    id : currIndex++
                }
            ];
        }
    ])
    .controller('AdminCategoriesCtrl', ['$scope', '$log', 'categoriesFactory',
        '$location', 'flashMessageService',
        function($scope, $log, categoriesFactory, $location, flashMessageService) {
            categoriesFactory.getCategories().then(
                function(response) {
                    $scope.allCategories = response.data;
                },
                function(err) {
                    $log.error(err);
                }
            );

            $scope.deleteCategory = function(id) {
                categoriesFactory.deleteCategory(id).then(
                    function (response) {
                        flashMessageService.setMessage(response.data);
                        $location.path('/admin/categories');
                    },
                    function(err) {
                        flashMessageService.setMessage('Unable to delete category');
                        $location.path('/admin/categories');
                    }
                );
            };
        }
    ])
    .controller('AdminEditCategoryCtrl', ['$scope', '$log', 'categoriesFactory',
        '$routeParams', '$location', 'flashMessageService',
        function($scope, $log, categoriesFactory, $routeParams, $location, flashMessageService) {
            $scope.categoryContent = {};
            $scope.categoryContent._id = $routeParams.id;
            $scope.heading = 'Add a New Category';

            if ($scope.categoryContent._id != 0) {
                $scope.heading = 'Update Category';
                categoriesFactory.getCategory($scope.categoryContent._id).then(
                    function(response) {
                        $scope.categoryContent = response.data;
                    },
                    function(err) {
                        flashMessageService.setMessage('Unable to get category content');
                    }
                );
            }

            $scope.saveCategory = function() {
                categoriesFactory.saveCategory($scope.categoryContent).then(
                    function(response) {
                        flashMessageService.setMessage('Category saved successfully');
                        $location.path('/admin/categories');
                    },
                    function(err) {
                        flashMessageService.setMessage('Unable to save category');
                        $location.path('/admin/categories');
                    }
                );
            };
        }
    ]);
