/**
 * Created by Tyler on 7/2/2015.
 */
var mainApp = angular.module('mainApp',['ngRoute']);
    //['ngRoute', 'ui.bootstrap']);

mainApp.config(['$routeProvider', function ($routeProvider)
    {
        $routeProvider.when ('/home',
            {
                controller: 'homeController',
                templateUrl: 'views/home.html'
            }
        ).
            when ('/resume',
            {
                controller: 'homeController',
                templateUrl: 'views/resume.html'
            }
        ).
            otherwise(
            {
                redirectTo: '/home'
            }
        );
    }
]);