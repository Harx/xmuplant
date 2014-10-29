<?php
header('Access-Control-Allow-Origin: *');
require("db_con.php");

$id = $_GET['id'];

// $arr = array();

// $result = mysqli_query($db, "select content,name_cn from family where id = ".$id);
// $arr[0] = mysqli_fetch_assoc($result);

$result = mysqli_query($db, "select id,name_cn,name_en from genus where family = ".$id);
$arr1 = array();
while ($row = mysqli_fetch_assoc($result)){

//   $result = mysqli_query($db, "select id,name_cn,name_en from species where genus = ".$row['id']);
//   
//   $arr2 = array();
//   while ($row2 = mysqli_fetch_assoc($result)){
//     $arr2[] = $row2;
//   }
//   $row['species'] = $arr2;
  $arr1[] = $row;
}
// $arr[1] = $arr1;

echo $json_response = json_encode($arr1);
?>