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
        foreach($commands as $cmd)
        {
            $command = array();
            $args = array();


            foreach($arguments as $arg)
            {
                if ($arg["command_name"] == $cmd["name"])
                {
                    array_push($args, array(
                        "argument" => $arg["argument_name"],
                        "argument_id" => $arg["argument_id"]
                    ));

                }
            }
            array_push($command, array(
                "command_id" => $cmd["id"],
                "command" => $cmd["name"],
                "arguments" => $args
            ));
            //$command["arguments"] = $args;
            array_push($commandStructure, $command);
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
    public function setName($newName){ $this->name = $newName; }

    public function getArguments() { return $this->arguments; }
    public function addArgument($arg)
    {
        array_push($this->arguments, $arg);
    }

}
?>
