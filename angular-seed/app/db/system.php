<?php
header('Access-Control-Allow-Origin: *');
require("db_con.php");

$table=$_GET['table'];
$id=isset($_GET['id'])?$_GET['id']:null;

$q="select * from $table ";
switch($table){
    case "division":
        break;
    case "family":
        $q=$q."where division = $id";
        break;
    case "genus":
        $q=$q."where family = $id";
        break;
    case "species":
        $q=$q."where genus = $id";
        break;        
}
$result=mysqli_query($db,$q);

$arr=array();
while($row=mysqli_fetch_assoc($result)){
    $arr[]=$row;
}

echo $json_response=json_encode($arr);
?>