<?php
/**
 * Created by IntelliJ IDEA.
 * User: Tyler
 * Date: 7/12/2015
 * Time: 11:10 AM
 */

require_once("../SQLUtil.php");

class Argument extends SQLUtil {

    const TABLE = "argument";

    private $name;
    private $command;

    function __construct($name, $command)
    {
        parent::__construct();
        $this->name = $name;
        $this->command = $command;
    }

    public static function getAllArguments()
    {
        $dbutil = new SQLUtil();

        $res = $dbutil->selectAllFromTable(self::TABLE);
        $retArr = parent::interpretQueryResponse($res);
        return $retArr;
    }

    public static function getArgumentByName($name)
    {
        $dbutil = new SQLUtil();
        $where = "name = " . "\"" . $name . "\"";

        $res = $dbutil->selectAllFromTableWhere(self::TABLE, $where);
        $retArr = parent::interpretQueryResponse($res);
        return $retArr;
    }

    public function setName($newName) { $this->name = $newName; }
    public function getName() { return $this->name; }

    public function setCommand($cmd) { $this->command = $cmd; }
    public function getCommand() { return $this->command; }
}
