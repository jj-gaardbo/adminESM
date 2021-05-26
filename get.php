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
	  echo "<div class='row'><div class='col-12 text-center'><strong>Total entry count: ".$result -> num_rows."</strong></div></div>";
	  echo "<table class='table' id='dtBasicExample'>
				<thead>
					<tr>
						<th scope='col'>ID</th>
						<th scope='col'>Timestamp</th>
						<th scope='col'>Data</th>
						<th scope='col'>Delete</th>
					</tr>
				</thead>
				<tbody>
				";

		while($data = mysqli_fetch_row($result))
		{   
		    $dateTimeZone = new DateTimeZone("Europe/Copenhagen");
            $dateTime = new DateTime(null, $dateTimeZone);
            $timeOffset = $dateTimeZone->getOffset($dateTime);
            $storedTime = new DateTime($data[1]);

			echo "<tr>";
			echo "<th scope='row'>$data[0]</td>"; //ID
			echo "<td>".date("Y-m-d H:i:s", $storedTime->getTimestamp() + $timeOffset)."</td>"; //Timestamp
			echo '<td class="data-column">';
			echo $data[2];
			echo "</td>"; //Data
			echo "<td class='del-col'>";
			echo "<button class='delete-btn' data-id=".$data[0].">";
			echo '<svg version="1.1" x="0px" y="0px" viewBox="0 0 380.267 380.267">
					<path d="M303.737,19.621h-54.739C240.571,7.463,226.669,0,211.427,0h-42.588c-15.241,0-29.143,7.462-37.571,19.621H76.529
						c-25.049,0-45.428,20.38-45.428,45.431v18.581c0,10.236,8.328,18.564,18.564,18.564h13.208l11.963,241.922
						c1.206,20.27,18.078,36.147,38.409,36.147h153.778c20.332,0,37.204-15.899,38.415-36.244l11.958-241.826h13.207
						c10.236,0,18.564-8.328,18.564-18.564V65.052C349.166,40.001,328.787,19.621,303.737,19.621z M166.436,293.537
						c0,9.492-7.722,17.213-17.214,17.213c-9.492,0-17.213-7.722-17.213-17.213V139.64c0-9.491,7.722-17.213,17.213-17.213
						c9.492,0,17.214,7.723,17.214,17.213V293.537z M248.258,293.537c0,9.492-7.722,17.213-17.214,17.213
						c-9.491,0-17.213-7.722-17.213-17.213V139.64c0-9.491,7.723-17.213,17.213-17.213c9.493,0,17.214,7.723,17.214,17.213V293.537z
						 M321.101,74.133H59.166v-9.081c0-9.576,7.789-17.367,17.363-17.367h62.986c5.681,0,10.801-3.425,12.97-8.675
						c2.746-6.649,9.166-10.946,16.355-10.946h42.588c7.189,0,13.608,4.296,16.354,10.944c2.168,5.251,7.289,8.677,12.97,8.677h62.986
						c9.574,0,17.364,7.791,17.364,17.367V74.133z"/>
					</svg>';

			echo "</button>";
			echo "</td>";
			
			echo "</tr>";
		}

		echo "</tbody>";
		echo "</table>";

	  $result -> free_result();
	}

	$conn -> close();
	?>