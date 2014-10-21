<?php
header('Access-Control-Allow-Origin: *');
require("db_con.php");

$id = $_GET['id'];

$arr = array();

$result = mysqli_query($db, "select content,name_cn from division where id = ".$id);
$arr[0] = mysqli_fetch_assoc($result);

$result = mysqli_query($db, "select id,name_cn,name_en from family where division = ".$id);
$arr1 = array();
while ($row = mysqli_fetch_assoc($result)){
  // 添加到数组
  $arr1[] = $row;
}
$arr[1] = $arr1;

echo $json_response = json_encode($arr);
?>

  