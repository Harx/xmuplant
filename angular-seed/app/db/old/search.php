<?php
header('Access-Control-Allow-Origin: *');
require("db_con.php");

// select id,name_cn,name_en from species where name_cn like (\"% 南洋 %\")
$query = "select id,name_cn,name_en from species where name_cn like (\"%".$_GET['search']."%\") or name_en like (\"%".$_GET['search']."%\")";
$result = mysqli_query($db, $query);

$arr = array();
while ($row = mysqli_fetch_assoc($result)){
  // 添加到数组
  $arr[] = $row;
}

echo $json_response = json_encode($arr);
?>