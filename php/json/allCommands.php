<?php
/**
 * Created by IntelliJ IDEA.
 * User: Tyler
 * Date: 7/11/2015
 * Time: 8:41 PM
 */
require_once("../objects/Command.php");
$json = null;
$commands = Command::getAllCommands();

if($commands != false)
{
    $json = array('data' => $commands);
} else $json = "Error getting all commands.";

echo json_encode($json);
