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
            argumentInfo: {tier1_arg: null, tier1_option: null,tier2_arg: null, tier2_option: null, tier2_userValue: false},
            error: false,
            errorMsg: ''
        };

        var cmd = commandParts[0];
        var currArg = null;
        var cmdOptApplied = false;
        var argOptionApplied = false;
        var tier1Applied = false;
        var tier2Applied = false;

        if(isValidCommand(cmd))
        {
            cmd = getCommandByName(cmd);
            result.commandInfo.command = cmd;
            commandParts.shift();
            var success;
            while(commandParts.length > 0 && result.error == false)
            {
                success = false;
                if(hasOptStart(commandParts[0]))  //switch null cond to cmdOptApplied if want to accept options not immediately after the command
                {
                    if(currArg !== null && !argOptionApplied)
                    {
                        if(!argOptionApplied)
                        {
                            for (var i = 0; i < currArg.options.length; i++)
                            {
                                curr = currArg.options[i];
                                if (curr.option == commandParts[0] || curr.option_short == commandParts[0])
                                {
                                    success = true;
                                    argOptionApplied = true;
                                    if(currArg.tier == 1) { result.argumentInfo.tier1_option = currArg.options[i]; }
                                    else if(currArg.tier == 2) { result.argumentInfo.tier2_option = currArg.options[i]; }
                                    break;
                                }
                            }
                            if (success == false) { result.error = true; result.errorMsg = 'Invalid option ' + commandParts[0] + ' for argument ' + currArg.argument; }
                        } else
                        {
                            result.error = true;
                            result.errorMsg = 'Invalid option \'' + commandParts[0] + '\' for argument \'' + currArg.argument + '\': already assigned option \'' + result.argumentInfo.option.option + '\'';
                        }

                    }
                    if(!cmdOptApplied)
                    {
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
                    }

                    if(success == false) { result.error = true; result.errorMsg = 'Invalid option \'' + commandParts[0] + '\' for command \'' + cmd.command + '\''; }
                } else
                {
                    var curr;
                    //check tier
                    if (!tier1Applied)
                    {
                        //get the tier 1 argument, set it as current argument
                        for(var i = 0; i < cmd.tier1_arguments.length; i++)
                        {
                            curr = cmd.tier1_arguments[i];
                            if(curr.argument == commandParts[0])
                            {
                                result.argumentInfo.tier1_arg = curr;
                                currArg = curr;
                                tier1Applied = true;
                                if(curr.has_child)
                                {
                                    if(commandParts.length > 1)
                                    {
                                        var currTier2;
                                        for(var j = 0; j < cmd.tier2_arguments.length; j++)
                                        {
                                            currTier2 = cmd.tier2_arguments[j];
                                            if((currTier2.argument_parent_id == currArg.argument_id && currTier2.user_defined) || (currTier2.argument == commandParts[1]))
                                            {
                                                currArg = currTier2;
                                                if(currArg.user_defined)
                                                {
                                                    console.log('user defined string', currArg, commandParts[0], commandParts[1]);
                                                    result.argumentInfo.tier2_userValue = commandParts[1];
//                                                    currArg.
                                                } else
                                                {

                                                }
                                                result.argumentInfo.tier2_arg = currTier2;
                                                tier2Applied = true;
                                                currArg = currTier2;
                                                success = true;
                                                commandParts.shift();
                                                break;
                                            }
                                        }
                                    } else
                                    {
                                        result.error = true; result.errorMsg = 'Missing required argument for argument \'' + curr.argument + '\'';
                                        break;
                                    }
                                }
                                success = true;
                                break;
                            }
                        }
                    } else if (!tier2Applied && tier1Applied)
                    {
                        //get the tier 2 argument if any
                        for(var i = 0; i < cmd.tier2_arguments.length; i++)
                        {
                            curr = cmd.tier2_arguments[i];
                            if(curr.argument_parent_id == currArg.argument_id)
                            {
                                result.argumentInfo.tier2_arg = curr;
                                currArg = curr;
                                success = true;
                                console.log('made tier 2 apply2');
                                tier2Applied = true;
                                break;
                            }
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
                if(hasOptStart(dependency)) { dependency = commandParts[commandParts.length - 3]; }

                if (dependency == commandParts[0])
                {
                    if(hasOptStart(toComplete))
                    {
                        var res = isValidCommandOptionStart(cmd.command, toComplete);
                        if(res !== false)
                        {
                            choices = choices.concat(res);
                        }
                    } else
                    {
                        var res = isValidCommandArgumentStart(cmd.command, toComplete);
                        //console.log('res', res);
                        if(res !== false)
                        {
                            choices = choices.concat(res);
                        }
                    }
                } else
                {
                    if(!hasOptStart(dependency))
                    {
                        var arg = getArgByName(cmd, dependency);
                        if(hasOptStart(toComplete))
                        {
                            var res = isValidArgumentOptionStart(arg, toComplete);
                            if (res !== false)
                            {
                                choices = choices.concat(res);
                            }
                        } else
                        {
                            var res = isValidArgumentTierStart(cmd.command, arg, toComplete);
                            if (res !== false)
                            {
                                choices = choices.concat(res);
                            }
                        }
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

    function isValidCommandArgumentStart(cmdName, argPiece)
    {
        var autocompleteChoices = [];
        var command = getCommandByName(cmdName);
        for(var i = 0; i < command.tier1_arguments.length; i++)
        {
            var curr = command.tier1_arguments[i].argument;
            if(curr.indexOf(argPiece) == 0)
            {
                autocompleteChoices.push(curr);
            }
        }
        return autocompleteChoices.length > 0 ? autocompleteChoices : false;
    }

    function isValidArgumentTierStart(cmdName, argParent, argPiece)
    {
        var autocompleteChoices = [];
        var cmd = getCommandByName(cmdName);
        if (argParent.tier == 1)
        {
            var curr;
            for(var i = 0; i < cmd.tier2_arguments.length; i++)
            {
                curr = cmd.tier2_arguments[i];
                if(curr.argument_parent_id == argParent.argument_id)
                {
                    autocompleteChoices.push(curr.argument);
                }
            }
        } else if (argParent.tier == 2)
        {
            //TODO
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
        for(var i = 0; i < cmd.tier1_arguments.length; i++)
        {
            curr = cmd.tier1_arguments[i].argument;
            if (curr == argName) {
                return cmd.tier1_arguments[i];
            }
        }
        for(var j = 0; i < cmd.tier2_arguments.length; j++)
        {
            curr = cmd.tier2_arguments[j].argument;
            if (curr == argName) {
                return cmd.tier2_arguments[j];
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