<?php
// 返回一个species的divison family genus.
header('Access-Control-Allow-Origin: *');
require("db_con.php");

$arr = array();

$query = "select name_cn,name_en from division where id = ".$_GET['division'];
$result = mysqli_fetch_assoc(mysqli_query($db, $query));
$arr["division"] = $result["name_cn"]." ".$result["name_en"];

$query = "select name_cn,name_en from family where id = ".$_GET['family'];
$result = mysqli_fetch_assoc(mysqli_query($db, $query));
$arr["family"] = $result["name_cn"]." ".$result["name_en"];

$query = "select name_cn,name_en from genus where id = ".$_GET['genus'];
$result = mysqli_fetch_assoc(mysqli_query($db, $query));
$arr["genus"] = $result["name_cn"]." ".$result["name_en"];

echo $json_response = json_encode($arr);
?>