<?php
/**
 * Created by IntelliJ IDEA.
 * User: Tyler
 * Date: 7/12/2015
 * Time: 2:20 AM
 */

include './connect.php';

$sql = "SELECT id, name FROM command WHERE name='ls'";

$result = $conn->query($sql);
//"INSERT INTO argument('name', 'command_id') VALUES ('resume',)";
if ($result->num_rows > 0)
{
    while($row = $result->fetch_assoc()) {
//        echo "id: " . $row["id"]. " - name: " . $row["name"]. "<br>";
        $parId = $row["id"];

        $sql ="INSERT INTO argument(name, command_id) VALUES ('home', '$parId')";
        $result = $conn->query($sql);
        echo "win";
    }
}
$conn->close();
