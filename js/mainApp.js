/**
 * Created by Tyler on 7/2/2015.
 */
var mainApp = angular.module('mainApp',['ui.bootstrap','ngRoute', 'ngAnimate']);
    //['ngRoute', 'ui.bootstrap']);

mainApp.config(['$routeProvider', function ($routeProvider)
    {
        $routeProvider.when ('/home',
            {
                controller: 'HomeController',
                templateUrl: 'views/home.html'
            }
        ).
            when ('/resume',
            {
                controller: 'HomeController',
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