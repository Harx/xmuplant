<?php
header('Access-Control-Allow-Origin: *');
require("db_con.php");


$query = "select title,d,s from subject where id = ".$_GET['id'];
$result = mysqli_fetch_assoc(mysqli_query($db, $query));

$result_a = array();
$name_cn = explode(",", $result['s']);
foreach($name_cn as $n){
  $query = "select id,name_cn,name_en from species where name_cn = \"".$n."\"";
  $s = mysqli_query($db, $query);
  if (mysqli_num_rows($s) == 0){
    $a = array();
    $a['id'] = "";
    $a['name_cn'] = $n;
    $a['name_en'] = "网站暂未收录";
    $result_a[] = $a;
  } else {
    $result_a[] = mysqli_fetch_assoc($s);
  }
}

$arr = array();
$arr=$result;
$arr['s']=$result_a;

echo $json_response = json_encode($arr);
?>