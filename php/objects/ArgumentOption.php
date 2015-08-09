<?php
/**
 * Created by IntelliJ IDEA.
 * User: Tyler
 * Date: 8/7/2015
 * Time: 6:33 PM
 */
require_once("../SQLUtil.php");
class ArgumentOption extends SQLUtil {
    const TABLE = "argument_option";

    private $name;
    private $command;

    function __construct()
    {
        parent::__construct();
        $this->name = '';
        $this->command = '';
    }

    public static function getAllArgumentOptions()
    {
        $dbutil = new SQLUtil();
        $sql = "SELECT A.name AS argument_name, A.id AS argument_option_id, O.name AS argument_option_name, O.id AS argument_id FROM argument A, argument_option O WHERE O.argument_id = A.id";

        $res = $dbutil->executeSql($sql);
        $retArr = parent::interpretQueryResponse($res);
        return $retArr;
    }

    public static function getArgumentOptionByName($name)
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