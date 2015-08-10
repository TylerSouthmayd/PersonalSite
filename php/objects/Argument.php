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

    function __construct()
    {
        parent::__construct();
        $this->name = '';
        $this->command = '';
    }

    public static function getAllArguments()
    {
        $dbutil = new SQLUtil();
        $sql = "SELECT C.name AS command_name, C.id AS command_id, A.name AS argument_name, A.id AS argument_id, A.requires_option FROM command C, argument A WHERE A.command_id = C.id";

        $res = $dbutil->executeSql($sql);
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
