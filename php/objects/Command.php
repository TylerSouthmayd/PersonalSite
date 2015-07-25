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

    public function getName(){ return $this->name; }
    public function setName($newName){ $this->name = $newName; }

    public function getArguments() { return $this->arguments; }
    public function addArgument($arg)
    {
        array_push($this->arguments, $arg);
    }

}
?>
