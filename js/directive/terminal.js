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

    terminalSetup.controller = function($scope, $timeout, $location, CommandDataSource, CommandUtility)
    {
        $scope.user = 'visitor';
        $scope.terminalBody = '';
        $scope.path = '/home'
        $scope.command = '';
        $scope.commandParts = [];
        $scope.commandHistory = [];
        var commandHistoryIndex = 0;
        $scope.readyForInput = false;
        $scope.showTerminal = false;
        $scope.showTop = false;
        $scope.commandStructure;  //full valid command json structure
        $scope.commands;          //list of valid commands

        getCommandStructure();
        function getCommandStructure()
        {
            CommandDataSource.getCommandStructure()
                .success(function(commands)
                {
                    $scope.commandStructure = commands.data;
                    console.log('command structure', $scope.commandStructure);
                })
                .error(function(error){
                    console.log("Failed to get command structure from factory: " + error.message);
                });
        }

//        getCommands();
//        function getCommands()
//        {
//            CommandDataSource.getAllCommands()
//                .success(function(commands)
//                {
//                    $scope.commands = commands.data;
//                    console.log('commands', $scope.commands);
//                })
//                .error(function(error){
//                    console.log("Failed to get commands from factory: " + error.message);
//                });
//        }

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
            $scope.commandHistory.push($scope.command);
            console.log('added command, history:', $scope.commandHistory);
            addLineNoDelay($scope.user + '@pseubuntu' + $scope.path + ': ' + $scope.command);
            $scope.commandParts = ($scope.command).split(" ");

            if (CommandUtility.isCommandLineValid($scope.command))
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
            for(var i = 0; i < $scope.commandStructure.length; i++)
            {
                cmd = $scope.commandStructure[i];
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
                if (arg2 == '-top') {
                    if ($scope.showTop) {
                        addLineNoDelay("The terminal is already on the top of the view.");
                    }
                    else {
                        addLineNoDelay("The terminal is currently on the bottom of the view");
                        newTerminalLine();
                        addLineNoDelay("Moving terminal to top of the view.");
                    }

                    $scope.showTop = true;
                } else if (arg2 == '-bottom') {
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

        $scope.captureKeyPress = function(event)
        {
            //console.log(event);
            //console.log($scope.commandHistory);

                //enter
            if(event.which === 13)
            {
                event.preventDefault();
                console.log($scope.command);
                executeCommand();
                $scope.command = '';
                commandHistoryIndex = $scope.commandHistory.length;

                //up
            } else if(event.which === 38)
            {
                event.preventDefault();
                console.log('up');
                if(commandHistoryIndex !== 0) { commandHistoryIndex--; }
                $scope.command =  $scope.commandHistory[commandHistoryIndex];
                console.log($scope.command);

                //down
            } else if(event.which === 40)
            {
                event.preventDefault();
                console.log('down');
                if(commandHistoryIndex !== $scope.commandHistory.length - 1) { commandHistoryIndex++; }
                $scope.command =  $scope.commandHistory[commandHistoryIndex];
                console.log($scope.command);

                //tab
            } else if(event.which === 9)
            {
                event.preventDefault();
                console.log('tab', $scope.command);

                $scope.commandParts = ($scope.command).split(" ");
                var userCommand = $scope.commandParts[0];
                var toComplete = $scope.commandParts[$scope.commandParts.length - 1];
//                if(userCommand == toComplete)
//                {
//
//                }
//
//                var isOption = false;
//                if (toComplete.indexOf('-') !== -1)
//                {
//                    isOption = true;
//                    toComplete.replace('-', '');
//
//                }
//                var choices = CommandUtility.autocompleteCommandPiece(userCommand, toComplete, isOption);
                var choices = CommandUtility.autocompleteCommandLine($scope.command);
                console.log(choices);
                if (choices.length > 0)
                {
                    if(choices.length == 1)
                    {
                        console.log('made it');
                        $scope.command = $scope.command.replace(toComplete, choices[0]);
                    } else
                    {
                        var retStr = '';
                        for(var i = 0; i < choices.length; i++)
                        {
                            retStr += choices[i] + ' ';
                        }
                        newTerminalLine();
                        addLineNoDelay(retStr);
                    }
                }

            }
        };
        function getCommandByName(cmd)
        {
            for(var i = 0; i < $scope.commandStructure.length; i++)
            {
                if($scope.commandStructure[i].command == cmd)
                {
                    //console.log('getCommandByName', $scope.commandStructure[i]);
                    return $scope.commandStructure[i];
                }
            }
            return null;
        }

        $scope.toggleTerminal = function()
        {
            $scope.showTerminal = !$scope.showTerminal;
        };

        $scope.init = function()
        {
            var ms = 15;
            var introText = 'You have control over the website through this terminal.';
            addLineWithCharDelay(introText,ms);
            $scope.path= $location.path();
            $timeout(function()
            {
                $scope.readyForInput = true;
            }, introText.length*ms);
        };

        $scope.init();
    };



    return terminalSetup;

});