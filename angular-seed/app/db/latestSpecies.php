<?php
header('Access-Control-Allow-Origin: *');
require("db_con.php");

$query="select id,name_cn,name_en,img_name from species order by id DESC limit 4";
$result=mysqli_query($db,$query);

$arr=array();
while($row=mysqli_fetch_assoc($result)){
    $arr[]=$row;
}

echo $json_response=json_encode($arr);
?>