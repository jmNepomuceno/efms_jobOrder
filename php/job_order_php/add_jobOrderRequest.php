<?php 
include('../../session.php');
include('../../assets/connection.php');

require "../../vendor/autoload.php";  // Ensure Composer's autoload is included
use WebSocket\Client;
// Check if the user has a pending request
$sql = "SELECT COUNT(*) AS pending_count FROM efms_joborder.job_order_request 
        WHERE (requestStatus = 'Pending' OR requestStatus = 'On-Process' OR requestStatus = 'Evaluation') 
        AND CAST(JSON_EXTRACT(requestBy, '$.bioID') AS UNSIGNED) = ?";

$stmt = $pdo->prepare($sql);
$stmt->execute([$_SESSION['user']]);
$data = $stmt->fetch(PDO::FETCH_ASSOC);
$pending_count = $data['pending_count'];

if ($pending_count >= 1) {
    echo "pending";
} else {
    // Prepare the request object
    $object = $_POST;
    $object["requestBy"] = [
        "name" => $_SESSION['name'],
        "bioID" => $_SESSION['user'],
        "division" => $_SESSION['divisionName'],
        "section" => $_SESSION['sectionName'],
    ];

    // Get last request number
    $sql = "SELECT requestNo FROM job_order_request ORDER BY requestNo DESC LIMIT 1";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $data = $stmt->fetch(PDO::FETCH_ASSOC);
    $requestNo = isset($data['requestNo']) ? intval($data['requestNo']) + 1 : 1;

    // Insert new record
    $sql = "INSERT INTO job_order_request 
            (requestNo, requestDate, requestFrom, requestBy, requestCategory, requestDescription, requestStatus) 
            VALUES (?, ?, ?, ?, ?, ?, ?)";

    $stmt = $pdo->prepare($sql);
    $success = $stmt->execute([
        $requestNo,
        $object["requestDate"],
        $object["requestFrom"],
        json_encode($object["requestBy"]),
        $object["requestCategory"],
        $object["requestDescription"],
        $object["requestStatus"],
    ]);

    if ($success) {
        echo "success";

        try {
            $client = new Client("ws://192.168.42.222:8080");
            $client->send(json_encode(["action" => "refreshIncomingTable"]));
            echo "WebSocket message sent successfully!";
        } catch (Exception $e) {
            echo "WebSocket error: " . $e->getMessage();
        }

    } else {
        echo "error";
    }
}
?>
