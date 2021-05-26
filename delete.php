<?php
    //this is if you are using different different origins/servers in your localhost, * to be update with the right address when it comes to production
	header('Access-Control-Allow-Origin: *');
	//this is if you are specifying content-type in your axios request
	header("Access-Control-Allow-Headers: Content-Type");
	
	mb_internal_encoding("UTF-8");

	require_once('../includes/connection.php');
    $db_host = getDbHost();
    $db_password = getDbPassword();
    $db_username = getDbUser();
    $db_dbname = getDbDatabase();

    try {
    $conn = new mysqli($db_host, $db_username, $db_password, $db_dbname);
    } catch(mysqli_sql_exception $e) {
    	echo "Failed to connect";
    }

	if (!$conn->set_charset("utf8")) {
		printf("Error loading character set utf8: %s\n", $conn->error);
	    exit();
	}
	
	$id = $_GET['id'];

	// Perform query
	if ($result = $conn -> query("DELETE FROM `esm_data` WHERE `esm_data`.`ID` = ".$id)) {
	  echo $id." was deleted"; 
	}

	$conn -> close();
	?>