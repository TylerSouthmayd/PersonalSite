/**
 * Created by Tyler on 7/23/2015.
 */
angular.module('mainApp')
.directive('terminal', function (CommandDataSource)
{
    var terminalSetup = [];

    terminalSetup.restrict = 'E';
    terminalSetup.templateUrl = '../../partials/terminal.html';

    terminalSetup.link = function(scope, elem, attr)
    {
        //console.log(scope, elem, attr);
    };

    terminalSetup.controller = function($scope, $timeout, $location, CommandDataSource)
    {
        $scope.user = 'visitor';
        $scope.terminalBody = '';
        $scope.path = '/home'
        $scope.command = '';
        $scope.commandParts = [];
        $scope.readyForInput = false;
        $scope.showTerminal = true;
        $scope.showTop = false;
        $scope.commands;

        getCommands();
        function getCommands()
        {
            CommandDataSource.getCommandStructure()
                .success(function(commands)
                {
                    $scope.commands = commands.data;
                    console.log('commands', $scope.commands);
                })
                .error(function(error){
                    console.log("Failed to get commands from factory: " + error.message);
                });
        }


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
                        $scope.terminalBody += line.charAt(index);
                    }, delay*i);
                })(i);
            }
        }

        function addLineNoDelay(line)
        {
            $scope.terminalBody += line;
        }

        function newTerminalLine()
        {
            addLineNoDelay('\n');
        }

        function executeCommand()
        {
            console.log('body', $scope.terminalBody);
            if ($scope.terminalBody !== '') newTerminalLine();
            addLineNoDelay($scope.user + '@pseubuntu' + $scope.path + ': ' + $scope.command);
            $scope.commandParts = ($scope.command).split(" ");

            if (checkValidity($scope.commandParts))
            {
                if($scope.commandParts[0] === "ls") { ls();}
                else if ($scope.commandParts[0] === "cd") { cd();}
                else if ($scope.commandParts[0] === "view") { view();}
                else if ($scope.commandParts[0] === "clear") { clear();}
                else if ($scope.commandParts[0] === "move") { move(); }
            } else
            {
                newTerminalLine();
                addLineNoDelay('Invalid Command: ' + $scope.commandParts[0]);
            }

        }

        function ls()
        {
            var info = getCommandByName("cd");

            newTerminalLine();
            for(var i = 0; i < info.arguments.length; i++)
            {
                addLineNoDelay(info.arguments[i].argument + ' ');
            }
        }
        function view()
        {
            if ($scope.commandParts[1] === "resume")
            {
                //todo
            }
        }
        function cd()
        {
            $scope.path = '/' + $scope.commandParts[1];
            $location.path($scope.path);
        }

        function clear()
        {
            $scope.terminalBody = '';
            //$scope.terminalBody = $scope.terminalBody.slice(0, $scope.terminalBody.length - 1);
        }
        function getCommandByName(name)
        {
            var cmd;
            for(var i = 0; i < $scope.commands.length; i++)
            {
                cmd = $scope.commands[i];
                if (cmd.command == name) {
                    return cmd;
                }
            }
        }

        function move()
        {
            var arg1 = $scope.commandParts[1];
            var arg2 = $scope.commandParts[2];
            if(arg1 == 'terminal') {
                if (arg2 == 'top') {
                    if ($scope.showTop) {
                        addLineNoDelay("The terminal is already on the top of the view.");
                    }
                    else {
                        addLineNoDelay("The terminal is currently on the bottom of the view");
                        newTerminalLine();
                        addLineNoDelay("Moving terminal to top of the view.");
                    }

                    $scope.showTop = true;
                } else if (arg2 == 'bottom') {
                    if (!$scope.showTop) {
                        addLineNoDelay("The terminal is already on the bottom of the view.");
                    }
                    else {
                        addLineNoDelay("The terminal is currently on the top of the view");
                        newTerminalLine();
                        addLineNoDelay("Moving terminal to bottom of the view.");
                    }
                    $scope.showTop = false;
                } else {
                    addLineNoDelay("Invalid arg" + arg2 + "for command move");
                }
            } else
            {
                addLineNoDelay("Invalid element to move: " + arg1);
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
                console.log(piece);
                for(var j = 0; j < $scope.commands.length; j++)
                {
                    cmd = $scope.commands[j].command;
                    if (piece == cmd)
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
                event.preventDefault();
                console.log($scope.command);
                executeCommand();
                $scope.command = '';
            }

        };

        $scope.determineTerminalPosition = function()
        {

        };

        $scope.toggleTerminal = function()
        {
            $scope.showTerminal = !$scope.showTerminal;
        };

        $scope.init = function()
        {
            var introText = 'Hello, I\'m Tyler Southmayd. Welcome to my personal website.                          \n';
            introText += 'You have control over the website through this terminal, type \"help pseubuntu\" for more information.'
            addLineNoDelay(introText,15);
            $scope.path= $location.path();
            $timeout(function()
            {
                $scope.readyForInput = true;
            }, introText.length*0);
        };

        $scope.init();
    };



    return terminalSetup;

});
