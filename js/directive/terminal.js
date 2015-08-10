/**
 * Created by Tyler on 7/23/2015.
 */
angular.module('mainApp')
.directive('terminal', function ()
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
        $scope.path = '/home';
        $scope.command = '';
        $scope.commandParts = [];
        $scope.commandHistory = [];
        var commandHistoryIndex = 0;
        $scope.readyForInput = false;
        $scope.showTerminal = true;
        $scope.showTop = false;
        $scope.commandStructure;  //full valid command json structure

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

            var res = CommandUtility.validateCommand($scope.commandParts);
            console.log(res);
            if (res.error == false)
            {
                var cmd = res.commandInfo.command.command;
                console.log('cmd', cmd);
                if(cmd === "ls") { ls();}
                else if (cmd === "cd") { cd(res);}
                else if (cmd === "clear") { clear();}
                else if (cmd === "move") { move(res); }
            }
            else
            {
                newTerminalLine();
                addLineNoDelay(res.errorMsg);
            }

        }

        function ls()
        {
            console.log('l3s');
            console.log('info1');
            var info = getCommandByName("cd");
            console.log('info2', info);

            newTerminalLine();
            for(var i = 0; i < info.arguments.length; i++)
            {
                addLineNoDelay(info.arguments[i].argument + ' ');
            }
        }
        function cd(res)
        {
            console.log('cd', res.argumentInfo.argument.argument);
            $scope.path = '/' + res.argumentInfo.argument.argument;
            $location.path($scope.path);
        }

        function clear()
        {
            console.log('clear');
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

        function move(res)
        {
            console.log('move');
            var arg1 = res.argumentInfo.argument.argument;
            var arg2 = res.argumentInfo.option.option;
            console.log('arg1', arg1, 'arg2', arg2);
            if(arg1 == 'terminal') {
                newTerminalLine();
                if (arg2 == '--top' || arg2 == '-t') {
                    if ($scope.showTop) {
                        addLineNoDelay("The terminal is already on the top of the view.");
                    }
                    else {
                        addLineNoDelay("The terminal is currently on the bottom of the view");
                        newTerminalLine();
                        addLineNoDelay("Moving terminal to top of the view.");
                    }
                    $scope.showTop = true;
                } else if (arg2 == '--bottom' || arg2 == '-b') {
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
                var toComplete = $scope.commandParts[$scope.commandParts.length - 1];
                var choices = CommandUtility.tab($scope.command);
                console.log('choices', choices);

                if (choices.length > 0)
                {
                    if(choices.length == 1)
                    {
                        console.log('made it');
                        $scope.command = $scope.command.replace(toComplete, choices[0]);
                    } else
                    {
                        newTerminalLine();
                        addLineNoDelay($scope.user + '@pseubuntu' + $scope.path + ': ' + $scope.command);
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

        $scope.toggleTerminal = function()
        {
            $scope.showTerminal = !$scope.showTerminal;
        };
        function test()
        {
            //console.log('hasOptStart', hasOptStart('-t'), hasOptStart('4-'), hasOptStart('--bottom'));

//            $timeout(function()
//            {
//                var cmd = 'cd resume';
//                var cmd1 = 'move terminal -t';
//                var cmd2 = 'move terminal --top';
//                var cmd3 = 'move terminal --top -b';
//                var cmd4 = 'clar';
//                var cmd5 = 'move terml --bottom';
//                var cmd6 = 'move terminal';
//                var cmd7 = 'clear';
//                console.log(cmd, CommandUtility.validateCommand(cmd.split(' ')));
//                console.log(cmd1, CommandUtility.validateCommand(cmd1.split(' ')));
//                console.log(cmd2, CommandUtility.validateCommand(cmd2.split(' ')));
//                console.log(cmd3, CommandUtility.validateCommand(cmd3.split(' ')));
//                console.log(cmd4, CommandUtility.validateCommand(cmd4.split(' ')));
//                console.log(cmd5, CommandUtility.validateCommand(cmd5.split(' ')));
//                console.log(cmd6, CommandUtility.validateCommand(cmd6.split(' ')));
//                console.log(cmd7, CommandUtility.validateCommand(cmd7.split(' ')));
//
//            }, 2500);
//            $timeout(function()
//            {
//                var cmd = 'cd res';
//                var cmd1 = 'move';
//                var cmd2 = 'move terminal';
//                var cmd3 = 'move terminal --t';
//                var cmd4 = 'c';
//                var cmd5 = 'cd';
//                var cmd6 = 'move terminl';
//                console.log(cmd, CommandUtility.tab(cmd));
//                console.log(cmd1, CommandUtility.tab(cmd1));
//                console.log(cmd2, CommandUtility.tab(cmd2));
//                console.log(cmd3, CommandUtility.tab(cmd3));
//                console.log(cmd4, CommandUtility.tab(cmd4));
//                console.log(cmd5, CommandUtility.tab(cmd5));
//                console.log(cmd6, CommandUtility.tab(cmd6));
//
//            }, 1500);
        }

        $scope.init = function()
        {
            var ms = 0;
            var introText = 'You have control over the website through this terminal.';
            addLineWithCharDelay(introText,ms);
            $scope.path= $location.path();
            $timeout(function()
            {
                $scope.readyForInput = true;
            }, introText.length*ms);
            test();
        };

        $scope.init();
    };

    return terminalSetup;

});