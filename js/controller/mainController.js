/**
 * Created by Tyler on 8/11/2015.
 */
mainApp.controller('MainController', MainController);

function MainController($scope, BroadcastUtility, $timeout)
{
    $scope.toggleHelpModal = function()
    {
        $('#helpModal').modal('toggle');
    };

//    $scope.setGri
}