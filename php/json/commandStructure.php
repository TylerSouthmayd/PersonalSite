<?php
/**
 * Created by IntelliJ IDEA.
 * User: Tyler
 * Date: 7/25/2015
 * Time: 6:23 PM
 */

require_once("../SQLUtil.php");
require_once("../objects/Command.php");
require_once("../objects/Argument.php");
require_once("../objects/CommandOption.php");
require_once("../objects/ArgumentOption.php");

$json = null;
$cmd = new Command();

$commandStructure = $cmd->getCommandList();
if($commandStructure != false)
{
    $json = array('data' => $commandStructure);
} else $json = "Error getting all commands.";

echo json_encode($json);
