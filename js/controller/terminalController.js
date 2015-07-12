/**
 * Created by Tyler on 7/5/2015.
 */
mainApp.controller('TerminalController', TerminalController);

function TerminalController($scope, $timeout, $location)
{
    $scope.user = 'visitor';
    $scope.terminalBody = '';
    $scope.path = '/home'
    $scope.command = '';
    $scope.commandParts = [];
    $scope.readyForInput = false;
    $scope.showTerminal = true;
    $scope.commands = [
        {
            "command" : "cd",
            "args" : ["resume", "home"]
        },
        {
            "command" : "ls",
            "args" : []
        },
        {
            "command" : "view",
            "views" : ["resume", "home"],
            "args" : []
        },
        {
            "command" : "clear",
            "args" : []
        }];

    //@Param - String line to add to console output
    //       - int delay (ms)
    function addLineWithCharDelay(line, delay)
    {
        for(var i = 0; i < line.length; i++)
        {
            (function(index) {
                $timeout(function()
                {
                    $scope.terminalBody += line.charAt(index);
                }, delay*i);
            })(i);
        }
    }

    function addLineNoDelay(line)
    {
        addLineWithCharDelay(line, 0);
    }

    function executeCommand()
    {
        $scope.commandParts = ($scope.command).split(" ");
        if($scope.terminalBody !== '') $scope.terminalBody += '\r\n';
        if (checkValidity($scope.commandParts))
        {
            if($scope.commandParts[0] === "ls")
            {
                console.log($scope.commands[2].views[i]);
                $scope.terminalBody += 'Navigate to: \n\t'
                for(var i = 0; i < $scope.commands[2].views.length; i++)
                {
                    console.log($scope.commands[2].views[i])
                    $scope.terminalBody += $scope.commands[2].views[i] + ' ';
                }
                $scope.terminalBody += '\nusing the \'cd\' command.';

            } else if ($scope.commandParts[0] === "cd")
            {
                $scope.path = '/' + $scope.commandParts[1];
                $location.path($scope.path);
            } else if ($scope.commandParts[0] === "view")
            {
                if ($scope.commandParts[1] === "resume")
                {
                    //todo
                }
            } else if ($scope.commandParts[0] === "clear")
            {
                $scope.terminalBody = '';
                $scope.terminalBody = $scope.terminalBody.slice(0, $scope.terminalBody.length - 1);
            }
        } else
        {
            $scope.terminalBody += 'Invalid Command: ' + $scope.commandParts[0];
        }

    }

    function checkValidity(inputArray)
    {
        var isValid = false;
        var size = inputArray.length;
        var piece, cmd;
        for(var i = 0; i < size; i++)
        {
            piece = inputArray[i];
            for(var j = 0; j < $scope.commands.length; j++)
            {
                cmd = $scope.commands[j];
                if (piece == cmd.command)
                {
                    isValid = true;
                    break;
                }
            }
        }
        console.log(isValid);
        return isValid;
    }

    $scope.captureKeyPress = function(event)
    {
        if(event.which === 13)
        {
            executeCommand();
            $scope.command = '';
        }

    };

    $scope.determineTerminalPosition = function()
    {

    };


    $scope.init = function()
    {
        var introText = 'Hello, I\'m Tyler Southmayd. Welcome to my personal website.                          \n';
        introText += 'You have control over the website through this terminal, type \"help pseubuntu\" for more information.'
        addLineWithCharDelay(introText,15);
        $timeout(function()
        {
            $scope.readyForInput = true;
        }, introText.length*15);
    };

    $scope.init();

}