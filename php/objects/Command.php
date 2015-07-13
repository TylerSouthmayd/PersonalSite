<?php
///**
// * Created by IntelliJ IDEA.
// * User: Tyler
// * Date: 7/11/2015
// * Time: 8:41 PM
// */

class Command {

    public $name = "fail";
//    private $arguments = array();

//    public function printCommand()
//    {
//        echo $this->$name;
//        var_dump($this->$arguments);
//    }

//    public function getName()
//    {
//        echo $this->$name;
//    }
//
//    public function setName($newName)
//    {
//        $this->$name = $newName;
//    }
//    public function addArgument($arg)
//    {
//        array_push($arguments, $arg);
//    }
//
//    public function getArguments()
//    {
//        return $this->$arguments;
//    }

}

$cmd = new Command();
//$cmd->setName("test");
echo $cmd->$name;
var_dump($cmd);
//$cmd->addArgument('tree');
//echo $cmd0->getArguments();
//echo $cmd0->getName();
//echo $cmd->printCommand();
?>