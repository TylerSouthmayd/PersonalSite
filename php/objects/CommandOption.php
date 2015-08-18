<?php
/**
 * Created by IntelliJ IDEA.
 * User: Tyler
 * Date: 7/25/2015
 * Time: 12:08 PM
 */

require_once("../SQLUtil.php");

class CommandOption {

    const TABLE = "command_option";

    private $name;
    private $dbutil;

    function __construct()
    {
        $this->name = '';
        $this->dbutil = new SQLUtil();
    }

    public static function getAllCommandOptions()
    {
        $dbutil = new SQLUtil();
        $sql = "SELECT C.name AS command_name, C.id AS command_id, O.name AS command_option_name, O.id AS command_option_id, O.short_name AS command_option_short_name FROM command C, command_option O WHERE O.command_id = C.id";

        $res = $dbutil->executeSql($sql);
        $retArr = $dbutil::interpretQueryResponse($res);
        return $retArr;
    }
    public function setName($newName) { $this->name = $newName; }
    public function getName() { return $this->name; }
}
