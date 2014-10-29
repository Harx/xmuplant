<?php
header('Access-Control-Allow-Origin: *');
require("db_con.php");

$keyword="'%".$_GET['keyword']."%'";
//$keyword=$_GET['keyword'];
$query="select id,name_cn,name_ot,name_en from species WHERE name_cn LIKE $keyword or name_en like $keyword or name_ot like $keyword";
//$query="select id,name_cn,name_en from species WHERE name_cn LIKE '%印%'";
$result=mysqli_query($db,$query);

$arr=array();
while($row=mysqli_fetch_assoc($result)){
    $arr[]=$row;
}

echo $json_response=json_encode($arr);
?>