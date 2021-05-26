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

	// Perform query
	if ($result = $conn -> query("SELECT * FROM esm_data")) {
	    $dataObj = array();
	    $index = 0;
		while($data = mysqli_fetch_row($result))
		{
		    $dataObj[$index]['id'] = $data[0];
		    $dateTimeZone = new DateTimeZone("Europe/Copenhagen");
            $dateTime = new DateTime(null, $dateTimeZone);
            $timeOffset = $dateTimeZone->getOffset($dateTime);
            $storedTime = new DateTime($data[1]);
		    $dataObj[$index]['timestamp'] = date("Y-m-d H:i:s", $storedTime->getTimestamp() + $timeOffset);
		    $dataObj[$index]['data'] = $data[2];
		    $index++;
		}

		echo json_encode($dataObj);

	  $result -> free_result();
	}

	$conn -> close();
	?>