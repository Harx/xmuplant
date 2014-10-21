<?php
header('Access-Control-Allow-Origin: *');
require("db_con.php");

$items = "id,name_cn,name_en,img_name";
if (isset($_GET['items'])){
  $items = $_GET['items'];
}

$id = "";
if (isset($_GET['id'])){
  $id = " where id = ".$_GET['id'];
}

// 条件控制可读取的数据库表。
$tables = "species";
$tables_get=$_GET['tables'];
if ($tables_get == "division"
 || $tables_get == "subject"
 || $tables_get == "knowledge"
 || $tables_get == "intro"
 || $tables_get == "klg_category"
 || $tables_get =="sblog" ){
  $tables = $tables_get;
}

$query = "select ".$items." from ".$tables.$id;
$result = mysqli_query($db, $query);

$arr = array();
while ($row = mysqli_fetch_assoc($result)){
  // 添加到数组
  $arr[] = $row;
}

echo $json_response = json_encode($arr);
?>