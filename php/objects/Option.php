<?php
/**
 * Created by IntelliJ IDEA.
 * User: Tyler
 * Date: 7/25/2015
 * Time: 12:08 PM
 */

require_once("../SQLUtil.php");

class Option extends SQLUtil{

    const TABLE = "option";

    private $name;

    function __construct()
    {
        parent::__construct();
        $this->name = '';
    }

    public static function getAllOptions()
    {
        $dbutil = new SQLUtil();
        $sql = "SELECT C.name AS command_name, C.id AS command_id, O.name AS option_name, O.id AS option_id FROM command C, command_option O WHERE O.command_id = C.id";

        $res = $dbutil->executeSql($sql);
        $retArr = parent::interpretQueryResponse($res);
        return $retArr;
    }
    public function setName($newName) { $this->name = $newName; }
    public function getName() { return $this->name; }
}
