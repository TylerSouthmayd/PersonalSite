<?php
/**
 * Created by IntelliJ IDEA.
 * User: Tyler
 * Date: 7/12/2015
 * Time: 2:04 AM
 */

include '../connect.php';

$sql = "SELECT id, name FROM command";
$result = $conn->query($sql);
if ($result->num_rows > 0)
{
    while($row = $result->fetch_assoc()) {
        echo "id: " . $row["id"]. " - name: " . $row["name"]. "<br>";
    }
}
$conn->close();
