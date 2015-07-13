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

    public function setName($newName)
    {
        $this->$name = $newName;
    }

    public function getName()
    {
        return $this->$name;
    }
}

$test = new Argument();
echo $test->getName();