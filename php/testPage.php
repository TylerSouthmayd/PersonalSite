<?php
/**
 * Created by IntelliJ IDEA.
 * User: Tyler
 * Date: 7/12/2015
 * Time: 2:20 AM
 */

include './connect.php';
include './SQLUtil.php';
include './objects/Argument.php';

//$arg = new Argument(20);

if(isset($_GET['argId']))
{
    $arg = new Argument($_GET['argId']);
    echo json_encode(array('children' => $arg->getChildren()));
} else
{
    echo 'error';
}

//$sql = "SELECT id, name FROM command WHERE name='ls'";
//
//$result = $conn->query($sql);
////"INSERT INTO argument('name', 'command_id') VALUES ('resume',)";
//if ($result->num_rows > 0)
//{
//    while($row = $result->fetch_assoc()) {
////        echo "id: " . $row["id"]. " - name: " . $row["name"]. "<br>";
//        $parId = $row["id"];
//
//        $sql ="INSERT INTO argument(name, command_id) VALUES ('home', '$parId')";
//        $result = $conn->query($sql);
//        echo "win";
//    }
//}
//$conn->close();
