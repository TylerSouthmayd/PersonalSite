<?php
/**
 * Created by IntelliJ IDEA.
 * User: Tyler
 * Date: 7/12/2015
 * Time: 11:10 AM
 */

class Argument {

    private $name = 'test';
    private $command;

    function __construct()
    {

    }

    public function setName($newName)
    {
        $this->$name = $newName;
    }

    public function getName()
    {
        return $this->$name;
    }
}