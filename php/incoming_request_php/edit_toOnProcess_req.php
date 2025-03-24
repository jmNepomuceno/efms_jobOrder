<?php
include ('../../session.php');
include('../../assets/connection.php');

require "../../vendor/autoload.php";  // Ensure Composer's autoload is included
use WebSocket\Client;

$current_date = date('m/d/Y - h:i:s A');

try {
    $sql = "UPDATE job_order_request SET requestStatus='On-Process', processedBy=?, processByID=?, requestStartDate=? WHERE requestNo=?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$_SESSION['name'] , $_SESSION['user'] ,$current_date , (int)$_POST['requestNo']]);

    // websocket server
    $client = new Client("ws://192.168.42.222:8080");
    $client->send(json_encode(["action" => "refreshOnProcessTableUser"]));

} catch (PDOException $e) {
    die("Database error: " . $e->getMessage());
}

?>
