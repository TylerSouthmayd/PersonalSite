/**
 * Created by Tyler on 7/3/2015.
 */
mainApp.controller('NavigationController', NavigationController);

function NavigationController($scope, $location)
{
    $scope.pageLinks = [{"label" : "Home", "path" : "/home"},{"label" : "Resume","path" : "/resume"}];
    $scope.isActive = function (viewLocation) {
        return viewLocation === $location.url();
    }

}