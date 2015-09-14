<?php
/**
 * Created by IntelliJ IDEA.
 * User: Tyler
 * Date: 9/14/2015
 * Time: 10:36 AM
 */

include '../connect.php';
include '../SQLUtil.php';
include '../objects/Argument.php';

if(isset($_GET['argId']))
{
    $arg = new Argument($_GET['argId']);
    echo json_encode(array('children' => $arg->getChildren()));
} else
{
    echo 'error getting argument children';
}
