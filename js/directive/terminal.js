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
    };

    terminalSetup.controller = function($scope, $timeout, $location, CommandDataSource, CommandUtility, BroadcastUtility)
    {
        $scope.user = 'visitor';
        $scope.terminalBody = '';
        $scope.path = '/home';
        $scope.command = '';
        $scope.manPage = '';
        $scope.commandParts = [];
        $scope.commandHistory = [];
        var commandHistoryIndex = 0;
        $scope.readyForInput = false;
        $scope.showTerminal = false;
        $scope.showTop = false;
        $scope.commandStructure;  //full valid command json structure
        $scope.commandsPretty;

        $scope.grids = [

        ];
        $scope.currentGrid = {
            name: '',
            rows: []
        };


        getCommandStructure();
        function getCommandStructure()
        {
            CommandDataSource.getCommandStructure()
                .success(function(commands)
                {
                    $scope.commandStructure = commands.data;
                    $scope.commandsPretty = JSON.stringify($scope.commandStructure, null, 10);
                    console.log('command structure', $scope.commandStructure);
                })
                .error(function(error){
                    console.log("Failed to get command structure from factory: " + error.message);
                });
        }

        $scope.toggleHelpModal = function()
        {
            $('#helpModal').modal('toggle');
        };

        $scope.$watch('grid', function()
        {
//            console.log('made it to watch');
            if ($scope.grid !== undefined) { BroadcastUtility.updateGrid($scope.grid); }
        },true);

        $scope.updateGrid = function()
        {
//            console.log($scope.grid);
//            var test = {'property': $scope.i};
//            $scope.grid = test;
//            $scope.i++;
//            console.log($scope.grid);
//            $scope.grid.test = 'property' + $scope.i;
//            $scope.i++;
        };

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

        function addArray(arr)
        {
            for(var i = 0; i < arr.length; i++)
            {
                var curr = arr[i];
                $scope.terminalBody += curr + ' ';
            }
        }
        function newTerminalLine()
        {
            addLineNoDelay('\n');
        }

        function executeCommand()
        {
//            console.log('body', $scope.terminalBody);
            if ($scope.terminalBody !== '') newTerminalLine();
            $scope.commandHistory.push($scope.command);
//            console.log('added command, history:', $scope.commandHistory);
            addLineNoDelay($scope.user + '@pseubuntu' + $scope.path + ': ' + $scope.command);
            $scope.commandParts = ($scope.command).split(" ");

            var res = CommandUtility.validateCommand($scope.commandParts);
//            console.log(res);
            if (res.error == false)
            {
                var cmd = res.commandInfo.command.command;
                console.log('cmd', cmd);
                if(cmd === "ls") { ls();}
                else if (cmd === "cd") { cd(res);}
                else if (cmd === "clear") { clear();}
                else if (cmd === "move") { move(res); }
                else if (cmd === "help") { help(); }
                else if (cmd === "man") { man(res); }
                else if (cmd === "create") { create(res); }
                else if (cmd === "git") { git(res); }
                else if (cmd === "add") { add(res); }
                else if (cmd === "rm") { rm(res); }
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
            for(var i = 0; i < info.tier1_arguments.length; i++)
            {
                addLineNoDelay(info.tier1_arguments[i].argument + ' ');
            }
        }
        function cd(res)
        {
            console.log('cd', res.argumentInfo.tier1_arg);
            $scope.path = '/' + res.argumentInfo.tier1_arg.argument;
            $location.path($scope.path);
        }

        function help()
        {
            $scope.toggleHelpModal();
        }
        function clear()
        {
            console.log('clear');
            $scope.terminalBody = '';
            //$scope.terminalBody = $scope.terminalBody.slice(0, $scope.terminalBody.length - 1);
        }

        function man(res)
        {
            console.log('man', res,'../../man/' + res.argumentInfo.tier1_arg.argument + '.txt');
            updateManPage('../../man/' + res.argumentInfo.tier1_arg.argument + '.txt');
            newTerminalLine();
            addLineNoDelay($scope.manPage);
        }

        function updateManPage(command)
        {
            var rawFile = new XMLHttpRequest();
            rawFile.open("GET", command, false);
            rawFile.onreadystatechange = function ()
            {
                if(rawFile.readyState === 4)
                {
                    if(rawFile.status === 200 || rawFile.status == 0)
                    {
                        var allText = rawFile.responseText;
                        $scope.manPage = allText;
                    }
                }
            };
            //return manPage;
            rawFile.send(null);
        }

        function create(res)
        {
            console.log('create', res);
            if(res.argumentInfo.tier1_arg.argument == 'grid')
            {
                $scope.grids.push({
                    name: res.argumentInfo.tier2_userValue,
                    rows: []
                });
                console.log('grids', $scope.grids);
            } else if (res.argumentInfo.tier1_arg.argument == 'row')
            {
                $scope.currentGrid.rows.push(res.argumentInfo.tier2_userValue);
                console.log('current grid', $scope.currentGrid);
            }
        }

        function git(res)
        {
            var win = window.open('https://github.com/TylerSouthmayd/PersonalSite', '_blank');
            win.focus();
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
            var arg1 = res.argumentInfo.tier1_arg.argument;
            var arg2 = res.argumentInfo.tier1_option.option;
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

        function add(res)
        {
            newTerminalLine();
            console.log('add', res);
            console.log('path', $location.path());
            if($location.path() !== '/sandbox')
            {
                addLineNoDelay('Changing directory to  \'\\sandbox\'');
                newTerminalLine();
                $scope.path = '/sandbox';
                $location.path($scope.path);
            }
            $timeout(function()
            {
                addLineNoDelay('Adding copy of \'' + res.argumentInfo.tier1_arg.argument + '\' component');
                newTerminalLine();
                switch(res.argumentInfo.tier1_arg.argument)
                {
                    case "ProjectHeader":
                        $scope.grid= {method: "add", component: "ProjectHeader"};
                        break;
                    case "TylerSouthmayd.com":
                        $scope.grid = {method: "add", component: "TylerSouthmayd.com"};
                        break;
                    case "RaspberryPi":
                        $scope.grid = {method: "add", component: "RaspberryPi"};
                        break;
                    case "UConnSmash.com":
                        $scope.grid = {method: "add", component: "UConnSmash.com"};
                        break;
                    case "Chinook":
                        $scope.grid = {method: "add", component: "Chinook"};
                        break;
                    case "HTMLEditor":
                        $scope.grid = {method: "add", component: "HTMLEditor"};
                        break;
                    case ".":
                        $scope.grid = {method: "add", component: "."};
                        break;
                }
            },350);
        }

        function rm(res)
        {
            newTerminalLine();
            console.log('add', res);
            console.log('path', $location.path());
            if($location.path() !== '/sandbox')
            {
                addLineNoDelay('You can only remove items you have added to the \'\\sandbox\' page');
                newTerminalLine();
            } else
            {
                addLineNoDelay('Attempting to remove copy of \'' + res.argumentInfo.tier1_arg.argument + '\' component');
                newTerminalLine();
                switch(res.argumentInfo.tier1_arg.argument)
                {
                    case "ProjectHeader":
                        $scope.grid={method: "rm", component: "ProjectHeader"};
                        break;
                    case "TylerSouthmayd.com":
                        $scope.grid = {method: "rm", component: "TylerSouthmayd.com"};
                        break;
                    case "RaspberryPi":
                        $scope.grid = {method: "rm", component: "RaspberryPi"};
                        break;
                    case "UConnSmash.com":
                        $scope.grid = {method: "rm", component: "UConnSmash.com"};
                        break;
                    case "Chinook":
                        $scope.grid = {method: "rm", component: "Chinook"};
                        break;
                    case "HTMLEditor":
                        $scope.grid = {method: "rm", component: "HTMLEditor"};
                        break;
                    case ".":
                        $scope.grid = {method: "rm", component: "."};
                        break;

                }
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
                console.log('enter', $scope.command);
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
//                $timeout(function()
//                {
                    var choices = CommandUtility.tab($scope.command);
                    console.log('choices', choices);
                    if (choices.length > 0)
                    {
                        if(choices.length == 1)
                        {
                            console.log('made it');
                            //$scope.command = $scope.command.replace(toComplete, choices[0]);
                            $scope.command = $scope.command.substring(0, $scope.command.lastIndexOf(toComplete)) + choices[0];
                            //ewString = oldString.substring(0,oldString.lastIndexOf("_"))
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
                    } else if (choices.length == 0)
                    {
                        $timeout(function() {
                            console.log('commandutility choices', CommandUtility.choices);
                            if(CommandUtility.choices.length > 0)
                            {
                                if (CommandUtility.choices.length == 1)
                                {
                                    $scope.command += ' ' + CommandUtility.choices[0];
                                } else
                                {
                                    newTerminalLine();
                                    addArray(CommandUtility.choices);
                                }
                            }
                        }, 200);
                    }
//                }, 0);



            }
        };

        $scope.toggleTerminal = function()
        {
            $scope.showTerminal = !$scope.showTerminal;
            if($scope.showTerminal)
            {
                $scope.focusCommandLine();
            }
        };

        $scope.focusCommandLine = function()
        {
            $timeout(function()
            {
//                console.log('commandLine', $('#commandLine'));
                $('#commandLine').focus();
            },0);
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
//                var cmd6 = 'move';
//                var cmd7 = 'clear';
//                var cmd8 = 'create row row_name';
//                var cmd9 = 'create -t row row_name';
//                var cmd10 = 'create row row_name -t';
//                console.log(cmd, CommandUtility.validateCommand(cmd.split(' ')));
//                console.log(cmd1, CommandUtility.validateCommand(cmd1.split(' ')));
//                console.log(cmd2, CommandUtility.validateCommand(cmd2.split(' ')));
//                console.log(cmd3, CommandUtility.validateCommand(cmd3.split(' ')));
//                console.log(cmd4, CommandUtility.validateCommand(cmd4.split(' ')));
//                console.log(cmd5, CommandUtility.validateCommand(cmd5.split(' ')));
//                console.log(cmd6, CommandUtility.validateCommand(cmd6.split(' ')));
//                console.log(cmd7, CommandUtility.validateCommand(cmd7.split(' ')));
//                console.log(cmd8, CommandUtility.validateCommand(cmd8.split(' ')));
//                console.log(cmd9, CommandUtility.validateCommand(cmd9.split(' ')));
//                console.log(cmd10, CommandUtility.validateCommand(cmd10.split(' ')));
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
//            getManPage("../../man/ls.txt");
//            getManPage("../../man/clear.txt");
        }

        $scope.init = function()
        {
            var ms = 15;
            var introText = 'You have control over the website through this terminal.';
            $scope.grid = {};
            $scope.i = 1;
            addLineWithCharDelay(introText,ms);
            $scope.path= $location.path();
            $timeout(function()
            {
                $scope.readyForInput = true;
                $scope.updateGrid();
            }, introText.length*ms);

            test();
        };

        $scope.init();
    };

    return terminalSetup;

});