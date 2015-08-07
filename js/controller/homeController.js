/**
 * Created by Tyler on 7/2/2015.
 */
mainApp.controller('HomeController', HomeController);

function HomeController($scope, $timeout)
{
    $scope.showNav = false;

    $scope.toggleNav = function()
    {
        $scope.showNav = !$scope.showNav;
    };
    $scope.introText = '';
    var introString = "Hello, I'm Tyler Southmayd. \nWelcome to my personal website......."
    addLineWithCharDelay(introString, 75);

    //@Param - String line to add to console output
    //       - int delay (ms)
    function addLineWithCharDelay(line, delay)
    {
        for(var i = 0; i < line.length; i++)
        {
            (function(index)
            {
                $timeout(function()
                {
                    $scope.introText += line.charAt(index);
                    $scope.$apply();
                }, delay*i);
            })(i);
        }
    }

    function addLineNoDelay(line)
    {
        $scope.introText += line;
    }

    function newTerminalLine()
    {
        addLineNoDelay('\n');
    }

}