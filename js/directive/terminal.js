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
            $scope.grid = '';
        },true);

        $scope.$on('Console Message', function(prop, args)
        {
            console.log('msg arg', args);
            if(args.consoleCommand == true)
            {
                $scope.command = args.method;
                executeCommand();
            } else
            {
                newTerminalLine();
                addLineNoDelay(args);
            }
//            $scope.commandHistory.push(args.method);
        });

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
            console.log('validation result', res);
            if (res.error == false)
            {
                var cmd = res.commandInfo.command.command;
                console.log('cmd', cmd);
                switch(cmd)
                {
                    case "ls":
                        ls(res);
                        break;
                    case "cd":
                        cd(res);
                        break;
                    case  "clear":
                        clear(res);
                        break;
                    case "mv":
                        mv(res);
                        break;
                    case "man":
                        man(res);
                        break;
                    case  "help":
                        help(res);
                        break;
                    case  "add":
                        add(res);
                        break;
                    case  "rm":
                        rm(res);
                        break;
                    case "git":
                        git(res);
                        break;
                }
            }
            else
            {
                newTerminalLine();
                addLineNoDelay(res.errorMsg);
            }

            $scope.command = '';
            commandHistoryIndex = $scope.commandHistory.length;
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
            var arg = res.argumentInfo.tier1_arg.argument;
            $scope.path = '/' + arg;
            switch(arg)
            {
                case "home":
                    $scope.grid = [
                        {method: 'rm', component: '.', exclude: 'navbar'},
                        {method: 'add', component: 'intro'}
                    ];
                    BroadcastUtility.activateTab('intronav');
                    break;
                case "resume":
                    $scope.grid = [
                        {method: 'rm', component: '.', exclude: 'navbar'},
                        {method: 'add', component: 'resume'}
                    ];
                    BroadcastUtility.activateTab('resumenav');
                    break;
                case "sandbox":
                    $scope.grid = [
                        {method: 'rm', component: '.', exclude: 'navbar'}
                    ];
                    BroadcastUtility.activateTab('sandboxnav');
                    break;
                case "lazyview":
                    $scope.grid = [
                        {method: 'rm', component: '.', exclude: 'navbar'},
                        {method: 'add', component: '.', exclude: 'navbar'}
                    ];
                    BroadcastUtility.activateTab('lazynav');
                    break;
            }

//            $location.path($scope.path);
//            $location.path($scope.path).search({navigation: $scope.showNavigation || false});
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

        function mv(res)
        {
            newTerminalLine();
            console.log('move', res);
            var option = res.argumentInfo.tier1_option || res.argumentInfo.tier2_option || false;
            option = !option ? false : option.option;
            var arg2 = res.argumentInfo.tier2_arg != null ? res.argumentInfo.tier2_arg.argument : false;

            if(res.argumentInfo.tier1_arg.argument == 'project')
            {
                switch(arg2)
                {
                    case "projectheader":
                        $scope.grid = {method: "mv", component: "projects/projectheader", option: option};
                        break;
                    case "tylersouthmayd.com":
                        $scope.grid = {method: "mv", component: "projects/tylersouthmayd.com", option: option};
                        break;
                    case "raspberrypi":
                        $scope.grid = {method: "mv", component: "projects/raspberrypi", option: option};
                        break;
                    case "uconnsmash.com":
                        $scope.grid = {method: "mv", component: "projects/uconnsmash.com", option: option};
                        break;
                    case "chinook":
                        $scope.grid = {method: "mv", component: "projects/chinook", option: option};
                        break;
                    case "htmleditor":
                        $scope.grid = {method: "mv", component: "projects/htmleditor", option: option};
                        break;
                }
            } else
            {
                $scope.grid = {
                    method: "mv",
                    component: res.argumentInfo.tier1_arg.argument,
                    option: option
                };

            }
            addLineNoDelay('moving \'' + $scope.grid.component + '\' component');
        }

        function add(res)
        {
            newTerminalLine();
            console.log('add', res);
            var option = res.argumentInfo.tier1_option || res.argumentInfo.tier2_option || false;
            option = !option? false : option.option;
            var arg2 = res.argumentInfo.tier2_arg != null ? res.argumentInfo.tier2_arg.argument : false;
            var excludeNav = option == '--exclude' && arg2 == 'navbar';

            if(res.argumentInfo.tier1_arg.argument == 'project')
            {
                switch(res.argumentInfo.tier2_arg.argument)
                {
                    case "projectheader":
                        $scope.grid = {method: "add", component: "projects/projectheader"};
                        break;
                    case "tylersouthmayd.com":
                        $scope.grid = {method: "add", component: "projects/tylersouthmayd.com"};
                        break;
                    case "raspberrypi":
                        $scope.grid = {method: "add", component: "projects/raspberrypi"};
                        break;
                    case "uconnsmash.com":
                        $scope.grid = {method: "add", component: "projects/uconnsmash.com"};
                        break;
                    case "chinook":
                        $scope.grid = {method: "add", component: "projects/chinook"};
                        break;
                    case "htmleditor":
                        $scope.grid = {method: "add", component: "projects/htmleditor"};
                        break;
                    case ".":
                        $scope.grid = {method: "add", component: ".", exclude: excludeNav ? 'navbar' : false};
                        break;
                }
            } else
            {
                $scope.grid = {
                    method: "add",
                    component: res.argumentInfo.tier1_arg.argument,
                    exclude: excludeNav? 'navbar' : false};

            }

            if($scope.grid.component == '.')
            {
                addLineNoDelay('adding all components not already displayed');
            } else addLineNoDelay('adding \'' + $scope.grid.component + '\' component if not already displayed');
        }

        function rm(res)
        {
            newTerminalLine();
            console.log('rm', res);

            var option = res.argumentInfo.tier1_option || res.argumentInfo.tier2_option || false;
            option = !option? false : option.option;
            var arg2 = res.argumentInfo.tier2_arg != null ? res.argumentInfo.tier2_arg.argument : false;
//            console.log('rm option and arg2', option, arg2);
            var excludeNav = option == '--exclude' && arg2 == 'navbar';

            if(res.argumentInfo.tier1_arg.argument == 'project')
            {
                switch (res.argumentInfo.tier2_arg.argument)
                {
                    case "projectheader":
                        $scope.grid = {method: "rm", component: "projects/projectheader"};
                        break;
                    case "tylersouthmayd.com":
                        $scope.grid = {method: "rm", component: "projects/tylersouthmayd.com"};
                        break;
                    case "raspberrypi":
                        $scope.grid = {method: "rm", component: "projects/raspberrypi"};
                        break;
                    case "uconnsmash.com":
                        $scope.grid = {method: "rm", component: "projects/uconnsmash.com"};
                        break;
                    case "chinook":
                        $scope.grid = {method: "rm", component: "projects/chinook"};
                        break;
                    case "htmleditor":
                        $scope.grid = {method: "rm", component: "projects/htmleditor"};
                        break;
                    case ".":
                        $scope.grid = {method: "rm", component: "."};
                        break;
                }
            } else
            {
                if (res.argumentInfo.tier1_arg.argument == 'intro') { BroadcastUtility.resetIntro();}
                $scope.grid = {
                    method: "rm",
                    component: res.argumentInfo.tier1_arg.argument,
                    exclude: excludeNav? 'navbar' : false
                };
            }
            if($scope.grid.component == '.')
            {
                addLineNoDelay('removing all components');
            } else addLineNoDelay('removing \'' + $scope.grid.component + '\' component if displayed');
        }

        $scope.captureKeyPress = function(event)
        {
            //console.log(event);
            //console.log($scope.commandHistory);

                //enter
            if(event.which === 13)
            {
                event.preventDefault();
                $scope.command = ($scope.command).toLowerCase();
                console.log('enter', $scope.command);
                executeCommand();

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
            $timeout(function()
            {
                $scope.showTerminal = !$scope.showTerminal;
                if($scope.showTerminal)
                {
                    $scope.focusCommandLine();
                }
            },200);
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
            }, introText.length*ms);

            test();
        };

        $scope.init();
    };

    return terminalSetup;

});