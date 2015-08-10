<?php
/**
 * Created by IntelliJ IDEA.
 * User: Tyler
 * Date: 7/11/2015
 * Time: 8:41 PM
 */

require_once("../SQLUtil.php");

class Command extends SQLUtil {

    const TABLE = "command";

    private $name;
    private $arguments;

    function __construct()
    {
        parent::__construct();
        $this->name = '';
        $this->arguments = array();
    }

    public function printCommand()
    {
        var_dump($this->arguments);
    }

    public static function getAllCommands()
    {
        $dbutil = new SQLUtil();

        $res = $dbutil->selectAllFromTable(self::TABLE);
        $retArr = parent::interpretQueryResponse($res);
        return $retArr;
    }

    public static function getCommandByName($name)
    {
        $dbutil = new SQLUtil();
        $where = "name = " . "\"" . $name . "\"";

        $res = $dbutil->selectAllFromTableWhere(self::TABLE, $where);
        $retArr = parent::interpretQueryResponse($res);
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
            $args = array();
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
                                "option" => $argOpt["argument_option_name"],
                                "option_short" => $argOpt["argument_option_short_name"],
                                "option_id" => $argOpt["argument_option_id"]
                            ));
                        }
                    }
                    if($arg["requires_option"] == 0) { $needsOp = false; } else { $needsOp = true; }

                    array_push($args, array(
                        "argument" => $arg["argument_name"],
                        "argument_id" => $arg["argument_id"],
                        "options" => $argOpts,
                        "requires_option" => $needsOp
                    ));

                }
            }
            foreach($commandOptions as $cmdOpt)
            {
                if($cmdOpt["command_name"] == $cmd["name"])
                {
                    array_push($cmdOpts, array(
                       "option" => $cmdOpt["command_option_name"],
                       "option_short" => $cmdOpt["command_option_short_name"],
                       "option_id" => $cmdOpt["command_option_id"]
                    ));
                }
            }
            if($cmd["requires_option"] == 0) { $needsOp = false; } else { $needsOp = true; }
            array_push($commandStructure, array(
                "command_id" => $cmd["id"],
                "command" => $cmd["name"],
                "arguments" => $args,
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
        $retArr = parent::interpretQueryResponse($res);
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
