/**
 * Created by Tyler on 8/15/2015.
 */
angular.module('mainApp')
.directive('grid', function ()
{
    var gridSetup = [];

    gridSetup.restrict = 'E';
    gridSetup.templateUrl = '../../partials/grid.html';

    gridSetup.link = function(scope, elem, attr)
    {
        //console.log(scope, elem, attr);
    };

    gridSetup.controller = function($scope, $timeout, BroadcastUtility)
    {
        $scope.grid;
        $scope.index = 1;

        $scope.$watch('grid', function()
        {
            if ($scope.grid !== undefined) { BroadcastUtility.updateGrid($scope.grid); }
        });

        $scope.init = function()
        {
            $timeout(function()
            {
                $scope.grid='test' + 1;
            }, 2000);
        };
        $scope.init();

    };

    return gridSetup;
});