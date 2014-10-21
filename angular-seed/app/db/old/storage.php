<?php
header('Access-Control-Allow-Origin: *');

$arr = array();
if (isset($_GET['img_name'])){

  $s = new SaeStorage();
  $img_name = explode(",", $_GET['img_name']);
  foreach ($img_name as $i){
    $arr[] = $s->getUrl('upload', $i);
  }
}

echo $json_response = json_encode($arr);
?>