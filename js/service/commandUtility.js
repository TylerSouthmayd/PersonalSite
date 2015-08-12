/**
 * Created by Tyler on 8/2/2015.
 */

mainApp.factory('CommandUtility', CommandUtility);

function CommandUtility(CommandDataSource)
{
    var CommandUtility = [];
    var commandStructure;

    CommandDataSource.getCommandStructure()
        .success(function(commands)
        {
            commandStructure = commands.data;
            console.log('command structure', commandStructure);
        }
    );

    CommandUtility.getCommandStructure = function()
    {
        var cmdStruct = [];
        CommandDataSource.getCommandStructure()
            .success(function(commands)
            {
                cmdStruct = commands.data;
                console.log('command structure', commandStructure);
            }
        );
        return cmdStruct;
    };

    CommandUtility.validateCommand = function(commandParts)
    {
        var result = {
            commandInfo: {command: null, option: null},
            argumentInfo: {argument: null, option: null},
            error: false,
            errorMsg: ''
        };

        var cmd = commandParts[0];
        var currArg = null;
        var cmdOptApplied = false;
        var argOptionApplied = false;

        if(isValidCommand(cmd))
        {
            cmd = getCommandByName(cmd);
            result.commandInfo.command = cmd;
            commandParts.shift();
            while(commandParts.length > 0 && result.error == false)
            {
                if(hasOptStart(commandParts[0]) && currArg == null)  //switch null cond to cmdOptApplied if want to accept options not immediately after the command
                {
                    var success = false;
                    for(var i = 0; i < cmd.options.length; i++)
                    {
                        if(cmd.options[i].option == commandParts[0] || cmd.options[i].option_short == commandParts[0])
                        {
                            result.commandInfo.option = cmd.options[i];
                            cmdOptApplied = true;
                            success = true;
                            break;
                        }
                    }
                    if(success == false) { result.error = true; result.errorMsg = 'Invalid option \'' + commandParts[0] + '\' for command \'' + cmd.command + '\''; }
                } else if (hasOptStart(commandParts[0]))
                {
                    var success = false;
                    if(!argOptionApplied)
                    {
                        for (var i = 0; i < currArg.options.length; i++)
                        {
                            if (currArg.options[i].option == commandParts[0] || currArg.options[i].option_short == commandParts[0])
                            {
                                result.argumentInfo.option = currArg.options[i];
                                success = true;
                                argOptionApplied = true;
                                break;
                            }
                        }
                        if (success == false) { result.error = true; result.errorMsg = 'Invalid option ' + commandParts[0] + ' for argument ' + currArg.argument; }
                    } else
                    {
                        result.error = true;
                        result.errorMsg = 'Invalid option \'' + commandParts[0] + '\' for argument \'' + currArg.argument + '\': already assigned option \'' + result.argumentInfo.option.option + '\'';
                    }
                } else
                {
                    var success = false;
                    for(var i = 0; i < cmd.arguments.length; i++)
                    {
                        if(cmd.arguments[i].argument == commandParts[0])
                        {
                            result.argumentInfo.argument = cmd.arguments[i];
                            currArg = cmd.arguments[i];
                            success = true;
                            break;
                        }
                    }
                    if(success == false) { result.error = true; result.errorMsg = 'Invalid argument \'' + commandParts[0] + '\' for command \'' + cmd.command + '\''; }
                }
                commandParts.shift();
            }
            if(!argOptionApplied && currArg !== null && currArg.requires_option == true  && result.error == false)
            {
                result.error = true;
                result.errorMsg = 'Missing option for argument \'' + currArg.argument + '\'';
            }
        } else  { result.error = true; result.errorMsg = 'Invalid command \'' + commandParts[0] + '\''; }
        if(!cmdOptApplied && cmd.requires_option == true)
        {
            result.error = true;
            result.errorMsg = 'Missing option for command \'' + cmd.command + '\'';
        }
        return result;

    };

    function hasOptStart(optString)
    {
        return optString.indexOf('-') == 0;
    }

    CommandUtility.tab = function(command)
    {
        var commandParts = (command).split(" ");
        var choices = [];
        if(isValidCommand(commandParts[0]))
        {
            var cmd = getCommandByName(commandParts[0]);
            //console.log('cmd', cmd);
            var toComplete = commandParts[commandParts.length - 1];
            if(commandParts.length == 1)
            {
                var cmdguts = getCommandArgsAndOpts(cmd.command);
                choices = choices.concat(cmdguts);
            } else
            {
                var dependency = commandParts[commandParts.length - 2];
                if (dependency == commandParts[0])
                {
                    if(hasOptStart(toComplete))
                    {
                        var res = isValidCommandOptionStart(cmd.command, toComplete)
                        if(res !== false)
                        {
                            choices = choices.concat(res);
                        }
                    } else
                    {
                        //console.log('guess');
                        var res = isValidArgumentStart(cmd.command, toComplete);
                        //console.log('res', res);
                        if(res !== false)
                        {
                            choices = choices.concat(res);
                            //console.log('choices', choices);
                        }
                    }
                } else
                {
                    var arg = getArgByName(cmd, dependency);
                    //console.log('arg', arg);
                    var res = isValidArgumentOptionStart(arg, toComplete);
                    if(res !== false)
                    {
                        choices = choices.concat(res);
                    }
                }

            }
        } else
        {
            var res = isValidCommandStart(commandParts[0]);
            if (res !== false)
            {
                choices = choices.concat(res);
            }
        }
        return choices;
    };

    //param: string cmd name
    function getCommandArgsAndOpts(cmd)
    {
        var ret = [];
        var args = [];
        var opts = [];
        var command = getCommandByName(cmd);
        for(var i = 0; i < command.arguments.length; i++)
        {
            args.push(command.arguments[i].argument);

        }
        for(var i = 0; i < command.options.length; i++)
        {
            opts.push(command.options[i].option);
        }
        ret.push(args, opts);
        return ret;
    }

    function isValidCommand(cmdName)
    {
        for(var i = 0; i < commandStructure.length; i++)
        {
            var curr = commandStructure[i].command;
            if(cmdName == curr)
            {
                return true;
            }
        }
        return false;
    }

    function isValidCommandStart(cmdName)
    {
        var choices = [];
        for(var i = 0; i < commandStructure.length; i++)
        {
            var curr = commandStructure[i].command;
            if(curr.indexOf(cmdName) == 0)
            {
                choices.push(curr);
            }
        }
        return choices.length > 0 ? choices : false;
    }

    function isValidCommandOptionStart(cmdName, optPiece)
    {
        var command = getCommandByName(cmdName);
        var choices = [];
        for(var i = 0; i < command.options.length; i++)
        {
            var curr = command.options[i];
            if((curr.option).indexOf(optPiece) == 0)
            {
                choices.push(curr.option);
            }
            if((curr.option_short).indexOf(optPiece) == 0)
            {
                choices.push(curr.option_short);
            }
        }
        return choices.length > 0 ? choices : false;
    }

    function isValidCommandOption(cmdName, optName)
    {
        var command = getCommandByName(cmdName);
        for(var i = 0; i < command.options.length; i++)
        {
            var curr = command.options[i].option;
            if(optName == curr)
            {
                return true;
            }
        }
        return false;
    }

    function isValidArgumentOptionStart(arg, optPiece)
    {
        var choices = [];
        for(var i = 0; i < arg.options.length; i++)
        {
            var curr = arg.options[i];
            if((curr.option).indexOf(optPiece) == 0)
            {
                choices.push(curr.option);
            }
            if((curr.option_short).indexOf(optPiece) == 0)
            {
                choices.push(curr.option_short);
            }
        }
        return choices.length > 0 ? choices : false;
    }

    function isValidArgumentOption(cmdName, optName)
    {
        var command = getCommandByName(cmdName);
        for(var i = 0; i < command.options.length; i++)
        {
            var curr = command.options[i].option;
            if(optName == curr)
            {
                return true;
            }
        }
        return false;
    }

    function isValidOptionStart(cmdName, optPiece)
    {
        var autocompleteChoices = [];
        var command = getCommandByName(cmdName);
        for(var i = 0; i < command.options.length; i++)
        {
            var curr = command.options[i].option;
            if(curr.indexOf(optPiece) == 0)
            {
                autocompleteChoices.push(curr);
            }
        }
        return autocompleteChoices.length > 0 ? autocompleteChoices : false;
    }

    function isValidArgument(cmdName, argName)
    {
        var command = getCommandByName(cmdName);
        //console.log('isValidArgument Command: ', command);
        for(var i = 0; i < command.arguments.length; i++)
        {
            var curr = command.arguments[i].argument;
            if(argName == curr)
            {
                return true;
            }
        }
        return false;
    }

    function isValidArgumentStart(cmdName, argPiece)
    {
        var autocompleteChoices = [];
        var command = getCommandByName(cmdName);
        for(var i = 0; i < command.arguments.length; i++)
        {
            var curr = command.arguments[i].argument;
            if(curr.indexOf(argPiece) == 0)
            {
                autocompleteChoices.push(curr);
            }
        }
        return autocompleteChoices.length > 0 ? autocompleteChoices : false;
    }

    function getCommandByName(name)
    {
        var cmd;
        for(var i = 0; i < commandStructure.length; i++)
        {
            cmd = commandStructure[i];
            if (cmd.command == name) {
                return cmd;
            }
        }
    }

    function getArgByName(cmd, argName)
    {
        var curr;
        for(var i = 0; i < cmd.arguments.length; i++)
        {
            curr = cmd.arguments[i].argument;
            if (curr == argName) {
                return cmd.arguments[i];
            }
        }
        return false;
    }

    function arrayToString(array)
    {
        var str = '';
        for(var i = 0; i < array.length; i++)
        {
            str += array[i] + ' ';
        }
        return str;
    }

    return CommandUtility;
}