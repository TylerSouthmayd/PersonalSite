/**
 * Created by Tyler on 7/2/2015.
 */
mainApp.controller('HomeController', HomeController);

function HomeController($scope)
{
    $scope.showNav = true;

    $scope.toggleNav = function()
    {
        $scope.showNav = !$scope.showNav;
    };

}