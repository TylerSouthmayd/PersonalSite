/**
 * Created by Tyler on 7/5/2015.
 */
mainApp.controller('TerminalController', TerminalController);

function TerminalController($scope, $timeout)
{
    $scope.user = 'visitor';
    $scope.terminalBody = '';
    $scope.command = '';
    $scope.commandParts = [];
    $scope.readyForInput = false;
    $scope.commands = [
        {
            "command" : "cd",
            "args" : []
        },
        {
            "command" : "ls",
            "args" : []
        },
        {
            "command" : "view",
            "views" : ["resume", "home"],
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
        if (checkValidity($scope.commandParts))
        {
            $scope.terminalBody += '\r\n&#10';
            if($scope.commandParts[0] === "ls")
            {
                console.log($scope.commands[2].views[i]);
                for(var i = 0; i < $scope.commands[2].views.length; i++)
                {
                    console.log($scope.commands[2].views[i])
                    $scope.terminalBody += $scope.commands[2].views[i] + ' ';
                }

            } else if ($scope.commandParts[0] === "cd")
            {

            } else if ($scope.commandParts[0] === "view")
            {
                if ($scope.commandParts[1] === "resume")
                {
                    //todo
                }
            }
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



    $scope.init = function()
    {
        var introText = 'ofte) at the same to work on the same documents (often code) at the same time, and without stepping';
        addLineWithCharDelay(introText,5);
        $timeout(function()
        {
            $scope.readyForInput = true;
        }, introText.length*5);
    };

    $scope.init();

}