/**
 * Created by Tyler on 8/2/2015.
 */

mainApp.factory('CommandUtility', CommmandUtility);

function CommmandUtility(CommandDataSource)
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

    CommandUtility.checkValidity = function(inputArray)
    {
        var isValid = false;
        var size = inputArray.length;
        var piece, cmd;
        for(var i = 0; i < size; i++)
        {
            piece = inputArray[i];
            console.log(piece);
            for(var j = 0; j < $scope.commandStructure.length; j++)
            {
                cmd = $scope.commandStructure[j].command;
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

    return CommandUtility;
}