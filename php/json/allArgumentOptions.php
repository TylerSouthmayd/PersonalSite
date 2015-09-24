<?php
/**
 * Created by IntelliJ IDEA.
 * User: Tyler
 * Date: 8/7/2015
 * Time: 7:02 PM
 */

require_once("../SQLUtil.php");
require_once("../objects/ArgumentOption.php");
$json = null;
$args = ArgumentOption::getAllArgumentOptions();

if($args != false)
{
    $json = array('data' => $args);
} else $json = "Error getting all arguments.";

echo json_encode($json);
