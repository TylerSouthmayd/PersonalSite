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
    $scope.outroText = '';
    var introString = "Hello, I'm Tyler Southmayd. \nWelcome to my personal website...                    ";

    addIntroLineWithCharDelay(introString, 75);
    $timeout(function()
    {
        var outroString = "Click the button to start manipulating what you see.                                                                                             ";
        addOutroLineWithCharDelay(outroString, 75);
        $timeout(function()
        {
            outroString = '\nOr don\'t...';
            addOutroLineWithCharDelay(outroString, 75);
        },75*(outroString.length));
    },75*(introString.length));

    //@Param - String line to add to console output
    //       - int delay (ms)
    function addIntroLineWithCharDelay(line, delay)
    {
        for(var i = 0; i < line.length; i++)
        {
            (function(index)
            {
                $timeout(function()
                {
                    $scope.introText += line.charAt(index);
                }, delay*i);
            })(i);
        }
    }

    function addOutroLineWithCharDelay(line, delay)
    {
        for(var i = 0; i < line.length; i++)
        {
            (function(index)
            {
                $timeout(function()
                {
                    $scope.outroText += line.charAt(index);
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