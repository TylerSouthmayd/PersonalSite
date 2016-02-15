/**
 * Created by Tyler on 7/2/2015.
 */
var mainApp = angular.module('mainApp',['ui.bootstrap','ngRoute', 'ngAnimate', 'monospaced.elastic']);
    //['ngRoute', 'ui.bootstrap']);

mainApp.config(['$routeProvider', function ($routeProvider)
    {
        $routeProvider.when ('/home',
            {
                controller: 'MainController',
                templateUrl: 'views/sandbox.html'
            }
        ).
//            when ('/resume',
//            {
//                controller: 'MainController',
//                templateUrl: 'views/resume.html'
//            }
//        ).  when ('/sandbox',
//            {
//                controller: 'MainController',
//                templateUrl: 'views/sandbox.html'
//            }
//        ).
            otherwise(
            {
                redirectTo: '/home'
            }
        );
    }
]);