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
    private $argument;

    function __construct()
    {
        parent::__construct();
        $this->name = '';
        $this->$argument = '';
    }

    public static function getAllArgumentOptions()
    {
        $dbutil = new SQLUtil();
        $sql = "SELECT A.name AS argument_name, A.id AS argument_option_id, O.name AS argument_option_name, O.id AS argument_id, O.short_name AS argument_option_short_name FROM argument A, argument_option O WHERE O.argument_id = A.id";

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

    public function setArgument($arg) { $this->argument = $arg; }
    public function getArgument() { return $this->argument; }
} 