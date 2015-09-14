<?php
/**
 * Created by IntelliJ IDEA.
 * User: Tyler
 * Date: 7/12/2015
 * Time: 2:04 AM
 */

require_once("../SQLUtil.php");
require_once("../objects/Argument.php");

$json = null;
$args = Argument::getAllArguments();

if($args != false)
{
    $json = array('data' => $args);
} else $json = "Error getting all arguments.";

echo json_encode($json);
