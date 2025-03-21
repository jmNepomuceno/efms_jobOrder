<?php
require "vendor/autoload.php";  // Ensure Composer's autoload is included
use WebSocket\Client;

try {
    $client = new Client("ws://192.168.42.222:8080");
    $client->send(json_encode(["action" => "refreshTable"]));
    echo "WebSocket message sent successfully!";
} catch (Exception $e) {
    echo "WebSocket error: " . $e->getMessage();
}

?>