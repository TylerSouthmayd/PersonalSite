<?php
/**
 * Created by IntelliJ IDEA.
 * User: Tyler
 * Date: 7/11/2015
 * Time: 8:41 PM
 */
include '../connect.php';
echo"win";
$sql = "SELECT id, name FROM command where name='ls'";
$result = $conn->query($sql);
if ($result->num_rows > 0)
{
    while($row = $result->fetch_assoc()) {
        echo "id: " . $row["id"]. " - name: " . $row["name"]. "<br>";
    }
}
$conn->close();
