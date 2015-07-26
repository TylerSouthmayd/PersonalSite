<?php
/**
 * Created by IntelliJ IDEA.
 * User: Tyler
 * Date: 7/25/2015
 * Time: 12:14 PM
 */

require_once("connect.php");

class SQLUtil
{
    private $login;
    private $servername;
    private $username;
    private $password;
    private $dbname;
    private $conn;

    function __construct()
    {
        $this->login = new ConnectionInfo();
        $this->servername = $this->login->getServerName();
        $this->username = $this->login->getUserName();
        $this->password = $this->login->getPassword();
        $this->dbname = $this->login->getDbName();
        $this->connectToDb();
    }

    private function connectToDb()
    {
        $this->conn = new mysqli($this->servername, $this->username, $this->password);
        if ($this->conn->connect_error)
        {
            die("Couldn't connect" . mysqli_connect_error());
        }
        $this->conn->select_db($this->dbname);
    }

    private function handleQueryResult($result)
    {
        $retArr = array('results' => null, 'error' => false, 'errorMessage' => '');
        if($result)
        {
            $retArr['results'] = $result;
        } else
        {
            $retArr['error'] = true;
            //$retArr['errorMessage'] = mysql_error($this->conn);
        }
        return $retArr;
    }

    public function interpretQueryResponse($result)
    {
        $data = array();
        if(!$result['error'])
        {
            while($row = $result['results']->fetch_assoc())
            {
                array_push($data, $row);
            }
            return $data;
        }
        return $result;
    }

    public function selectAllFromTable($table)
    {
        $sql = "SELECT * FROM " . $table;
        //echo $sql;

        $result = $this->conn->query($sql);
        $retArr = $this->handleQueryResult($result);
        return $retArr;
    }

    public function selectAllFromTableWhere($table, $where)
    {
        $sql = "SELECT * FROM " . $table . " WHERE " . $where;
        //echo $sql;

        $result = $this->conn->query($sql);
        $retArr = $this->handleQueryResult($result);
        return $retArr;
    }

    public function executeSql($sql)
    {
        $result = $this->conn->query($sql);
        $retArr = $this->handleQueryResult($result);
        return $retArr;
    }

    public function getConnection() { return $this->conn; }
}
