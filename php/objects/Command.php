<?php
/**
 * Created by IntelliJ IDEA.
 * User: Tyler
 * Date: 7/11/2015
 * Time: 8:41 PM
 */

require_once("../SQLUtil.php");

class Command {

    const TABLE = "command";

    private $name;
    private $arguments;
    private $dbutil;

    function __construct()
    {
        $this->name = '';
        $this->arguments = array();
        $this->dbUtil = array();
    }

    public function printCommand()
    {
        var_dump($this->arguments);
    }

    public static function getAllCommands()
    {
        $dbutil = new SQLUtil();

        $res = $dbutil->selectAllFromTable(self::TABLE);
        $retArr = $dbutil::interpretQueryResponse($res);
        return $retArr;
    }

    public static function getCommandByName($name)
    {
        $dbutil = new SQLUtil();
        $where = "name = " . "\"" . $name . "\"";

        $res = $dbutil->selectAllFromTableWhere(self::TABLE, $where);
        $retArr = $dbutil::interpretQueryResponse($res);
        return $retArr;
    }

    public function getCommandList()
    {
        $commandStructure = array();
        $commands = Command::getAllCommands();
        $arguments = Argument::getAllArguments();
        $commandOptions = CommandOption::getAllCommandOptions();
        $argumentOptions = ArgumentOption::getAllArgumentOptions();

        foreach($commands as $cmd)
        {
            $tier1Args = array();
            $tier2Args = array();
//            $tier3Args = array();
            $cmdOpts = array();
            $argOpts = array();

            foreach($arguments as $arg)
            {
                if ($arg["command_name"] == $cmd["name"])
                {

                    foreach($argumentOptions as $argOpt)
                    {
                        if($argOpt["argument_name"] == $arg["argument_name"])
                        {
                            array_push($argOpts, array(
                                "option_id" => $argOpt["argument_option_id"],
                                "option" => $argOpt["argument_option_name"],
                                "option_short" => $argOpt["argument_option_short_name"],
                                "argument_id" => $argOpt["argument_id"]
                            ));
                        }
                    }
                    if($arg["requires_option"] == 0) { $needsOp = false; } else { $needsOp = true; }

                    if($arg["argument_tier"] == 1)
                    {
                        array_push($tier1Args, array(
                            "argument_id" => $arg["argument_id"],
                            "argument" => $arg["argument_name"],
                            "command_name" => $arg["command_name"],
                            "has_child" => $arg["requires_argument_child"] == '0' ? false : true,
                            "options" => $argOpts,
                            "requires_option" => $needsOp,
                            "user_defined" => $arg["user_defined"] == '0' ? false : true,
                            "tier" => 1
                        ));
                    } else if($arg["argument_tier"] == 2)
                    {
                        array_push($tier2Args, array(
                            "argument_id" => $arg["argument_id"],
                            "argument" => $arg["argument_name"],
                            "argument_parent_id" => $arg["argument_parent"],
                            "has_child" => $arg["requires_argument_child"] == '0' ? false : true,
                            "options" => $argOpts,
                            "requires_option" => $needsOp,
                            "user_defined" => $arg["user_defined"] == '0' ? false : true,
                            "tier" => 2
                        ));
                    }
//                    else if($arg["argument_tier"] == 3)
//                    {
//                        array_push($tier3Args, array(
//                            "argument_id" => $arg["argument_id"],
//                            "argument" => $arg["argument_name"],
//                            "argument_parent_id" => $arg["argument_parent"],
//                            "argument_parent" => $arg["command_name"],
//                            "has_child" => $arg["requires_argument_child"] == '0' ? false : true,
//                            "options" => $argOpts,
//                            "requires_option" => $needsOp
//                        ));
//                    }

                }
            }
            foreach($commandOptions as $cmdOpt)
            {
                if($cmdOpt["command_name"] == $cmd["name"])
                {
                    array_push($cmdOpts, array(
                       "option_id" => $cmdOpt["command_option_id"],
                       "option" => $cmdOpt["command_option_name"],
                       "option_short" => $cmdOpt["command_option_short_name"]
                    ));
                }
            }
            if($cmd["requires_option"] == 0) { $needsOp = false; } else { $needsOp = true; }
            array_push($commandStructure, array(
                "command_id" => $cmd["id"],
                "command" => $cmd["name"],
                "tier1_arguments" => $tier1Args,
                "tier2_arguments" => $tier2Args,
//                "tier3_arguments" => $tier3Args,
                "options" => $cmdOpts,
                "requires_option" => $needsOp
            ));
        }
        return $commandStructure;
    }

    public static function getCommandStructure()
    {
        $dbutil = new SQLUtil();
        $sql = "SELECT C.name AS command_name, C.id AS command_id, A.name AS argument_name, A.id AS argument_id FROM command C LEFT JOIN argument A ON C.id = A.command_id";

        $res = $dbutil->executeSql($sql);
        $retArr = $dbutil::interpretQueryResponse($res);
        return $retArr;
    }

    public function getName(){ return $this->name; }
    public function getArguments() { return $this->arguments; }
    public function addArgument($arg)
    {
        array_push($this->arguments, $arg);
    }

}
?>
