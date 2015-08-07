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

    CommandUtility.isCommandLineValid = function(command)
    {
        var commandParts = (command).split(" ");
        var isValid = true;
        var cmd = commandParts[0];
        if (isValidCommand(cmd))
        {
            //var skipnext = false;
            for (var i = 1; i < commandParts.length; i++) {
                //if(skipnext) else do it
                if(i == commandParts.length - 1)
                {
//                    console.log('isValidArgumentStart:', isValidArgumentStart(cmd, commandParts[i]));
//                    console.log('isValidOptionStart:', isValidOptionStart(cmd, commandParts[i]));
                    if((isValidArgumentStart(cmd, commandParts[i]) == false) && (isValidOptionStart(cmd, commandParts[i]) == false))
                    {
                        isValid = false;

                    }
                } else if (!isValidArgument(cmd, commandParts[i]) && !isValidOption(cmd, commandParts[i]))
                {
                    isValid = false;
                    //if valid arg, check next for option
                }
            }
        } else {
            isValid = false;
        }
        console.log('isCommandLineValid:', isValid);
        return isValid;
    };

    //WAS WORKING HERE
    CommandUtility.autocompleteCommandLine = function(command)
    {
        var commandParts = (command).split(" ");
        var userCommand = commandParts[0];
        var toComplete = commandParts[commandParts.length - 1];
        var autocompleteOptions = [];
        var terminalString = '';
        if(CommandUtility.isCommandLineValid(command))
        {
            var cmd = getCommandByName(userCommand);
            if(commandParts.length == 1)
            {
                cmdguts = getCommandArgsAndOpts(userCommand);

                if(cmd.arguments.length > 0)
                {
                    terminalString += 'Available Arguments: ' + arrayToString(cmdguts[0]) + ' '
                }
                if(cmd.options.length > 0)
                {
                    terminalString += 'Available Options: ' + arrayToString(cmdguts[1]);
                }
                autocompleteOptions.push(terminalString);
            } else
            {
                var startedArg = isValidArgumentStart(userCommand, toComplete)
                if(startedArg !== false)
                {
                    autocompleteOptions.push(startedArg);
                }
            }
        }

        return autocompleteOptions;
    };

    CommandUtility.autocompleteCommand = function(command)
    {
        var cmd = getCommandByName(command);
        var autocompleteOptions = [];

        if(isValidCommand(cmd))
        {
            autocompleteOptions = getCommandArgsAndOpts(cmd);
            console.log('valid command args/opts: ', autocompleteOptions);
            return autocompleteOptions;
        } else if(!isValidCommandStart(cmd))
        {

        }
    };

    CommandUtility.autocompleteCommandPiece = function(command, piece, isOption)
    {

        var cmd = getCommandByName(command);
        var autocompleteOptions = [];
        //console.log(cmd, piece, isOption);
        if(cmd !== null)
        {
            if(isOption)
            {
                for(var i = 0; i < cmd.options.length; i++)
                {
                    var opt = cmd.options[i].option;
                    if (opt.indexOf(piece) !== -1)
                    {
                        autocompleteOptions.push(opt);
                    }
                }
            } else
            {
                for(var i = 0; i < cmd.arguments.length; i++)
                {
                    var arg = cmd.arguments[i].argument;
                    console.log('indexOfPiece:', arg.indexOf(piece));
                    if (arg.indexOf(piece) >= 0)
                    {
                        autocompleteOptions.push(arg);
                    }
                }
            }
        }
        return autocompleteOptions;
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
        for(var i = 0; i < commandStructure.length; i++)
        {
            var curr = commandStructure[i].command;
            if(curr.indexOf(cmdName) == 0)
            {
                return curr;
            }
        }
        return false;
    }

    function isValidOption(cmdName, optName)
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