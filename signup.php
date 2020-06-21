<?php  

	$dataFile = "users.json";
	$header = "Content-Type: application/json";
		// Get form data
	   $user = array(
	      'firstName'=> filter_var($_POST["firstName"]),
	      'lastName'=> filter_var($_POST["lastName"]),
	      'email'=> filter_var($_POST["email"]),
	      'password'=> password_hash(filter_var($_POST["password"]), PASSWORD_DEFAULT)
	   );

		// Get data from existing json file
	   $jsondata = file_get_contents($dataFile);
	   
	   // converts json data into array
	   $arr_data = json_decode($jsondata, true);

	   if (is_null($arr_data)){
	   	$arr_data = array();
	   }

	   // Push user data to array
	   array_push($arr_data, $user);

	   //Convert updated array to JSON
	   $jsondata = json_encode($arr_data, JSON_PRETTY_PRINT);

	   file_put_contents($dataFile, $jsondata);

	   header($header);
	   echo json_encode($user);
?>