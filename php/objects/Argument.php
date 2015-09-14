<?php
/**
 * Created by IntelliJ IDEA.
 * User: Tyler
 * Date: 7/12/2015
 * Time: 11:10 AM
 */

//require_once("../SQLUtil.php");

class Argument {

    const TABLE = "argument";
    private $dbUtil;

    private $name;
    private $commandId;
    private $id;
    private $info;
    private $children;
    private $parentArgument;

    function __construct($id)
    {
        $this->id = $id;
        $this->dbUtil = new SQLUtil();
        $this->getArgumentInfo();
        $this->setChildren();
        $this->setParentArgument();

//        print_r($this->info);
//        echo "<br/> $this->name <br/> $this->commandId <br/> Children:";
//        print_r($this->children);
//        echo "<br/> Parent:";
//        print_r($this->parentArgument);
    }

    private function getArgumentInfo()
    {
        $where = "id = " . "\"" . $this->id . "\"";
        $this->info = $this->dbUtil->selectAllFromTableWhere(self::TABLE, $where);
        $this->info = $this->dbUtil->interpretQueryResponse($this->info)[0];
        $this->name = $this->info["name"];
        $this->commandId = $this->info["command_id"];
    }

    private function setChildren()
    {
        $where = "argument_parent = " . "\"" . $this->id . "\"";
        $this->children = $this->dbUtil->selectAllFromTableWhere(self::TABLE, $where);
        $this->children = $this->dbUtil->interpretQueryResponse($this->children);
    }

    private function setParentArgument()
    {
        if($this->info["argument_parent"] != 0)
        {
            $where = "id = " . "\"" . $this->info["argument_parent"] . "\"";
            $this->parentArgument = $this->dbUtil->selectAllFromTableWhere(self::TABLE, $where);
            $this->parentArgument = $this->dbUtil->interpretQueryResponse($this->parentArgument)[0];
        } else $this->parentArgument = false;

    }

    public static function getAllArguments()
    {
        $dbUtil = new SQLUtil();
        $sql = "SELECT C.name AS command_name, C.id AS command_id, A.name AS argument_name, A.id AS argument_id, A.requires_option,
                A.requires_argument_child, A.argument_tier, A.argument_parent, A.user_defined
                FROM command C, argument A
                WHERE A.command_id = C.id";

        $res = $dbUtil->executeSql($sql);
        $retArr = $dbUtil->interpretQueryResponse($res);
        return $retArr;
    }

    public static function getArgumentByName($name)
    {
        $dbUtil = new SQLUtil();
        $where = "name = " . "\"" . $name . "\"";

        $res = $dbUtil->selectAllFromTableWhere(self::TABLE, $where);
        $retArr = $dbUtil->interpretQueryResponse($res);
        return $retArr;
    }

    public function setName($newName) { $this->name = $newName; }
    public function getName() { return $this->name; }

    public function setCommand($cmd) { $this->commandId = $cmd; }
    public function getCommand() { return $this->commandId; }

    public function getChildren() { return $this->children; }
    public function getParentArgument() { return $this->parentArgument; }
}
