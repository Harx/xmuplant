<?php
// 连接到数据库 关于mysqli与pdo区别： http://php.net/manual/zh/mysqli.overview.php
//@ $db = mysqli_connect(SAE_MYSQL_HOST_M.':'.SAE_MYSQL_PORT, SAE_MYSQL_USER, SAE_MYSQL_PASS, SAE_MYSQL_DB);
@ $db = mysqli_connect("127.0.0.1", "root","root", "xmuplant");

if (mysqli_connect_errno()) {
  echo "Failed to connect to MySQL: " . mysqli_connect_error();
  exit();
}

// http://php.net/manual/zh/mysqli.set-charset.php
mysqli_set_charset($db, "utf8")

?>