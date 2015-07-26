<?php
/**
 * Created by IntelliJ IDEA.
 * User: Tyler
 * Date: 7/25/2015
 * Time: 12:08 PM
 */

require_once("../SQLUtil.php");

class Option extends SQLUtil{

    private $name;

    function __construct()
    {
        $this->name = '';
    }

    public function setName($newName) { $this->name = $newName; }
    public function getName() { return $this->name; }
}
