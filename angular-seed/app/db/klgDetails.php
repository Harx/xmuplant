<?php
header('Access-Control-Allow-Origin: *');
require("db_con.php");

$query = "select * from knowledge where id =".$_REQUEST['id'];
$result = mysqli_query($db, $query);

$arr = array();
while ($row = mysqli_fetch_assoc($result)){
    $query1="select name from klg_category where id = ".$row['category'];
    $result1=mysqli_query($db,$query1);
    while($row1=mysqli_fetch_assoc($result1)){        
        $row['category']=$row1['name'];
        $arr[] = $row;
    }
}

echo $json_response = json_encode($arr);
?>