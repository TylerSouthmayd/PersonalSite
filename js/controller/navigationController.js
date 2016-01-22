/**
 * Created by Tyler on 7/3/2015.
 */
mainApp.controller('NavigationController', NavigationController);

function NavigationController($scope, $location)
{
    $scope.pageLinks = [
        {"label" : "Intro", "path" : "/home"},
        {"label" : "Resume","path" : "/resume"},
        {"label" : "Sandbox","path" : "/sandbox"}
    ];
    $scope.isActive = function (viewLocation) {
        return viewLocation === $location.url();
    }

}