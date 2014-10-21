<?php
header('Access-Control-Allow-Origin: *');
require("db_con.php");

$arr=array();
//访问数量
$result=mysqli_query($db,"select content from intro where title = 'uview'");
$row=mysqli_fetch_assoc($result);
$arr['uview']=$row['content'];

//科目属统计
$tables=array('family','genus','species');
for($i=0;$i<count($tables);$i++){
    $query="select id from ".$tables[$i];
    $result=mysqli_query($db,$query);
    $arr[$tables[$i]]=mysqli_num_rows($result);
}

    echo $json_response=json_encode($arr);


?>