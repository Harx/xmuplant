<?php
header('Access-Control-Allow-Origin: *');
require("db_con.php");

$table=$_GET['table'];
$items=$_REQUEST['items'];
$pageVolume=5;
$page=$_REQUEST['page'];

$where="";
if(isset($_REQUEST['catid'])){
    $where="where category = ".$_REQUEST['catid'];
}
$ret=array();
//[0]为总页数
$count=0;
$result=mysqli_query($db,"select id from $table ".$where);
while($row=mysqli_fetch_assoc($result)){
    $count++;}
$pageNumber=ceil($count/$pageVolume);
$temp=array();
for($i=1;$i<=$pageNumber;$i++){
    $temp[]=$i;
}

$ret[0]=$temp;

//[1]为请求页码的数据
$startId=($page-1)*$pageVolume;
$result=mysqli_query($db,"select $items from $table ".$where." limit $startId,$pageVolume");
$arr=array();
while ($row = mysqli_fetch_assoc($result)){
  // 添加到数组
  $arr[] = $row;
}
$ret[1]=$arr;

echo $json_response=json_encode($ret);
?>