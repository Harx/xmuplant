<?php
header('Access-Control-Allow-Origin: *');
require("db_con.php");


$query = "select title,d,s from subject where id = ".$_GET['id'];
$result = mysqli_fetch_assoc(mysqli_query($db, $query));

$result_a = array();
$name_cn = explode(",", $result['s']);
foreach($name_cn as $n){
  $query = "select id,name_cn,name_en,img_name from species where name_cn = '$n'";
  $s = mysqli_query($db, $query);
  if (mysqli_num_rows($s) == 0){
    $a = array();
    $a['name_cn'] = $n;
    $a['name_en'] = "暂未收录";
    $result_a[] = $a;
  } else {
    $a = mysqli_fetch_assoc($s);
    $tmp=array();
    $tmp=explode(",", $a['img_name']);
    $a['img_name'] = $tmp[0];
    $result_a[] = $a;
  }
}

$arr = array();
$arr=$result;
$arr['s']=$result_a;

echo $json_response = json_encode($arr);
?>