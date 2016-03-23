'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('rsmApp.services', [])
    .value('version', '0.1')
    .factory('categoriesFactory', ['$http',
        function($http) {
            return {
                getCategories : function() {
                    return $http.get('/api/categories');
                },

                saveCategory : function(categoryData) {
                    var id = categoryData._id;

                    if (id == 0) {
                        return $http.post('/api/categories/add', categoryData);
                    } else {
                        return $http.post('/api/categories/update/' + id, categoryData);
                    }
                },

                deleteCategory : function(id) {
                    return $http.get('/api/categories/delete/' + id);
                },

                getCategory : function(id) {
                    return $http.get('/api/categories/' + id);
                },

                getServices : function(id) {
                    return $http.get('/api/categories/services/' + id);
                }
            };
        }]);
